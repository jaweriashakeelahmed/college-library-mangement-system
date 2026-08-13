import React, { useState, useMemo } from 'react';
import { Book, IssueRecord } from '@/src/types';
import { 
  BookOpen, Search, Plus, Filter, Download, MoreVertical, Upload, 
  Trash2, Edit, Eye, Archive, BarChart3, TrendingUp, TrendingDown,
  ChevronLeft, ChevronRight, AlertTriangle
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { BookFormModal } from './components/BookFormModal';
import { BookDetailsModal } from './components/BookDetailsModal';
import { ImportBooksModal } from './components/ImportBooksModal';

interface BooksProps {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  trackingRecords?: IssueRecord[]; // Just in case we need it, though App might not pass it. If not passed, we'll default to []
}

export function Books({ books, setBooks, trackingRecords = [] }: BooksProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedBookForEdit, setSelectedBookForEdit] = useState<Book | null>(null);
  const [selectedBookForDetails, setSelectedBookForDetails] = useState<Book | null>(null);

  // Derived Stats
  const totalBooks = books.length;
  const availableCopies = books.reduce((acc, b) => acc + (b.availableCopies || (b.status === 'Available' ? 1 : 0)), 0);
  const issuedCopies = books.reduce((acc, b) => acc + (b.issuedCopies || (b.status === 'Issued' ? 1 : 0)), 0);
  const reservedCopies = books.reduce((acc, b) => acc + (b.reservedCopies || (b.status === 'Reserved' ? 1 : 0)), 0);
  const lostCopies = books.reduce((acc, b) => acc + (b.lostCopies || (b.status === 'Lost' ? 1 : 0)), 0);
  const damagedCopies = books.reduce((acc, b) => acc + (b.damagedCopies || (b.status === 'Damaged' ? 1 : 0)), 0);
  const lowStockCount = books.filter(b => (b.availableCopies ?? (b.status === 'Available' ? 1 : 0)) < 2).length;

  const categories = ['Computer Science', 'Software Engineering', 'AI', 'IT', 'Accounting & Finance', 'Education', 'BBA', 'English Literature'];
  const statuses = useMemo(() => Array.from(new Set(books.map(b => b.status))), [books]);

  // Filtering & Sorting
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = 
        book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.isbn13 && book.isbn13.includes(searchQuery)) ||
        (book.publisher && book.publisher.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'All' || (book.category || book.department) === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [books, searchQuery, categoryFilter]);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const paginatedBooks = filteredBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSaveBook = (bookData: Book) => {
    if (selectedBookForEdit) {
      // Edit
      setBooks(prev => prev.map(b => b.id === bookData.id ? bookData : b));
    } else {
      // Add
      const newBook: Book = {
        ...bookData,
        createdDate: new Date().toISOString(),
      };
      setBooks(prev => [...prev, newBook]);
    }
    setIsAddModalOpen(false);
    setSelectedBookForEdit(null);
  };

  const handleDeleteBook = (id: string) => {
    if (window.confirm("Are you sure you want to delete this book? This action cannot be undone.")) {
      setBooks(prev => prev.filter(b => b.id !== id));
    }
  };

  
  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Author', 'Department', 'Category', 'Status', 'Total Copies', 'Available'];
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + filteredBooks.map(b => 
          [b.id, `"${b.name}"`, `"${b.author}"`, b.category || b.department, b.status, b.totalCopies || 1, b.availableCopies ?? (b.status === 'Available' ? 1 : 0)].join(",")
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "library_inventory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Library Inventory Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
    
    const tableData = filteredBooks.map(b => [
      b.id,
      b.name,
      b.author,
      b.category || b.department,
      b.status,
      b.totalCopies || 1,
      b.availableCopies ?? (b.status === 'Available' ? 1 : 0)
    ]);

    (doc as any).autoTable({
      startY: 28,
      head: [['ID', 'Title', 'Author', 'Department', 'Status', 'Total', 'Avail']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    doc.save('library_inventory.pdf');
  };


  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Available': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Issued': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Reserved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Out of Stock': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Lost': return 'bg-slate-800 text-slate-100 border-slate-700';
      case 'Damaged': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header & Inventory Stats */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Inventory Management</h1>
        <p className="text-slate-500 mt-1">Manage library books, track inventory, and view analytics.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm flex flex-col justify-center">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Books</span>
          <span className="text-xl font-black text-slate-800">{totalBooks}</span>
        </div>
        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 shadow-sm flex flex-col justify-center">
          <span className="text-xs font-bold text-emerald-600 uppercase">Available</span>
          <span className="text-xl font-black text-emerald-700">{availableCopies}</span>
        </div>
        <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 shadow-sm flex flex-col justify-center">
          <span className="text-xs font-bold text-amber-600 uppercase">Issued</span>
          <span className="text-xl font-black text-amber-700">{issuedCopies}</span>
        </div>
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 shadow-sm flex flex-col justify-center">
          <span className="text-xs font-bold text-blue-600 uppercase">Reserved</span>
          <span className="text-xl font-black text-blue-700">{reservedCopies}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col lg:flex-row gap-4 items-center justify-between">
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-1">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Book ID Title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium">
              <option value="All">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 justify-end">
          <button onClick={() => setIsImportModalOpen(true)} className="px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold rounded-xl text-sm transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" /> Import
          </button>
          <div className="relative group">
            <button className="px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold rounded-xl text-sm transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" /> Export
            </button>
            <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-lg border border-slate-200 py-2 hidden group-hover:block z-20">
              <button onClick={handleExportCSV} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-medium">Export CSV</button>
              <button onClick={handleExportPDF} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-medium">Export PDF</button>
            </div>
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 font-bold rounded-xl text-sm transition-colors flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> Add Book
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Book Info</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Copies</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedBooks.map(book => (
                <tr key={book.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 line-clamp-1 cursor-pointer hover:text-blue-600" onClick={() => setSelectedBookForDetails(book)}>{book.name}</div>
                        <div className="text-xs text-slate-500 line-clamp-1">{book.author}</div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">ID: {book.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{book.category || book.department}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-center w-12">
                      <div className="font-semibold text-slate-800 text-lg">{book.totalCopies || 1}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(book.status)}`}>
                      {book.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setSelectedBookForDetails(book)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => setSelectedBookForEdit(book)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteBook(book.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {paginatedBooks.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                        <Search className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="font-semibold text-slate-700">No books found</p>
                      <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span>Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredBooks.length)} of {filteredBooks.length} entries</span>
              <div className="flex items-center gap-2 hidden sm:flex">
                <span>Rows per page:</span>
                <select value={itemsPerPage} onChange={(e) => {setItemsPerPage(Number(e.target.value)); setCurrentPage(1);}} className="bg-white border border-slate-200 rounded px-2 py-1 outline-none">
                  {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-sm font-medium text-slate-700 px-2">
                Page {currentPage} of {totalPages}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {(isAddModalOpen || selectedBookForEdit) && (
        <BookFormModal 
          book={selectedBookForEdit} 
          onSave={handleSaveBook} 
          onClose={() => { setIsAddModalOpen(false); setSelectedBookForEdit(null); }} 
        />
      )}

      {selectedBookForDetails && (
        <BookDetailsModal 
          book={selectedBookForDetails} 
          trackingRecords={trackingRecords}
          onClose={() => setSelectedBookForDetails(null)} 
          onEdit={(b) => { setSelectedBookForDetails(null); setSelectedBookForEdit(b); }}
        />
      )}

    </div>
  );
}
