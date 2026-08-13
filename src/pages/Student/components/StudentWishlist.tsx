import React from 'react';
import { Star, BookOpen, Trash2, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { Book, Student } from '@/src/types';

interface StudentWishlistProps {
  books: Book[];
  student: Student;
  onBookClick: (book: Book) => void;
  onRemoveWishlist: (studentId: string, bookId: string) => void;
}

export function StudentWishlist({ books, student, onBookClick, onRemoveWishlist }: StudentWishlistProps) {
  const wishlistBooks = books.filter(b => student.wishlist?.includes(b.id));

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">My Wishlist</h2>
        <p className="text-slate-500 mt-1">Books you've saved for later reading.</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {wishlistBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 bg-white rounded-2xl border border-slate-200 p-8">
            <Star className="w-16 h-16 mb-4 text-slate-300" />
            <p className="font-medium text-lg text-slate-700">Your wishlist is empty</p>
            <p className="text-sm mt-1">Explore the catalog and save books you're interested in.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-8">
            {wishlistBooks.map(book => {
              const isAvailable = (book.availableCopies ?? (book.status === "Available" ? 1 : 0)) > 0;
              return (
                <div key={book.id} className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm hover:shadow-lg transition-all group flex flex-col relative overflow-hidden">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveWishlist(student.id, book.id);
                    }} 
                    className="absolute top-5 right-5 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-rose-50 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 text-slate-400"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div onClick={() => onBookClick(book)} className="cursor-pointer flex flex-col h-full mt-2">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${isAvailable ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">{book.department}</div>
                        <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors" title={book.name}>{book.name}</h3>
                      </div>
                    </div>
                    
                    <div className="flex flex-col flex-1">
                      <p className="text-xs text-slate-500 truncate mb-3">{book.author}</p>
                      
                      <div className="mt-auto flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className={`text-xs font-bold flex items-center gap-1 ${isAvailable ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isAvailable ? (
                            <><CheckCircle2 className="w-3.5 h-3.5" /> Available ({book.availableCopies ?? (book.status === "Available" ? 1 : 0)})</>
                          ) : (
                            <><X className="w-3.5 h-3.5" /> Issued</>
                          )}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
