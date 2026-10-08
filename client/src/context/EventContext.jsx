import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { INITIAL_EVENTS, INITIAL_REGISTRATIONS } from '../data/mockData';
import { generateTicketCode } from '../utils/helpers';
import { apiClient } from '../api/apiClient';

const EventContext = createContext();

const EVENTS_STORAGE_KEY = 'campuspulse_events_db';
const REGISTRATIONS_STORAGE_KEY = 'campuspulse_registrations_db';

export function EventProvider({ children }) {
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(EVENTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [registrations, setRegistrations] = useState(() => {
    try {
      const saved = localStorage.getItem(REGISTRATIONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_REGISTRATIONS;
    } catch {
      return INITIAL_REGISTRATIONS;
    }
  });

  const [isServerConnected, setIsServerConnected] = useState(false);
  const [isRealtimeFirestoreActive, setIsRealtimeFirestoreActive] = useState(false);

  // Sync state to local storage cache
  useEffect(() => {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(registrations));
  }, [registrations]);

  // ========================================================
  // 🔥 Real-Time Cloud Firestore Synchronizer (onSnapshot)
  // ========================================================
  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      return;
    }

    console.log('⚡ Initializing Real-Time Firestore listeners...');
    let unsubEvents = () => {};
    let unsubRegs = () => {};

    try {
      // 1. Real-time Events Stream
      const eventsRef = collection(db, 'events');
      unsubEvents = onSnapshot(
        eventsRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const remoteEvents = snapshot.docs.map(docSnap => {
              const data = docSnap.data();
              let agenda = data.agenda;
              if (typeof agenda === 'string') {
                try { agenda = JSON.parse(agenda); } catch { agenda = []; }
              }
              return {
                id: docSnap.id,
                ...data,
                agenda: Array.isArray(agenda) ? agenda : []
              };
            });

            // Sort by event date ascending
            remoteEvents.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
            setEvents(remoteEvents);
            setIsRealtimeFirestoreActive(true);
            console.log(`⚡ [Firestore Real-Time] Received ${remoteEvents.length} events`);
          }
        },
        (error) => {
          console.warn('Firestore events real-time listener notice:', error.message);
          setIsRealtimeFirestoreActive(false);
        }
      );

      // 2. Real-time Registrations Stream
      const regsRef = collection(db, 'registrations');
      unsubRegs = onSnapshot(
        regsRef,
        (snapshot) => {
          const remoteRegs = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          setRegistrations(remoteRegs);
          console.log(`⚡ [Firestore Real-Time] Received ${remoteRegs.length} registrations`);
        },
        (error) => {
          console.warn('Firestore registrations real-time listener notice:', error.message);
        }
      );
    } catch (err) {
      console.warn('Error attaching Firestore listeners:', err);
    }

    return () => {
      unsubEvents();
      unsubRegs();
    };
  }, []);

  // Fallback initial load from Express backend API
  const refreshFromBackend = useCallback(async () => {
    try {
      const [eventsRes, regsRes] = await Promise.all([
        apiClient.getEvents(),
        apiClient.getRegistrations()
      ]);

      if (eventsRes.success && Array.isArray(eventsRes.data)) {
        if (!isRealtimeFirestoreActive) {
          setEvents(eventsRes.data);
        }
        setIsServerConnected(true);
      }
      if (regsRes.success && Array.isArray(regsRes.data)) {
        if (!isRealtimeFirestoreActive) {
          setRegistrations(regsRes.data);
        }
      }
    } catch {
      setIsServerConnected(false);
    }
  }, [isRealtimeFirestoreActive]);

  useEffect(() => {
    refreshFromBackend();
  }, [refreshFromBackend]);

  // Retrieve an event by ID
  const getEventById = (id) => {
    return events.find(e => e.id === id);
  };

  // Get registrations for a specific event
  const getEventAttendees = (eventId) => {
    return registrations.filter(r => r.eventId === eventId && r.status !== 'CANCELLED');
  };

  // Get registrations for a student
  const getStudentRegistrations = (studentId) => {
    return registrations
      .filter(r => r.studentId === studentId && r.status !== 'CANCELLED')
      .map(reg => {
        const event = getEventById(reg.eventId);
        return {
          ...reg,
          event
        };
      })
      .filter(item => item.event !== undefined);
  };

  // Check if student is already registered for an event
  const isStudentRegistered = (eventId, studentId) => {
    if (!studentId) return false;
    return registrations.some(r => r.eventId === eventId && r.studentId === studentId && r.status !== 'CANCELLED');
  };

  // Register a student for an event
  const registerForEvent = async (eventId, student) => {
    const event = getEventById(eventId);
    if (!event) {
      return { success: false, message: 'Event not found.' };
    }

    if (isStudentRegistered(eventId, student.id)) {
      return { success: false, message: 'You are already registered for this event.' };
    }

    const currentAttendees = getEventAttendees(eventId);
    if (currentAttendees.length >= event.maxParticipants) {
      return { success: false, message: 'Event has reached maximum capacity.' };
    }

    // Check deadline
    if (event.registrationDeadline && new Date(event.registrationDeadline) < new Date().setHours(0,0,0,0)) {
      return { success: false, message: 'Registration deadline has passed for this event.' };
    }

    const newTicketCode = generateTicketCode(eventId, student.id);
    const newRegistration = {
      id: `reg-${Date.now()}`,
      eventId,
      studentId: student.id,
      studentName: student.fullName,
      studentEmail: student.email,
      studentIdNumber: student.studentIdNumber || 'N/A',
      department: student.department || 'General',
      ticketCode: newTicketCode,
      registeredAt: new Date().toISOString(),
      status: 'CONFIRMED'
    };

    // 1. Write directly to Cloud Firestore in real time
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'registrations', newRegistration.id), newRegistration);
        console.log('⚡ Registration written live to Cloud Firestore!');
      } catch (fsErr) {
        console.warn('Firestore write warning:', fsErr.message);
      }
    }

    // 2. Also inform Express backend
    try {
      await apiClient.registerForEvent(eventId, student);
    } catch {
      // Local fallback
    }

    // Update local state immediately for instant optimistic UI
    setRegistrations(prev => [newRegistration, ...prev.filter(r => r.id !== newRegistration.id)]);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // Ignore
    }

    return {
      success: true,
      message: 'Registration confirmed successfully!',
      registration: newRegistration,
      event
    };
  };

  // Cancel registration
  const cancelRegistration = async (registrationId) => {
    // 1. Delete from Cloud Firestore in real time
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'registrations', registrationId));
        console.log('⚡ Registration removed live from Cloud Firestore!');
      } catch (fsErr) {
        console.warn('Firestore delete warning:', fsErr.message);
      }
    }

    // 2. Inform Express backend
    try {
      await apiClient.cancelRegistration(registrationId);
    } catch {
      // Local fallback
    }

    setRegistrations(prev => prev.filter(r => r.id !== registrationId));
    return { success: true, message: 'Registration successfully cancelled. Seat released.' };
  };

  // Add new event (Admin)
  const addEvent = async (eventData) => {
    const newEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      maxParticipants: Number(eventData.maxParticipants) || 100,
      bannerUrl:
        eventData.bannerUrl ||
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      agenda: eventData.agenda || [],
      createdAt: new Date().toISOString()
    };

    // 1. Write live to Cloud Firestore
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'events', newEvent.id), newEvent);
        console.log('⚡ New event broadcasted live to Cloud Firestore!');
      } catch (fsErr) {
        console.warn('Firestore add event warning:', fsErr.message);
      }
    }

    // 2. Inform Express backend
    try {
      await apiClient.createEvent(newEvent);
    } catch {
      // Fallback
    }

    setEvents(prev => [newEvent, ...prev]);
    return { success: true, event: newEvent };
  };

  // Update existing event (Admin)
  const updateEvent = async (eventId, updatedData) => {
    const cleanedUpdates = {
      ...updatedData,
      maxParticipants: Number(updatedData.maxParticipants) || 100,
      updatedAt: new Date().toISOString()
    };

    // 1. Update live in Cloud Firestore
    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'events', eventId), cleanedUpdates);
        console.log('⚡ Event updated live in Cloud Firestore!');
      } catch (fsErr) {
        console.warn('Firestore update event warning:', fsErr.message);
      }
    }

    // 2. Inform Express backend
    try {
      await apiClient.updateEvent(eventId, cleanedUpdates);
    } catch {
      // Fallback
    }

    setEvents(prev =>
      prev.map(e =>
        e.id === eventId ? { ...e, ...cleanedUpdates } : e
      )
    );
    return { success: true, message: 'Event successfully updated.' };
  };

  // Delete event (Admin)
  const deleteEvent = async (eventId) => {
    // 1. Delete live from Cloud Firestore
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'events', eventId));
        console.log('⚡ Event deleted live from Cloud Firestore!');
      } catch (fsErr) {
        console.warn('Firestore delete event warning:', fsErr.message);
      }
    }

    // 2. Inform Express backend
    try {
      await apiClient.deleteEvent(eventId);
    } catch {
      // Fallback
    }

    setEvents(prev => prev.filter(e => e.id !== eventId));
    setRegistrations(prev => prev.filter(r => r.eventId !== eventId));
    return { success: true, message: 'Event and associated registrations deleted.' };
  };

  // Update registration attendance status (e.g. ATTENDED, CHECKED_IN)
  const updateRegistrationStatus = async (registrationId, status = 'ATTENDED') => {
    // 1. Update live in Cloud Firestore
    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'registrations', registrationId), {
          status,
          attendedAt: new Date().toISOString()
        });
        console.log(`⚡ Attendance status (${status}) broadcasted live to Cloud Firestore!`);
      } catch (fsErr) {
        console.warn('Firestore update status notice:', fsErr.message);
      }
    }

    // 2. Update Express SQLite backend
    try {
      await apiClient.updateRegistrationStatus(registrationId, status);
    } catch {
      // Fallback
    }

    setRegistrations(prev =>
      prev.map(r =>
        r.id === registrationId ? { ...r, status, attendedAt: new Date().toISOString() } : r
      )
    );
    return { success: true };
  };

  // Reset demo data
  const resetDemoData = () => {
    setEvents(INITIAL_EVENTS);
    setRegistrations(INITIAL_REGISTRATIONS);
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
    localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(INITIAL_REGISTRATIONS));
  };

  return (
    <EventContext.Provider
      value={{
        events,
        registrations,
        isServerConnected,
        isRealtimeFirestoreActive,
        refreshFromBackend,
        getEventById,
        getEventAttendees,
        getStudentRegistrations,
        isStudentRegistered,
        registerForEvent,
        cancelRegistration,
        updateRegistrationStatus,
        addEvent,
        updateEvent,
        deleteEvent,
        resetDemoData
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
