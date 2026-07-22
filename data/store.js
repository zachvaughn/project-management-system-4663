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

function addProject(name, description = '', owner = '', members = [], risks = []) {
    const project = {
        id: Date.now(),
        name: name,
        description: description,
        owner: owner,
        members: members, // array of strings
        risks: risks, // array of { description, status }
        requirements: [], // array of { id, text, type }
        effortLogs: [], // array of { id, requirementId, category, hours, date }
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

function updateProject(id, updates) {
    const project = getProjectById(id);
    if (!project) return null;
    Object.assign(project, updates);
    saveState();
    return project;
}

function deleteProject(id) {
    projects = projects.filter(p => p.id !== id);
    saveState();
}
function addRequirement(projectId, text, type) {
    const project = getProjectById(projectId);

    if (!project) {
        return null;
    }

    const normalizedType =
        type.toLowerCase() === 'functional'
            ? 'functional'
            : 'non-functional';

    const requirement = {
        id: Date.now(),
        text: text,
        type: normalizedType
    };

    project.requirements.push(requirement);
    saveState();

    return requirement;
}

function updateRequirement(projectId, requirementId, updates) {
    const project = getProjectById(projectId);
    if (!project) return null;

    const requirement = project.requirements.find(r => r.id === requirementId);
    if (!requirement) return null;

    Object.assign(requirement, updates);
    saveState();

    return requirement;
}

function deleteRequirement(projectId, requirementId) {
    const project = getProjectById(projectId);
    if (!project) return;

    project.requirements = project.requirements.filter(
        r => r.id !== requirementId
    );

    saveState();
}
