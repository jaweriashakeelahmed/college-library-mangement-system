const fs = require('fs');
let code = fs.readFileSync('src/pages/Staff/components/BookDetailsModal.tsx', 'utf8');

if (!code.includes("import { QRCodeCanvas }")) {
  code = code.replace("import { X, QrCode", "import { QRCodeCanvas } from 'qrcode.react';\nimport Barcode from 'react-barcode';\nimport { X, QrCode");
}

code = code.replace(
  /<div className="w-32 h-32 bg-slate-100 flex items-center justify-center rounded">[\s\S]*?<\/div>/,
  '<div className="bg-white p-2 flex items-center justify-center rounded">\n                     <QRCodeCanvas value={`https://library.edu/book/${book.id}`} size={120} level="H" />\n                  </div>'
);

code = code.replace(
  /{\/\* CSS Barcode Mock \*\/}[\s\S]*?<\/div>/,
  '<div className="mt-2 w-full flex justify-center">\n                    <Barcode value={book.id} width={1.5} height={40} fontSize={12} displayValue={false} />\n                  </div>'
);

fs.writeFileSync('src/pages/Staff/components/BookDetailsModal.tsx', code);
