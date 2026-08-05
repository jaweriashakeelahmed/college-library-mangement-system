const fs = require('fs');
let code = fs.readFileSync('src/pages/Staff/FinesDashboard.tsx', 'utf8');

const newModalState = `
  const [addFineModal, setAddFineModal] = useState({ isOpen: false });
  const [newFineStudentId, setNewFineStudentId] = useState('');
  const [newFineAmount, setNewFineAmount] = useState<number>(0);
  const [newFineReason, setNewFineReason] = useState('');

  const handleAddFine = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === newFineStudentId || s.email === newFineStudentId);
    if (!student) {
      alert('Student not found');
      return;
    }
    const newFine: FineRecord = {
      id: \`F\${String(Date.now()).slice(-6)}\`,
      studentId: student.id,
      studentName: student.name,
      amount: newFineAmount,
      reason: newFineReason,
      dateIssued: new Date().toISOString().split('T')[0],
      status: 'Pending',
      amountPaid: 0,
      waivedAmount: 0
    };
    setFines(prev => [newFine, ...prev]);
    setAddFineModal({ isOpen: false });
    alert('Fine added successfully.');
  };
`;

code = code.replace(
  /const \[waiverModal, setWaiverModal\] = useState[\s\S]*?;\n  const \[waiverReason, setWaiverReason\] = useState\(''\);/,
  `$&${newModalState}`
);

const newButton = `
        <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setAddFineModal({ isOpen: true })}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all bg-emerald-100 text-emerald-700 hover:bg-emerald-200 mr-2 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Fine
          </button>
`;

code = code.replace(
  /<div className="flex bg-slate-100 p-1 rounded-xl shrink-0">/,
  newButton
);

const modalJsx = `
      {/* Add Fine Modal */}
      {addFineModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><Plus className="w-5 h-5 text-emerald-600"/> Add Manual Fine</h3>
            </div>
            <form onSubmit={handleAddFine} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Student ID or Email</label>
                <input type="text" required value={newFineStudentId} onChange={e => setNewFineStudentId(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500" placeholder="e.g. STU001" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Fine Amount (Rs.)</label>
                <input type="number" required min="1" value={newFineAmount} onChange={e => setNewFineAmount(Number(e.target.value))} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Reason</label>
                <input type="text" required value={newFineReason} onChange={e => setNewFineReason(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Late Return, Lost ID Card" />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setAddFineModal({isOpen: false})} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold">Add Fine</button>
              </div>
            </form>
          </div>
        </div>
      )}
`;

code = code.replace(
  /<\/div>\n  \);\n\}/,
  `${modalJsx}    </div>\n  );\n}`
);

fs.writeFileSync('src/pages/Staff/FinesDashboard.tsx', code);
