const fs = require('fs');
let code = fs.readFileSync('src/pages/Staff/components/BookDetailsModal.tsx', 'utf8');

code = code.replace(
  /<div className="mt-2 w-full flex justify-center">[\s\S]*?\)\)}/,
  `<div className="mt-2 w-full flex justify-center">
                    <Barcode value={book.id} width={1.5} height={40} fontSize={12} displayValue={false} />`
);

fs.writeFileSync('src/pages/Staff/components/BookDetailsModal.tsx', code);
