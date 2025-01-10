const express = require('express');
const next = require('next');
const cors = require('cors');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const server = express();

server.use(cors());
server.use(express.json());

let usersData = []; // State to store user data

// API routes
server.post('/join', (req, res) => {
  const { user } = req.body;
  if (!usersData.some((u) => u.user === user)) {
    usersData.push({ user, width: null });
  }
  res.json(usersData);
});

server.post('/updateWidth', (req, res) => {
  const { user, width } = req.body;
  usersData = usersData.map((u) =>
    u.user === user ? { ...u, width } : u
  );
  res.json(usersData);
});

server.get('/usersData', (req, res) => {
  res.json(usersData);
});

// Handle Next.js pages
nextApp.prepare().then(() => {
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
