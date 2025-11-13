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
