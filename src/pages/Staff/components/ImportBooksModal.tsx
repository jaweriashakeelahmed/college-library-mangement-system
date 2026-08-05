import React, { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Book } from '@/src/types';

interface ImportBooksModalProps {
  onClose: () => void;
  onImport: (books: Book[]) => void;
  existingBooks: Book[];
}

export function ImportBooksModal({ onClose, onImport, existingBooks }: ImportBooksModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [duplicates, setDuplicates] = useState<number>(0);
  const [newBooksCount, setNewBooksCount] = useState<number>(0);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setError('');
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        const lines = csv.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) throw new Error("File seems empty or missing headers");
        
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const parsed = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.replace(/^"|"$/g, '').trim());
          const bookData: any = {};
          headers.forEach((h, i) => {
             bookData[h] = values[i] || '';
          });
          return bookData;
        });

        // Basic validation & duplicate check (checking ISBN or title)
        let dupes = 0;
        let newCount = 0;
        const processed = parsed.map(p => {
           const isDupe = existingBooks.some(eb => (eb.isbn13 && eb.isbn13 === p.isbn13) || eb.name.toLowerCase() === (p.title || p.name || '').toLowerCase());
           if (isDupe) dupes++;
           else newCount++;
           return { ...p, isDuplicate: isDupe };
        });

        setPreview(processed);
        setDuplicates(dupes);
        setNewBooksCount(newCount);
      } catch (err) {
        setError('Failed to parse CSV. Please ensure it follows the correct format.');
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleImport = () => {
    const validBooks = preview.filter(p => !p.isDuplicate).map((p, i) => {
       const newBook: Book = {
         id: `B${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}-${i}`,
         name: p.title || p.name || 'Unknown Title',
         author: p.author || 'Unknown Author',
         department: p.department || 'General',
         status: 'Available',
         totalCopies: parseInt(p.copies || p.totalcopies || '1'),
         availableCopies: parseInt(p.copies || p.totalcopies || '1'),
         isbn13: p.isbn13 || p.isbn,
         publisher: p.publisher,
         category: p.category,
         createdDate: new Date().toISOString()
       };
       return newBook;
    });
    
    onImport(validBooks);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Import Books</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {!preview.length ? (
            <div 
              className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-1">Upload CSV File</h3>
              <p className="text-slate-500 text-sm mb-4">Click or drag file to this area to upload</p>
              <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700">
                Browse Files
              </button>
              <input type="file" accept=".csv" className="hidden" ref={fileRef} onChange={handleFileChange} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <FileText className="w-8 h-8 text-blue-600" />
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">{file?.name}</h4>
                  <p className="text-xs text-slate-500">{preview.length} total records found</p>
                </div>
                <button onClick={() => { setFile(null); setPreview([]); }} className="text-sm text-rose-600 font-semibold hover:underline">
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-emerald-800">{newBooksCount} New Books</h4>
                    <p className="text-sm text-emerald-600">Ready to be imported into inventory.</p>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-800">{duplicates} Duplicates</h4>
                    <p className="text-sm text-amber-600">Matched by ISBN or Title. Will be skipped.</p>
                  </div>
                </div>
              </div>
              
              <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl text-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 shadow-sm">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-slate-600">Title</th>
                      <th className="px-4 py-3 font-semibold text-slate-600">Author</th>
                      <th className="px-4 py-3 font-semibold text-slate-600">ISBN</th>
                      <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {preview.slice(0, 50).map((row, i) => (
                      <tr key={i} className={row.isDuplicate ? 'bg-amber-50/30' : ''}>
                        <td className="px-4 py-3 truncate max-w-[150px]">{row.title || row.name}</td>
                        <td className="px-4 py-3 truncate max-w-[100px]">{row.author}</td>
                        <td className="px-4 py-3 font-mono">{row.isbn13 || row.isbn || '-'}</td>
                        <td className="px-4 py-3">
                          {row.isDuplicate ? 
                            <span className="text-amber-600 font-semibold text-xs">Duplicate</span> : 
                            <span className="text-emerald-600 font-semibold text-xs">Ready</span>
                          }
                        </td>
                      </tr>
                    ))}
                    {preview.length > 50 && (
                      <tr><td colSpan={4} className="px-4 py-3 text-center text-slate-500 italic">...and {preview.length - 50} more rows</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {error && <div className="text-rose-600 text-sm font-semibold">{error}</div>}
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleImport} 
            disabled={!preview.length || newBooksCount === 0}
            className="px-5 py-2.5 text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Import {newBooksCount} Books
          </button>
        </div>
      </div>
    </div>
  );
}
