const newProjectBtn = document.getElementById('new-project-btn');
const projectList = document.getElementById('project-list');
const emptyState = document.getElementById('empty-state');

// handle logout
const logoutBtn = document.getElementById('logout-btn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        logout(); // calls the function from store.js
        window.location.href = 'login.html'; // redirect to login page
    });
}

newProjectBtn.addEventListener('click', () => {
    const name = prompt("Enter a name for the new project:");
    if (name) {
        addProject(name); // from store.js
        renderProjects();
    }
});

function renderProjects() {
    const projects = getProjects(); // from store.js

    emptyState.style.display = projects.length === 0 ? 'block' : 'none';

    // clear rendered projects
    [...projectList.children].forEach(child => {
        if (child.id !== 'empty-state') child.remove();
    });

    // render each project card
    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.textContent = project.name;
        projectList.appendChild(card);
    });
}

renderProjects();