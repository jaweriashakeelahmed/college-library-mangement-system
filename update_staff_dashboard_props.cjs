const fs = require('fs');
let code = fs.readFileSync('src/pages/Staff/StaffDashboard.tsx', 'utf8');

code = code.replace(
  /interface StaffDashboardProps \{/,
  `interface StaffDashboardProps {
  fines: FineRecord[];
  setFines: React.Dispatch<React.SetStateAction<FineRecord[]>>;
  payments: PaymentRecord[];
  setPayments: React.Dispatch<React.SetStateAction<PaymentRecord[]>>;
  fineSettings: FineSettings;
  setFineSettings: React.Dispatch<React.SetStateAction<FineSettings>>;`
);

code = code.replace(
  /export function StaffDashboard\(\{\n  currentUser,\n  staffData,\n  books,\n  setBooks,\n  students,\n  setStudents,\n  staffs,\n  setStaffs,\n  trackingRecords,\n  returnRequests,\n  activityLogs,\n  onLogout,\n  onIssueBook,\n  onReturnBook,\n  onApproveReturnRequest,\n  onUpdateRequestStatus\n\}: StaffDashboardProps\) \{/,
  `export function StaffDashboard({
  currentUser,
  staffData,
  books,
  setBooks,
  students,
  setStudents,
  staffs,
  setStaffs,
  trackingRecords,
  returnRequests,
  activityLogs,
  fines,
  setFines,
  payments,
  setPayments,
  fineSettings,
  setFineSettings,
  onLogout,
  onIssueBook,
  onReturnBook,
  onApproveReturnRequest,
  onUpdateRequestStatus
}: StaffDashboardProps) {`
);

const newImports = "import { Book, CurrentUser, Student, Staff, IssueRecord, ReturnRequest, ActivityLog, FineRecord, PaymentRecord, FineSettings } from '@/src/types/index';";
code = code.replace(/import \{ Book, CurrentUser, Student, Staff, IssueRecord, ReturnRequest, ActivityLog \} from '@\/src\/types\/index';/, newImports);

// Also we need to add the new navigation items for Fines
code = code.replace(
  /<button\n                key=\{item\.id\}/,
  `{item.id === 'Profile' && (
              <div className="my-4 border-t border-slate-700/50"></div>
            )}
            <button
                key={item.id}`
);

// We need to add 'Fines' to navigation
code = code.replace(
  /const navItems = \[[\s\S]*?\];/,
  `const navItems = [
    { id: 'Home', icon: Home, label: 'Dashboard' },
    { id: 'Books', icon: BookOpen, label: 'Books Inventory' },
    { id: 'Students', icon: Users, label: 'Students' },
    { id: 'Issue', icon: BookUp, label: 'Issue Book' },
    { id: 'Return', icon: BookDown, label: 'Return Book' },
    { id: 'Tracking', icon: ClipboardList, label: 'Issue History' },
    { id: 'Requests', icon: RefreshCw, label: 'Requests' },
    { id: 'Fines', icon: Banknote, label: 'Fines & Payments' },
    { id: 'Activity', icon: Activity, label: 'Activity Logs' },
    { id: 'Profile', icon: Settings, label: 'Settings & Profile' },
  ];`
);

// We need to import Banknote
code = code.replace(
  /import \{ \n  LogOut, \n  Home, \n  BookOpen, \n  Users, \n  BookUp, \n  BookDown, \n  ClipboardList, \n  Activity, \n  Settings, \n  Menu, \n  X, \n  Search,\n  RefreshCw\n\} from 'lucide-react';/,
  `import { 
  LogOut, 
  Home, 
  BookOpen, 
  Users, 
  BookUp, 
  BookDown, 
  ClipboardList, 
  Activity, 
  Settings, 
  Menu, 
  X, 
  Search,
  RefreshCw,
  Banknote
} from 'lucide-react';`
);

// Import Fines component
code = code.replace(
  /import \{ StaffProfile \} from '\.\/StaffProfile';/,
  `import { StaffProfile } from './StaffProfile';
import { FinesDashboard } from './FinesDashboard';`
);

// Add Fines to switch statement
code = code.replace(
  /case 'Requests': return <Requests[\s\S]*?\/>;/,
  `$&
      case 'Fines': return <FinesDashboard fines={fines} setFines={setFines} payments={payments} setPayments={setPayments} fineSettings={fineSettings} setFineSettings={setFineSettings} students={students} staffData={staffData} />;`
);

fs.writeFileSync('src/pages/Staff/StaffDashboard.tsx', code);
