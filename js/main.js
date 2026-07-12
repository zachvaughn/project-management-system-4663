const newProjectBtn = document.getElementById('new-project-btn');
const projectList = document.getElementById('project-list');
const emptyState = document.getElementById('empty-state');
const newProjectFormSection = document.getElementById('new-project-form-section');
const newProjectForm = document.getElementById('new-project-form');
const cancelNewProjectBtn = document.getElementById('cancel-new-project-btn');

// handle logout
const logoutBtn = document.getElementById('logout-btn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        logout(); // calls the function from store.js
        window.location.href = 'login.html'; // redirect to login page
    });
}

// show the new project form
newProjectBtn.addEventListener('click', () => {
    newProjectFormSection.style.display = 'block';
    newProjectBtn.style.display = 'none';
});

// hide the new project form
cancelNewProjectBtn.addEventListener('click', () => {
    newProjectForm.reset();
    newProjectFormSection.style.display = 'none';
    newProjectBtn.style.display = 'inline-block';
});

// handle project creation
newProjectForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('np-name').value.trim();
    const description = document.getElementById('np-description').value.trim();
    const owner = document.getElementById('np-owner').value.trim();

    const membersRaw = document.getElementById('np-members').value.trim();
    const members = membersRaw ? membersRaw.split(',').map(m => m.trim()).filter(Boolean) : [];

    const risksRaw = document.getElementById('np-risks').value.trim();
    const risks = risksRaw
        ? risksRaw.split(',').map(r => ({ description: r.trim(), status: 'Open' })).filter(r => r.description)
        : [];

    if (!name) return;

    addProject(name, description, owner, members, risks); // from store.js

    newProjectForm.reset();
    newProjectFormSection.style.display = 'none';
    newProjectBtn.style.display = 'inline-block';

    renderProjects();
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
        card.addEventListener('click', () => {
            window.location.href = `project-detail.html?id=${project.id}`;
        });

        const title = document.createElement('h3');
        title.className = 'project-card-title';
        title.textContent = project.name;
        card.appendChild(title);

        if (project.description) {
            const desc = document.createElement('p');
            desc.className = 'project-card-description';
            desc.textContent = project.description;
            card.appendChild(desc);
        }

        const meta = document.createElement('div');
        meta.className = 'project-card-meta';

        const ownerSpan = document.createElement('span');
        ownerSpan.textContent = project.owner ? `Owner: ${project.owner}` : 'Owner: Not set';
        meta.appendChild(ownerSpan);

        const membersSpan = document.createElement('span');
        const memberCount = (project.members || []).length;
        membersSpan.textContent = `${memberCount} member${memberCount === 1 ? '' : 's'}`;
        meta.appendChild(membersSpan);

        const reqCount = (project.requirements || []).length;
        const reqSpan = document.createElement('span');
        reqSpan.textContent = `${reqCount} requirement${reqCount === 1 ? '' : 's'}`;
        meta.appendChild(reqSpan);

        card.appendChild(meta);
        projectList.appendChild(card);
    });
}

renderProjects();