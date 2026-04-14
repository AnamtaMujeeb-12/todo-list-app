const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// read data
function readData() {
  return JSON.parse(fs.readFileSync('data.json'));
}

// write data
function writeData(data) {
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
}

// REGISTER
app.post('/register', (req, res) => {
  let data = readData();

  const { username, password } = req.body;

  data.users.push({
    id: Date.now(),
    username,
    password
  });

  writeData(data);

  res.send("Registered");
});

// LOGIN
app.post('/login', (req, res) => {
  let data = readData();

  const { username, password } = req.body;

  const user = data.users.find(
    u => u.username === username && u.password === password
  );

  if (user) {
    res.json(user);
  } else {
    res.send("Invalid");
  }
});

// ADD TODO
app.post('/add', (req, res) => {
  let data = readData();

  const { userId, task } = req.body;

  data.todos.push({
  id: Date.now(),
  userId,
  task,
  completed: false
});

  writeData(data);

  res.send("Added");
});

//UPDATE TODO
app.get('/update/:id', (req, res) => {
  let data = readData();

  let todo = data.todos.find(t => t.id == req.params.id);

  if (todo) {
    todo.completed = !todo.completed; // toggle true/false
  }

  writeData(data);
  res.send("Updated");
});

// GET TODOS
app.get('/todos/:userId', (req, res) => {
  let data = readData();

  let todos = data.todos.filter(t => t.userId == req.params.userId);

  res.json(todos);
});

// DELETE TODO
app.get('/delete/:id', (req, res) => {
  let data = readData();

  data.todos = data.todos.filter(t => t.id != req.params.id);

  writeData(data);

  res.send("Deleted");
});

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});