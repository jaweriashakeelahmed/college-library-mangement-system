const fs = require('fs');
let code = fs.readFileSync('src/app/App.tsx', 'utf8');

const newStates = `
  const [fines, setFines] = useState<FineRecord[]>(() => {
    const saved = localStorage.getItem('lms_fines');
    return saved ? JSON.parse(saved) : [];
  });
  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('lms_payments');
    return saved ? JSON.parse(saved) : [];
  });
  const [fineSettings, setFineSettings] = useState<FineSettings>(() => {
    const saved = localStorage.getItem('lms_fine_settings');
    return saved ? JSON.parse(saved) : {
      finePerDay: 10,
      gracePeriodDays: 1,
      maxFine: 1000,
      lostBookProcessingFee: 200,
      minorDamageFee: 100,
      majorDamageFee: 300,
      criticalDamageFee: 500,
      membershipRenewalFee: 500
    };
  });

  useEffect(() => {
    localStorage.setItem('lms_fines', JSON.stringify(fines));
  }, [fines]);

  useEffect(() => {
    localStorage.setItem('lms_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('lms_fine_settings', JSON.stringify(fineSettings));
  }, [fineSettings]);
`;

code = code.replace(
  /const \[trackingRecords, setTrackingRecords\] = useState<IssueRecord\[\]>\(\(\) => \{/,
  newStates + "\n  const [trackingRecords, setTrackingRecords] = useState<IssueRecord[]>(() => {"
);

const newImports = "import { Book, Student, IssueRecord, ReturnRequest, Staff, FineRecord, PaymentRecord, FineSettings } from '@/src/types/index';";
code = code.replace(/import \{ Book, Student, IssueRecord, ReturnRequest, Staff \} from '@\/src\/types\/index';/, newImports);

fs.writeFileSync('src/app/App.tsx', code);
