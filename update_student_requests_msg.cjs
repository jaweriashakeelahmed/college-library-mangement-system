const fs = require('fs');
let code = fs.readFileSync('src/pages/Student/components/StudentRequests.tsx', 'utf8');

const updatedQueueLogic = `
                    {request.type === 'Book Reservation' && (
                      <div className="mt-3 text-sm text-indigo-700 bg-indigo-50 p-2 rounded-lg flex items-start gap-2 border border-indigo-100">
                        <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          {request.status === 'Approved' ? (
                            <p className="font-semibold text-emerald-700">Your reserved book is now available! Please collect it from the library desk.</p>
                          ) : (
                            <>
                              <p className="font-semibold">Queue Position: {
                                allRequests
                                  .filter(r => r.type === 'Book Reservation' && r.bookId === request.bookId && ['Pending', 'Approved'].includes(r.status))
                                  .sort((a, b) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime())
                                  .findIndex(r => r.id === request.id) + 1
                              }</p>
                              <p className="text-xs opacity-90 mt-0.5">You will be notified when the book becomes available.</p>
                            </>
                          )}
                        </div>
                      </div>
                    )}
`;

code = code.replace(
  /\{request\.type === 'Book Reservation' && \([\s\S]*?<\/div>\n                    \)\}/,
  updatedQueueLogic.trim()
);

fs.writeFileSync('src/pages/Student/components/StudentRequests.tsx', code);
