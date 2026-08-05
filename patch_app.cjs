const fs = require('fs');

let content = fs.readFileSync('src/app/App.tsx', 'utf8');

// Find where // Staff Portal begins
const startIndex = content.indexOf('  // Staff Portal');

if (startIndex === -1) {
  console.log("Could not find Staff Portal start");
  process.exit(1);
}

// Find the end of the App component (which is the last closing brace)
const endIndex = content.lastIndexOf('}');

const newStaffPortal = `
  const staffData = staffs.find(s => s.id === currentUser.id) || staffs[0];

  return (
    <>
      <SessionManager onLogout={handleLogout} isActive={true} />
      <StaffDashboard
        currentUser={currentUser}
        staffData={staffData}
        books={books}
        setBooks={setBooks}
        students={students}
        setStudents={setStudents}
        staffs={staffs}
        setStaffs={setStaffs}
        trackingRecords={trackingRecords}
        returnRequests={returnRequests}
        activityLogs={activityLogs}
        onLogout={handleLogout}
        onIssueBook={handleIssueBook}
        onReturnBook={handleReturnBook}
        onApproveReturnRequest={handleApproveReturnRequest}
        onUpdateRequestStatus={handleUpdateRequestStatus}
        addActivityLog={addActivityLog}
      />
    </>
  );
`;

const newContent = content.substring(0, startIndex) + newStaffPortal + '\n}\n';

// Replace import { Dashboard, Books, Students, IssueBook, ReturnBook, IssueHistory, Requests, About } with import { StaffDashboard }
const importRegex = /import { Dashboard } from '@\/src\/pages\/Staff\/Dashboard';[\s\S]*?import { Requests } from '@\/src\/pages\/Staff\/Requests';/g;

let patchedContent = newContent.replace(importRegex, "import { StaffDashboard } from '@/src/pages/Staff/StaffDashboard';");

// Remove About component import if it's there
patchedContent = patchedContent.replace(/import { About } from '@\/src\/pages\/Shared\/About';\n/g, "");
// Remove icon imports that might be unused now (LayoutDashboard, Users, BookUp, BookDown, History, Info, Activity, GraduationCap, LogOut)
// Let eslint fix unused imports or we can leave them

fs.writeFileSync('src/app/App.tsx', patchedContent);
console.log("Patched successfully");
