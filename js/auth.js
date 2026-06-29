// auth logic which handles sign up and log in
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('signup-username').value.trim();
        const password = document.getElementById('signup-password').value;
        const errorEl = document.getElementById('signup-error');

        if (findUser(username)) {
            errorEl.textContent = "That username is already taken.";
            return;
        }

        addUser(username, password);
        setCurrentUser(username);
        errorEl.textContent = "";

        // send to the dashboard after signup
        window.location.href = "dashboard.html";
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        const errorEl = document.getElementById('login-error');

        const user = findUser(username);

        if (!user || user.password !== password) {
            errorEl.textContent = "Incorrect username or password.";
            return;
        }

        setCurrentUser(username);
        errorEl.textContent = "";

        window.location.href = "dashboard.html";
    });
}