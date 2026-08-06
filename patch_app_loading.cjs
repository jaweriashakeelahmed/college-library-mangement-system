const fs = require('fs');
let code = fs.readFileSync('src/app/App.tsx', 'utf8');

code = code.replace(/const \{ data: books, setData: setBooks \} = useFirestoreSync<Book>\('books', INITIAL_BOOKS\);/, "const { data: books, setData: setBooks, loading: booksLoading } = useFirestoreSync<Book>('books', []);");

// Add loading display before rendering StudentDashboard
const authRenderRegex = /return \(\n\s*<>\n\s*<SessionManager onLogout=\{handleLogout\} isActive=\{true\} \/>\n\s*<StudentDashboard/;

const authRenderReplacement = `if (booksLoading) {
      return <div className="p-8 text-center text-slate-500">Loading library...</div>;
    }
    return (
      <>
        <SessionManager onLogout={handleLogout} isActive={true} />
        <StudentDashboard`;

code = code.replace(authRenderRegex, authRenderReplacement);

fs.writeFileSync('src/app/App.tsx', code);
