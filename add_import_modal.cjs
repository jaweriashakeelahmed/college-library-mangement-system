const fs = require('fs');
let code = fs.readFileSync('src/pages/Staff/Books.tsx', 'utf8');

code = code.replace(
  "import { BookDetailsModal } from './components/BookDetailsModal';",
  "import { BookDetailsModal } from './components/BookDetailsModal';\nimport { ImportBooksModal } from './components/ImportBooksModal';"
);

code = code.replace(
  "const [isAddModalOpen, setIsAddModalOpen] = useState(false);",
  "const [isAddModalOpen, setIsAddModalOpen] = useState(false);\n  const [isImportModalOpen, setIsImportModalOpen] = useState(false);"
);

code = code.replace(
  /<button onClick={handleExportCSV}[\s\S]*?<\/button>/,
  `<button onClick={() => setIsImportModalOpen(true)} className="px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold rounded-xl text-sm transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" /> Import
          </button>
          $&`
);

if (!code.includes('import { Upload }')) {
    code = code.replace("Search, Plus, Filter, Download, MoreVertical", "Search, Plus, Filter, Download, MoreVertical, Upload");
}

code = code.replace(
  /{selectedBookForDetails && \([\s\S]*?<\/BookDetailsModal>\n      \)}/,
  `$&
      {isImportModalOpen && (
        <ImportBooksModal
          existingBooks={books}
          onClose={() => setIsImportModalOpen(false)}
          onImport={(newBooks) => {
            setBooks(prev => [...prev, ...newBooks]);
            setIsImportModalOpen(false);
          }}
        />
      )}`
);

fs.writeFileSync('src/pages/Staff/Books.tsx', code);
