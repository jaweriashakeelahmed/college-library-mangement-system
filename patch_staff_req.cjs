const fs = require('fs');

let reqCode = fs.readFileSync('src/pages/Staff/Requests.tsx', 'utf8');

reqCode = reqCode.replace(
  `import { ReturnRequest, Student, IssueRecord } from '@/src/types';`,
  `import { ReturnRequest, BorrowRequest, Student, IssueRecord } from '@/src/types';`
);

reqCode = reqCode.replace(
  `interface RequestsProps {
  returnRequests: ReturnRequest[];
  students: Student[];
  trackingRecords: IssueRecord[];
  onApprove: (id: string, approved: boolean) => void;
  onUpdateStatus: (id: string, status: ReturnRequest['status'], reason?: string) => void;
}`,
  `interface RequestsProps {
  returnRequests: ReturnRequest[];
  borrowRequests?: BorrowRequest[];
  onUpdateBorrowRequest?: (id: string, status: BorrowRequest['status'], remarks?: string) => void;
  students: Student[];
  trackingRecords: IssueRecord[];
  onApprove: (id: string, approved: boolean) => void;
  onUpdateStatus: (id: string, status: ReturnRequest['status'], reason?: string) => void;
}`
);

// We need to add a toggle for "General Requests" vs "Borrow Requests"
reqCode = reqCode.replace(
  `export function Requests({ returnRequests, students, trackingRecords, onApprove, onUpdateStatus }: RequestsProps) {`,
  `export function Requests({ returnRequests, borrowRequests = [], onUpdateBorrowRequest, students, trackingRecords, onApprove, onUpdateStatus }: RequestsProps) {
  const [activeTab, setActiveTab] = useState<'General' | 'Borrow'>('General');`
);

// Under <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">, add a tab switch
reqCode = reqCode.replace(
  `        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">`,
  `        <div className="flex gap-4 border-b border-slate-200 w-full mb-4">
          <button onClick={() => setActiveTab('General')} className={\`pb-2 font-bold \${activeTab === 'General' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}\`}>General Requests</button>
          <button onClick={() => setActiveTab('Borrow')} className={\`pb-2 font-bold \${activeTab === 'Borrow' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}\`}>Borrow Requests</button>
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">`
);

// Wait, doing this by regex might break the UI because `filteredRequests` is used for rendering.
fs.writeFileSync('src/pages/Staff/Requests.tsx', reqCode);
