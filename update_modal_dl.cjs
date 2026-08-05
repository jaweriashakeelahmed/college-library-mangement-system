const fs = require('fs');
let code = fs.readFileSync('src/pages/Staff/components/BookDetailsModal.tsx', 'utf8');

const downloadFuncs = `
  const handleDownloadQR = () => {
    const canvas = document.querySelector(\`#print-label-\${book.id} canvas\`) as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = \`qr-\${book.id}.png\`;
      a.click();
    }
  };

  const handleDownloadBarcode = () => {
    const svg = document.querySelector(\`#print-label-\${book.id} svg\`);
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = \`barcode-\${book.id}.svg\`;
      a.click();
    }
  };
`;

code = code.replace("const getStatusColor", downloadFuncs + "\n  const getStatusColor");

const buttons = `
                  <div className="flex gap-2">
                    <button onClick={handleDownloadQR} className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                      <Download className="w-3.5 h-3.5" /> QR
                    </button>
                    <button onClick={handleDownloadBarcode} className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                      <Download className="w-3.5 h-3.5" /> Barcode
                    </button>
                    <button onClick={handlePrintLabel} className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                      <Printer className="w-3.5 h-3.5" /> Print
                    </button>
                  </div>
`;

code = code.replace(/<button onClick={handlePrintLabel}[\s\S]*?<\/button>/, buttons);

fs.writeFileSync('src/pages/Staff/components/BookDetailsModal.tsx', code);
