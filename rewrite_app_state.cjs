const fs = require('fs');
let code = fs.readFileSync('src/app/App.tsx', 'utf8');

const stateBlockRegex = /const \[books, setBooks\] = useState<Book\[\]>\(\(\) => \{[\s\S]*?const \[resetData, setResetData\] = useState<\{ token: string; role: 'student' \| 'staff' \} \| null>\(null\);/m;

const replacement = `
  const { data: books, setData: setBooks } = useFirestoreSync<Book>('books', INITIAL_BOOKS);
  const { data: students, setData: setStudents } = useFirestoreSync<Student>('students', INITIAL_STUDENTS);
  const { data: staffs, setData: setStaffs } = useFirestoreSync<Staff>('staffs', []);
  const { data: fines, setData: setFines } = useFirestoreSync<FineRecord>('fines', []);
  const { data: payments, setData: setPayments } = useFirestoreSync<PaymentRecord>('payments', []);
  const [fineSettings, setFineSettings] = useState<FineSettings>(() => {
    const saved = localStorage.getItem('lms_fine_settings');
    return saved ? JSON.parse(saved) : {
      finePerDay: 10, gracePeriodDays: 1, maxFine: 1000, lostBookProcessingFee: 200, minorDamageFee: 100, majorDamageFee: 300, criticalDamageFee: 500, membershipRenewalFee: 500
    };
  });
  const { data: trackingRecords, setData: setTrackingRecords } = useFirestoreSync<IssueRecord>('trackingRecords', []);
  const { data: returnRequests, setData: setReturnRequests } = useFirestoreSync<ReturnRequest>('returnRequests', []);
  const { data: borrowRequests, setData: setBorrowRequests } = useFirestoreSync<BorrowRequest>('borrowRequests', []);
  const { data: activityLogs, setData: setActivityLogs } = useFirestoreSync<ActivityLog>('activityLogs', []);
  const { data: notifications } = useFirestoreSync<any>('notifications', []);

  // Handle URL Reset Token
  const [resetData, setResetData] = useState<{ token: string; role: 'student' | 'staff' } | null>(null);
`;

code = code.replace(stateBlockRegex, replacement);

fs.writeFileSync('src/app/App.tsx', code);
