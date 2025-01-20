const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const port = 3000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = new sqlite3.Database('./library.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
    }
});


const getProfessorByUsername = (username) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM professors WHERE username = ?", [username], (err, row) => {
            if (err) {
                return reject(err);
            }
            resolve(row);
        });
    });
};

// JWT Middleware
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from header
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user; // Attach user info to request object
        next();
    });
};

// Function to get students by division
const getStudentsByDivision = (division) => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM students WHERE division_id = ?", [division], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
};

// Add a new student route with authentication
app.post('/api/students', authenticateToken, (req, res) => {
    const { roll_no, name } = req.body;

    // Validate input
    if (!roll_no || !name) {
        return res.status(400).json({ error: 'Roll No and Name are required' });
    }

    // Insert student into the database
    db.run("INSERT INTO students (roll_no, name) VALUES (?, ?)", [roll_no, name], function(err) {
        if (err) {
            console.error("Error adding student:", err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.status(201).json({ message: 'Student added successfully', id: this.lastID });
    });
});


// Routes

// Professor Registration
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Check if username already exists
        const existingProfessor = await getProfessorByUsername(username);
        if (existingProfessor) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new professor into the database
        db.run("INSERT INTO professors (username, password) VALUES (?, ?)", [username, hashedPassword], function(err) {
            if (err) {
                console.error("Error inserting professor:", err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ message: 'Professor registered successfully' });
        });
    } catch (err) {
        console.error("Error during registration:", err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Professor Authentication
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const professor = await getProfessorByUsername(username);
        
        if (!professor) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const validPassword = await bcrypt.compare(password, professor.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: professor.id }, process.env.SECRET_KEY);
        res.json({ token });
    } catch (err) {
        console.error("Error during login:", err);
        return res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/students', async (req, res) => {
    try {
        const { roll_no, name } = req.body;

        // Validate input
        if (!roll_no || !name) {
            return res.status(400).json({ error: 'Roll No and Name are required' });
        }

        // Insert student into the database
        db.run("INSERT INTO students (roll_no, name) VALUES (?, ?)", [roll_no, name], function(err) {
            if (err) {
                console.error("Error adding student:", err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ message: 'Student added successfully', id: this.lastID });
        });
    } catch (err) {
        console.error("Error during adding student:", err);
        return res.status(500).json({ error: 'Server error' });
    }
});


// Fetch students by division
app.get('/api/students', authenticateToken, (req, res) => {
    const division = req.query.division;
    
    if (!division) {
        return res.status(400).json({ error: 'Division is required' });
    }

    db.all("SELECT * FROM students WHERE division_id = ?", [division], (err, students) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({ students });
    });
});

// Add a new student
app.post('/api/students', (req, res) => {
    const { roll_no, name } = req.body;

    // Validate input
    if (!roll_no || !name) {
        return res.status(400).json({ error: 'Roll No and Name are required' });
    }

    // Insert student into the database
    db.run("INSERT INTO students (roll_no, name) VALUES (?, ?)", [roll_no, name], function(err) {
        if (err) {
            console.error("Error adding student:", err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.status(201).json({ message: 'Student added successfully', id: this.lastID });
    });
});


// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
