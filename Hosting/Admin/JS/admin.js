// ------------------------------
// AUTH + PROFILE LOAD (FIREBASE)
// ------------------------------

import { auth, db } from "../Public/JS/firebase-init.js";
import { onAuthStateChanged, updateEmail, updatePassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Wait until page is ready
document.addEventListener("DOMContentLoaded", () => {
  
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "../Public/loginpage.html";
      return;
    }

    // Display name at top right
    document.getElementById("topStudentName").textContent = data.fullname || data.username || "Student";

    const uid = user.uid;
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();

      // Fill the profile fields
      document.getElementById("fullname").value = data.fullname || "";
      document.getElementById("username").value = data.username || "";
      document.getElementById("email").value = data.email || "";
      document.getElementById("phone").value = data.phone || "";

      // Set top name
      document.getElementById("topStudentName").textContent = data.fullname || data.username || "Student";
    }

    initCharts();
  });

});


// ------------------------------
// LOGOUT
// ------------------------------
function logoutUser() {
  auth.signOut().then(() => {
    window.location.href = "../Public/loginpage.html";
  });
}
window.logoutUser = logoutUser;


// ------------------------------
// SAVE PROFILE CHANGES
// ------------------------------
document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  const uid = user.uid;

  const updatedFullname = document.getElementById("fullname").value;
  const updatedEmail = document.getElementById("email").value;
  const updatedPhone = document.getElementById("phone").value;
  const newPassword = document.getElementById("password").value.trim();

  try {
    const userRef = doc(db, "users", uid);

    // Save Firestore profile data
    await updateDoc(userRef, {
      fullname: updatedFullname,
      email: updatedEmail,
      phone: updatedPhone,
      username: updatedEmail.split("@")[0]
    });

    // Update Firebase Auth email
    if (updatedEmail !== user.email) {
      await updateEmail(user, updatedEmail);
    }

    // Update Firebase Auth password
    if (newPassword.length > 0) {
      await updatePassword(user, newPassword);
    }

    document.getElementById("saveMessage").textContent = "Profile updated successfully!";

  } catch (error) {
    alert(error.message);
  }
});


// ------------------------------
// CHARTS (UNCHANGED)
// ------------------------------
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
    scales:{ 
      x:{ ticks:{ color:"#8E8B82" }, grid:{ color:"rgba(142,139,130,0.08)" } },
      y:{ beginAtZero:true, max:100, ticks:{ color:"#8E8B82" }, grid:{ color:"rgba(142,139,130,0.08)" } }
    }
  };

  const attendanceCanvas = document.getElementById("attendanceChart");
  if(attendanceCanvas){ 
    new Chart(attendanceCanvas.getContext("2d"), { type:"line", data:attendanceData, options:commonOptions }); 
  }

  const gradesCanvas = document.getElementById("gradesChart");
  if(gradesCanvas){ 
    new Chart(gradesCanvas.getContext("2d"), { type:"line", data:gradesData, options:JSON.parse(JSON.stringify(commonOptions)) }); 
  }

  const pieCanvas = document.getElementById("pieChart");
  if(pieCanvas){ 
    new Chart(pieCanvas.getContext("2d"), { type:"pie", data:pieData, options:{ 
      responsive:true, 
      maintainAspectRatio:false, 
      plugins:{ legend:{ position:"bottom", labels:{ color:"#F3F3F3", padding:14 } } }
    }}); 
  }
}


// ------------------------------
// UPLOAD SYSTEM (UNCHANGED)
// ------------------------------
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

  row.innerHTML = `
    <td>${file.name}</td>
    <td>${(file.size / 1024).toFixed(2)} KB</td>
    <td>${document.getElementById("fileCategory").value}</td>
    <td>${today}</td>
    <td>${auth.currentUser.displayName || "Student"}</td>
    <td><button onclick="downloadFile('${file.name}')">Download</button></td>
  `;

  uploadedTableBody.appendChild(row);
}

function downloadFile(filename) {
  alert(`Downloading ${filename} (replace with real server download).`);
}
