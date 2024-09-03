require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import CORS module
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const db = require('./db');

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS
app.use(express.json());

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mock data
let todos = [
  { id: 1, task: 'Do laundry', completed: false },
  { id: 2, task: 'Write code', completed: false },
  { id: 3, task: 'Watch course', completed: false }
];

const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
  // Use the secret key from your environment variables
  return jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
}

function authenticateToken(req, res, next) {
  console.log("Headers:", req.headers);  // Log all headers to inspect what is being received
  const authHeader = req.headers['authorization'];
  console.log("Authorization Header:", authHeader);  // Log the exact value of the Authorization header
  const token = authHeader && authHeader.split(' ')[1];
  console.log("Received token:", token);  // This should now show the token if it's being sent correctly

  if (!token) {
    return res.sendStatus(401); // Send Unauthorized if there is no token
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.log("Token verification error:", err);  // Log any error that occurs during token verification
      return res.sendStatus(403); // Send Forbidden if the token is invalid
    }
    req.user = user;
    next();
  });
}



// CRUD Operations
// Read all todos
app.get('/todos', authenticateToken, async (req, res) => {
  try {
    const results = await db.query('SELECT * FROM todos ORDER BY id');
    res.send(results.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Use authenticateToken for other routes as needed


// Read a single todo
app.get('/todos/:id', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM todos WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      res.status(404).send('The todo with the given ID was not found.');
    } else {
      res.send(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Dummy user database
const users = [
  { id: 1, username: 'admin', password: 'password' } // In practice, use hashed passwords
];

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const accessToken = generateAccessToken({ username: user.username });
    console.log("Token generated:", accessToken);  // Check the token output
    res.json({ accessToken });
  } else {
    res.status(400).send('Username or password incorrect');
  }
});

// Create a new todo
app.post('/todos', authenticateToken, async (req, res) => {
  const { task, completed = false } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO todos (task, completed) VALUES ($1, $2) RETURNING *',
      [task, completed]
    );
    res.status(201).send(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// Update a todo
app.put('/todos/:id', authenticateToken, async (req, res) => {
  const { task, completed } = req.body;
  try {
    const result = await db.query(
      'UPDATE todos SET task = $1, completed = $2 WHERE id = $3 RETURNING *',
      [task, completed, req.params.id]
    );
    if (result.rows.length === 0) {
      res.status(404).send('The todo with the given ID was not found.');
    } else {
      res.send(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// Delete a todo
app.delete('/todos/:id', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('DELETE FROM todos WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      res.status(404).send('The todo with the given ID was not found.');
    } else {
      res.send(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

