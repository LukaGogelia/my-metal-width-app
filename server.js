const express = require("express");
const next = require("next");
const cors = require("cors");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const server = express();

server.use(cors());
server.use(express.json());

let usersData = []; // Stores user data (with multiple width selections)

// API to handle user joining
server.post("/join", (req, res) => {
  const { user } = req.body;
  if (!usersData.some((u) => u.user === user)) {
    usersData.push({ user, widths: [] }); // Initialize widths as an empty array
  }
  res.json(usersData);
});

// API to update widths for a user
server.post("/updateWidth", (req, res) => {
  const { user, widths } = req.body; // Expecting `widths` as an array

  usersData = usersData.map((u) =>
    u.user === user ? { ...u, widths: Array.isArray(widths) ? widths : [] } : u
  );

  res.json(usersData);
});

// API to fetch all user data
server.get("/usersData", (req, res) => {
  res.json(usersData);
});

// Start Next.js and handle pages
nextApp.prepare().then(() => {
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
