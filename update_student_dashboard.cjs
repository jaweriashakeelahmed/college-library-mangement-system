const fs = require('fs');
let code = fs.readFileSync('src/pages/Student/StudentDashboard.tsx', 'utf8');

const newImports = "import { Book, ReturnRequest, Student, IssueRecord, FineRecord, PaymentRecord } from '@/src/types';";
code = code.replace(/import \{ Book, ReturnRequest, Student, IssueRecord \} from '@\/src\/types';/, newImports);

code = code.replace(
  /import \{ \n  LogOut, \n  Home, \n  Search, \n  BookMarked, \n  Star, \n  Clock, \n  Activity, \n  UserCircle \n\} from 'lucide-react';/,
  `import { 
  LogOut, 
  Home, 
  Search, 
  BookMarked, 
  Star, 
  Clock, 
  Activity, 
  UserCircle,
  Banknote
} from 'lucide-react';`
);

code = code.replace(
  /interface StudentDashboardProps \{/,
  `interface StudentDashboardProps {
  fines: FineRecord[];
  payments: PaymentRecord[];`
);

code = code.replace(
  /export function StudentDashboard\(\{\n  student,\n  books,\n  trackingRecords,\n  returnRequests,\n  onLogout,\n  onIssueBook,\n  onToggleWishlist,\n  onReturnRequest\n\}: StudentDashboardProps\) \{/,
  `export function StudentDashboard({
  student,
  books,
  trackingRecords,
  returnRequests,
  fines,
  payments,
  onLogout,
  onIssueBook,
  onToggleWishlist,
  onReturnRequest
}: StudentDashboardProps) {`
);

code = code.replace(
  /const tabs = \[\n    \{ name: 'Home', icon: Home \},\n    \{ name: 'Search Books', icon: Search \},\n    \{ name: 'My Books', icon: BookMarked \},\n    \{ name: 'Wishlist', icon: Star \},\n    \{ name: 'History', icon: Clock \},\n    \{ name: 'Requests', icon: Activity \},\n    \{ name: 'Profile', icon: UserCircle \},\n  \];/,
  `const tabs = [
    { name: 'Home', icon: Home },
    { name: 'Search Books', icon: Search },
    { name: 'My Books', icon: BookMarked },
    { name: 'Wishlist', icon: Star },
    { name: 'History', icon: Clock },
    { name: 'Requests', icon: Activity },
    { name: 'Fines', icon: Banknote },
    { name: 'Profile', icon: UserCircle },
  ];`
);

// We need to import StudentFinesTab
code = code.replace(
  /import \{ StudentBookDetails \} from '\.\/components\/StudentBookDetails';/,
  `import { StudentBookDetails } from './components/StudentBookDetails';\nimport { StudentFinesTab } from './components/StudentFinesTab';`
);

code = code.replace(
  /case 'Requests':\n        return <StudentRequests requests=\{studentRequests\} books=\{books\} \/>;/,
  `$&
      case 'Fines':
        return <StudentFinesTab student={student} fines={fines} payments={payments} />;`
);

fs.writeFileSync('src/pages/Student/StudentDashboard.tsx', code);
