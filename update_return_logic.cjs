const fs = require('fs');
let code = fs.readFileSync('src/app/App.tsx', 'utf8');

code = code.replace(
  /const handleReturnBook = \(recordId: string, returnStatus: 'Early' \| 'On Time' \| 'Late', lateDays: number, fine: number\) => \{[\s\S]*?\}\)\;\n  \}\;/,
  `const handleReturnBook = (recordId: string, returnStatus: 'Early' | 'On Time' | 'Late', lateDays: number, fine: number, condition: 'Excellent' | 'Good' | 'Fair' | 'Damaged' | 'Lost' = 'Good') => {
    setTrackingRecords(prev => prev.map(r => {
      if (r.id === recordId) {
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
  };`
);

fs.writeFileSync('src/app/App.tsx', code);
