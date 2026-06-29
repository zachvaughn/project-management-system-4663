// store.js
// initialize from localStorage if data exists, otherwise default to empty arrays/null
let projects = JSON.parse(localStorage.getItem('projects')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = localStorage.getItem('currentUser') || null;

// helper function to save current state to localStorage
function saveState() {
    localStorage.setItem('projects', JSON.stringify(projects));
    localStorage.setItem('users', JSON.stringify(users));

    if (currentUser) {
        localStorage.setItem('currentUser', currentUser);
    } else {
        localStorage.removeItem('currentUser');
    }
}

function addUser(username, password) {
    users.push({ username, password });
    saveState(); // save after modifying
}

function findUser(username) {
    return users.find(u => u.username === username);
}

function setCurrentUser(username) {
    currentUser = username;
    saveState(); // save after modifying
}

function getCurrentUser() {
    return currentUser;
}

function logout() {
    currentUser = null;
    saveState(); // save after modifying
}

function addProject(name) {
    const project = {
        id: Date.now(),
        name: name,
        requirements: [],
    };
    projects.push(project);
    saveState(); // save after modifying
    return project;
}

function getProjects() {
    return projects;
}

function getProjectById(id) {
    return projects.find(p => p.id === id);
}