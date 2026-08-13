### College Library Management System — C++ Core

A structured, menu-driven Library Management System built in C++ with clear separation between data structures, business logic, file persistence, and the application entry point.

This repository contains the original C++ logical core of the College Library Management System.

The C++ implementation is intentionally straightforward: it uses structures to model library entities, fixed-size in-memory collections to manage records, validation checks to protect core operations, and text-file persistence so that books, students, and issue records survive between program runs.

The project demonstrates how a real library workflow can be translated into fundamental C++ programming concepts rather than hiding the logic behind a framework.

What the C++ Core Handles

The C++ layer covers the fundamental library operations:

Book registration

Book search

Book listing

Student registration

Student listing

Book issuing

Book returns

Student borrowing limits

Book availability validation

Fine calculation

Issue-history tracking

Persistent file storage

Loading existing records when the program starts

Saving updated records after important operations

The core workflow is:

Application Start
      ↓
loadData()
      ↓
Display Main Menu
      ↓
Book / Student / Issue / Return Operation
      ↓
Update In-Memory Records
      ↓
saveData()
      ↓
Persistent Text Files

Core Architecture

The C++ implementation is divided into three primary files:

cpp_backend/
├── Library.h
├── Library.cpp
└── main.cpp

Library.h

The header defines the system's data model and public operations.

It contains:

Book

Student

IssueRecord

global collection declarations

record limits

function declarations

Library.cpp

This is where the actual library logic lives.

It implements:

file loading

file saving

book operations

student operations

issue processing

return processing

fine calculation

main.cpp

This is the executable entry point.

It:

Loads existing data.

Displays the command-line menu.

Reads the user's selection.

Dispatches the corresponding library operation.

Saves data before exiting.

This keeps the program flow separate from the underlying library business logic.

Data Model

The system uses C++ struct types to represent its core entities.

Book

struct Book {
    string bookID;
    string bookName;
    string author;
    string department;
    string status;
};

A book stores its identity, title, author, academic department, and current availability state.

The current C++ implementation represents availability through:

Available
Issued

Student

struct Student {
    string studentID;
    string studentName;
    string department;
    int semester;
    string phone;
    int issuedBooksCount;
};

The student record keeps both academic and library-specific information.

Most importantly, issuedBooksCount is used by the issuing logic to enforce the borrowing limit.

IssueRecord

struct IssueRecord {
    string studentID;
    string studentName;
    string bookID;
    string bookName;
    string issueDate;
    string expectedReturnDate;
    string returnDate;
    int fine;
    string status;
};

This structure acts as the transaction record for a book loan.

It preserves:

student identity

book identity

issue date

expected return date

actual return date

calculated fine

transaction status

That makes the issue array function as an in-memory transaction ledger.

Memory Management Strategy

The current implementation uses fixed-size arrays rather than dynamic containers.

const int MAX_BOOKS = 1000;
const int MAX_STUDENTS = 500;
const int MAX_ISSUES = 2000;

The collections are maintained through:

Book books[MAX_BOOKS];
Student students[MAX_STUDENTS];
IssueRecord issues[MAX_ISSUES];

and counters:

int bookCount;
int studentCount;
int issueCount;

This approach is intentionally transparent and suitable for demonstrating fundamental C++ concepts such as:

arrays

structures

counters

iteration

searching

conditional validation

function-based modularity

Book Management Logic

Add Book

addBook() collects:

Book ID

Book name

Author

Department

New books are initialized as:

b.status = "Available";

The record is then inserted into the books array and persisted using saveData().

The implementation also protects the array boundary:

if (bookCount >= MAX_BOOKS)

This prevents insertion beyond the configured book capacity.

Search Book

searchBook() performs a sequential search through the book collection.

The Book ID is compared against each stored record until a match is found.

This is a simple and predictable lookup strategy appropriate for the current fixed-array architecture.

Display Books

displayBooks() traverses the active portion of the books array and prints:

Book ID
Book Name
Status

Only records below bookCount are considered active.

Student Management Logic

Add Student

addStudent() collects:

Student ID

Student name

Department

Semester

Phone number

Every newly registered student starts with:

s.issuedBooksCount = 0;

The student is then added to the in-memory collection and saved to disk.

Display Students

displayStudents() provides a compact overview containing:

Student ID

Student name

Number of currently issued books

This makes the student's borrowing state immediately visible.

Book Issue Logic

The issueBook() function is one of the most important pieces of the C++ core because it coordinates multiple entities in a single transaction.

The operation follows this sequence:

Student ID
   ↓
Find student
   ↓
Check borrowing limit
   ↓
Book ID
   ↓
Find book
   ↓
Check book status
   ↓
Collect issue/return dates
   ↓
Create IssueRecord
   ↓
Mark book as Issued
   ↓
Increment student's issuedBooksCount
   ↓
Persist data

Student Validation

The system first searches for the student.

If the student does not exist:

Student not found!

The operation terminates without modifying library state.

Borrowing Limit

The current C++ core enforces a maximum of 3 simultaneously issued books per student:

if (students[sIndex].issuedBooksCount >= 3)

This is a direct business rule implemented at the C++ logic level.

Book Validation

The requested Book ID is searched in the book collection.

If it does not exist, the issue operation is cancelled.

The system also prevents issuing a book whose current state is:

"Issued"

This protects the basic one-copy/one-active-issue rule represented by the current C++ model.

Creating the Issue Record

Once validation succeeds, the system creates an IssueRecord.

The new record initially contains:

returnDate = N/A
fine = 0
status = Issued

The record is appended to the issue collection.

At the same time:

books[bIndex].status = "Issued";
students[sIndex].issuedBooksCount++;

This keeps the book state and student borrowing count synchronized with the newly created transaction.

Book Return Logic

returnBook() reverses the active issue state.

The function searches the issue records for a matching Book ID whose status is:

Issued

If no active issue exists, the return operation is rejected.

For a valid return, the system collects:

Return date

Number of days late

The issue record is then changed to:

status = Returned

and its return date is recorded.

Fine Calculation

Fine calculation is intentionally simple and deterministic.

The current rule is:

daysLate * 10

Therefore:

0 days late  → Rs. 0
1 day late   → Rs. 10
5 days late  → Rs. 50
10 days late → Rs. 100

The logic is encapsulated in:

int calculateFine(int daysLate)

which returns zero when the book is not late.

This separation makes the fine policy easy to modify without rewriting the complete return workflow.

Return-State Synchronization

After a successful return, two important records are updated.

Book

books[i].status = "Available";

Student

students[i].issuedBooksCount--;

This means the return operation does not merely change the transaction status; it also restores the corresponding library and student state.

The complete transition is:

Issued Book
    ↓
Return Transaction
    ↓
Fine Calculation
    ↓
IssueRecord = Returned
    ↓
Book = Available
    ↓
Student Issued Count − 1
    ↓
saveData()

File Persistence

The project uses plain text files as its persistence layer.

books.txt
students.txt
issue.txt

The system loads these files when the program starts:

loadData();

and writes updated records after data-changing operations:

saveData();

This gives the console application persistence without requiring an external database.

books.txt

Stores book records in a structured line-based format containing:

Book ID
Book Name
Author
Department
Status

students.txt

Stores:

Student ID
Student Name
Department
Semester
Phone
Issued Books Count

issue.txt

Stores:

Student ID
Student Name
Book ID
Book Name
Issue Date
Expected Return Date
Return Date
Fine
Status

The format is deliberately simple so that it can be inspected and understood directly.

Main Menu

The console application exposes the core operations through main.cpp:

=========================================
   College Library Management System
=========================================
1. Add Book
2. Search Book
3. Display All Books
4. Add Student
5. Display All Students
6. Issue Book
7. Return Book
0. Exit
=========================================

The menu is controlled by a do...while loop and a switch statement.

This provides a clean command-dispatch model:

switch (choice) {
    case 1: addBook(); break;
    case 2: searchBook(); break;
    case 3: displayBooks(); break;
    case 4: addStudent(); break;
    case 5: displayStudents(); break;
    case 6: issueBook(); break;
    case 7: returnBook(); break;
    case 0: saveData(); break;
}

Important Business Rules Implemented in C++

Rule

Current C++ Implementation

Maximum books in memory

1000

Maximum students in memory

500

Maximum issue records in memory

2000

Maximum active books per student

3

New book state

Available

New student issued count

0

Active issue state

Issued

Returned issue state

Returned

On-time fine

Rs. 0

Late fine

Rs. 10 per late day

Persistence

books.txt, students.txt, issue.txt

Error Handling & Validation

The C++ core performs validation before committing important operations.

Examples include:

library capacity checks

student existence checks

book existence checks

duplicate active-book protection

student borrowing-limit protection

active issue verification during return

safe state transitions

persistence after mutations

The philosophy is simple:

Validate first. Mutate state second. Persist last.

That makes the workflow easier to reason about and reduces accidental corruption of the in-memory state.

Complexity

Because the current implementation uses arrays and sequential searches, most lookup operations are linear.

For example:

Search Book      → O(n)
Search Student   → O(n)
Find Issue       → O(n)
Display Books    → O(n)
Display Students → O(n)

This is a deliberate trade-off in the current educational implementation: the logic remains explicit, readable, and easy to trace.

For a significantly larger production dataset, indexed structures such as std::unordered_map or a database-backed repository would be appropriate.

Design Philosophy

The C++ implementation prioritizes clarity of logic over unnecessary abstraction.

Instead of hiding library operations behind layers of frameworks, the core rules are visible:

Find → Validate → Update → Save

That makes the project useful for demonstrating practical applications of:

C++ structures

functions

arrays

loops

conditional statements

string handling

file streams

modular source/header organization

transaction-style state changes

The result is a compact but meaningful example of turning real library requirements into executable business rules.

Build & Run

A standard C++ compiler such as g++ can compile the C++ backend.

From the project root:

g++ cpp_backend/main.cpp cpp_backend/Library.cpp -o library

Run it on Linux/macOS:

./library

On Windows:

library.exe

Make sure the following files are available in the program's working directory:

books.txt
students.txt
issue.txt

If they do not exist, the application can start with empty in-memory collections and create the files when records are saved.

Project Structure

College-Library-Management-System/
│
├── cpp_backend/
│   ├── Library.h
│   ├── Library.cpp
│   └── main.cpp
│
├── books.txt
├── students.txt
├── issue.txt
│
├── src/
│   ├── app/
│   ├── pages/
│   ├── services/
│   ├── types/
│   └── utils/
│
├── java_gui/
│   └── LibraryApp.java
│
├── package.json
├── vite.config.ts
└── README.md

The repository also contains a broader application layer, but the files under cpp_backend/ remain the dedicated C++ implementation of the core library logic.

What Makes the C++ Core Valuable

This project is not simply a menu with CRUD operations.

The important part is the relationship between the records.

A book issue changes multiple pieces of state:

Book status
      +
Student issued-book count
      +
Issue transaction

A return reverses that relationship:

Issue status
      +
Book availability
      +
Student issued-book count
      +
Fine

That is where the project's actual business logic lives.

The C++ implementation therefore demonstrates a small but complete transaction model using only fundamental language features and file persistence.

Future Engineering Improvements

The current implementation is intentionally based on fixed arrays and text files. Natural next improvements would include:

replacing fixed arrays with STL containers

introducing unique-indexed lookups

stronger input validation

date-aware fine calculation

separating persistence from business logic

exception-based file/error handling

database persistence

unit testing

stronger transaction consistency

encapsulation through classes

repository/service abstractions

These are future engineering directions, not requirements for understanding the current implementation.

Academic / Technical Focus

The C++ component demonstrates practical use of:

Structures

Arrays

Functions

Header/source separation

Loops

Conditional logic

String processing

File handling

Sequential searching

State management

Business-rule validation

Basic transaction processing

It is particularly suitable for demonstrating how core C++ programming concepts can be combined to model a real-world information system.

Author's Note

The strongest part of this implementation is its transparency.

Every important library decision can be followed directly through the code: where a student is found, where the borrowing limit is enforced, where a book becomes issued, where a transaction is created, where a fine is calculated, and where the final state is persisted.

That makes the C++ backend more than supporting code—it is a clear implementation of the library's core operational rules.

License

This project is intended for academic, educational, and demonstration purposes.
