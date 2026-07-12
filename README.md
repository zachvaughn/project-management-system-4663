# Project Management System
SWE 4663 Software Project Management Project Group 7

## Tasks
### 1. Projects (done by zach)

- Replace the prompt() for creating a project with an actual form (should store new fields as well)
- Add fields: project description, owner/PM name, team members list, risks list with status
- Add ability to edit a project
- Add ability to delete a project
- Clicking a project card on the dashboard should open a project detail page
- After this info is entered, you should return to dashboard and view the project cards of all created projects

### 2. Requirements Tracking
- After project is created from previous step, you should be able to click on the project card on the dashboard to open a project detail page with a requirements section

In this page:
- Add/edit/delete functional and non-functional requirements per project
- Requirements should be tied to a specific project by ID
- Save requirements back to store.js (localStorage)

### 3. Effort Logging (amber)
- After any requirements are created, you should be able to (in the project detail page for a project):
- Log hours by category, per requirement: Requirements Analysis, Design, Coding, Testing, Project Management
- Save effort logging back to store.js

### 4. Effort Reporting (kayden)
After all the previous steps are done, there will then be the ability to view a summary per project showing:
- Total hours per category across all requirements
- Total hours per requirement across all categories

Should be a section on the project detail page

### 5. General stuff
- Navigation, every page needs a way to get back to the dashboard (so either home button or click text in top left to go back to dashboard)
- Make sure everything works (like clicking between pages doesn't break anything)
- Add a getProjectById usage so project detail pages know which project is being viewed (probably URL query like ?id=12345)
