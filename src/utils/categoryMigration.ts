import { Book } from '../types/index';

const APPROVED_CATEGORIES = [
  'Computer Science',
  'Information Technology',
  'Software Engineering',
  'Artificial Intelligence',
  'Accounting and Finance',
  'Education',
  'BBA',
  'English Literature'
];

export function migrateBooksCategory(books: Book[]): Book[] {
  return books.map(book => {
    let newCategory = book.category;
    let newMaterialType = book.materialType || 'Book'; // Default to Book
    
    // Check if current category is a material type
    const lowerCat = book.category?.toLowerCase() || '';
    if (lowerCat.includes('journal')) {
      newMaterialType = 'Journal';
      newCategory = undefined;
    } else if (lowerCat.includes('reference')) {
      newMaterialType = 'Reference Material';
      newCategory = undefined;
    } else if (lowerCat.includes('magazine')) {
      newMaterialType = 'Magazine';
      newCategory = undefined;
    } else if (lowerCat.includes('guide')) {
      newMaterialType = 'Guide';
      newCategory = undefined;
    }

    // Try to guess category from department if not in approved list
    if (newCategory && !APPROVED_CATEGORIES.includes(newCategory)) {
        // Just clear it and try to use department
        newCategory = undefined;
    }

    if (!newCategory) {
        const dept = book.department?.toLowerCase() || '';
        if (dept.includes('computer science') || dept === 'cs') newCategory = 'Computer Science';
        else if (dept.includes('information technology') || dept === 'it') newCategory = 'Information Technology';
        else if (dept.includes('software engineering') || dept === 'se') newCategory = 'Software Engineering';
        else if (dept.includes('artificial intelligence') || dept === 'ai') newCategory = 'Artificial Intelligence';
        else if (dept.includes('accounting') || dept.includes('finance')) newCategory = 'Accounting and Finance';
        else if (dept.includes('education')) newCategory = 'Education';
        else if (dept.includes('bba') || dept.includes('business')) newCategory = 'BBA';
        else if (dept.includes('english') || dept.includes('literature')) newCategory = 'English Literature';
        else newCategory = 'Computer Science'; // Fallback so it's not empty, or leave it undefined if optional
    }

    return {
      ...book,
      category: newCategory,
      materialType: newMaterialType
    };
  });
}
