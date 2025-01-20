# Attendance-Tracker

Developed a Student Attendance Management System using Node.js, SQLite, and Bootstrap.


#A] Methodology:
# 1. Project Structure
Created a web-based attendance management system with the following structure:

attendance-system/
├── login.html
├── dashboard.html
├── student_management.html
├── attendance_report.html
├── app.js
└── library.db

#2. Technologies Used

- Frontend: HTML5, Bootstrap 5.3.0, JavaScript
- Backend: Node.js with Express.js
- Database: SQLite3
- Authentication: JWT (JSON Web Tokens)
- Security: bcrypt for password hashing
- Additional Libraries: cors for cross-origin requests

#3. Database Design

Created SQLite database (library.db) with three main tables:
- professors: Stores authentication credentials
- students: Manages student information
- divisions: Handles division/class organization


#4. Key Components

Frontend Pages: 
- login.html: Professor authentication interface
- dashboard.html: Main attendance marking interface
- student_management.html: Student data management
- attendance_report.html: Monthly attendance reporting
  
Backend Services: 
- Authentication system with JWT
- RESTful API endpoints for:
 - Professor registration/login
 - Student management
 - Attendance tracking
 - Report generation




#B] Summary of Functionalities
#1. Authentication System

- Secure login with username/password
- JWT token-based session management
- Password hashing using bcrypt

#2. Dashboard Features

- Division selection (A/B)
- Date selection for attendance
- Real-time student list loading
- Bulk attendance marking

#3. Student Management
- Add new students with roll numbers
- View student list by division
- Basic CRUD operations

#4. Reporting System
- Monthly attendance reports
- Division-wise filtering
- Attendance percentage calculation
- Present/Absent day tracking
