const fs = require('fs');
const path = require('path');

const departments = [
  'Computer Science', 'Artificial Intelligence', 'Data Science', 'Software Engineering',
  'Information Technology', 'Cyber Security', 'Computer Engineering', 'Electrical Engineering',
  'Electronics Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Business Administration (BBA)',
  'Commerce', 'Accounting & Finance', 'Economics', 'Mathematics', 'Statistics', 'Physics',
  'Chemistry', 'Biology', 'English', 'Urdu', 'Education', 'Islamic Studies', 'Law', 'Pharmacy',
  'Nursing', 'Agriculture', 'Environmental Science', 'Psychology', 'Sociology'
];

const publishers = ["Pearson", "McGraw-Hill", "Oxford University Press", "Cambridge University Press", "Springer", "Wiley", "Routledge", "Macmillan", "Cengage Learning", "SAGE Publishing"];
const categories = ["Textbook", "Reference", "Manual", "Guide", "Journal", "Research Paper", "Monograph", "Anthology"];
const locations = {
  floors: ["1st Floor", "2nd Floor", "3rd Floor", "Ground Floor", "Basement"],
  racks: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
};

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];

const generateBooks = () => {
  let idCounter = 1000;
  const books = [];

  const addBooks = (department, subjects, authors) => {
    const numBooks = 42;
    for (let i = 0; i < numBooks; i++) {
      const subject = subjects[i % subjects.length];
      const prefix = ["Advanced", "Principles of", "Introduction to", "Mastering", "Fundamentals of", "Applied", "Modern", "Essentials of", "Practical", "Foundations of", "Comprehensive"][i % 11];
      const author = authors[i % authors.length];
      const editionNumber = Math.floor(i / subjects.length) + 1;
      const edition = i >= subjects.length ? `${editionNumber}${editionNumber === 1 ? 'st' : editionNumber === 2 ? 'nd' : editionNumber === 3 ? 'rd' : 'th'} Edition` : '1st Edition';
      const year = randomInt(2005, 2023);
      
      const total = randomInt(1, 10);
      const isAvailable = Math.random() > 0.2;
      let status = 'Available';
      let available = total;
      let issued = 0;
      let reserved = 0;
      
      if (!isAvailable) {
        status = 'Issued';
        available = 0;
        issued = total;
      } else if (Math.random() > 0.8) {
        status = 'Reserved';
        available = 0;
        reserved = total;
      } else {
        issued = randomInt(0, total - 1);
        available = total - issued;
      }

      books.push({
        id: `B${idCounter++}`,
        accessionNumber: `ACC-${year}-${idCounter}`,
        isbn10: `0${randomInt(100000000, 999999999)}`,
        isbn13: `978-0${randomInt(100000000, 999999999)}`,
        name: `${prefix} ${subject}`,
        subtitle: `A Comprehensive Guide to ${subject}`,
        author: author,
        coAuthor: Math.random() > 0.7 ? authors[(i + 1) % authors.length] : undefined,
        publisher: getRandom(publishers),
        edition: edition,
        publicationYear: year.toString(),
        language: "English",
        category: getRandom(categories),
        subCategory: subject,
        department: department,
        semester: `${randomInt(1, 8)}`,
        subject: subject,
        shelfNumber: randomInt(1, 10).toString(),
        rackNumber: getRandom(locations.racks),
        rowNumber: randomInt(1, 5).toString(),
        floor: getRandom(locations.floors),
        totalCopies: total,
        availableCopies: available,
        issuedCopies: issued,
        reservedCopies: reserved,
        lostCopies: 0,
        damagedCopies: 0,
        price: randomInt(500, 5000),
        purchaseDate: randomDate(new Date(2015, 0, 1), new Date()),
        vendor: "University Booksellers",
        description: `This book provides an in-depth exploration of ${subject}, covering essential concepts and advanced techniques suitable for university students in the ${department} department.`,
        keywords: [subject.toLowerCase(), department.toLowerCase(), 'textbook', 'university'],
        status: status,
        imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(prefix)}+${encodeURIComponent(subject.substring(0,2))}&background=random&size=400&font-size=0.33`,
        createdDate: randomDate(new Date(2020, 0, 1), new Date()),
        updatedDate: new Date().toISOString()
      });
    }
  };

  const getGenericSubjects = (dept) => [
    `${dept} Principles`, `${dept} Theory`, `Applied ${dept}`, `Methodology in ${dept}`,
    `Research in ${dept}`, `History of ${dept}`, `${dept} Systems`, `Ethics in ${dept}`
  ];

  const getGenericAuthors = () => [
    'John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Brown',
    'Sarah Wilson', 'David Taylor', 'Jessica Anderson', 'William Thomas', 'Lisa Jackson'
  ];

  // Specific subjects for some departments
  const subjectMap = {
    'Computer Science': ['Data Structures', 'Algorithms', 'Operating Systems', 'Database Systems', 'Computer Architecture', 'Theory of Computation', 'Compilers'],
    'Software Engineering': ['Software Engineering', 'Design Patterns', 'Software Architecture', 'Agile Methodologies', 'Software Testing', 'Requirements Engineering', 'DevOps'],
    'Information Technology': ['Computer Networking', 'Cloud Computing', 'Cybersecurity', 'System Administration', 'Information Systems', 'IT Project Management', 'Web Technologies'],
    'Artificial Intelligence': ['Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Natural Language Processing', 'Computer Vision', 'Reinforcement Learning', 'Robotics'],
    'Data Science': ['Data Science', 'Data Analysis', 'Data Mining', 'Big Data Analytics', 'Statistical Learning', 'Data Visualization', 'Data Engineering'],
    'Commerce': ['Financial Accounting', 'Managerial Accounting', 'Business Law', 'Taxation', 'Corporate Finance', 'Marketing Management', 'Organizational Behavior'],
    'Economics': ['Microeconomics', 'Macroeconomics', 'Econometrics', 'Development Economics', 'International Trade', 'Public Finance', 'Behavioral Economics'],
    'Mathematics': ['Calculus', 'Linear Algebra', 'Differential Equations', 'Real Analysis', 'Complex Analysis', 'Abstract Algebra', 'Topology'],
    'Physics': ['Classical Mechanics', 'Electromagnetism', 'Quantum Mechanics', 'Thermodynamics', 'Statistical Mechanics', 'Optics', 'Solid State Physics'],
    'Law': ['Constitutional Law', 'Criminal Law', 'Contract Law', 'Tort Law', 'Property Law', 'International Law', 'Human Rights Law'],
  };

  departments.forEach(dept => {
    addBooks(dept, subjectMap[dept] || getGenericSubjects(dept), getGenericAuthors());
  });

  return books;
};

const books = generateBooks();
fs.writeFileSync(path.join(__dirname, 'src', 'data', 'booksData.json'), JSON.stringify(books, null, 2));
console.log(`Generated ${books.length} books.`);
