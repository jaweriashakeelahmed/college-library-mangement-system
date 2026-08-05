import React from 'react';
import { Star, BookOpen, Trash2, ArrowRight } from 'lucide-react';
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
                  <div onClick={() => onBookClick(book)} className="cursor-pointer flex flex-col h-full">
                    <div className="aspect-[2/3] w-full bg-slate-100 rounded-xl overflow-hidden mb-4 relative">
                      {book.imageUrl ? (
                        <img src={book.imageUrl} alt={book.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50 font-bold text-4xl">{book.name.charAt(0)}</div>
                      )}
                      {!isAvailable && (
                        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-[1px]">
                          <span className="bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">Borrowed</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">{book.category}</div>
                      <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors" title={book.name}>{book.name}</h3>
                      <p className="text-xs text-slate-500 truncate mb-3">{book.author}</p>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                          {isAvailable ? `${book.availableCopies ?? (book.status === "Available" ? 1 : 0)} left` : '0 left'}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
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
