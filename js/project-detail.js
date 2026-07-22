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

// Get the requirement-related elements from project-detail.html
const newRequirementBtn =
    document.getElementById('new-requirement-btn');

const requirementForm =
    document.getElementById('requirement-form');

const requirementIdInput =
    document.getElementById('requirement-id');

const requirementTextInput =
    document.getElementById('requirement-text');

const requirementTypeInput =
    document.getElementById('requirement-type');

const cancelRequirementBtn =
    document.getElementById('cancel-requirement-btn');

const requirementsList =
    document.getElementById('requirements-list');


// Make sure the current project has a requirements array
if (!Array.isArray(currentProject.requirements)) {
    currentProject.requirements = [];
}


// Display all requirements belonging to the current project
function renderRequirements() {
    requirementsList.innerHTML = '';

    if (currentProject.requirements.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.id = 'requirements-empty-state';
        emptyMessage.textContent = 'No requirements yet.';

        requirementsList.appendChild(emptyMessage);
        return;
    }

    currentProject.requirements.forEach((requirement) => {
        const requirementItem = document.createElement('div');
        requirementItem.classList.add('requirement-item');

        const requirementInformation = document.createElement('div');
        requirementInformation.classList.add('requirement-information');

        const requirementText = document.createElement('p');
        requirementText.textContent = requirement.text;

        const requirementType = document.createElement('span');
        requirementType.classList.add('requirement-type');
        requirementType.textContent =
            requirement.type === 'functional'
                ? 'Functional'
                : 'Non-Functional';

        requirementInformation.appendChild(requirementText);
        requirementInformation.appendChild(requirementType);

        const requirementActions = document.createElement('div');
        requirementActions.classList.add('requirement-actions');

        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-requirement-btn');

        editButton.addEventListener('click', () => {
            openRequirementForm(requirement);
        });

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-requirement-btn');

        deleteButton.addEventListener('click', () => {
            deleteRequirement(requirement.id);
        });

        requirementActions.appendChild(editButton);
        requirementActions.appendChild(deleteButton);

        requirementItem.appendChild(requirementInformation);
        requirementItem.appendChild(requirementActions);

        requirementsList.appendChild(requirementItem);
    });
}


// Open the form for either adding or editing a requirement
function openRequirementForm(requirement = null) {
    requirementForm.hidden = false;

    if (requirement) {
        requirementIdInput.value = requirement.id;
        requirementTextInput.value = requirement.text;
        requirementTypeInput.value = requirement.type;
    } else {
        requirementForm.reset();
        requirementIdInput.value = '';
    }

    requirementTextInput.focus();
}


// Close and clear the requirement form
function closeRequirementForm() {
    requirementForm.reset();
    requirementIdInput.value = '';
    requirementForm.hidden = true;
}


// Delete a requirement from the current project
function deleteRequirement(requirementId) {
    const shouldDelete = confirm(
        'Are you sure you want to delete this requirement?'
    );

    if (!shouldDelete) {
        return;
    }

    currentProject.requirements =
        currentProject.requirements.filter(
            (requirement) => requirement.id !== requirementId
        );

    saveState();
    renderRequirements();
    closeRequirementForm();
}


// Open an empty form when Add Requirement is clicked
newRequirementBtn.addEventListener('click', () => {
    openRequirementForm();
});


// Close the form when Cancel is clicked
cancelRequirementBtn.addEventListener('click', () => {
    closeRequirementForm();
});


// Add a new requirement or save changes to an existing one
requirementForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const requirementText =
        requirementTextInput.value.trim();

    const requirementType =
        requirementTypeInput.value;

    if (requirementText === '') {
        alert('Please enter a requirement description.');
        return;
    }

    const existingRequirementId =
        requirementIdInput.value;

    if (existingRequirementId) {
        const requirementToEdit =
            currentProject.requirements.find(
                (requirement) =>
                    requirement.id === Number(existingRequirementId)
            );

        if (requirementToEdit) {
            requirementToEdit.text = requirementText;
            requirementToEdit.type = requirementType;
        }
    } else {
        const newRequirement = {
            id: Date.now(),
            text: requirementText,
            type: requirementType
        };

        currentProject.requirements.push(newRequirement);
    }

    saveState();
    renderRequirements();
    closeRequirementForm();
});


// Display any requirements that were previously saved
renderRequirements();

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
 
