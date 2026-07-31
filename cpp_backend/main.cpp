#include <iostream>
#include "Library.h"

using namespace std;

void showMenu() {
    cout << "\n=========================================\n";
    cout << "   🏛 College Library Management System\n";
    cout << "=========================================\n";
    cout << "1. Add Book\n";
    cout << "2. Search Book\n";
    cout << "3. Display All Books\n";
    cout << "4. Add Student\n";
    cout << "5. Display All Students\n";
    cout << "6. Issue Book\n";
    cout << "7. Return Book\n";
    cout << "0. Exit\n";
    cout << "=========================================\n";
    cout << "Enter your choice: ";
}

int main() {
    loadData();
    int choice;
    
    do {
        showMenu();
        cin >> choice;
        
        switch (choice) {
            case 1: addBook(); break;
            case 2: searchBook(); break;
            case 3: displayBooks(); break;
            case 4: addStudent(); break;
            case 5: displayStudents(); break;
            case 6: issueBook(); break;
            case 7: returnBook(); break;
            case 0: 
                saveData();
                cout << "Exiting system. Data saved successfully.\n"; 
                break;
            default: cout << "Invalid choice! Try again.\n";
        }
    } while (choice != 0);
    
    return 0;
}
