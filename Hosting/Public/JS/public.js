// ---------------- REGISTER ----------------
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("regName").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const password = document.getElementById("regPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (!name || !email || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      let users = JSON.parse(localStorage.getItem("users")) || [];
      const existingUser = users.find((u) => u.email === email);

      if (existingUser) {
        alert("An account with this email already exists.");
        return;
      }

      users.push({ name, email, password });
      localStorage.setItem("users", JSON.stringify(users));

      alert("Account created successfully!");
      window.location.href = "loginpage.html";
    });
  }

  // ---------------- LOGIN ----------------
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;
      const users = JSON.parse(localStorage.getItem("users")) || [];

      const user = users.find((u) => u.email === email && u.password === password);
      const message = document.getElementById("loginMessage");

      if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        message.textContent = "Login successful! Redirecting...";
        message.style.color = "lightgreen";
        setTimeout(() => {
          window.location.href = "../Admin/dashboard.html";
        }, 1000);
      } else {
        message.textContent = "Invalid email or password.";
        message.style.color = "red";
      }
    });
  }
});
