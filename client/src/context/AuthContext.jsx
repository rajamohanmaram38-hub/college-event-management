import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_STUDENTS, INITIAL_ADMIN } from '../data/mockData';
import { apiClient } from '../api/apiClient';
import { auth, googleProvider, signInWithPopup, isFirebaseConfigured, db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'campuspulse_auth_user';
const STUDENTS_STORAGE_KEY = 'campuspulse_students_db';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [studentsList, setStudentsList] = useState(() => {
    try {
      const saved = localStorage.getItem(STUDENTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [authLoading, setAuthLoading] = useState(false);

  // Sync current user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  // Sync students list to localStorage
  useEffect(() => {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(studentsList));
  }, [studentsList]);

  // Try fetching fresh students from server on mount
  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await apiClient.getAllStudents();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setStudentsList(res.data);
        }
      } catch {
        // Fallback to local
      }
    }
    fetchStudents();
  }, []);

  // Student Login with Email/Password
  const loginStudent = async (email, password) => {
    try {
      const res = await apiClient.loginStudent(email, password);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        return { success: true, user: res.user };
      }
      if (res.message && !res.networkError) {
        return { success: false, message: res.message };
      }
    } catch {
      // Fallback
    }

    // Local fallback check
    const student = studentsList.find(
      s => s.email.toLowerCase() === email.trim().toLowerCase() && s.password === password
    );
    if (!student) {
      return { success: false, message: 'Invalid student email or password.' };
    }
    const userPayload = { ...student, role: 'student' };
    setCurrentUser(userPayload);
    return { success: true, user: userPayload };
  };

  // Google Authentication via Firebase
  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      return {
        success: false,
        message: 'Firebase Google Auth is not configured. Please verify your client/.env credentials.'
      };
    }

    setAuthLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      if (!firebaseUser || !firebaseUser.email) {
        setAuthLoading(false);
        return { success: false, message: 'Could not retrieve email from Google Account.' };
      }

      // Check if student already exists
      const existing = studentsList.find(
        s => s.email.toLowerCase() === firebaseUser.email.trim().toLowerCase()
      );

      let studentPayload = null;

      if (existing) {
        studentPayload = {
          ...existing,
          fullName: existing.fullName || firebaseUser.displayName || 'Google Student',
          photoURL: firebaseUser.photoURL || existing.photoURL || null,
          role: 'student'
        };
      } else {
        // Create new student profile based on Google metadata
        const uidShort = firebaseUser.uid.substring(0, 5).toUpperCase();
        studentPayload = {
          id: firebaseUser.uid,
          fullName: firebaseUser.displayName || 'Google Student',
          email: firebaseUser.email.trim().toLowerCase(),
          studentIdNumber: `APX-2026-G-${uidShort}`,
          department: 'Computer Science & Engineering',
          academicYear: '3rd Year',
          photoURL: firebaseUser.photoURL || null,
          role: 'student',
          registeredAt: new Date().toISOString()
        };
        setStudentsList(prev => [studentPayload, ...prev]);
      }

      // Sync to Firestore if available
      if (db) {
        try {
          await setDoc(doc(db, 'students', studentPayload.id), studentPayload, { merge: true });
        } catch (dbErr) {
          console.warn('Firestore sync note:', dbErr.message);
        }
      }

      setCurrentUser(studentPayload);
      setAuthLoading(false);
      return { success: true, user: studentPayload };
    } catch (error) {
      setAuthLoading(false);
      console.error('Google Sign-In Error:', error);

      if (error.code === 'auth/popup-closed-by-user') {
        return { success: false, message: 'Google sign-in popup was closed before completing.' };
      }
      if (error.code === 'auth/cancelled-popup-request') {
        return { success: false, message: 'Sign-in cancelled due to another active request.' };
      }
      if (error.code === 'auth/unauthorized-domain') {
        return {
          success: false,
          message: 'Unauthorized domain. Please add localhost to Firebase Console -> Authentication -> Settings -> Authorized Domains.'
        };
      }
      if (error.code === 'auth/popup-blocked') {
        return { success: false, message: 'Browser popup was blocked. Please allow popups for this site and try again.' };
      }

      return { success: false, message: error.message || 'Google authentication failed.' };
    }
  };

  // Student Registration
  const registerStudent = async (formData) => {
    try {
      const res = await apiClient.registerStudent(formData);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setStudentsList(prev => [...prev, res.user]);
        return { success: true, user: res.user };
      }
      if (res.message && !res.networkError) {
        return { success: false, message: res.message };
      }
    } catch {
      // Fallback
    }

    // Local fallback
    const existing = studentsList.find(
      s => s.email.toLowerCase() === formData.email.trim().toLowerCase()
    );
    if (existing) {
      return { success: false, message: 'A student account with this email already exists.' };
    }

    const newStudent = {
      id: `stu-${Date.now()}`,
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      studentIdNumber: formData.studentIdNumber.trim(),
      department: formData.department,
      academicYear: formData.academicYear || '1st Year',
      registeredAt: new Date().toISOString()
    };

    setStudentsList(prev => [...prev, newStudent]);
    const userPayload = { ...newStudent, role: 'student' };
    setCurrentUser(userPayload);
    return { success: true, user: userPayload };
  };

  // Admin Login
  const loginAdmin = async (email, password) => {
    try {
      const res = await apiClient.loginAdmin(email, password);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        return { success: true, user: res.user };
      }
      if (res.message && !res.networkError) {
        return { success: false, message: res.message };
      }
    } catch {
      // Fallback
    }

    if (
      email.trim().toLowerCase() === INITIAL_ADMIN.email.toLowerCase() &&
      password === INITIAL_ADMIN.password
    ) {
      const userPayload = { ...INITIAL_ADMIN, role: 'admin' };
      setCurrentUser(userPayload);
      return { success: true, user: userPayload };
    }
    return { success: false, message: 'Invalid admin credentials.' };
  };

  // Quick Demo Login (for frictionless testing)
  const quickLoginDemo = (role = 'student') => {
    if (role === 'admin') {
      const adminPayload = { ...INITIAL_ADMIN, role: 'admin' };
      setCurrentUser(adminPayload);
      return adminPayload;
    } else {
      const demoStudent = studentsList[0] || INITIAL_STUDENTS[0];
      const studentPayload = { ...demoStudent, role: 'student' };
      setCurrentUser(studentPayload);
      return studentPayload;
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userRole: currentUser?.role || null,
        isStudent: currentUser?.role === 'student',
        isAdmin: currentUser?.role === 'admin',
        authLoading,
        loginStudent,
        loginWithGoogle,
        registerStudent,
        loginAdmin,
        quickLoginDemo,
        logout,
        studentsList
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
