import React, { useState, useEffect, useRef } from 'react';
import { BookUp, CheckCircle2, AlertCircle, Search, User, BookOpen, Clock, Printer, X } from 'lucide-react';
import { Book, IssueRecord, Student } from '@/src/types/index';
import jsPDF from 'jspdf';
import { QRCodeCanvas } from 'qrcode.react';

interface IssueBookProps {
  books: Book[];
  students: Student[];
  trackingRecords: IssueRecord[];
  onIssueBook: (studentName: string, rollNo: string, bookId: string, bookName: string, customExpectedReturnDate?: string) => void;
  settings?: any; // LibrarySettings
}

export function IssueBook({ books, students, trackingRecords, onIssueBook, settings }: IssueBookProps) {
  const [studentQuery, setStudentQuery] = useState('');
  const [bookQuery, setBookQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [showBookDropdown, setShowBookDropdown] = useState(false);

  // Settings fallbacks
  const maxBooks = settings?.maxBooksPerStudent || 3;
  const borrowDays = settings?.maxBorrowingDays || 15;

  const [expectedReturnDate, setExpectedReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + borrowDays);
    return d.toISOString().split('T')[0];
  });
  
  const [toastMessage, setToastMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedStudent) {
      setStudentQuery(selectedStudent.name + ' (' + selectedStudent.id + ')');
    }
  }, [selectedStudent]);

  useEffect(() => {
    if (selectedBook) {
      setBookQuery(selectedBook.name + ' (' + selectedBook.id + ')');
    }
  }, [selectedBook]);

  const showToast = (text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredStudents = students.filter(s => {
    const q = studentQuery.toLowerCase();
    return s.id.toLowerCase().includes(q) || 
           s.name.toLowerCase().includes(q) || 
           (s.membershipNumber && s.membershipNumber.toLowerCase().includes(q));
  }).slice(0, 5);

  const filteredBooks = books.filter(b => {
    const q = bookQuery.toLowerCase();
    return b.id.toLowerCase().includes(q) || 
           b.name.toLowerCase().includes(q) || 
           (b.isbn13 && b.isbn13.toLowerCase().includes(q));
  }).slice(0, 5);

  const studentIssues = selectedStudent ? trackingRecords.filter(r => r.studentId === selectedStudent.id && r.status === 'Issued') : [];
  const overdueBooks = studentIssues.filter(r => new Date(r.expectedReturnDate) < new Date());
  
  const handleIssue = () => {
    if (!selectedStudent || !selectedBook) {
      showToast('Please select both Student and Book.', 'error');
      return;
    }

    if (selectedStudent.accountStatus && selectedStudent.accountStatus !== 'Active') {
      showToast(`Student account is ${selectedStudent.accountStatus}. Cannot issue book.`, 'error');
      return;
    }

    if (studentIssues.length >= maxBooks) {
      showToast(`Maximum borrowing limit reached (${maxBooks} books).`, 'error');
      return;
    }

    if (overdueBooks.length > 0) {
      showToast('Student has overdue books. Cannot issue new books until returned.', 'error');
      return;
    }

    if (studentIssues.some(r => r.bookId === selectedBook.id)) {
      showToast('Student already has a copy of this book issued.', 'error');
      return;
    }

    const avail = selectedBook.availableCopies ?? (selectedBook.status === 'Available' ? 1 : 0);
    if (avail <= 0) {
      showToast('This book is currently out of stock.', 'error');
      return;
    }

    // Print Receipt
    handlePrintReceipt(selectedStudent, selectedBook, expectedReturnDate);

    // Issue Book
    onIssueBook(selectedStudent.name, selectedStudent.id, selectedBook.id, selectedBook.name, expectedReturnDate);
    showToast('Book issued successfully!', 'success');
    
    // Clear form
    setSelectedStudent(null);
    setSelectedBook(null);
    setStudentQuery('');
    setBookQuery('');
    const d = new Date();
    d.setDate(d.getDate() + borrowDays);
    setExpectedReturnDate(d.toISOString().split('T')[0]);
  };

  const handlePrintReceipt = (student: Student, book: Book, returnDate: string) => {
    const doc = new jsPDF();
    
    // Simple Receipt Design
    doc.setFontSize(20);
    doc.text("LIBRARY ISSUE RECEIPT", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
    
    doc.setFontSize(14);
    doc.text("Student Details:", 20, 55);
    doc.setFontSize(12);
    doc.text(`Name: ${student.name}`, 20, 65);
    doc.text(`ID/Roll No: ${student.id}`, 20, 75);
    doc.text(`Department: ${student.department}`, 20, 85);
    
    doc.setFontSize(14);
    doc.text("Book Details:", 20, 105);
    doc.setFontSize(12);
    doc.text(`Title: ${book.name}`, 20, 115);
    doc.text(`Book ID: ${book.id}`, 20, 125);
    doc.text(`Due Date: ${new Date(returnDate).toLocaleDateString()}`, 20, 135);

    doc.setFontSize(10);
    doc.text("Please return the book on or before the due date to avoid fines.", 105, 160, { align: "center" });
    doc.text("----------------------------------------------------------------", 105, 170, { align: "center" });
    doc.text("Authorized Signature", 160, 190, { align: "center" });

    // Ensure we run this sync or await, but for PDF rendering simple text works fine
    doc.save(`Receipt_${student.id}_${book.id}.pdf`);
  };

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6 relative pb-10">
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg border animate-in slide-in-from-top-2 fade-in duration-300 ${
          toastMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          <p className="font-medium">{toastMessage.text}</p>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-slate-800">Issue Book Checkout</h2>
        <p className="text-slate-500 mt-1">Scan or search student and book to process checkout.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col: Search Forms */}
        <div className="space-y-6">
          {/* Student Search */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 relative">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              1. Select Student
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                value={studentQuery}
                onChange={(e) => {
                  setStudentQuery(e.target.value);
                  setSelectedStudent(null);
                  setShowStudentDropdown(true);
                }}
                onFocus={() => setShowStudentDropdown(true)}
                placeholder="Scan ID Card or type name/membership..."
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              {selectedStudent && (
                <button onClick={() => { setSelectedStudent(null); setStudentQuery(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Student Dropdown */}
            {showStudentDropdown && studentQuery && !selectedStudent && (
              <div className="absolute z-20 left-6 right-6 top-[100px] mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                {filteredStudents.length > 0 ? (
                  <ul className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                    {filteredStudents.map(s => (
                      <li 
                        key={s.id}
                        onClick={() => { setSelectedStudent(s); setShowStudentDropdown(false); }}
                        className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors"
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{s.name}</div>
                          <div className="text-xs text-slate-500">{s.id} • {s.department} {s.membershipNumber && `• Mem: ${s.membershipNumber}`}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-slate-500 text-sm">No students found.</div>
                )}
              </div>
            )}
          </div>

          {/* Book Search */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 relative">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              2. Select Book
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                value={bookQuery}
                onChange={(e) => {
                  setBookQuery(e.target.value);
                  setSelectedBook(null);
                  setShowBookDropdown(true);
                }}
                onFocus={() => setShowBookDropdown(true)}
                placeholder="Scan Barcode/QR or type title/ISBN..."
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              {selectedBook && (
                <button onClick={() => { setSelectedBook(null); setBookQuery(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Book Dropdown */}
            {showBookDropdown && bookQuery && !selectedBook && (
              <div className="absolute z-20 left-6 right-6 top-[100px] mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                {filteredBooks.length > 0 ? (
                  <ul className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                    {filteredBooks.map(b => (
                      <li 
                        key={b.id}
                        onClick={() => { setSelectedBook(b); setShowBookDropdown(false); }}
                        className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex gap-3 transition-colors"
                      >
                        {b.imageUrl ? (
                          <img src={b.imageUrl} alt={b.name} className="w-10 h-14 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-14 bg-slate-100 rounded flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-slate-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="font-bold text-slate-800 line-clamp-1">{b.name}</div>
                          <div className="text-xs text-slate-500">{b.id} • {b.author}</div>
                          <div className="mt-1 text-xs font-semibold text-emerald-600">
                            {b.availableCopies ?? (b.status === 'Available' ? 1 : 0)} Available
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-slate-500 text-sm">No books found.</div>
                )}
              </div>
            )}
          </div>

          {/* Checkout Controls */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              3. Confirm & Checkout
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Issue Date</label>
                <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Due Date</label>
                <input 
                  type="date"
                  value={expectedReturnDate}
                  onChange={(e) => setExpectedReturnDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <button 
              onClick={handleIssue}
              disabled={!selectedStudent || !selectedBook}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <BookUp className="w-5 h-5" />
              Complete Issue & Print Receipt
            </button>
          </div>
        </div>

        {/* Right Col: Validation & Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 h-full">
            <h3 className="font-bold text-slate-800 mb-4">Checkout Validation</h3>
            
            <div className="space-y-4">
              {/* Student Status */}
              <div className={`p-4 rounded-xl border ${selectedStudent ? (selectedStudent.accountStatus === 'Active' || !selectedStudent.accountStatus ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100') : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase">Student Status</div>
                    {selectedStudent ? (
                      <div className="font-bold text-slate-800 mt-1">{selectedStudent.name} ({selectedStudent.id})</div>
                    ) : (
                      <div className="text-slate-400 mt-1 italic">Pending selection</div>
                    )}
                  </div>
                  {selectedStudent && (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${(selectedStudent.accountStatus === 'Active' || !selectedStudent.accountStatus) ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {selectedStudent.accountStatus || 'Active'}
                    </span>
                  )}
                </div>
                
                {selectedStudent && (
                  <div className="mt-4 pt-4 border-t border-black/5 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-500">Borrowed</div>
                      <div className={`font-bold ${studentIssues.length >= maxBooks ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {studentIssues.length} / {maxBooks}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Overdue</div>
                      <div className={`font-bold ${overdueBooks.length > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
                        {overdueBooks.length}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Book Status */}
              <div className={`p-4 rounded-xl border ${selectedBook ? ((selectedBook.availableCopies ?? (selectedBook.status === 'Available' ? 1 : 0)) > 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100') : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase">Book Status</div>
                    {selectedBook ? (
                      <div className="font-bold text-slate-800 mt-1 line-clamp-1">{selectedBook.name}</div>
                    ) : (
                      <div className="text-slate-400 mt-1 italic">Pending selection</div>
                    )}
                  </div>
                  {selectedBook && (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-3 ${(selectedBook.availableCopies ?? (selectedBook.status === 'Available' ? 1 : 0)) > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {(selectedBook.availableCopies ?? (selectedBook.status === 'Available' ? 1 : 0)) > 0 ? 'Available' : 'Out of Stock'}
                    </span>
                  )}
                </div>
                
                {selectedBook && (
                  <div className="mt-4 pt-4 border-t border-black/5 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-500">Book ID</div>
                      <div className="font-bold text-slate-700 font-mono">{selectedBook.id}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Available</div>
                      <div className="font-bold text-slate-700">
                        {selectedBook.availableCopies ?? (selectedBook.status === 'Available' ? 1 : 0)} of {selectedBook.totalCopies || 1}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Warning Messages */}
              <div className="space-y-2">
                {selectedStudent && studentIssues.length >= maxBooks && (
                  <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-3 rounded-lg text-sm font-medium border border-rose-100">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Student has reached maximum borrow limit.
                  </div>
                )}
                {selectedStudent && overdueBooks.length > 0 && (
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg text-sm font-medium border border-amber-100">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Student has {overdueBooks.length} overdue book(s).
                  </div>
                )}
                {selectedBook && (selectedBook.availableCopies ?? (selectedBook.status === 'Available' ? 1 : 0)) <= 0 && (
                  <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-3 rounded-lg text-sm font-medium border border-rose-100">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Book is out of stock.
                  </div>
                )}
                {selectedStudent && selectedBook && studentIssues.some(r => r.bookId === selectedBook.id) && (
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg text-sm font-medium border border-amber-100">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Student already borrowed this book.
                  </div>
                )}
              </div>

              {/* QR Code Hidden Container for PDF rendering if needed later */}
              <div className="hidden" ref={qrRef}>
                {selectedStudent && selectedBook && (
                  <QRCodeCanvas value={`ISSUE:${selectedStudent.id}:${selectedBook.id}`} size={100} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
