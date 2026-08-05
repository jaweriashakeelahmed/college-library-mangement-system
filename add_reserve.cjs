const fs = require('fs');
let code = fs.readFileSync('src/pages/Student/components/StudentBookDetails.tsx', 'utf8');

code = code.replace(
  /interface StudentBookDetailsProps \{[\s\S]*?\}/,
  `interface StudentBookDetailsProps {
  book: Book;
  student: Student;
  onClose: () => void;
  onToggleWishlist: (studentId: string, bookId: string) => void;
  onRequestReservation?: (bookId: string) => void;
}`
);

code = code.replace(
  /export function StudentBookDetails\(\{ book, student, onClose, onToggleWishlist \}: StudentBookDetailsProps\) \{/,
  "export function StudentBookDetails({ book, student, onClose, onToggleWishlist, onRequestReservation }: StudentBookDetailsProps) {"
);

const reserveButton = `
              {!isAvailable && onRequestReservation && (
                <button 
                  onClick={() => { onRequestReservation(book.id); onClose(); }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                >
                  <Clock className="w-5 h-5" />
                  Reserve Book
                </button>
              )}
`;

code = code.replace(
  /\{isWishlisted \? 'Saved to Wishlist' : 'Add to Wishlist'\}\n              <\/button>/,
  `$&${reserveButton}`
);

fs.writeFileSync('src/pages/Student/components/StudentBookDetails.tsx', code);
