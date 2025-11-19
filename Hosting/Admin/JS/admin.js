// JS/admin.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import Chart from "https://cdn.jsdelivr.net/npm/chart.js";

// ==================== Logout ====================
window.logoutUser = async function() {
    try {
        await auth.signOut();
        window.location.href = "../Public/loginpage.html";
    } catch (err) {
        alert("Error logging out: " + err.message);
    }
};

// ==================== Profile Page ====================
const fullnameEl = document.getElementById("fullname");
const emailEl = document.getElementById("email");
const phoneEl = document.getElementById("phone");
const usernameEl = document.getElementById("username");
const topNameEl = document.getElementById("topStudentName");

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "../Public/loginpage.html";
        return;
    }

    // Populate profile info if profile elements exist
    if (fullnameEl && emailEl && phoneEl && usernameEl && topNameEl) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            fullnameEl.textContent = userData.name || "N/A";
            emailEl.textContent = userData.email || user.email;
            phoneEl.textContent = userData.phone || "N/A";
            usernameEl.textContent = userData.email.split("@")[0];
            topNameEl.textContent = userData.name || user.email;
        } else {
            fullnameEl.textContent = "N/A";
            emailEl.textContent = user.email;
            phoneEl.textContent = "N/A";
            usernameEl.textContent = user.email.split("@")[0];
            topNameEl.textContent = user.email;
        }
    }

    // ==================== Dashboard Charts ====================
    const attendanceChartEl = document.getElementById("attendanceChart");
    const gradesChartEl = document.getElementById("gradesChart");
    const pieChartEl = document.getElementById("pieChart");

    if (attendanceChartEl && gradesChartEl && pieChartEl) {
        new Chart(attendanceChartEl, {
            type: "line",
            data: {
                labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                datasets: [{
                    label: "Attendance",
                    data: [90, 85, 95, 92],
                    borderColor: "rgba(75,192,192,1)",
                    tension: 0.3
                }]
            }
        });

        new Chart(gradesChartEl, {
            type: "line",
            data: {
                labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                datasets: [{
                    label: "Grades",
                    data: [78, 82, 88, 91],
                    borderColor: "rgba(255,99,132,1)",
                    tension: 0.3
                }]
            }
        });

        new Chart(pieChartEl, {
            type: "pie",
            data: {
                labels: ["Completed", "Pending", "Overdue"],
                datasets: [{
                    data: [12, 5, 3],
                    backgroundColor: ["#4caf50", "#ff9800", "#f44336"]
                }]
            }
        });
    }
});
