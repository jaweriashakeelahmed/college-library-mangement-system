const fs = require('fs');
let code = fs.readFileSync('src/pages/Staff/TrackingRecords.tsx', 'utf8');

// Update Filter Options
code = code.replace(
  /<option value="All">All Statuses<\/option>[\s\S]*?<option value="Overdue">Overdue<\/option>/,
  `<option value="All">All Statuses</option>
              <option value="Issued">Issued</option>
              <option value="Returned">Returned</option>
              <option value="Overdue">Overdue</option>
              <option value="Lost">Lost</option>
              <option value="Damaged">Damaged</option>`
);

// Add missing columns to CSV
code = code.replace(
  /const headers = \['Student ID'[\s\S]*?'Status'\];/,
  `const headers = ['Student ID', 'Student Name', 'Book ID', 'Book Name', 'Issue Date', 'Due Date', 'Return Date', 'Late Days', 'Fine', 'Status', 'Condition', 'Renewals'];`
);

code = code.replace(
  /`"\$\{r.status\}\$\{r.status === 'Returned' && r.returnStatus \? \` \(\$\{r.returnStatus\}\)\` : ''\}"`/g,
  `$&,\n          \`"\${r.conditionOnReturn || 'Good'}"\`,\n          \`"\${r.renewals || 0}"\``
);

// Add column headers in table
code = code.replace(
  /<th className="px-6 py-4">Status<\/th>/,
  `<th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Cond.</th>`
);

// Render status and condition
code = code.replace(
  /\{record\.status === 'Overdue' && \([\s\S]*?Overdue[\s\S]*?<\/span>[\s\S]*?\)\}/,
  `$&
                    {record.status === 'Lost' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                        Lost
                      </span>
                    )}
                    {record.status === 'Damaged' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                        Damaged
                      </span>
                    )}`
);

code = code.replace(
  /<td className="px-6 py-4 text-right">/,
  `<td className="px-6 py-4">
                    {record.conditionOnReturn ? (
                      <span className={\`text-xs font-medium \${record.conditionOnReturn === 'Lost' || record.conditionOnReturn === 'Damaged' ? 'text-rose-600' : 'text-slate-600'}\`}>
                        {record.conditionOnReturn}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">`
);

fs.writeFileSync('src/pages/Staff/TrackingRecords.tsx', code);
