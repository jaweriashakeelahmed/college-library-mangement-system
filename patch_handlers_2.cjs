const fs = require('fs');
let code = fs.readFileSync('src/app/App.tsx', 'utf8');

const issueBookRegex = /const handleIssueBook = \(studentName: string, rollNo: string, bookId: string, bookName: string, customExpectedReturnDate\?: string\) => \{[\s\S]*?\}\);?\n\s*\};/;
const issueBookReplacement = `const handleIssueBook = async (studentName: string, rollNo: string, bookId: string, bookName: string, customExpectedReturnDate?: string) => {
    const b = books.find(b => b.id === bookId);
    if (b) {
      const currentAvail = b.availableCopies ?? (b.status === 'Available' ? 1 : 0);
      const currentIssued = b.issuedCopies || 0;
      const newAvail = Math.max(0, currentAvail - 1);
      const newIssued = currentIssued + 1;
      const newStatus = newAvail === 0 ? 'Issued' : b.status;
      await updateDoc(doc(db, 'books', bookId), {
         status: newStatus,
         availableCopies: newAvail,
         issuedCopies: newIssued
      });
    }

    const today = new Date();
    const issueDate = today.toISOString().split('T')[0];
    let expectedReturnDate = customExpectedReturnDate;
    if (!expectedReturnDate) {
      const returnDate = new Date();
      returnDate.setDate(today.getDate() + 15);
      expectedReturnDate = returnDate.toISOString().split('T')[0];
    }
    
    const newRecordId = \`REC\${String(trackingRecords.length + 1).padStart(3, '0')}\`;
    const newRecord: IssueRecord = {
      id: newRecordId,
      studentId: rollNo,
      studentName,
      bookId,
      bookName,
      issueDate,
      expectedReturnDate,
      status: 'Issued'
    };
    
    await setDoc(doc(db, 'trackingRecords', newRecordId), newRecord);
  };`;
code = code.replace(issueBookRegex, issueBookReplacement);

// handleReturnBook
const returnBookRegex = /const handleReturnBook = \(recordId: string, returnStatus: 'Early' \| 'On Time' \| 'Late', lateDays: number, fine: number\) => \{[\s\S]*?\}\)\);\n\s*\};/;
const returnBookReplacement = `const handleReturnBook = async (recordId: string, returnStatus: 'Early' | 'On Time' | 'Late', lateDays: number, fine: number) => {
    const r = trackingRecords.find(tr => tr.id === recordId);
    if (r) {
      const b = books.find(b => b.id === r.bookId);
      if (b) {
        const currentAvail = b.availableCopies ?? (b.status === 'Available' ? 1 : 0);
        const currentIssued = b.issuedCopies || 0;
        await updateDoc(doc(db, 'books', b.id), {
          status: 'Available',
          availableCopies: currentAvail + 1,
          issuedCopies: Math.max(0, currentIssued - 1)
        });
      }
      
      await updateDoc(doc(db, 'trackingRecords', recordId), {
        status: 'Returned',
        returnDate: new Date().toISOString().split('T')[0],
        returnStatus,
        lateDays,
        fine
      });
      
      if (fine > 0) {
        await addDoc(collection(db, 'fines'), {
          studentId: r.studentId,
          recordId: r.id,
          amount: fine,
          status: 'Unpaid',
          date: new Date().toISOString()
        });
      }
    }
  };`;
code = code.replace(returnBookRegex, returnBookReplacement);

fs.writeFileSync('src/app/App.tsx', code);
