// ---------------- REGISTER & LOGIN ----------------
document.addEventListener("DOMContentLoaded", () => {

  // ---------------- REGISTER ----------------
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get all input values and trim whitespace
      const name = document.getElementById("regName").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const username = document.getElementById("regUsername").value.trim();
      const phone = document.getElementById("regPhone").value.trim();
      const grade = document.getElementById("regGrade").value.trim();
      const school = document.getElementById("regSchool").value.trim();
      const studentID = document.getElementById("regStudentID").value.trim();
      const password = document.getElementById("regPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      // Check for empty fields
      if (!name || !email || !username || !phone || !grade || !school || !studentID || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
      }

      // Basic email format check
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      // Phone number basic check (digits only)
      if (!/^\d{7,15}$/.test(phone)) {
        alert("Please enter a valid phone number (7-15 digits).");
        return;
      }

      // Password match check
      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      // Optional: password length check
      if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
      }

      // Get existing users from localStorage
      let users = JSON.parse(localStorage.getItem("users")) || [];

      // Check if email already exists (case-insensitive)
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        alert("An account with this email already exists.");
        return;
      }

      // Add new user
      users.push({
        name,
        email,
        username,
        phone,
        grade,
        school,
        studentID,
        password
      });

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
      const message = document.getElementById("loginMessage");

      if (!email || !password) {
        message.textContent = "Please enter both email and password.";
        message.style.color = "red";
        return;
      }

      const users = JSON.parse(localStorage.getItem("users")) || [];

      // Find user by email (case-insensitive) and password
      const user = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        message.textContent = "Login successful! Redirecting...";
        message.style.color = "lightgreen";
        setTimeout(() => {
          window.location.href = "../Admin/dashboard.html"; // adjust path if needed
        }, 1000);
      } else {
        message.textContent = "Invalid email or password.";
        message.style.color = "red";
      }
    });
  }
});
