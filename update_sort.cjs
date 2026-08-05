const fs = require('fs');
let code = fs.readFileSync('src/pages/Staff/Books.tsx', 'utf8');

const sortOptions = `
              <option value="name-asc">Title (A-Z)</option>
              <option value="name-desc">Title (Z-A)</option>
              <option value="isbn13-asc">ISBN</option>
              <option value="author-asc">Author (A-Z)</option>
              <option value="publisher-asc">Publisher (A-Z)</option>
              <option value="totalCopies-desc">Copies (High-Low)</option>
              <option value="availableCopies-desc">Availability (High-Low)</option>
              <option value="createdDate-desc">Newest First</option>
              <option value="createdDate-asc">Oldest First</option>
`;

code = code.replace(/<option value="name-asc">Title \(A-Z\)<\/option>[\s\S]*?<option value="availableCopies-desc">Availability \(High-Low\)<\/option>/, sortOptions.trim());

fs.writeFileSync('src/pages/Staff/Books.tsx', code);
