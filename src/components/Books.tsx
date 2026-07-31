import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit, X } from 'lucide-react';
import { Book } from '../types';

interface BooksProps {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}

export function Books({ books, setBooks }: BooksProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newBookName, setNewBookName] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookDepartment, setNewBookDepartment] = useState('CS');

  const filteredBooks = books.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <option value="CS">Computer Science</option>
                <option value="IT">Information Technology</option>
                <option value="Software Eng">Software Engineering</option>
                <option value="General">General Knowledge</option>
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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 flex-1 flex flex-col overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-white">
          <div className="relative max-w-md">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Book ID or Name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-4">Book ID</th>
                <th className="px-6 py-4">Book Name</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Department</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-900">{book.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{book.name}</td>
                  <td className="px-6 py-4 text-slate-500">{book.author}</td>
                  <td className="px-6 py-4 text-slate-500">{book.department}</td>
                </tr>
              ))}
              {filteredBooks.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No books found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
