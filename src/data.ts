import { Book, Student } from './types';

const generateBooks = (): Book[] => {
  const books: Book[] = [];
  let idCounter = 100;
  
  const addBooks = (department: string, subjects: string[], authors: string[]) => {
    // Generate 45 books per department
    for (let i = 0; i < 45; i++) {
      const subject = subjects[i % subjects.length];
      const prefix = ["Advanced", "Principles of", "Introduction to", "Mastering", "Fundamentals of", "Applied", "Modern", "Essentials of", "Practical"][i % 9];
      const author = authors[i % authors.length];
      const version = i >= subjects.length ? ` Edition ${Math.floor(i / subjects.length) + 1}` : '';
      
      books.push({
        id: `B${idCounter++}`,
        name: `${prefix} ${subject}${version}`,
        author: author,
        department: department,
        status: i % 7 === 0 ? 'Issued' : 'Available'
      });
    }
  };

  addBooks('CS', ['Data Structures', 'Algorithms', 'Operating Systems', 'Database Systems', 'Computer Architecture', 'Theory of Computation', 'Compilers'], ['Robert Lafore', 'Thomas H. Cormen', 'Abraham Silberschatz', 'Elmasri & Navathe', 'John L. Hennessy']);
  addBooks('SE', ['Software Engineering', 'Design Patterns', 'Software Architecture', 'Agile Methodologies', 'Software Testing', 'Requirements Engineering', 'DevOps'], ['Ian Sommerville', 'Erich Gamma', 'Martin Fowler', 'Steve McConnell', 'Robert C. Martin']);
  addBooks('IT', ['Computer Networking', 'Cloud Computing', 'Cybersecurity', 'System Administration', 'Information Systems', 'IT Project Management', 'Web Technologies'], ['James Kurose', 'Andrew S. Tanenbaum', 'William Stallings', 'Kathy Schwalbe', 'Thomas Erl']);
  addBooks('AI', ['Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Natural Language Processing', 'Computer Vision', 'Reinforcement Learning', 'Robotics'], ['Peter Norvig', 'Ian Goodfellow', 'Tom M. Mitchell', 'Richard S. Sutton', 'Christopher M. Bishop']);
  addBooks('DS', ['Data Science', 'Data Analysis', 'Data Mining', 'Big Data Analytics', 'Statistical Learning', 'Data Visualization', 'Data Engineering'], ['Wes McKinney', 'Trevor Hastie', 'Joe Reis', 'Cole Nussbaumer Knaflic', 'Joel Grus']);
  addBooks('Finance', ['Corporate Finance', 'Investment Analysis', 'Financial Markets', 'Portfolio Management', 'Financial Derivatives', 'International Finance', 'Behavioral Finance'], ['Brealey', 'Myers', 'Allen', 'Ross', 'Westerfield']);
  addBooks('Accounting', ['Financial Accounting', 'Managerial Accounting', 'Cost Accounting', 'Auditing', 'Taxation', 'Accounting Information Systems', 'Forensic Accounting'], ['Weygandt', 'Kimmel', 'Kieso', 'Horngren', 'Datar']);
  addBooks('Education', ['Educational Psychology', 'Curriculum Development', 'Instructional Design', 'Philosophy of Education', 'Educational Leadership', 'Special Education', 'Assessment and Evaluation'], ['John Dewey', 'Paulo Freire', 'Jean Piaget', 'Lev Vygotsky', 'Benjamin Bloom']);

  return books;
};

export const INITIAL_BOOKS: Book[] = [
  // Computer Science
  { id: 'B001', name: 'Digital Logic Design (DLD)', author: 'M. Morris Mano', department: 'CS', status: 'Available' },
  { id: 'B002', name: 'Object Oriented Programming (OOP)', author: 'Robert Lafore', department: 'CS', status: 'Available' },
  { id: 'B003', name: 'C++ Programming', author: 'Bjarne Stroustrup', department: 'CS', status: 'Available' },
  { id: 'B004', name: 'Data Structures', author: 'Mark Allen Weiss', department: 'CS', status: 'Issued' },
  { id: 'B005', name: 'Database Systems', author: 'Elmasri & Navathe', department: 'CS', status: 'Available' },
  { id: 'B007', name: 'Introduction to Algorithms', author: 'Thomas H. Cormen', department: 'CS', status: 'Available' },
  { id: 'B008', name: 'Clean Code', author: 'Robert C. Martin', department: 'CS', status: 'Available' },
  { id: 'B011', name: 'Artificial Intelligence: A Modern Approach', author: 'Peter Norvig', department: 'CS', status: 'Available' },
  { id: 'B012', name: 'Operating System Concepts', author: 'Abraham Silberschatz', department: 'CS', status: 'Available' },
  { id: 'B015', name: 'Structure and Interpretation of Computer Programs', author: 'Harold Abelson', department: 'CS', status: 'Available' },
  { id: 'B016', name: 'Theory of Computation', author: 'Michael Sipser', department: 'CS', status: 'Available' },
  { id: 'B017', name: 'Compilers: Principles', author: 'Alfred V. Aho', department: 'CS', status: 'Issued' },
  { id: 'B019', name: 'Computer Architecture', author: 'John L. Hennessy', department: 'CS', status: 'Available' },
  { id: 'B024', name: 'Cracking the Coding Interview', author: 'Gayle Laakmann McDowell', department: 'CS', status: 'Issued' },

  // Software Engineering
  { id: 'B009', name: 'Design Patterns', author: 'Erich Gamma', department: 'SE', status: 'Issued' },
  { id: 'B013', name: 'The Pragmatic Programmer', author: 'Andrew Hunt', department: 'SE', status: 'Available' },
  { id: 'B014', name: 'Code Complete', author: 'Steve McConnell', department: 'SE', status: 'Issued' },
  { id: 'B020', name: 'Software Engineering', author: 'Ian Sommerville', department: 'SE', status: 'Available' },
  { id: 'B021', name: 'Head First Design Patterns', author: 'Eric Freeman', department: 'SE', status: 'Issued' },
  { id: 'B022', name: 'Refactoring', author: 'Martin Fowler', department: 'SE', status: 'Available' },
  { id: 'B023', name: 'Domain-Driven Design', author: 'Eric Evans', department: 'SE', status: 'Available' },
  { id: 'B025', name: 'The Mythical Man-Month', author: 'Frederick P. Brooks Jr.', department: 'SE', status: 'Available' },

  // Information Technology
  { id: 'B010', name: 'Computer Networking', author: 'James Kurose', department: 'IT', status: 'Available' },
  { id: 'B018', name: 'Modern Operating Systems', author: 'Andrew S. Tanenbaum', department: 'IT', status: 'Available' },
  { id: 'B026', name: 'Don\'t Make Me Think', author: 'Steve Krug', department: 'IT', status: 'Available' },
  { id: 'B046', name: 'Information Technology Project Management', author: 'Kathy Schwalbe', department: 'IT', status: 'Available' },
  { id: 'B047', name: 'Cloud Computing: Concepts, Technology', author: 'Thomas Erl', department: 'IT', status: 'Available' },
  { id: 'B048', name: 'Cybersecurity Essentials', author: 'Charles J. Brooks', department: 'IT', status: 'Issued' },

  // Artificial Intelligence
  { id: 'B049', name: 'Deep Learning', author: 'Ian Goodfellow', department: 'AI', status: 'Available' },
  { id: 'B050', name: 'Machine Learning', author: 'Tom M. Mitchell', department: 'AI', status: 'Available' },
  { id: 'B051', name: 'Reinforcement Learning', author: 'Richard S. Sutton', department: 'AI', status: 'Issued' },
  { id: 'B052', name: 'Natural Language Processing with Python', author: 'Steven Bird', department: 'AI', status: 'Available' },
  { id: 'B053', name: 'Pattern Recognition and Machine Learning', author: 'Christopher M. Bishop', department: 'AI', status: 'Available' },

  // Data Science
  { id: 'B054', name: 'Python for Data Analysis', author: 'Wes McKinney', department: 'DS', status: 'Available' },
  { id: 'B055', name: 'Data Science from Scratch', author: 'Joel Grus', department: 'DS', status: 'Available' },
  { id: 'B056', name: 'The Elements of Statistical Learning', author: 'Trevor Hastie', department: 'DS', status: 'Issued' },
  { id: 'B057', name: 'Fundamentals of Data Engineering', author: 'Joe Reis', department: 'DS', status: 'Available' },
  { id: 'B058', name: 'Storytelling with Data', author: 'Cole Nussbaumer Knaflic', department: 'DS', status: 'Available' },
  
  // Finance & Accounting
  { id: 'B059', name: 'Principles of Corporate Finance', author: 'Brealey, Myers, Allen', department: 'Finance', status: 'Available' },
  { id: 'B060', name: 'Financial Accounting', author: 'Weygandt, Kimmel, Kieso', department: 'Accounting', status: 'Available' },
  
  // Education
  { id: 'B061', name: 'Democracy and Education', author: 'John Dewey', department: 'Education', status: 'Available' },
  { id: 'B062', name: 'Pedagogy of the Oppressed', author: 'Paulo Freire', department: 'Education', status: 'Available' },
  ...generateBooks()
];

export const INITIAL_STUDENTS: Student[] = [
  { id: '2k26/CS/12', name: 'Ayesha Malik', department: 'CS', semester: 3, phone: '03001234567' },
  { id: '2k25/IT/10', name: 'Zainab Tariq', department: 'IT', semester: 5, phone: '03339876543' },
  { id: '2k24/SE/05', name: 'Muhammad Abdullah', department: 'Software Eng', semester: 7, phone: '03451122334' },
  { id: '2k26/CS/15', name: 'Fatima Noor', department: 'CS', semester: 2, phone: '03111223344' },
  { id: '2k25/CS/20', name: 'Bilal Hassan', department: 'CS', semester: 4, phone: '03221234567' },
  { id: '2k26/IT/01', name: 'Khadija Bibi', department: 'IT', semester: 1, phone: '03334567890' },
  { id: '2k24/CS/30', name: 'Omar Farooq', department: 'CS', semester: 6, phone: '03009876543' },
  { id: '2k25/SE/11', name: 'Maryam Zafar', department: 'Software Eng', semester: 3, phone: '03458765432' },
  { id: '2k23/CS/45', name: 'Usman Ali', department: 'CS', semester: 8, phone: '03123456789' },
  { id: '2k26/IT/08', name: 'Sana Javed', department: 'IT', semester: 2, phone: '03219876543' },
  { id: '2k25/CS/22', name: 'Hassan Raza', department: 'CS', semester: 5, phone: '03011223344' },
  { id: '2k26/SE/03', name: 'Nida Yasir', department: 'Software Eng', semester: 1, phone: '03312345678' },
  { id: '2k24/CS/14', name: 'Kamran Saleem', department: 'CS', semester: 7, phone: '03419876543' },
  { id: '2k25/IT/19', name: 'Iqra Aziz', department: 'IT', semester: 4, phone: '03131234567' },
  { id: '2k26/CS/25', name: 'Hamza Shah', department: 'CS', semester: 2, phone: '03239876543' },
  { id: '2k24/SE/21', name: 'Mahira Khan', department: 'Software Eng', semester: 6, phone: '03021234567' },
  { id: '2k25/CS/33', name: 'Tariq Mehmood', department: 'CS', semester: 3, phone: '03329876543' },
  { id: '2k23/IT/40', name: 'Sajal Aly', department: 'IT', semester: 8, phone: '03421234567' },
  { id: '2k26/CS/05', name: 'Fahad Mustafa', department: 'CS', semester: 1, phone: '03149876543' },
  { id: '2k25/SE/15', name: 'Aliya Shah', department: 'Software Eng', semester: 5, phone: '03241234567' },
  { id: '2k25/CS/18', name: 'Atif Aslam', department: 'CS', semester: 4, phone: '03031234567' },
  { id: '2k24/IT/25', name: 'Fatima Zahra', department: 'IT', semester: 7, phone: '03339876543' },
  { id: '2k26/CS/31', name: 'Zaid Ali', department: 'CS', semester: 2, phone: '03431234567' },
  { id: '2k26/DS/12', name: 'Hania Amir', department: 'DS', semester: 2, phone: '03341234567' },
  { id: '2k25/AI/07', name: 'Ammar Yasir', department: 'AI', semester: 4, phone: '03441234567' },
  { id: '2k26/AI/14', name: 'Mehwish Hayat', department: 'AI', semester: 1, phone: '03041234567' },
  { id: '2k25/DS/19', name: 'Fawad Khan', department: 'DS', semester: 3, phone: '03151234567' },
  { id: '2k24/CS/55', name: 'Maya Ali', department: 'CS', semester: 6, phone: '03251234567' },
  { id: '2k26/SE/23', name: 'Zoya Ahmed', department: 'Software Eng', semester: 2, phone: '03351234567' },
  { id: '2k25/IT/34', name: 'Hira Tareen', department: 'IT', semester: 5, phone: '03451234567' },
  { id: '2k26/DS/30', name: 'Minal Khan', department: 'DS', semester: 1, phone: '03051234567' },
  { id: '2k24/AI/11', name: 'Aiman Khan', department: 'AI', semester: 7, phone: '03161234567' },
];
