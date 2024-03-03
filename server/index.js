const express = require("express");
const cors = require("cors");
const fs = require("fs");
const users = require("./sample.json");

const app = express();
app.use(express.json());
const port = 4000;
app.use(cors());

// Get All Users
app.get("/users", (req, res) => {
  return res.json(users);
});

// Delete User
app.delete("/users/:id", (req, res) => {
  let id = Number(req.params.id);
  let filteredUser = users.filter((user) => user.id !== id);
  fs.writeFile("./sample.json", JSON.stringify(filteredUser), (err, data) => {
    return res.json(filteredUser);
  });
});

// Add User
app.post("/users", (req, res) => {
  let { name, age, city } = req.body;
  if (!name || !age || !city) {
    res.status(400).send({ message: "All Fields Required" });
  }
  let id = Date.now();
  users.push({ id, name, age, city });
  fs.writeFile("./sample.json", JSON.stringify(filteredUser), (err, data) => {
    return res.json({ message: "User Added Successfully...👍🏻" });
  });
});

// Update User
app.patch("/users/:id", (req, res) => {
  let id = Number(req.params.id);
  let { name, age, city } = req.body;
  if (!name || !age || !city) {
    res.status(400).send({ message: "All Fields Required" });
  }
  let index = users.findIndex((user) => user.id == id);
  users.splice(index, 1, { ...req.body });
  fs.writeFile("./sample.json", JSON.stringify(filteredUser), (err, data) => {
    return res.json({ message: "User updated Successfully...👍🏻" });
  });
});

app.listen(port, () => {
  console.log(`Server is started on the port:${port}`);
});
