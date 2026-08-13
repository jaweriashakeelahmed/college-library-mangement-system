const fs = require('fs');
let content = fs.readFileSync('src/app/App.tsx', 'utf8');

const regex = /const handleApproveReturnRequest = \([\s\S]*?\n  \};/m;

const newFunc = `const handleApproveReturnRequest = (requestId: string, approved: boolean, actionReason?: string) => {
    setReturnRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: approved ? 'Approved' : 'Rejected', staffRemarks: actionReason } : r));
    
    if (approved) {
      const request = returnRequests.find(r => r.id === requestId);
      if (request && (request.type === 'Return Before Time' || request.type === 'Return')) {
        const issueRecord = trackingRecords.find(tr => tr.bookId === request.bookId && tr.status === 'Issued' && tr.studentId === request.studentId);
        if (issueRecord) {
           const actualReturnDate = new Date().toISOString().split('T')[0];
           
           // Calculate fine
           const expDate = new Date(issueRecord.expectedReturnDate);
           const actDate = new Date(actualReturnDate);
           expDate.setHours(0, 0, 0, 0);
           actDate.setHours(0, 0, 0, 0);
           
           const diffTime = actDate.getTime() - expDate.getTime();
           let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
           const savedSettings = localStorage.getItem('lms_fine_settings');
           const fineSettings = savedSettings ? JSON.parse(savedSettings) : { finePerDay: 20, gracePeriodDays: 1, maxFine: 1000 };
           
           if (diffDays <= fineSettings.gracePeriodDays) { diffDays = 0; }
           
           let fineAmt = diffDays > 0 ? diffDays * fineSettings.finePerDay : 0;
           if (fineAmt > fineSettings.maxFine) fineAmt = fineSettings.maxFine;
           
           handleReturnBook(issueRecord.id, diffDays > 0 ? 'Late' : (diffDays < 0 ? 'Early' : 'On Time'), diffDays, fineAmt);
        }
      }
    }
  };`;

content = content.replace(regex, newFunc);
fs.writeFileSync('src/app/App.tsx', content);
