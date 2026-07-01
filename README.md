# Project Management System
SWE 4663 Software Project Management Project Group 7

## Tasks
### 1. Projects (General Info)

- Replace the prompt() for creating a project with an actual form (should store new fields as well)
- Add fields: project description, owner/PM name, team members list, risks list with status
- Add ability to edit a project
- Add ability to delete a project
- Clicking a project card on the dashboard should open a project detail page

### 2. Requirements Tracking
- After project is created from previous step, you should be able to click on the project card on the dashboard to open a project detail page with a requirements section

In this page:
- Add/edit/delete functional and non-functional requirements per project
- Requirements should be tied to a specific project by ID
- Save requirements back to store.js (localStorage)

### 3. Effort Logging
- On each requirement, add ability to log hours by category: Requirements Analysis, Design, Coding, Testing, Project Management
- Save effort logging back to store.js

### 4. Effort Reporting

Summary view per project showing:
- Total hours per category across all requirements
- Total hours per requirement across all categories

Could be a section on the project detail page or its own page

### 5. General stuff
- Navigation, every page needs a way to get back to the dashboard
- Make sure everything works (like clicking between pages doesn't break anything)
- Add a getProjectById usage so project detail pages know which project they're viewing (probably URL query like ?id=12345)
