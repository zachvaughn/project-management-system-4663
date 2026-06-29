// ui logic which handles rendering the project list and the "New Project" button.
// uses store.js

const newProjectBtn = document.getElementById('new-project-btn');
const projectList = document.getElementById('project-list');
const emptyState = document.getElementById('empty-state');

newProjectBtn.addEventListener('click', () => {
    const name = prompt("Enter a name for the new project:");
    if (name) {
        addProject(name);// from store.js
        renderProjects();
    }
});

function renderProjects() {
    const projects = getProjects(); // from store.js

    emptyState.style.display = projects.length === 0 ? 'block' : 'none';

    [...projectList.children].forEach(child => {
        if (child.id !== 'empty-state') child.remove();
    });

    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.textContent = project.name;
        projectList.appendChild(card);
    });
}