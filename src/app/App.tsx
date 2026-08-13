import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  BookUp, 
  BookDown, 
  History, 
  Info,
  LayoutDashboard,
  GraduationCap,
  LogOut,
  Activity
} from 'lucide-react';
import { StaffDashboard } from '@/src/pages/Staff/StaffDashboard';
import { INITIAL_BOOKS, INITIAL_STUDENTS } from '@/src/data/mockData';
import { migrateBooksCategory } from '@/src/utils/categoryMigration';
import { IssueRecord, Book, Student, Staff, CurrentUser, ActivityLog, ReturnRequest, BorrowRequest, FineRecord, PaymentRecord, FineSettings } from '@/src/types/index';
import { Auth } from '@/src/pages/Authentication/Auth';
import { StudentDashboard } from '@/src/pages/Student/StudentDashboard';
import { SessionManager } from './SessionManager';
import { ResetPassword } from '@/src/pages/Authentication/ResetPassword';
import { handleFailedAttempt, resetFailedAttempts, validateResetToken, createActivityLog } from '@/src/services/auth/authService';

export type TabType = 'Home' | 'Books' | 'Students' | 'Issue' | 'Return' | 'Tracking' | 'Requests' | 'Activity' | 'About';

export default function App() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    const saved = localStorage.getItem('lms_current_user');
    const rememberMe = localStorage.getItem('lms_remember_me') === 'true';
    if (!rememberMe) {
      // If not remember me, we could clear it on boot, but let's just keep it simple
      // Usually sessionStorage is used for not remember me, but since this is a mock we just check the flag.
      if (!sessionStorage.getItem('lms_session_active')) {
        return null; // Session expired on tab close
      }
    }
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<TabType>('Home');
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('lms_books_v2');
    let parsed: Book[] = saved ? JSON.parse(saved) : INITIAL_BOOKS;
    
    // Seed exactly 320 books if not already correct
    if (parsed.length !== 320) {
      parsed = [...INITIAL_BOOKS];
      localStorage.setItem('lms_books_v2', JSON.stringify(parsed));
    }

    return parsed;
  });
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('students_accounts');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });
  const [staffs, setStaffs] = useState<Staff[]>(() => {
    const saved = localStorage.getItem('staff_accounts');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [fines, setFines] = useState<FineRecord[]>(() => {
    const saved = localStorage.getItem('lms_fines');
    return saved ? JSON.parse(saved) : [];
  });
  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('lms_payments');
    return saved ? JSON.parse(saved) : [];
  });
  const [fineSettings, setFineSettings] = useState<FineSettings>(() => {
    const saved = localStorage.getItem('lms_fine_settings');
    return saved ? JSON.parse(saved) : {
      finePerDay: 20,
      gracePeriodDays: 1,
      maxFine: 1000,
      lostBookProcessingFee: 200,
      minorDamageFee: 100,
      majorDamageFee: 300,
      criticalDamageFee: 500,
      membershipRenewalFee: 500
    };
  });

  useEffect(() => {
    localStorage.setItem('lms_fines', JSON.stringify(fines));
  }, [fines]);

  useEffect(() => {
    localStorage.setItem('lms_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('lms_fine_settings', JSON.stringify(fineSettings));
  }, [fineSettings]);

  const [trackingRecords, setTrackingRecords] = useState<IssueRecord[]>(() => {
    const saved = localStorage.getItem('lms_tracking');
    if (saved) return JSON.parse(saved);
    return [];
  });
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>(() => {
    const saved = localStorage.getItem('lms_return_requests');
    return saved ? JSON.parse(saved) : [];
  });
  const [borrowRequests, setBorrowRequests] = useState<BorrowRequest[]>(() => {
    const saved = localStorage.getItem('lms_borrow_requests');
    return saved ? JSON.parse(saved) : [];
  });
  const [notifications, setNotifications] = useState<any[]>(() => {
    const saved = localStorage.getItem('lms_notifications');
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem('lms_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (userId: string, role: 'student' | 'staff', title: string, message: string) => {
    setNotifications(prev => [{
      id: `NOTIF${Date.now()}`,
      userId,
      role,
      title,
      message,
      date: new Date().toISOString(),
      read: false
    }, ...prev]);
  };
  
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('lms_activity_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Handle URL Reset Token
  const [resetData, setResetData] = useState<{ token: string; role: 'student' | 'staff' } | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('resetToken');
    const role = urlParams.get('role') as 'student' | 'staff';
    if (token && role) {
      setResetData({ token, role });
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const addActivityLog = (user: string, role: 'student' | 'staff' | 'system', action: ActivityLog['action'], details?: string) => {
    const newLog = createActivityLog(user, role, action, details);
    setActivityLogs(prev => [newLog, ...prev]);
  };

  useEffect(() => {
    localStorage.setItem('lms_books_v2', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('students_accounts', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('staff_accounts', JSON.stringify(staffs));
  }, [staffs]);

  useEffect(() => {
    localStorage.setItem('lms_tracking', JSON.stringify(trackingRecords));
  }, [trackingRecords]);

  useEffect(() => {
    localStorage.setItem('lms_return_requests', JSON.stringify(returnRequests));
  }, [returnRequests]);
  useEffect(() => {
    localStorage.setItem('lms_borrow_requests', JSON.stringify(borrowRequests));
  }, [borrowRequests]);

  useEffect(() => {
    localStorage.setItem('lms_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lms_current_user', JSON.stringify(currentUser));
      sessionStorage.setItem('lms_session_active', 'true');
    } else {
      localStorage.removeItem('lms_current_user');
      localStorage.removeItem('lms_remember_me');
      sessionStorage.removeItem('lms_session_active');
    }
  }, [currentUser]);

  const handleLogin = (user: CurrentUser, rememberMe: boolean) => {
    setCurrentUser(user);
    if (rememberMe) {
      localStorage.setItem('lms_remember_me', 'true');
    }
    
    // Reset failed attempts
    if (user.role === 'student') {
      setStudents(prev => prev.map(s => s.id === user.id ? resetFailedAttempts(s) as Student : s));
    } else {
      setStaffs(prev => prev.map(s => s.id === user.id ? resetFailedAttempts(s) as Staff : s));
    }

    addActivityLog(user.id, user.role, user.role === 'student' ? 'Student Login' : 'Staff Login');
  };

  const handleLogout = () => {
    if (currentUser) {
      addActivityLog(currentUser.id, currentUser.role, currentUser.role === 'student' ? 'Student Logout' : 'Other', 'Staff Logout');
    }
    setCurrentUser(null);
  };

  const handleFailedLogin = (id: string, role: 'student' | 'staff') => {
    if (role === 'student') {
      setStudents(prev => prev.map(s => s.id === id ? handleFailedAttempt(s) as Student : s));
    } else {
      setStaffs(prev => prev.map(s => s.id === id ? handleFailedAttempt(s) as Staff : s));
    }
    addActivityLog(id, role, 'Failed Login');
  };

  const handleRegisterStudent = (student: Student) => {
    setStudents(prev => [...prev, student]);
    addActivityLog(student.id, 'student', 'Registration');
  };

  const handleRegisterStaff = (staff: Staff) => {
    setStaffs(prev => [...prev, staff]);
    addActivityLog(staff.id, 'staff', 'Registration');
  };

  const handleResetRequested = (id: string, role: 'student' | 'staff', token: string, expiry: string) => {
    if (role === 'student') {
      setStudents(prev => prev.map(s => s.id === id ? { ...s, resetToken: token, resetTokenExpiry: expiry } : s));
    } else {
      setStaffs(prev => prev.map(s => s.id === id ? { ...s, resetToken: token, resetTokenExpiry: expiry } : s));
    }
    addActivityLog(id, role, 'Password Reset Request');
  };

  const handleResetComplete = (password: string) => {
    if (!resetData) return;
    
    let isValid = false;
    let userId = '';

    if (resetData.role === 'student') {
      const student = students.find(s => s.resetToken === resetData.token);
      if (student && validateResetToken(student, resetData.token)) {
        isValid = true;
        userId = student.id;
        setStudents(prev => prev.map(s => s.id === student.id ? { ...s, password, resetToken: undefined, resetTokenExpiry: undefined } : s));
      }
    } else {
      const staff = staffs.find(s => s.resetToken === resetData.token);
      if (staff && validateResetToken(staff, resetData.token)) {
        isValid = true;
        userId = staff.id;
        setStaffs(prev => prev.map(s => s.id === staff.id ? { ...s, password, resetToken: undefined, resetTokenExpiry: undefined } : s));
      }
    }

    if (isValid) {
      addActivityLog(userId, resetData.role, 'Password Reset Complete');
      alert('Password reset successfully. You can now login.');
      setResetData(null);
    } else {
      alert('Invalid or expired reset token.');
      setResetData(null);
    }
  };

  const handleToggleWishlist = (studentId: string, bookId: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const wishlist = s.wishlist || [];
        if (wishlist.includes(bookId)) {
          return { ...s, wishlist: wishlist.filter(id => id !== bookId) };
        } else {
          return { ...s, wishlist: [...wishlist, bookId] };
        }
      }
      return s;
    }));
  };

  const handleIssueBook = (studentName: string, rollNo: string, bookId: string, bookName: string, customExpectedReturnDate?: string) => {
    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        const currentAvail = b.availableCopies ?? (b.status === 'Available' ? 1 : 0);
        const currentIssued = b.issuedCopies || 0;
        const newAvail = Math.max(0, currentAvail - 1);
        const newIssued = currentIssued + 1;
        // If there's only 1 total copy (or we just took the last available), we can set status to 'Issued'
        // If it's a multi-copy book and copies are still left, keep it 'Available'
        const newStatus = newAvail === 0 ? 'Issued' : b.status;
        
        return { 
          ...b, 
          status: newStatus,
          availableCopies: newAvail,
          issuedCopies: newIssued
        };
      }
      return b;
    }));
    
    const today = new Date();
    const issueDate = today.toISOString().split('T')[0];
    let expectedReturnDate = customExpectedReturnDate;
    
    if (!expectedReturnDate) {
      const returnDate = new Date();
      returnDate.setDate(today.getDate() + 15);
      expectedReturnDate = returnDate.toISOString().split('T')[0];
    }

    const newRecord: IssueRecord = {
      id: `REC${String(trackingRecords.length + 1).padStart(3, '0')}`,
      studentId: rollNo,
      studentName,
      bookId,
      bookName,
      issueDate,
      expectedReturnDate,
      status: 'Issued'
    };
    
    setTrackingRecords(prev => [newRecord, ...prev]);
      addNotification(rollNo, 'student', 'Book Issued', `${bookName} has been issued to you.`);
  };

  const handleReturnBook = (recordId: string, returnStatus: 'Early' | 'On Time' | 'Late', lateDays: number, fine: number) => {
    setTrackingRecords(prev => prev.map(r => {
      if (r.id === recordId) {
        setBooks(books => books.map(b => {
          if (b.id === r.bookId) {
            const currentAvail = b.availableCopies ?? (b.status === 'Available' ? 1 : 0);
            const currentIssued = b.issuedCopies || 0;
            const newAvail = currentAvail + 1;
            const newIssued = Math.max(0, currentIssued - 1);
            return { 
              ...b, 
              status: 'Available',
              availableCopies: newAvail,
              issuedCopies: newIssued
            };
          }
          return b;
        }));
        return {
          ...r,
          status: 'Returned',
          returnDate: new Date().toISOString().split('T')[0],
          returnStatus,
          lateDays,
          fine
        };
      }
      return r;
    }));
  };

  const handleReturnRequest = (request: Omit<ReturnRequest, 'id' | 'status' | 'requestDate'>) => {
    const newRequest: ReturnRequest = {
      ...request,
      id: `REQ${String(returnRequests.length + 1).padStart(3, '0')}`,
      status: 'Pending',
      requestDate: new Date().toISOString().split('T')[0]
    };
    setReturnRequests(prev => [newRequest, ...prev]);
  };

  const handleApproveReturnRequest = (requestId: string, approved: boolean, actionReason?: string) => {
    setReturnRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: approved ? 'Approved' : 'Rejected', staffRemarks: actionReason } : r));
    
    if (approved) {
      const request = returnRequests.find(r => r.id === requestId);
      if (request && (request.type === 'Return Before Time' || request.type === 'Return')) {
        const issueRecord = trackingRecords.find(tr => tr.bookId === request.bookId && tr.status === 'Issued' && tr.studentId === request.studentId);
        if (issueRecord) {
           const actualReturnDate = new Date().toISOString().split('T')[0];
           
           // Calculate fine
           const expDate = new Date(issueRecord.expectedReturnDate);
           const actDate = new Date(actualReturnDate);
           expDate.setHours(0, 0, 0, 0);
           actDate.setHours(0, 0, 0, 0);
           
           const diffTime = actDate.getTime() - expDate.getTime();
           let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
           const savedSettings = localStorage.getItem('lms_fine_settings');
           const fineSettings = savedSettings ? JSON.parse(savedSettings) : { finePerDay: 20, gracePeriodDays: 1, maxFine: 1000 };
           
           if (diffDays <= fineSettings.gracePeriodDays) { diffDays = 0; }
           
           let fineAmt = diffDays > 0 ? diffDays * fineSettings.finePerDay : 0;
           if (fineAmt > fineSettings.maxFine) fineAmt = fineSettings.maxFine;
           
           handleReturnBook(issueRecord.id, diffDays > 0 ? 'Late' : (diffDays < 0 ? 'Early' : 'On Time'), diffDays, fineAmt);
        }
      }
    }
  };

  const handleUpdateRequestStatus = (requestId: string, status: ReturnRequest['status']) => {
    setReturnRequests(prev => prev.map(r => r.id === requestId ? { ...r, status } : r));
  };

  if (resetData) {
    return (
      <ResetPassword 
        token={resetData.token} 
        role={resetData.role} 
        onResetComplete={handleResetComplete}
        onCancel={() => setResetData(null)}
      />
    );
  }

  if (!currentUser) {
    return (
      <Auth 
        onLogin={handleLogin} 
        students={students} 
        staffs={staffs} 
        onRegisterStudent={handleRegisterStudent}
        onRegisterStaff={handleRegisterStaff}
        onFailedLogin={handleFailedLogin}
        onResetRequested={handleResetRequested}
      />
    );
  }

  if (currentUser.role === 'student') {
    const studentData = students.find(s => s.id.toLowerCase() === currentUser.id.toLowerCase());
    if (!studentData) {
      return <div className="p-8">Error loading student data. <button onClick={handleLogout}>Logout</button></div>;
    }
    return (
      <>
        <SessionManager onLogout={handleLogout} isActive={true} />
        <StudentDashboard 
          student={studentData} 
          books={books} 
          trackingRecords={trackingRecords} 
          returnRequests={returnRequests}
          borrowRequests={borrowRequests}
          setBorrowRequests={setBorrowRequests}
          fines={fines}
          payments={payments}
          onLogout={handleLogout} 
          onIssueBook={(bookId, bookName, studentId) => {
            const student = students.find(s => s.id === studentId);
            if (student) {
              handleIssueBook(student.name, student.id, bookId, bookName);
            }
          }}
          onToggleWishlist={handleToggleWishlist}
          onReturnRequest={handleReturnRequest}
          onUpdateProfile={(studentId, updates) => {
            setStudents(students.map(s => s.id === studentId ? { ...s, ...updates } : s));
          }}
        />
      </>
    );
  }


  const staffDataFallback = staffs.find(s => s.id === currentUser.id) || {
    id: currentUser.id,
    name: currentUser.name,
    email: 'admin@library.com',
    role: 'Admin',
    department: 'Library',
    joinDate: new Date().toISOString(),
    status: 'Active',
    password: ''
  };

  return (
    <>
      <SessionManager onLogout={handleLogout} isActive={true} />
      <StaffDashboard 
          currentUser={currentUser}
          staffData={staffDataFallback}
          books={books}
          setBooks={setBooks}
          students={students}
          setStudents={setStudents}
          staffs={staffs}
          setStaffs={setStaffs}
          trackingRecords={trackingRecords}
          returnRequests={returnRequests}
          borrowRequests={borrowRequests}
          setBorrowRequests={setBorrowRequests}
          addActivityLog={addActivityLog}
          
          activityLogs={activityLogs}
          fines={fines}
          setFines={setFines}
          payments={payments}
          setPayments={setPayments}
          fineSettings={fineSettings}
          setFineSettings={setFineSettings}
          onLogout={handleLogout}
          onIssueBook={handleIssueBook}
          onReturnBook={handleReturnBook}
          onApproveReturnRequest={handleApproveReturnRequest}
          onUpdateRequestStatus={handleUpdateRequestStatus}
        />
    </>
  );

}
