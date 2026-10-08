import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { StudentLoginPage } from './pages/StudentLoginPage';
import { StudentRegisterPage } from './pages/StudentRegisterPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { MyRegistrationsPage } from './pages/MyRegistrationsPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AddEditEventPage } from './pages/AddEditEventPage';
import { TicketScannerPage } from './pages/TicketScannerPage';
import { CertificateVerifyPage } from './pages/CertificateVerifyPage';

// Scroll to top helper on navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EventProvider>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public & Student Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:id" element={<EventDetailsPage />} />
                
                {/* Student Auth & Dashboards */}
                <Route path="/login" element={<StudentLoginPage />} />
                <Route path="/register" element={<StudentRegisterPage />} />
                <Route path="/dashboard" element={<StudentDashboardPage />} />
                <Route path="/my-registrations" element={<MyRegistrationsPage />} />
                <Route path="/scanner" element={<TicketScannerPage />} />
                <Route path="/verify" element={<CertificateVerifyPage />} />

                {/* Admin Auth & Dashboards */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/events/new" element={<AddEditEventPage />} />
                <Route path="/admin/events/edit/:id" element={<AddEditEventPage />} />

                {/* Catch-all Fallback */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </EventProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
