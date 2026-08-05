const fs = require('fs');
let code = fs.readFileSync('src/app/App.tsx', 'utf8');

const updatedLogic = `
  const handleReturnBook = (recordId: string, returnStatus: 'Early' | 'On Time' | 'Late', lateDays: number, fine: number, condition: 'Excellent' | 'Good' | 'Fair' | 'Damaged' | 'Lost' = 'Good') => {
    let returnedBookId = '';
    let isAvailableNow = false;

    setTrackingRecords(prev => prev.map(r => {
      if (r.id === recordId) {
        returnedBookId = r.bookId;
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
                newAvail += 1; // Damaged books are usually kept but maybe need repair. We'll add back to available for simplicity or wait, let's say they don't increment available if they are heavily damaged. We'll follow earlier logic.
                newAvail -= 1; // Nevermind, keep it out of circulation for now.
            } else {
                newAvail += 1;
            }

            isAvailableNow = newAvail > 0;

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
          status: 'Returned',
          returnDate: new Date().toISOString().split('T')[0],
          returnStatus,
          lateDays,
          fine,
          conditionOnReturn: condition
        };
      }
      return r;
    }));

    // Auto-approve next reservation in queue
    if (returnedBookId) {
      setReturnRequests(prev => {
        const bookReservations = prev.filter(r => r.type === 'Book Reservation' && r.bookId === returnedBookId && r.status === 'Pending').sort((a, b) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime());
        
        if (bookReservations.length > 0) {
          // Found a reservation!
          const nextReservationId = bookReservations[0].id;
          return prev.map(r => r.id === nextReservationId ? { ...r, status: 'Approved' } : r);
        }
        return prev;
      });
    }
  };
`;

code = code.replace(
  /const handleReturnBook = \(recordId: string, returnStatus: 'Early' \| 'On Time' \| 'Late', lateDays: number, fine: number, condition: 'Excellent' \| 'Good' \| 'Fair' \| 'Damaged' \| 'Lost' = 'Good'\) => \{[\s\S]*?\}\)\;\n  \}\;/,
  updatedLogic.trim()
);

fs.writeFileSync('src/app/App.tsx', code);
