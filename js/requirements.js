// Get the Project ID from the URL 
const urlParams = new URLSearchParams(window.location.search);
const projectId = parseInt(urlParams.get('projectId'), 10);

// DOM Elements
const form = document.getElementById('requirement-form');
const textInput = document.getElementById('requirement-text');
const typeInput = document.getElementById('requirement-type');
const functionalContainer = document.getElementById('functional-requirements');
const nonFunctionalContainer = document.getElementById('non-functional-requirements');

// Render Requirements
function renderRequirements() {
    const project = getProjectById(projectId);
    
    if (!project) {
        document.body.innerHTML = '<h2>Project not found. Please return to the dashboard.</h2>';
        return;
    }

    // set page title
    document.title = `${project.name} - Requirements`;

    // clear existing content
    functionalContainer.innerHTML = '';
    nonFunctionalContainer.innerHTML = '';

    // loop through requirements and build the UI
    project.requirements.forEach(req => {
        const reqDiv = document.createElement('div');
        reqDiv.className = 'requirement-item';
        reqDiv.style.marginBottom = '10px';
        reqDiv.style.padding = '10px';
        reqDiv.style.border = '1px solid #ccc';

        reqDiv.innerHTML = `
            <span class="req-text"><strong>${req.text}</strong></span>
            <div style="margin-top: 5px;">
                <button onclick="handleEdit(${req.id}, '${req.text.replace(/'/g, "\\'")}')">Edit</button>
                <button onclick="handleDelete(${req.id})">Delete</button>
            </div>
        `;

        // append to the correct section
        if (req.type === 'Functional') {
            functionalContainer.appendChild(reqDiv);
        } else {
            nonFunctionalContainer.appendChild(reqDiv);
        }
    });

    if (functionalContainer.innerHTML === '') {
        functionalContainer.innerHTML = '<p>No functional requirements added yet.</p>';
    }
    if (nonFunctionalContainer.innerHTML === '') {
        nonFunctionalContainer.innerHTML = '<p>No non-functional requirements added yet.</p>';
    }
}

// Handle Add Requirement
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page refresh

    const text = textInput.value.trim();
    const type = typeInput.value;

    if (text) {
        addRequirement(projectId, text, type);
        textInput.value = ''; // Clear input field
        renderRequirements(); // Refresh the list
    }
});

// Handle Edit Requirement (Exposed to window so inline onclick can read it)
window.handleEdit = function(reqId, currentText) {
    const newText = prompt("Edit your requirement:", currentText);
    
    // Check if user clicked "Cancel" or entered empty text
    if (newText !== null && newText.trim() !== '') {
        updateRequirement(projectId, reqId, { text: newText.trim() });
        renderRequirements(); // Refresh the list
    }
};

// Handle Delete Requirement
window.handleDelete = function(reqId) {
    if (confirm("Are you sure you want to delete this requirement?")) {
        deleteRequirement(projectId, reqId);
        renderRequirements(); // Refresh the list
    }
};

// Initial Render
renderRequirements();
