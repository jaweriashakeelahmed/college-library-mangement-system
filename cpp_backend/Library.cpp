#include "Library.h"
#include <fstream>
#include <iomanip>

using namespace std;

// Array Definitions
Book books[MAX_BOOKS];
int bookCount = 0;

Student students[MAX_STUDENTS];
int studentCount = 0;

IssueRecord issues[MAX_ISSUES];
int issueCount = 0;

// ==========================================
// File Handling (Load Data)
// ==========================================
void loadData() {
    ifstream bookFile("books.txt");
    if (bookFile.is_open()) {
        while (bookFile >> books[bookCount].bookID) {
            bookFile.ignore();
            getline(bookFile, books[bookCount].bookName);
            getline(bookFile, books[bookCount].author);
            getline(bookFile, books[bookCount].department);
            getline(bookFile, books[bookCount].status);
            bookCount++;
        }
        bookFile.close();
    }

    ifstream studentFile("students.txt");
    if (studentFile.is_open()) {
        while (studentFile >> students[studentCount].studentID) {
            studentFile.ignore();
            getline(studentFile, students[studentCount].studentName);
            getline(studentFile, students[studentCount].department);
            studentFile >> students[studentCount].semester;
            studentFile.ignore();
            getline(studentFile, students[studentCount].phone);
            studentFile >> students[studentCount].issuedBooksCount;
            studentFile.ignore();
            studentCount++;
        }
        studentFile.close();
    }

    ifstream issueFile("issue.txt");
    if (issueFile.is_open()) {
        while (issueFile >> issues[issueCount].studentID) {
            issueFile.ignore();
            getline(issueFile, issues[issueCount].studentName);
            getline(issueFile, issues[issueCount].bookID);
            getline(issueFile, issues[issueCount].bookName);
            getline(issueFile, issues[issueCount].issueDate);
            getline(issueFile, issues[issueCount].expectedReturnDate);
            getline(issueFile, issues[issueCount].returnDate);
            issueFile >> issues[issueCount].fine;
            issueFile.ignore();
            getline(issueFile, issues[issueCount].status);
            issueCount++;
        }
        issueFile.close();
    }
}

// ==========================================
// File Handling (Save Data)
// ==========================================
void saveData() {
    ofstream bookFile("books.txt");
    for (int i = 0; i < bookCount; i++) {
        bookFile << books[i].bookID << "\n"
                 << books[i].bookName << "\n"
                 << books[i].author << "\n"
                 << books[i].department << "\n"
                 << books[i].status << "\n";
    }
    bookFile.close();

    ofstream studentFile("students.txt");
    for (int i = 0; i < studentCount; i++) {
        studentFile << students[i].studentID << "\n"
                    << students[i].studentName << "\n"
                    << students[i].department << "\n"
                    << students[i].semester << "\n"
                    << students[i].phone << "\n"
                    << students[i].issuedBooksCount << "\n";
    }
    studentFile.close();

    ofstream issueFile("issue.txt");
    for (int i = 0; i < issueCount; i++) {
        issueFile << issues[i].studentID << "\n"
                  << issues[i].studentName << "\n"
                  << issues[i].bookID << "\n"
                  << issues[i].bookName << "\n"
                  << issues[i].issueDate << "\n"
                  << issues[i].expectedReturnDate << "\n"
                  << issues[i].returnDate << "\n"
                  << issues[i].fine << "\n"
                  << issues[i].status << "\n";
    }
    issueFile.close();
}

// ==========================================
// Book Management
// ==========================================
void addBook() {
    if (bookCount >= MAX_BOOKS) {
        cout << "Library is full! Cannot add more books.\n";
        return;
    }
    Book b;
    cout << "Enter Book ID: "; cin >> b.bookID;
    cin.ignore();
    cout << "Enter Book Name: "; getline(cin, b.bookName);
    cout << "Enter Author Name: "; getline(cin, b.author);
    cout << "Enter Department: "; getline(cin, b.department);
    b.status = "Available";
    
    books[bookCount] = b;
    bookCount++;
    saveData();
    cout << "Book Added Successfully!\n";
}

void searchBook() {
    string id;
    cout << "Enter Book ID to Search: "; cin >> id;
    bool found = false;
    for (int i = 0; i < bookCount; i++) {
        if (books[i].bookID == id) {
            cout << "--- Book Found ---\n";
            cout << "ID: " << books[i].bookID << "\nName: " << books[i].bookName 
                 << "\nAuthor: " << books[i].author << "\nStatus: " << books[i].status << "\n";
            found = true;
            break;
        }
    }
    if (!found) cout << "Book not found.\n";
}

void displayBooks() {
    cout << "--- All Books ---\n";
    for (int i = 0; i < bookCount; i++) {
        cout << books[i].bookID << " | " << books[i].bookName << " | " << books[i].status << "\n";
    }
}

// ==========================================
// Student Management
// ==========================================
void addStudent() {
    if (studentCount >= MAX_STUDENTS) return;
    Student s;
    cout << "Enter Student ID: "; cin >> s.studentID;
    cin.ignore();
    cout << "Enter Student Name: "; getline(cin, s.studentName);
    cout << "Enter Department: "; getline(cin, s.department);
    cout << "Enter Semester: "; cin >> s.semester;
    cin.ignore();
    cout << "Enter Phone Number: "; getline(cin, s.phone);
    s.issuedBooksCount = 0;
    
    students[studentCount] = s;
    studentCount++;
    saveData();
    cout << "Student Added Successfully!\n";
}

void displayStudents() {
    cout << "--- All Students ---\n";
    for (int i = 0; i < studentCount; i++) {
        cout << students[i].studentID << " | " << students[i].studentName 
             << " | Issued: " << students[i].issuedBooksCount << "\n";
    }
}

// ==========================================
// Issue & Return Logic
// ==========================================
void issueBook() {
    string sID, bID, iDate, eDate;
    cout << "Enter Student ID: "; cin >> sID;
    
    // Find Student
    int sIndex = -1;
    for (int i = 0; i < studentCount; i++) {
        if (students[i].studentID == sID) {
            sIndex = i; break;
        }
    }
    if (sIndex == -1) { cout << "Student not found!\n"; return; }
    if (students[sIndex].issuedBooksCount >= 3) {
        cout << "Limit Reached! Student already has 3 books.\n"; return;
    }

    cout << "Enter Book ID: "; cin >> bID;
    // Find Book
    int bIndex = -1;
    for (int i = 0; i < bookCount; i++) {
        if (books[i].bookID == bID) {
            bIndex = i; break;
        }
    }
    if (bIndex == -1) { cout << "Book not found!\n"; return; }
    if (books[bIndex].status == "Issued") {
        cout << "Book Already Issued!\n"; return;
    }

    cout << "Enter Issue Date (DD/MM/YYYY): "; cin >> iDate;
    cout << "Enter Expected Return Date (DD/MM/YYYY): "; cin >> eDate;

    // Issue Process
    IssueRecord record;
    record.studentID = sID;
    record.studentName = students[sIndex].studentName;
    record.bookID = bID;
    record.bookName = books[bIndex].bookName;
    record.issueDate = iDate;
    record.expectedReturnDate = eDate;
    record.returnDate = "N/A";
    record.fine = 0;
    record.status = "Issued";

    issues[issueCount] = record;
    issueCount++;
    
    books[bIndex].status = "Issued";
    students[sIndex].issuedBooksCount++;
    
    saveData();
    cout << "Book Issued Successfully!\n";
}

void returnBook() {
    string bID;
    cout << "Enter Book ID to Return: "; cin >> bID;

    int iIndex = -1;
    for (int i = 0; i < issueCount; i++) {
        if (issues[i].bookID == bID && issues[i].status == "Issued") {
            iIndex = i; break;
        }
    }
    if (iIndex == -1) { cout << "No active issue record found for this Book ID.\n"; return; }

    int daysLate;
    cout << "Enter Return Date (DD/MM/YYYY): "; cin >> issues[iIndex].returnDate;
    cout << "Enter Days Late (0 if on time): "; cin >> daysLate;

    issues[iIndex].fine = calculateFine(daysLate);
    issues[iIndex].status = "Returned";

    // Update Book and Student Status
    for (int i = 0; i < bookCount; i++) {
        if (books[i].bookID == bID) { books[i].status = "Available"; break; }
    }
    for (int i = 0; i < studentCount; i++) {
        if (students[i].studentID == issues[iIndex].studentID) {
            students[i].issuedBooksCount--; break;
        }
    }

    saveData();
    cout << "Book Returned Successfully! Fine to pay: Rs. " << issues[iIndex].fine << "\n";
}

int calculateFine(int daysLate) {
    if (daysLate > 0) return daysLate * 10;
    return 0;
}
