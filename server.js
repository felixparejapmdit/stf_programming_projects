const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

const DATA_PATH = path.join(__dirname, "projects.json");

app.use(express.json());
app.use(express.static("public"));

// Read all projects
app.get("/api/projects", (req, res) => {
  const data = fs.existsSync(DATA_PATH) ? fs.readFileSync(DATA_PATH) : "[]";
  res.json(JSON.parse(data));
});

// Add or update project
app.post("/api/projects", (req, res) => {
  const newProject = req.body;
  const projects = JSON.parse(fs.readFileSync(DATA_PATH));

  // Handle the case where we're updating an existing project
  if (newProject.index !== undefined) {
    projects[newProject.index] = newProject;
  } else {
    // Handle new project creation
    projects.push(newProject);
  }

  // Save updated project list to file
  fs.writeFileSync(DATA_PATH, JSON.stringify(projects, null, 2));
  res.json({ success: true });
});

// Delete project
app.delete("/api/projects/:index", (req, res) => {
  const index = +req.params.index;
  const projects = JSON.parse(fs.readFileSync(DATA_PATH));

  // Remove the project from the array
  projects.splice(index, 1);

  // Save updated list of projects
  fs.writeFileSync(DATA_PATH, JSON.stringify(projects, null, 2));
  res.json({ success: true });
});

// Update the listen statement to allow external connections
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
