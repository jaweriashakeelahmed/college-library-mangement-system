import React, { useState } from 'react';
import { Book } from '@/src/types';
import { X, Save, BookOpen, AlertCircle } from 'lucide-react';

interface BookFormModalProps {
  book?: Book | null;
  onSave: (book: Book) => void;
  onClose: () => void;
}

const DEPARTMENTS = ['Computer Science', 'Software Engineering', 'AI', 'IT', 'Accounting & Finance', 'Education', 'BBA', 'English Literature'];

export function BookFormModal({ book, onSave, onClose }: BookFormModalProps) {
  const [formData, setFormData] = useState<Partial<Book>>(
    book || {
      id: '',
      name: '',
      author: '',
      subject: '',
      department: DEPARTMENTS[0],
      status: 'Available',
      totalCopies: 3,
      availableCopies: 3,
      issuedCopies: 0,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: any = value;
    
    if (type === 'number') {
      parsedValue = value === '' ? '' : Number(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.name || !formData.author) {
      alert("Book ID, Title and Author are required.");
      return;
    }
    
    const finalData = { ...formData };
    if (!book) { 
       finalData.availableCopies = finalData.totalCopies;
       finalData.issuedCopies = 0;
       finalData.status = 'Available';
    }
    onSave(finalData as Book);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10 rounded-t-2xl">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            {book ? 'Edit Book Details' : 'Add New Book'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                Book Registration Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1">
                    Book ID <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="id" 
                    value={formData.id || ''} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 font-mono" 
                    placeholder="e.g. B001, B012" 
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1">
                    Title of Book <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name || ''} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" 
                    placeholder="e.g. Introduction to Algorithms" 
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1">
                    Author Name <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="author" 
                    value={formData.author || ''} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" 
                    placeholder="e.g. Thomas H. Cormen"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1">Subject</label>
                  <input 
                    type="text" 
                    name="subject" 
                    value={formData.subject || ''} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" 
                    placeholder="e.g. Computer Science / Data Structures"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1">Category</label>
                  <select 
                    name="category" 
                    value={formData.category || formData.department} 
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, category: e.target.value, department: e.target.value }));
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1">Total Copies of Book</label>
                  <input 
                    type="number" 
                    name="totalCopies" 
                    min="1" 
                    value={formData.totalCopies ?? 3} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 font-semibold" 
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
             <button type="button" onClick={onClose} className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors">
               Cancel
             </button>
             <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
               <Save className="w-4 h-4" />
               {book ? 'Save Changes' : 'Add Book'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
