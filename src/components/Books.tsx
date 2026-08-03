import React, { useState, useRef } from 'react';
import { Search, Plus, X, BookOpen, Filter, Tags, Trash2, Camera } from 'lucide-react';
import { Book } from '../types';

interface BooksProps {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}

const INITIAL_DEPARTMENTS = [
  'CS', 'SE', 'AI', 'IT', 'DS', 'English Literature', 
  'BBA', 'Commerce', 'Finance', 'Accounting', 'Education'
];

export function Books({ books, setBooks }: BooksProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [departments, setDepartments] = useState<string[]>(INITIAL_DEPARTMENTS);
  const [isManagingCategories, setIsManagingCategories] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [isAdding, setIsAdding] = useState(false);
  const [newBookName, setNewBookName] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookDepartment, setNewBookDepartment] = useState('CS');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const filteredBooks = books.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || b.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

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
      status: 'Available',
      imageUrl: capturedImage || undefined
    };

    setBooks(prev => [newBook, ...prev]);
    setIsAdding(false);
    setNewBookName('');
    setNewBookAuthor('');
    setNewBookDepartment(departments.length > 0 ? departments[0] : '');
    setCapturedImage(null);
  };

  const handleAddCategory = () => {
    const cat = newCategoryName.trim();
    if (cat && !departments.includes(cat)) {
      setDepartments([...departments, cat]);
      setNewCategoryName('');
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Book Records</h2>
          <p className="text-slate-500 mt-1">Manage library inventory and track availability.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsManagingCategories(true)} 
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <Tags className="w-4 h-4" />
            <span className="hidden sm:inline">Categories</span>
          </button>
          {!isAdding && (
            <button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm active:scale-95">
              <Plus className="w-5 h-5" />
              Add New Book
            </button>
          )}
        </div>
      </div>

      {isManagingCategories && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Manage Categories</h3>
              <button onClick={() => setIsManagingCategories(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  placeholder="New category name..."
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCategory();
                    }
                  }}
                />
                <button 
                  onClick={handleAddCategory}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-all"
                >
                  Add
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                {departments.map(dept => (
                  <div key={dept} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="font-medium text-slate-700">{dept}</span>
                    <button 
                      onClick={() => {
                        setDepartments(departments.filter(d => d !== dept));
                        if (selectedDept === dept) setSelectedDept('All');
                        if (newBookDepartment === dept) setNewBookDepartment(departments[0] || '');
                      }}
                      className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {departments.length === 0 && (
                  <p className="text-center text-slate-500 text-sm py-4">No categories defined.</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button 
                onClick={() => setIsManagingCategories(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-xl font-medium transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

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
              <label className="text-sm font-semibold text-slate-700 block">Book Name</label>
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
                required
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            <label className="text-sm font-semibold text-slate-700 block">Book Cover Image</label>
            {!isCameraActive && !capturedImage && (
              <button 
                type="button" 
                onClick={startCamera}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Capture from Camera
              </button>
            )}
            
            {isCameraActive && (
              <div className="relative w-full max-w-sm rounded-xl overflow-hidden bg-slate-900 aspect-[3/4]">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                  <button 
                    type="button" 
                    onClick={stopCamera}
                    className="bg-slate-800/80 hover:bg-slate-800 text-white p-3 rounded-full backdrop-blur-sm transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button 
                    type="button" 
                    onClick={captureImage}
                    className="bg-white hover:bg-slate-100 text-slate-900 p-3 rounded-full shadow-lg transition-all"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {capturedImage && !isCameraActive && (
              <div className="relative inline-block">
                <img src={capturedImage} alt="Book cover" className="w-32 h-40 object-cover rounded-xl border border-slate-200 shadow-sm" />
                <button 
                  type="button" 
                  onClick={() => setCapturedImage(null)}
                  className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full shadow-sm hover:bg-rose-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
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
              placeholder="Search by Title, Author, or ISBN..." 
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
              <option value="All">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div key={book.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 overflow-hidden">
                    {book.imageUrl ? (
                      <img src={book.imageUrl} alt={book.name} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen className="w-6 h-6 stroke-[1.5]" />
                    )}
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
