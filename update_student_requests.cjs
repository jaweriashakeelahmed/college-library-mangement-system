const fs = require('fs');

let content = fs.readFileSync('src/pages/Student/components/StudentRequests.tsx', 'utf8');

// We need to merge borrowRequests and returnRequests.
const mergeLogic = `
  const allCombinedRequests = [
    ...requests,
    ...(borrowRequests || [])
  ];
  const filteredRequests = allCombinedRequests
    .filter(r => filter === 'All' || r.status === filter)
    .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
`;

content = content.replace(/const filteredRequests = requests[\s\S]*?getTime\(\)\);/, mergeLogic);
content = content.replace(/<span className="font-semibold text-slate-700">Reason:<\/span> \{request\.reason\}/, 
                          '<span className="font-semibold text-slate-700">Reason/Remarks:</span> {request.reason || (request as any).staffRemarks || "N/A"}');
content = content.replace(/Track the status of your return and exchange requests\./, 'Track the status of your borrow, return and exchange requests.');

fs.writeFileSync('src/pages/Student/components/StudentRequests.tsx', content);
