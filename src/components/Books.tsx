import React, { useState } from 'react';
import { Search, Plus, X, BookOpen, Filter } from 'lucide-react';
import { Book } from '../types';

interface BooksProps {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}

const DEPARTMENTS = [
  'All', 'CS', 'SE', 'AI', 'IT', 'DS', 'English Literature', 
  'BBA', 'Commerce', 'Finance', 'Accounting', 'Education'
];

export function Books({ books, setBooks }: BooksProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [isAdding, setIsAdding] = useState(false);
  const [newBookName, setNewBookName] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookDepartment, setNewBookDepartment] = useState('CS');

  const filteredBooks = books.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || b.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookName || !newBookAuthor) return;

    // Generate next ID
    const currentMax = books.reduce((max, b) => {
      const num = parseInt(b.id.substring(1), 10);
      return num > max ? num : max;
    }, 0);
    const nextId = `B${String(currentMax + 1).padStart(3, '0')}`;

    const newBook: Book = {
      id: nextId,
      name: newBookName,
      author: newBookAuthor,
      department: newBookDepartment,
      status: 'Available'
    };

    setBooks(prev => [newBook, ...prev]);
    setIsAdding(false);
    setNewBookName('');
    setNewBookAuthor('');
    setNewBookDepartment('CS');
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Book Records</h2>
          <p className="text-slate-500 mt-1">Manage library inventory and track availability.</p>
        </div>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm active:scale-95">
            <Plus className="w-5 h-5" />
            Add New Book
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAddBook} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in slide-in-from-top-2 fade-in duration-200 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-slate-800">Add a New Book</h3>
            <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Book Name / URL</label>
              <input 
                type="text" 
                value={newBookName}
                onChange={e => setNewBookName(e.target.value)}
                placeholder="e.g. C++ Programming" 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Author</label>
              <input 
                type="text" 
                value={newBookAuthor}
                onChange={e => setNewBookAuthor(e.target.value)}
                placeholder="e.g. Bjarne Stroustrup" 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Department</label>
              <select
                value={newBookDepartment}
                onChange={e => setNewBookDepartment(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
              >
                {DEPARTMENTS.filter(d => d !== 'All').map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-all shadow-sm active:scale-95">
              Publish Book
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 flex-1 flex flex-col overflow-hidden p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Book ID or Name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
            />
          </div>
          <div className="relative md:w-64">
            <Filter className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 appearance-none relative"
            >
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div key={book.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <BookOpen className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md">
                    {book.department}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 mb-1 line-clamp-2" title={book.name}>{book.name}</h4>
                <p className="text-sm text-slate-500 mb-4 line-clamp-1" title={book.author}>By {book.author}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">
                    ID: {book.id}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    book.status === 'Available' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                      : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                  }`}>
                    {book.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {filteredBooks.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              No books found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
