// === Register User ===
function registerUser(event) {
  event.preventDefault();

  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (!name || !email || !password || !confirmPassword) {
    alert("Please fill in all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.some(u => u.email === email)) {
    alert("User already exists! Please login instead.");
    window.location.href = "loginpage.html";
    return;
  }

  const user = { name, email, password };
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Registration successful! Please login.");
  window.location.href = "loginpage.html";
}

// === Login User ===
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const validUser = users.find(
      (user) => (user.email === username || user.name === username) && user.password === password
    );

    if (validUser) {
      localStorage.setItem("loggedInUser", JSON.stringify(validUser));
      alert(`Welcome back, ${validUser.name}!`);
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid username or password. Please try again.");
    }
  });
});

// === Dashboard Authentication Check ===
function checkLogin() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    window.location.href = "loginpage.html";
  } else {
    const nameEl = document.getElementById("studentName");
    if (nameEl) nameEl.innerText = user.name;
  }
}

// === Logout ===
function logoutUser() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "loginpage.html";
}
