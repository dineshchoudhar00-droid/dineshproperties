const correctUsername = "dealer";
const correctPassword = "123456";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (
        username === correctUsername &&
        password === correctPassword
    ) {

        // Login successful
        sessionStorage.setItem("dealerLoggedIn", "true");

        window.location.href = "dashboard.html";

    } else {

        document.getElementById("errorMessage").textContent =
            "Invalid username or password!";

    }

});