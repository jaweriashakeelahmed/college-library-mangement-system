const fs = require('fs');
let code = fs.readFileSync('src/app/App.tsx', 'utf8');

const updatedLogic = `
  const handleReturnBook = (recordId: string, returnStatus: 'Early' | 'On Time' | 'Late', lateDays: number, fine: number, condition: 'Excellent' | 'Good' | 'Fair' | 'Damaged' | 'Lost' = 'Good') => {
    let returnedBookId = '';

    setTrackingRecords(prev => prev.map(r => {
      if (r.id === recordId) {
        returnedBookId = r.bookId;
        
        // Generate Fine if applicable
        if (fine > 0) {
          const newFine: FineRecord = {
            id: \`F\${String(Date.now()).slice(-6)}\`,
            studentId: r.studentId,
            studentName: r.studentName,
            amount: fine,
            reason: condition === 'Lost' ? 'Lost Book' : (condition === 'Damaged' ? 'Damaged Book' : 'Overdue'),
            relatedRecordId: r.id,
            dateIssued: new Date().toISOString().split('T')[0],
            status: 'Pending',
            amountPaid: 0,
            waivedAmount: 0
          };
          setFines(prevFines => [newFine, ...prevFines]);
        }

        setBooks(books => books.map(b => {
          if (b.id === r.bookId) {
            const currentAvail = b.availableCopies ?? (b.status === 'Available' ? 1 : 0);
            const currentIssued = b.issuedCopies || 0;
            const newIssued = Math.max(0, currentIssued - 1);
            
            let newAvail = currentAvail;
            let newLost = b.lostCopies || 0;
            let newDamaged = b.damagedCopies || 0;
            
            if (condition === 'Lost') {
                newLost += 1;
            } else if (condition === 'Damaged') {
                newDamaged += 1;
            } else {
                newAvail += 1;
            }

            return { 
              ...b, 
              status: newAvail > 0 ? 'Available' : (condition === 'Lost' ? 'Lost' : (condition === 'Damaged' ? 'Damaged' : 'Out of Stock')),
              availableCopies: newAvail,
              issuedCopies: newIssued,
              lostCopies: newLost,
              damagedCopies: newDamaged
            };
          }
          return b;
        }));
        
        return {
          ...r,
          status: condition === 'Lost' ? 'Lost' : (condition === 'Damaged' ? 'Damaged' : 'Returned'),
          returnDate: new Date().toISOString().split('T')[0],
          returnStatus,
          lateDays,
          fine,
          conditionOnReturn: condition
        };
      }
      return r;
    }));

    if (returnedBookId) {
      setReturnRequests(prev => {
        const bookReservations = prev.filter(r => r.type === 'Book Reservation' && r.bookId === returnedBookId && r.status === 'Pending').sort((a, b) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime());
        if (bookReservations.length > 0) {
          const nextReservationId = bookReservations[0].id;
          return prev.map(r => r.id === nextReservationId ? { ...r, status: 'Approved' } : r);
        }
        return prev;
      });
    }
  };
`;

code = code.replace(
  /const handleReturnBook = \(recordId: string, returnStatus: 'Early' \| 'On Time' \| 'Late', lateDays: number, fine: number\) => \{[\s\S]*?\}\)\;\n  \}\;/,
  updatedLogic.trim()
);

fs.writeFileSync('src/app/App.tsx', code);
