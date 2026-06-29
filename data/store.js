// data store for the whole app.
// Everyone's pages/scripts should read and write through these functions

let projects = [];
let users = [];
let currentUser = null; // tracks who's logged in for this session

function addUser(username, password) {
    users.push({ username, password });
}

function findUser(username) {
    return users.find(u => u.username === username);
}

function setCurrentUser(username) {
    currentUser = username;
}

function getCurrentUser() {
    return currentUser;
}

function logout() {
    currentUser = null;
}

function addProject(name) {
    const project = {
        id: Date.now(),
        name: name,
        requirements: [], // each requirement: { id, text, hours: { analysis, design, coding, testing, management } }
    };
    projects.push(project);
    return project;
}

function getProjects() {
    return projects;
}

function getProjectById(id) {
    return projects.find(p => p.id === id);
}