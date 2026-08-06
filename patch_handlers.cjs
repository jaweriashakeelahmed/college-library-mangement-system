const fs = require('fs');
let code = fs.readFileSync('src/app/App.tsx', 'utf8');

// handleToggleWishlist
const wishlistRegex = /const handleToggleWishlist = \(studentId: string, bookId: string\) => \{[\s\S]*?\}\)\);\n\s*\};/;
const wishlistReplacement = `const handleToggleWishlist = async (studentId: string, bookId: string) => {
    const s = students.find(s => s.id === studentId);
    if (!s) return;
    const wishlist = s.wishlist || [];
    let newWishlist = [];
    if (wishlist.includes(bookId)) {
      newWishlist = wishlist.filter(id => id !== bookId);
    } else {
      newWishlist = [...wishlist, bookId];
    }
    await updateDoc(doc(db, 'students', studentId), { wishlist: newWishlist });
  };`;
code = code.replace(wishlistRegex, wishlistReplacement);

fs.writeFileSync('src/app/App.tsx', code);
