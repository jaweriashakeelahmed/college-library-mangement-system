import { useState } from 'react';
import { BookDown, Search, CheckCircle } from 'lucide-react';

export function ReturnBook() {
  const [fine, setFine] = useState<number | null>(null);

  const handleCalculateFine = () => {
    // Mocking fine calculation
    setFine(20); 
  };

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Return a Book</h2>
        <p className="text-slate-500 mt-1">Process a returned book and calculate late fines.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 md:p-8">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Student ID</label>
              <input 
                type="text" 
                placeholder="e.g. 2k26/CS/12"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all placeholder-slate-400"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Book ID</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="e.g. B002"
                  className="w-full pl-4 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all placeholder-slate-400"
                />
                <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-600 bg-white rounded-lg transition-colors shadow-sm border border-slate-100">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Return Date</label>
            <input 
              type="date" 
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-700"
            />
          </div>

          <div className="bg-slate-50/80 rounded-2xl border border-slate-200/60 p-5 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Calculated Fine</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">
                  Rs. {fine !== null ? fine : '0'}
                </p>
              </div>
              <button 
                type="button" 
                onClick={handleCalculateFine}
                className="px-5 py-2.5 text-sm font-medium text-blue-700 bg-white border border-blue-200/60 hover:bg-blue-50 rounded-xl transition-all shadow-sm active:scale-95"
              >
                Calculate Fine
              </button>
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-slate-100 mt-8">
            <button type="button" className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors">
              Clear
            </button>
            <button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm active:scale-95">
              <CheckCircle className="w-5 h-5" />
              Complete Return
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
