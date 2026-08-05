const fs = require('fs');
let code = fs.readFileSync('src/pages/Staff/Books.tsx', 'utf8');

if (!code.includes("import jsPDF")) {
  code = code.replace("import { BookFormModal }", "import jsPDF from 'jspdf';\nimport 'jspdf-autotable';\nimport { BookFormModal }");
}

const exportFuncs = `
  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Author', 'Department', 'Category', 'Status', 'Total Copies', 'Available'];
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\\n"
      + filteredBooks.map(b => 
          [b.id, \`"\${b.name}"\`, \`"\${b.author}"\`, b.department, b.category || '', b.status, b.totalCopies || 1, b.availableCopies ?? (b.status === 'Available' ? 1 : 0)].join(",")
        ).join("\\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "library_inventory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Library Inventory Report", 14, 15);
    doc.setFontSize(10);
    doc.text(\`Generated on: \${new Date().toLocaleDateString()}\`, 14, 22);
    
    const tableData = filteredBooks.map(b => [
      b.id,
      b.name,
      b.author,
      b.department,
      b.status,
      b.totalCopies || 1,
      b.availableCopies ?? (b.status === 'Available' ? 1 : 0)
    ]);

    (doc as any).autoTable({
      startY: 28,
      head: [['ID', 'Title', 'Author', 'Department', 'Status', 'Total', 'Avail']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    doc.save('library_inventory.pdf');
  };
`;

code = code.replace(/const handleExportCSV = \(\) => {[\s\S]*?removeChild\(link\);\n  };/, exportFuncs);

const buttons = `
          <div className="relative group">
            <button className="px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold rounded-xl text-sm transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" /> Export
            </button>
            <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-lg border border-slate-200 py-2 hidden group-hover:block z-20">
              <button onClick={handleExportCSV} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-medium">Export CSV</button>
              <button onClick={handleExportPDF} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-medium">Export PDF</button>
            </div>
          </div>
`;

code = code.replace(/<button onClick={handleExportCSV}[\s\S]*?<\/button>/, buttons.trim());

fs.writeFileSync('src/pages/Staff/Books.tsx', code);
