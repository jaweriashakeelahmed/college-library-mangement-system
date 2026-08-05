import React, { useRef } from 'react';
import { Book, IssueRecord } from '@/src/types';
import { QRCodeCanvas } from 'qrcode.react';
import Barcode from 'react-barcode';
import { X, QrCode, Printer, MapPin, Tag, Calendar, Download, Edit } from 'lucide-react';

interface BookDetailsModalProps {
  book: Book;
  trackingRecords: IssueRecord[];
  onClose: () => void;
  onEdit: (book: Book) => void;
}

export function BookDetailsModal({ book, trackingRecords, onClose, onEdit }: BookDetailsModalProps) {
  const printRef = useRef<HTMLDivElement>(null);
  
  const bookRecords = trackingRecords.filter(r => r.bookId === book.id);
  const currentBorrower = bookRecords.find(r => r.status === 'Issued');

  const handlePrintLabel = () => {
    const printContent = document.getElementById(`print-label-${book.id}`);
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  
  const handleDownloadQR = () => {
    const canvas = document.querySelector(`#print-label-${book.id} canvas`) as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `qr-${book.id}.png`;
      a.click();
    }
  };

  const handleDownloadBarcode = () => {
    const svg = document.querySelector(`#print-label-${book.id} svg`);
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `barcode-${book.id}.svg`;
      a.click();
    }
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50 rounded-t-2xl">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-800">Book Details</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(book.status)}`}>
              {book.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { onClose(); onEdit(book); }} className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5">
              <Edit className="w-4 h-4" /> Edit
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col: Visuals & Labels */}
            <div className="space-y-6">
              <div className="aspect-[3/4] bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden shadow-inner flex items-center justify-center relative group">
                {book.imageUrl ? (
                  <img src={book.imageUrl} alt={book.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-slate-400 font-medium">No Cover Available</div>
                )}
              </div>

              {/* Barcode & QR Label */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-slate-700">Digital Identity</h3>
                  
                  <div className="flex gap-2">
                    <button onClick={handleDownloadQR} className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                      <Download className="w-3.5 h-3.5" /> QR
                    </button>
                    <button onClick={handleDownloadBarcode} className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                      <Download className="w-3.5 h-3.5" /> Barcode
                    </button>
                    <button onClick={handlePrintLabel} className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                      <Printer className="w-3.5 h-3.5" /> Print
                    </button>
                  </div>

                </div>
                
                <div id={`print-label-${book.id}`} className="bg-white border border-slate-300 p-4 rounded-lg flex flex-col items-center justify-center gap-2">
                  <div className="bg-white p-2 flex items-center justify-center rounded">
                     <QRCodeCanvas value={`https://library.edu/book/${book.id}`} size={120} level="H" />
                  </div>
                  <div className="text-center mt-2">
                    <div className="font-mono text-sm tracking-widest text-slate-800 font-bold">{book.id}</div>
                    <div className="text-[10px] text-slate-500 max-w-[150px] truncate">{book.name}</div>
                  </div>
                  <div className="mt-2 w-full flex justify-center">
                    <Barcode value={book.id} width={1.5} height={40} fontSize={12} displayValue={false} />
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Col: Details */}
            <div className="lg:col-span-2 space-y-8">
              
              <div>
                <h1 className="text-3xl font-black text-slate-900 mb-1">{book.name}</h1>
                {book.subtitle && <h2 className="text-lg font-medium text-slate-600 mb-2">{book.subtitle}</h2>}
                <p className="text-lg text-blue-600 font-semibold mb-4">By {book.author} {book.coAuthor && `& ${book.coAuthor}`}</p>
                {book.description && (
                  <p className="text-slate-600 text-sm leading-relaxed">{book.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">Total Copies</div>
                  <div className="text-xl font-black text-slate-800">{book.totalCopies || 1}</div>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <div className="text-xs font-bold text-emerald-600 uppercase mb-1">Available</div>
                  <div className="text-xl font-black text-emerald-700">{book.availableCopies ?? 1}</div>
                </div>
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                  <div className="text-xs font-bold text-amber-600 uppercase mb-1">Issued</div>
                  <div className="text-xl font-black text-amber-700">{book.issuedCopies || 0}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">Reserved</div>
                  <div className="text-xl font-black text-slate-800">{book.reservedCopies || 0}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Tag className="w-4 h-4 text-slate-400" /> Classification
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Department:</span> <span className="font-semibold text-slate-800">{book.department}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Category:</span> <span className="font-semibold text-slate-800">{book.category || '-'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Subject:</span> <span className="font-semibold text-slate-800">{book.subject || '-'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500">ISBN-13:</span> <span className="font-mono text-slate-800">{book.isbn13 || '-'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Accession No:</span> <span className="font-mono text-slate-800">{book.accessionNumber || '-'}</span></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                    <MapPin className="w-4 h-4 text-slate-400" /> Location & Publication
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Floor:</span> <span className="font-semibold text-slate-800">{book.floor || '-'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Rack / Shelf:</span> <span className="font-semibold text-slate-800">{book.rackNumber || '-'} / {book.shelfNumber || '-'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Publisher:</span> <span className="font-semibold text-slate-800">{book.publisher || '-'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Edition / Year:</span> <span className="font-semibold text-slate-800">{book.edition || '-'} {book.publicationYear ? `(${book.publicationYear})` : ''}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500">Price:</span> <span className="font-semibold text-slate-800">{book.price ? `Rs. ${book.price}` : '-'}</span></div>
                  </div>
                </div>
              </div>

              {/* Current Status / Borrower */}
              {currentBorrower && (
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-blue-600 uppercase mb-1">Currently Issued To</div>
                    <div className="font-semibold text-slate-800">{currentBorrower.studentName}</div>
                    <div className="text-xs text-slate-500">{currentBorrower.studentId}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-blue-600 uppercase mb-1">Expected Return</div>
                    <div className="font-semibold text-slate-800">{currentBorrower.expectedReturnDate}</div>
                  </div>
                </div>
              )}

              {/* Circulation History */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Calendar className="w-4 h-4 text-slate-400" /> Circulation History
                </h3>
                {bookRecords.length > 0 ? (
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">Student</th>
                          <th className="px-4 py-3">Issued Date</th>
                          <th className="px-4 py-3">Return Date</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {bookRecords.map(record => (
                          <tr key={record.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 font-medium text-slate-800">{record.studentName}</td>
                            <td className="px-4 py-3 text-slate-600">{record.issueDate}</td>
                            <td className="px-4 py-3 text-slate-600">{record.returnDate || '-'}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                record.status === 'Issued' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                              }`}>{record.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-100 p-6 rounded-xl text-center text-slate-500 text-sm">
                    No circulation history found for this book.
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
