const express = require('express');

const server = express();

server.use(express.json());

const projects = [
  { id: 99, title: 'Project 99', tasks: [] },
  { id: 98, title: 'Project 98', tasks: [] }
];

let requestCount = 0;
function countRequests(req, res, next) {
  console.log(`Number of requests: ${++requestCount}`);

  return next();
}

server.use(countRequests);

function checkProjectExists(req, res, next) {
  const { id } = req.params;

  if (!projects.find(p => p.id == id)) {
    return res.status(400).json({ error: 'Project not found' });
  }

  return next();
}

// List Projects
server.get('/projects', (_, res) => res.json(projects));

// Create Project
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  if (!id || !title) {
    return res.status(400).json({ error: 'ID and title required' });
  }

  projects.push({ id, title, tasks: [] });

  return res.json(projects);
});

// Edit Project Name
server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'title required' });
  }

  const project = projects.find(p => p.id == id);
  project.title = title;

  return res.json(projects);
});

// Delete Project
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(p => p.id == id);

  projects.splice(index, 1);

  return res.json(projects);
});

// Create Task
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'title required' });
  }

  const project = projects.find(p => p.id == id);
  project.tasks.push(title);

  return res.json(projects);
});

server.listen(3000, () => console.log('Server listening: http://localhost:3000'));
