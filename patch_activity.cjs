const fs = require('fs');
let code = fs.readFileSync('src/app/App.tsx', 'utf8');

const actLogRegex = /const addActivityLog = \(user: string, role: 'student' \| 'staff' \| 'system', action: ActivityLog\['action'\], details\?: string\) => \{[\s\S]*?\}\);?\n\s*\}, \[activityLogs\]\);/;
const actLogReplacement = `const addActivityLog = async (user: string, role: 'student' | 'staff' | 'system', action: ActivityLog['action'], details?: string) => {
    try {
      const newLog = createActivityLog(user, role, action, details);
      await addDoc(collection(db, 'activityLogs'), newLog);
    } catch(e) {}
  };`;
code = code.replace(actLogRegex, actLogReplacement);

fs.writeFileSync('src/app/App.tsx', code);
