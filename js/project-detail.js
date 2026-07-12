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
const newEffortBtn = document.getElementById('new-effort-btn');
const newEffortForm = document.getElementById('new-effort-form');
const cancelEffortBtn = document.getElementById('cancel-effort-btn');
const effortRequirementSelect = document.getElementById('ef-requirement');
const effortLogList = document.getElementById('effort-log-list');
const effortEmptyState = document.getElementById('effort-empty-state');

newEffortBtn.addEventListener('click', () => {
    if (!currentProject.requirements || currentProject.requirements.length === 0) {
        alert('Add at least one requirement before logging effort.');
        return;
    }

    effortRequirementSelect.innerHTML = currentProject.requirements
        .map(r => `<option value="${r.id}">${r.text}</option>`)
        .join('');

    newEffortForm.style.display = 'block';
    newEffortBtn.style.display = 'none';
});

cancelEffortBtn.addEventListener('click', () => {
    newEffortForm.reset();
    newEffortForm.style.display = 'none';
    newEffortBtn.style.display = 'inline-block';
});

newEffortForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const requirementId = Number(effortRequirementSelect.value);
    const category = document.getElementById('ef-category').value;
    const hours = Number(document.getElementById('ef-hours').value);

    if (!requirementId || !category || !hours || hours <= 0) return;

    const entry = {
        id: Date.now(),
        requirementId: requirementId,
        category: category,
        hours: hours,
        date: new Date().toISOString().split('T')[0],
    };

    if (!currentProject.effortLogs) currentProject.effortLogs = [];
    currentProject.effortLogs.push(entry);
    saveState(); // from store.js

    newEffortForm.reset();
    newEffortForm.style.display = 'none';
    newEffortBtn.style.display = 'inline-block';

    renderEffortLogs();
    renderEffortReport();
});

function renderEffortLogs() {
    effortLogList.innerHTML = '';

    if (!currentProject.effortLogs || currentProject.effortLogs.length === 0) {
        effortEmptyState.style.display = 'block';
        effortLogList.appendChild(effortEmptyState);
        return;
    }

    effortEmptyState.style.display = 'none';

    currentProject.effortLogs.forEach(log => {
        const requirement = currentProject.requirements.find(r => r.id === log.requirementId);
        const entryDiv = document.createElement('div');
        entryDiv.className = 'effort-log-entry';
        entryDiv.textContent = `${requirement ? requirement.text : 'Unknown Requirement'} — ${log.category}: ${log.hours} hr(s) (${log.date})`;
        effortLogList.appendChild(entryDiv);
    });
}

renderEffortLogs();



// task #4
function renderEffortReport() {
    const emptyState = document.getElementById("report-empty-state");
    const categoryReport = document.getElementById("category-report");
    const requirementReport = document.getElementById("requirement-report");

    categoryReport.innerHTML = "";
    requirementReport.innerHTML = "";

    if (!currentProject.effortLogs || currentProject.effortLogs.length === 0) {
        emptyState.style.display = "block";
        categoryReport.innerHTML = "<p>No data available</p>";
        requirementReport.innerHTML = "<p>No data available</p>";
        return;
    }

    emptyState.style.display = "none";

    const categoryTotals = {};
    const requirementTotals = {};

    currentProject.effortLogs.forEach(log => {
        if (!categoryTotals[log.category]) {
            categoryTotals[log.category] = 0;
        }
        categoryTotals[log.category] += Number(log.hours);

        if (!requirementTotals[log.requirementId]) {
            requirementTotals[log.requirementId] = 0;
        }
        requirementTotals[log.requirementId] += Number(log.hours);
    });

    const categoryTitle = document.createElement("h4");
    categoryTitle.textContent = "By Category";
    categoryReport.appendChild(categoryTitle);

    const categoryList = document.createElement("ul");
    for (const category in categoryTotals) {
        const li = document.createElement("li");
        li.textContent = `${category}: ${categoryTotals[category]} hour(s)`;
        categoryList.appendChild(li);
    }
    categoryReport.appendChild(categoryList);

    const requirementTitle = document.createElement("h4");
    requirementTitle.textContent = "By Requirement";
    requirementReport.appendChild(requirementTitle);

    const requirementList = document.createElement("ul");
    for (const requirementId in requirementTotals) {
        const requirement = currentProject.requirements.find(r => r.id == requirementId);
        const li = document.createElement("li");
        li.textContent = `${requirement ? requirement.text : "Unknown Requirement"}: ${requirementTotals[requirementId]} hour(s)`;
        requirementList.appendChild(li);
    }
    requirementReport.appendChild(requirementList);
}

renderEffortReport();
 
