import React from 'react';
import { X, Star, BookOpen, Clock, Hash, Tag, User, MapPin } from 'lucide-react';
import { Book, Student } from '@/src/types';

interface StudentBookDetailsProps {
  book: Book;
  student: Student;
  onClose: () => void;
  onToggleWishlist: (studentId: string, bookId: string) => void;
  onRequestBorrow?: (bookId: string) => void;
}

export function StudentBookDetails({ book, student, onClose, onToggleWishlist, onRequestBorrow }: StudentBookDetailsProps) {
  const isWishlisted = student.wishlist?.includes(book.id);
  const isAvailable = (book.availableCopies ?? (book.status === "Available" ? 1 : 0)) > 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
        <button onClick={onClose} className="absolute top-6 right-6 z-10 p-2 bg-white/50 backdrop-blur-md rounded-full shadow-sm hover:bg-slate-100 transition-colors text-slate-500">
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col md:flex-row h-full max-h-[85vh]">
          {/* Left: Image */}
          <div className="md:w-2/5 bg-slate-100 relative shrink-0">
             {book.imageUrl ? (
               <img src={book.imageUrl} alt={book.name} className="w-full h-full object-cover min-h-[300px] md:absolute md:inset-0" />
             ) : (
               <div className="w-full h-full min-h-[300px] flex items-center justify-center text-slate-400 bg-slate-50 font-bold text-6xl">{book.name.split(' ').slice(0, 2).map(w => w.charAt(0)).join('')}</div>
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-slate-900/10 pointer-events-none"></div>
             
             {!isAvailable && (
                <div className="absolute top-6 left-6 bg-rose-600 text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
                  Out of Stock
                </div>
             )}
          </div>

          {/* Right: Details */}
          <div className="md:w-3/5 p-8 md:p-10 flex flex-col overflow-y-auto bg-white">
            <div className="flex items-center gap-2 mb-4">
               <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">{book.category}</span>
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
            {book.description && (
              <div className="mb-8">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</div>
                <p className="text-sm text-slate-600 leading-relaxed">{book.description}</p>
              </div>
            )}
            <div className="mt-auto pt-6 flex gap-4 border-t border-slate-100 flex-col sm:flex-row">
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
                  onClick={() => { onRequestBorrow(book.id); onClose(); }}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all shadow-sm text-white ${isAvailable ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-800 hover:bg-slate-900'}`}
                >
                  <Clock className="w-5 h-5" />
                  {isAvailable ? 'Borrow Book' : 'Reserve Book'}
                </button>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
