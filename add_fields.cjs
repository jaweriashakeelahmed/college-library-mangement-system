const fs = require('fs');
let code = fs.readFileSync('src/pages/Staff/components/BookFormModal.tsx', 'utf8');

const missingFields = `
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Language</label>
                      <input type="text" name="language" value={formData.language || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Sub Category</label>
                      <input type="text" name="subCategory" value={formData.subCategory || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Semester</label>
                      <input type="text" name="semester" value={formData.semester || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Row Number</label>
                      <input type="text" name="rowNumber" value={formData.rowNumber || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Purchase Date</label>
                      <input type="date" name="purchaseDate" value={formData.purchaseDate || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Vendor</label>
                      <input type="text" name="vendor" value={formData.vendor || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Keywords (comma separated)</label>
                      <input type="text" name="keywords" value={formData.keywords?.join(', ') || ''} onChange={(e) => setFormData(p => ({...p, keywords: e.target.value.split(',').map(k=>k.trim())}))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Lost Copies</label>
                      <input type="number" name="lostCopies" min="0" value={formData.lostCopies ?? ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Damaged Copies</label>
                      <input type="number" name="damagedCopies" min="0" value={formData.damagedCopies ?? ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                    </div>
`;

code = code.replace(/(<label className="text-xs font-bold text-slate-500 uppercase">Price<\/label>[\s\S]*?<\/div>)/, `$1\n${missingFields}`);

fs.writeFileSync('src/pages/Staff/components/BookFormModal.tsx', code);
