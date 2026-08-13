import React, { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, Star, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { Book, Student } from '@/src/types';

interface StudentSearchProps {
  books: Book[];
  student: Student;
  onBookClick: (book: Book) => void;
  onToggleWishlist: (studentId: string, bookId: string) => void;
  onRequestBorrow?: (bookId: string) => void;
}

export function StudentSearch({ books, student, onBookClick, onToggleWishlist, onRequestBorrow }: StudentSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const filteredBooks = useMemo(() => {
    let result = books;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => 
        (b.name || '').toLowerCase().includes(q) ||
        (b.author || '').toLowerCase().includes(q) ||
        (b.isbn13 || '').includes(q) ||
        (b.isbn10 || '').includes(q) ||
        (b.id || '').toLowerCase().includes(q) ||
        (b.category || '').toLowerCase().includes(q) ||
        (b.department || '').toLowerCase().includes(q) ||
        (b.publisher || '').toLowerCase().includes(q) ||
        (b.rackNumber || '').toLowerCase().includes(q) ||
        (b.shelfNumber || '').toLowerCase().includes(q)
      );
    }
    if (filterCategory) {
      result = result.filter(b => (b.category || b.department) === filterCategory);
    }
    return result;
  }, [books, searchQuery, filterCategory]);

  const categories = ['Computer Science', 'Software Engineering', 'AI', 'IT', 'Accounting & Finance', 'Education', 'BBA', 'English Literature'];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Library Catalog</h2>
          <p className="text-slate-500 mt-1">Search and discover thousands of books.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search Book ID Title" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-5 h-5 text-slate-400 shrink-0" />
          <select 
            value={filterCategory} 
            onChange={e => setFilterCategory(e.target.value)} 
            className="w-full md:w-48 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-[400px]">
        {filteredBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <BookOpen className="w-16 h-16 mb-4 text-slate-300" />
            <p className="font-medium text-lg text-slate-700">No books found</p>
            <p className="text-sm">Try adjusting your search query or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-8">
            {filteredBooks.map(book => {
              const isWishlisted = student.wishlist?.includes(book.id);
              const isAvailable = (book.availableCopies ?? (book.status === "Available" ? 1 : 0)) > 0;
              return (
                <div key={book.id} className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm hover:shadow-lg transition-all group flex flex-col relative overflow-hidden">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(student.id, book.id);
                    }} 
                    className="absolute top-5 right-5 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-slate-50 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Star className={`w-4 h-4 ${isWishlisted ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                  </button>
                  <div onClick={() => onBookClick(book)} className="cursor-pointer flex flex-col h-full mt-2">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${isAvailable ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">{book.category || book.department}</div>
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
