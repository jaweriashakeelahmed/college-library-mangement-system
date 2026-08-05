import React, { useState, useRef } from 'react';
import { Book } from '@/src/types';
import { X, Camera, Upload, Save, BookOpen, AlertCircle } from 'lucide-react';

interface BookFormModalProps {
  book?: Book | null;
  onSave: (book: Omit<Book, 'id'> | Book) => void;
  onClose: () => void;
}

const DEPARTMENTS = ['Computer Science', 'Electrical', 'Mechanical', 'Civil', 'Business', 'Mathematics', 'Physics', 'Chemistry'];
const CATEGORIES = ['Textbook', 'Reference', 'Journal', 'Magazine', 'Fiction', 'Non-Fiction'];
const STATUSES = ['Available', 'Issued', 'Reserved', 'Out of Stock', 'Lost', 'Damaged', 'Archived'];

export function BookFormModal({ book, onSave, onClose }: BookFormModalProps) {
  const [formData, setFormData] = useState<Partial<Book>>(
    book || {
      name: '',
      author: '',
      department: DEPARTMENTS[0],
      status: 'Available',
      totalCopies: 1,
      availableCopies: 1,
      category: CATEGORIES[0],
      language: 'English',
      price: 0,
    }
  );

  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: any = value;
    
    if (type === 'number') {
      parsedValue = value === '' ? '' : Number(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera access denied or unavailable.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
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
        setFormData(prev => ({ ...prev, imageUrl: canvas.toDataURL('image/jpeg', 0.8) }));
      }
      stopCamera();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.author) {
      alert("Title and Author are required.");
      return;
    }
    onSave(formData as any);
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col: Cover Image */}
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">Book Cover</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:bg-slate-50 transition-colors flex flex-col items-center justify-center aspect-[3/4] overflow-hidden relative">
                  {isCameraActive ? (
                    <>
                      <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                        <button type="button" onClick={stopCamera} className="bg-slate-800/80 text-white p-2.5 rounded-full backdrop-blur-sm"><X className="w-4 h-4" /></button>
                        <button type="button" onClick={captureImage} className="bg-blue-600 text-white p-2.5 rounded-full"><Camera className="w-4 h-4" /></button>
                      </div>
                    </>
                  ) : formData.imageUrl ? (
                    <>
                      <img src={formData.imageUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                         <label className="bg-white text-slate-800 p-2 rounded-full cursor-pointer hover:bg-slate-100"><Upload className="w-4 h-4" /><input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={handleFileUpload} /></label>
                         <button type="button" onClick={startCamera} className="bg-white text-slate-800 p-2 rounded-full hover:bg-slate-100"><Camera className="w-4 h-4" /></button>
                         <button type="button" onClick={() => setFormData(prev => ({...prev, imageUrl: undefined}))} className="bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600"><X className="w-4 h-4" /></button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3 w-full">
                      <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                        <BookOpen className="w-8 h-8" />
                      </div>
                      <div className="text-sm text-slate-500 mb-2">JPG, PNG, WEBP (Max 2MB)</div>
                      <div className="flex gap-2 w-full px-4">
                        <label className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg cursor-pointer transition-colors text-xs font-semibold flex items-center justify-center gap-1">
                          <Upload className="w-3.5 h-3.5" /> Upload
                          <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={handleFileUpload} />
                        </label>
                        <button type="button" onClick={startCamera} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg transition-colors text-xs font-semibold flex items-center justify-center gap-1">
                          <Camera className="w-3.5 h-3.5" /> Camera
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Total Copies</label>
                    <input type="number" name="totalCopies" min="0" value={formData.totalCopies ?? ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Available</label>
                    <input type="number" name="availableCopies" min="0" value={formData.availableCopies ?? ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Issued</label>
                    <input type="number" name="issuedCopies" min="0" value={formData.issuedCopies ?? ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Reserved</label>
                    <input type="number" name="reservedCopies" min="0" value={formData.reservedCopies ?? ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Fields */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Basic Info */}
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Title <span className="text-rose-500">*</span></label>
                    <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="e.g. Clean Code" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Subtitle</label>
                    <input type="text" name="subtitle" value={formData.subtitle || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="A Handbook of Agile Software Craftsmanship" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Author <span className="text-rose-500">*</span></label>
                    <input type="text" name="author" value={formData.author || ''} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Co-Author</label>
                    <input type="text" name="coAuthor" value={formData.coAuthor || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Description</label>
                    <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={3} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Brief description or synopsis..." />
                  </div>
                </div>
              </div>

              {/* Classification */}
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Classification</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">ISBN-13</label>
                    <input type="text" name="isbn13" value={formData.isbn13 || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 font-mono" placeholder="978-..." />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">ISBN-10</label>
                    <input type="text" name="isbn10" value={formData.isbn10 || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 font-mono" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Accession Number</label>
                    <input type="text" name="accessionNumber" value={formData.accessionNumber || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 font-mono" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Department</label>
                    <select name="department" value={formData.department} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Subject</label>
                    <input type="text" name="subject" value={formData.subject || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              {/* Publication & Location */}
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Publication & Location</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Publisher</label>
                    <input type="text" name="publisher" value={formData.publisher || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Edition</label>
                    <input type="text" name="edition" value={formData.edition || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Pub. Year</label>
                    <input type="text" name="publicationYear" value={formData.publicationYear || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Floor</label>
                    <input type="text" name="floor" value={formData.floor || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Rack No.</label>
                    <input type="text" name="rackNumber" value={formData.rackNumber || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Shelf No.</label>
                    <input type="text" name="shelfNumber" value={formData.shelfNumber || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-1">Price</label>
                    <input type="number" name="price" value={formData.price ?? ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" placeholder="Rs." />
                  </div>
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
