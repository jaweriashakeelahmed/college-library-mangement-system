#!/bin/bash

# Move files to their new locations
mv src/data.ts src/data/mockData.ts
mv src/types.ts src/types/index.ts
mv src/index.css src/styles/index.css

# Move components to pages/components
mv src/components/Auth.tsx src/pages/Authentication/Auth.tsx
mv src/components/Dashboard.tsx src/pages/Staff/Dashboard.tsx
mv src/components/Books.tsx src/pages/Staff/Books.tsx
mv src/components/Students.tsx src/pages/Staff/Students.tsx
mv src/components/IssueBook.tsx src/pages/Staff/IssueBook.tsx
mv src/components/ReturnBook.tsx src/pages/Staff/ReturnBook.tsx
mv src/components/IssueHistory.tsx src/pages/Staff/TrackingRecords.tsx
mv src/components/Requests.tsx src/pages/Staff/Requests.tsx
mv src/components/StudentDashboard.tsx src/pages/Student/StudentDashboard.tsx
mv src/components/About.tsx src/pages/Shared/About.tsx
mv src/components/CameraCapture.tsx src/components/ui/CameraCapture.tsx

mv src/App.tsx src/app/App.tsx

# Create empty files as requested
touch src/app/Router.tsx
touch src/app/AppProvider.tsx

# Update main.tsx
sed -i "s|import App from './App';|import App from '@/src/app/App';|g" src/main.tsx
sed -i "s|import './index.css';|import '@/src/styles/index.css';|g" src/main.tsx

# Update App.tsx imports
sed -i "s|import { Auth } from './components/Auth';|import { Auth } from '@/src/pages/Authentication/Auth';|g" src/app/App.tsx
sed -i "s|import { Dashboard } from './components/Dashboard';|import { Dashboard } from '@/src/pages/Staff/Dashboard';|g" src/app/App.tsx
sed -i "s|import { Books } from './components/Books';|import { Books } from '@/src/pages/Staff/Books';|g" src/app/App.tsx
sed -i "s|import { Students } from './components/Students';|import { Students } from '@/src/pages/Staff/Students';|g" src/app/App.tsx
sed -i "s|import { IssueBook } from './components/IssueBook';|import { IssueBook } from '@/src/pages/Staff/IssueBook';|g" src/app/App.tsx
sed -i "s|import { ReturnBook } from './components/ReturnBook';|import { ReturnBook } from '@/src/pages/Staff/ReturnBook';|g" src/app/App.tsx
sed -i "s|import { IssueHistory } from './components/IssueHistory';|import { IssueHistory } from '@/src/pages/Staff/TrackingRecords';|g" src/app/App.tsx
sed -i "s|import { Requests } from './components/Requests';|import { Requests } from '@/src/pages/Staff/Requests';|g" src/app/App.tsx
sed -i "s|import { StudentDashboard } from './components/StudentDashboard';|import { StudentDashboard } from '@/src/pages/Student/StudentDashboard';|g" src/app/App.tsx
sed -i "s|import { About } from './components/About';|import { About } from '@/src/pages/Shared/About';|g" src/app/App.tsx

sed -i "s|import { INITIAL_BOOKS, INITIAL_STUDENTS, INITIAL_STAFFS, INITIAL_ISSUE_RECORDS, INITIAL_RETURN_REQUESTS } from './data';|import { INITIAL_BOOKS, INITIAL_STUDENTS, INITIAL_STAFFS, INITIAL_ISSUE_RECORDS, INITIAL_RETURN_REQUESTS } from '@/src/data/mockData';|g" src/app/App.tsx
sed -i "s|import { Book, Student, Staff, IssueRecord, CurrentUser, ReturnRequest } from './types';|import { Book, Student, Staff, IssueRecord, CurrentUser, ReturnRequest } from '@/src/types/index';|g" src/app/App.tsx

# Update types and data imports everywhere
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i "s|from '../types'|from '@/src/types/index'|g"
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i "s|from '../../types'|from '@/src/types/index'|g"
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i "s|from './types'|from '@/src/types/index'|g"
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i "s|from '../data'|from '@/src/data/mockData'|g"
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i "s|from '../../data'|from '@/src/data/mockData'|g"
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i "s|from './data'|from '@/src/data/mockData'|g"

# Update CameraCapture imports
find src -type f -name "*.tsx" | xargs sed -i "s|from './CameraCapture'|from '@/src/components/ui/CameraCapture'|g"
find src -type f -name "*.tsx" | xargs sed -i "s|from '../CameraCapture'|from '@/src/components/ui/CameraCapture'|g"

