document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if(user && user.name){
    document.getElementById("topStudentName").textContent = user.name;
  } else {
    window.location.href = "../Public/loginpage.html";
  }
  initCharts();
});

function logoutUser() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "../Public/loginpage.html";
}

function initCharts() {
  const labels = ["Week 1","Week 2","Week 3","Week 4","Week 5"];
  const attendanceData = {
    labels: labels,
    datasets: [{
      label:"Attendance %",
      data:[90,92,85,95,88],
      borderColor:"#F3CBA0",
      backgroundColor:"rgba(243,203,160,0.15)",
      tension:0.25, fill:true, pointRadius:3, pointHoverRadius:5
    }]
  };
  const gradesData = {
    labels: labels,
    datasets: [{
      label:"Grades",
      data:[80,85,78,90,88],
      borderColor:"#F3CBA0",
      backgroundColor:"rgba(243,203,160,0.15)",
      tension:0.25, fill:true, pointRadius:3, pointHoverRadius:5
    }]
  };
  const pieData = {
    labels:["Submitted On Time","Due","Late/Not Submitted"],
    datasets:[{
      data:[5,2,1],
      backgroundColor:["#F3CBA0","#8E8B82","#343434"],
      borderWidth:0
    }]
  };
  const commonOptions = {
    responsive:true,
    maintainAspectRatio:false,
    plugins:{ legend:{ labels:{ color:"#F3F3F3" } }, tooltip:{ mode:"index", intersect:false } },
    scales:{ x:{ ticks:{ color:"#8E8B82" }, grid:{ color:"rgba(142,139,130,0.08)" } },
             y:{ beginAtZero:true, max:100, ticks:{ color:"#8E8B82" }, grid:{ color:"rgba(142,139,130,0.08)" } } }
  };
  const attendanceCanvas = document.getElementById("attendanceChart");
  if(attendanceCanvas){ new Chart(attendanceCanvas.getContext("2d"), { type:"line", data:attendanceData, options:commonOptions }); }
  const gradesCanvas = document.getElementById("gradesChart");
  if(gradesCanvas){ new Chart(gradesCanvas.getContext("2d"), { type:"line", data:gradesData, options:JSON.parse(JSON.stringify(commonOptions)) }); }
  const pieCanvas = document.getElementById("pieChart");
  if(pieCanvas){ new Chart(pieCanvas.getContext("2d"), { type:"pie", data:pieData, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:"bottom", labels:{ color:"#F3F3F3", padding:14 } } } } }); }
}

const uploadArea = document.getElementById("uploadArea");
const fileInput = document.getElementById("fileInput");
const progressContainer = document.querySelector(".progress-container");
const progressBar = document.getElementById("progressBar");
const uploadMessage = document.getElementById("uploadMessage");
const uploadedTableBody = document.querySelector("#uploadedTable tbody");

uploadArea.addEventListener("click", () => fileInput.click());
uploadArea.addEventListener("dragover", (e) => { e.preventDefault(); uploadArea.classList.add("dragover"); });
uploadArea.addEventListener("dragleave", () => uploadArea.classList.remove("dragover"));
uploadArea.addEventListener("drop", (e) => { e.preventDefault(); uploadArea.classList.remove("dragover"); handleFiles(e.dataTransfer.files); });
fileInput.addEventListener("change", (e) => handleFiles(e.target.files));

function handleFiles(files) {
  if (!files.length) return;
  Array.from(files).forEach(file => uploadSingleFile(file));
}

function uploadSingleFile(file) {
  progressContainer.style.display = "block";
  progressBar.style.width = "0%";
  uploadMessage.textContent = "";
  const fakeUpload = setInterval(() => {
    let currentWidth = parseFloat(progressBar.style.width);
    if (currentWidth >= 100) {
      clearInterval(fakeUpload);
      addFileToTable(file);
      uploadMessage.textContent = `${file.name} uploaded successfully!`;
      progressBar.style.width = "0%";
      progressContainer.style.display = "none";
    } else {
      progressBar.style.width = `${currentWidth + 20}%`;
    }
  }, 100);
}

function addFileToTable(file) {
  const row = document.createElement("tr");
  const today = new Date().toLocaleDateString();
  const user = JSON.parse(localStorage.getItem("loggedInUser")) || { name: "Admin" };
  row.innerHTML = `
    <td>${file.name}</td>
    <td>${(file.size / 1024).toFixed(2)} KB</td>
    <td>${document.getElementById("fileCategory").value}</td>
    <td>${today}</td>
    <td>${user.name}</td>
    <td><button onclick="downloadFile('${file.name}')">Download</button></td>
  `;
  uploadedTableBody.appendChild(row);
}

function downloadFile(filename) {
  alert(`Downloading ${filename} (replace with real server download).`);
}

// --- Authentication Check ---
if (!localStorage.getItem("loggedInUser")) {
    window.location.href = "../Public/loginpage.html";
}

// --- IndexedDB Setup ---
let db;
const request = indexedDB.open("EduTrackDB", 1);

request.onupgradeneeded = function (event) {
    db = event.target.result;

    if (!db.objectStoreNames.contains("users")) {
        db.createObjectStore("users", { keyPath: "username" });
    }
};

request.onsuccess = function (event) {
    db = event.target.result;
    loadProfileData();
};

// --- Load Data Into Profile Page ---
function loadProfileData() {
    const username = localStorage.getItem("loggedInUser");

    const tx = db.transaction("users", "readonly");
    const store = tx.objectStore("users");
    const request = store.get(username);

    request.onsuccess = function () {
        const user = request.result;

        document.getElementById("username").value = user.username;
        document.getElementById("fullname").value = user.fullname;
        document.getElementById("email").value = user.email;
        document.getElementById("phone").value = user.phone;
    };
}

// --- Save Changes ---
document.getElementById("profileForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const updatedUser = {
        username: document.getElementById("username").value,
        fullname: document.getElementById("fullname").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        password: document.getElementById("password").value.trim()
    };

    const tx = db.transaction("users", "readwrite");
    const store = tx.objectStore("users");

    store.put(updatedUser);

    tx.oncomplete = function () {
        document.getElementById("saveMessage").textContent = "Profile updated successfully!";
    };
});

// --- Logout Button ---
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
});
