import React, { useState } from 'react';
import { X, Star, BookOpen, Clock, Hash, Tag, User, MapPin, CheckCircle } from 'lucide-react';
import { Book, Student } from '@/src/types';

interface StudentBookDetailsProps {
  book: Book;
  student: Student;
  onClose: () => void;
  onToggleWishlist: (studentId: string, bookId: string) => void;
  onRequestBorrow?: (bookId: string) => void;
}

export function StudentBookDetails({ book, student, onClose, onToggleWishlist, onRequestBorrow }: StudentBookDetailsProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const isWishlisted = student.wishlist?.includes(book.id);
  const isAvailable = (book.availableCopies ?? (book.status === "Available" ? 1 : 0)) > 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
        <button onClick={onClose} className="absolute top-6 right-6 z-10 p-2 bg-white/50 backdrop-blur-md rounded-full shadow-sm hover:bg-slate-100 transition-colors text-slate-500">
          <X className="w-6 h-6" />
        </button>
        <div className="flex flex-col h-full max-h-[85vh]">
          
          <div className="w-full p-8 md:p-10 flex flex-col overflow-y-auto bg-white relative">
            <div className="flex items-center gap-2 mb-4">
              {isAvailable ? (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    Available ({book.availableCopies ?? (book.status === "Available" ? 1 : 0)})
                  </span>
               ) : null}
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 leading-tight">{book.name}</h2>
            <p className="text-xl text-slate-600 font-medium mb-8 flex items-center gap-2"><User className="w-5 h-5" /> {book.author}</p>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1"><Hash className="w-3.5 h-3.5" /> Book ID</div>
                <div className="font-semibold text-slate-800">{book.id}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1"><MapPin className="w-3.5 h-3.5" /> Location</div>
                <div className="font-semibold text-slate-800">Shelf {book.shelfNumber || '1'}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1"><Tag className="w-3.5 h-3.5" /> Department</div>
                <div className="font-semibold text-slate-800">{book.department}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1"><Clock className="w-3.5 h-3.5" /> Semester</div>
                <div className="font-semibold text-slate-800">Sem {book.semester}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1"><BookOpen className="w-3.5 h-3.5" /> Total Copies</div>
                <div className="font-semibold text-slate-800">{book.totalCopies}</div>
              </div>
            </div>

            <div className="mt-auto pt-6 flex gap-4 border-t border-slate-100">
              <button 
                onClick={() => onToggleWishlist(student.id, book.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${
                  isWishlisted 
                    ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100' 
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Star className={`w-5 h-5 ${isWishlisted ? 'fill-amber-400 text-amber-400' : ''}`} />
                {isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
              </button>
              {onRequestBorrow && (
                <button 
                  onClick={() => { 
                    onRequestBorrow(book.id); 
                    setShowSuccess(true);
                    setTimeout(() => {
                      onClose(); 
                    }, 2000);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                >
                  <Clock className="w-5 h-5" />
                  Request Book
                </button>
              )}
            </div>

            {showSuccess && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-50 rounded-3xl">
                <div className="bg-emerald-100 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-in zoom-in-95 fade-in duration-200">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                  <span className="font-bold text-lg">Request sent to admin</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
