import { StudentModel } from '../models/studentModel.js';
import { AdminModel } from '../models/adminModel.js';

export const AuthController = {
  // Student Login
  loginStudent(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
      }

      const student = StudentModel.findByEmail(email);
      if (!student || student.password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid student email or password.' });
      }

      const { password: _, ...studentData } = student;
      const userPayload = { ...studentData, role: 'student' };

      res.json({
        success: true,
        message: 'Student authenticated successfully.',
        user: userPayload
      });
    } catch (err) {
      next(err);
    }
  },

  // Student Registration
  registerStudent(req, res, next) {
    try {
      const { fullName, email, password, studentIdNumber, department, academicYear } = req.body;

      if (!fullName || !email || !password || !studentIdNumber || !department || !academicYear) {
        return res.status(400).json({ success: false, message: 'All registration fields are required.' });
      }

      const existing = StudentModel.findByEmail(email);
      if (existing) {
        return res.status(409).json({ success: false, message: 'A student account with this email already exists.' });
      }

      const newStudent = StudentModel.create({
        id: `stu-${Date.now()}`,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        studentIdNumber: studentIdNumber.trim().toUpperCase(),
        department,
        academicYear,
        registeredAt: new Date().toISOString()
      });

      const { password: _, ...studentData } = newStudent;
      const userPayload = { ...studentData, role: 'student' };

      res.status(201).json({
        success: true,
        message: 'Account created successfully! Welcome to CampusPulse.',
        user: userPayload
      });
    } catch (err) {
      next(err);
    }
  },

  // Admin Login
  loginAdmin(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
      }

      const admin = AdminModel.findByEmail(email);
      if (!admin || admin.password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid administrator credentials.' });
      }

      const { password: _, ...adminData } = admin;
      const userPayload = { ...adminData, role: 'admin' };

      res.json({
        success: true,
        message: 'Administrator signed in successfully.',
        user: userPayload
      });
    } catch (err) {
      next(err);
    }
  },

  // Get list of students (for admin roster/management)
  getAllStudents(req, res, next) {
    try {
      const students = StudentModel.findAll();
      res.json({ success: true, data: students });
    } catch (err) {
      next(err);
    }
  }
};
