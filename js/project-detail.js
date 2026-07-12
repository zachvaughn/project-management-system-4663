const params = new URLSearchParams(window.location.search);
const currentProjectId = Number(params.get('id'));
const currentProject = getProjectById(currentProjectId); // from store.js

// handle logout
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        logout();
        window.location.href = '../index.html';
    });
}

// if no valid project is found, send back to dashboard
if (!currentProject) {
    alert("Project not found.");
    window.location.href = "dashboard.html";
}

// basic render of project info
function renderProjectInfo() {
    document.getElementById('project-name').textContent = currentProject.name;
    document.getElementById('project-description').textContent =
        currentProject.description || "No description added yet.";
    document.getElementById('project-owner').textContent =
        currentProject.owner || "Not set";
    document.getElementById('project-members').textContent =
        (currentProject.members && currentProject.members.length)
            ? currentProject.members.join(', ')
            : "None added yet";

    const risksList = document.getElementById('project-risks');
    risksList.innerHTML = '';
    if (currentProject.risks && currentProject.risks.length) {
        currentProject.risks.forEach(risk => {
            const li = document.createElement('li');
            li.textContent = `${risk.description} — ${risk.status}`;
            risksList.appendChild(li);
        });
    } else {
        risksList.innerHTML = '<li>No risks added yet.</li>';
    }
}

renderProjectInfo();

// edit / delete project
const infoDisplay = document.getElementById('project-info-display');
const editForm = document.getElementById('edit-project-form');
const editBtn = document.getElementById('edit-project-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const deleteBtn = document.getElementById('delete-project-btn');

editBtn.addEventListener('click', () => {
    // pre-fill the form with current values
    document.getElementById('ep-name').value = currentProject.name || '';
    document.getElementById('ep-description').value = currentProject.description || '';
    document.getElementById('ep-owner').value = currentProject.owner || '';
    document.getElementById('ep-members').value = (currentProject.members || []).join(', ');
    document.getElementById('ep-risks').value = (currentProject.risks || []).map(r => r.description).join(', ');

    infoDisplay.style.display = 'none';
    editForm.style.display = 'block';
});

cancelEditBtn.addEventListener('click', () => {
    editForm.style.display = 'none';
    infoDisplay.style.display = 'block';
});

editForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('ep-name').value.trim();
    const description = document.getElementById('ep-description').value.trim();
    const owner = document.getElementById('ep-owner').value.trim();

    const membersRaw = document.getElementById('ep-members').value.trim();
    const members = membersRaw ? membersRaw.split(',').map(m => m.trim()).filter(Boolean) : [];

    const risksRaw = document.getElementById('ep-risks').value.trim();
    const risks = risksRaw
        ? risksRaw.split(',').map(r => ({ description: r.trim(), status: 'Open' })).filter(r => r.description)
        : [];

    if (!name) return;

    updateProject(currentProjectId, { name, description, owner, members, risks }); // from store.js

    renderProjectInfo();
    editForm.style.display = 'none';
    infoDisplay.style.display = 'block';
});

deleteBtn.addEventListener('click', () => {
    const confirmed = confirm(`Are you sure you want to delete "${currentProject.name}"? This cannot be undone.`);
    if (confirmed) {
        deleteProject(currentProjectId); // from store.js
        window.location.href = 'dashboard.html';
    }
});

// task #2
// add/edit/delete requirements here
// requirement entries follow this shape: { id, text, type }
// (type is functional or non-functional)
// Use currentProject.requirements (array)
// call saveState() from store.js after any change



// task #3
// effort log entries follow this shape: { id, requirementId, category, hours, date }
// effort logging logic here



// task #4
// summary/report logic here
// pull from currentProject.requirements and/or currentProject.effortLogs
// to calculate totals per category and per requirement
//
// effort log entries follow this shape: { id, requirementId, category, hours, date }
// (there is another comment for task 4 in project-detail.html)
//
// two totals needed:
// total hours per category across all requirements
// total hours per requirement across all categories