#ifndef LIBRARY_H
#define LIBRARY_H

#include <iostream>
#include <string>

using namespace std;

// Constants
const int MAX_BOOKS = 1000;
const int MAX_STUDENTS = 500;
const int MAX_ISSUES = 2000;

// Structures
struct Book {
    string bookID;
    string bookName;
    string author;
    string department;
    string status; // "Available" or "Issued"
};

struct Student {
    string studentID;
    string studentName;
    string department;
    int semester;
    string phone;
    int issuedBooksCount;
};

struct IssueRecord {
    string studentID;
    string studentName;
    string bookID;
    string bookName;
    string issueDate;
    string expectedReturnDate;
    string returnDate;
    int fine;
    string status; // "Issued" or "Returned"
};

// Global Arrays (Simulating Database in Memory)
extern Book books[MAX_BOOKS];
extern int bookCount;

extern Student students[MAX_STUDENTS];
extern int studentCount;

extern IssueRecord issues[MAX_ISSUES];
extern int issueCount;

// Core Functions
void addBook();
void deleteBook();
void updateBook();
void searchBook();
void displayBooks();

void addStudent();
void searchStudent();
void displayStudents();

void issueBook();
void returnBook();
bool checkAvailability(string bookID);
int calculateFine(int daysLate);

// File Handling Functions
void saveData();
void loadData();

#endif
