let total = 0, good = 0, bad = 0;
let inspectionInterval;
let screwChart;
let videoStream;

function login() {
	const username = document.getElementById('username').value.trim();
	const password = document.getElementById('password').value.trim();
	
	// Set your desired correct credentials
	const correctUsername = "admin";
	const correctPassword = "1234";
	
	if (username === correctUsername && password === correctPassword) {
	  document.getElementById('login-container').style.display = 'none';
	  document.getElementById('home-container').style.display = 'block';
	  document.getElementById('nav').style.display = 'flex';
	} else {
	  alert("Incorrect username or password!");
	}
  }
  
function showPage(page) {
  ["home", "data", "inspection"].forEach(p => {
    document.getElementById(`${p}-container`).style.display = "none";
  });

  if (page === "inspection") {
    document.getElementById("inspection-container").style.display = "block";
    startCamera();
    startCounting();
  } else {
    stopCounting();
    stopCamera();
    document.getElementById(`${page}-container`).style.display = "block";

    if (page === "data") {
      updateChart();
    }
  }
}

async function startCamera() {
  try {
    const video = document.getElementById('live-video');
    videoStream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { ideal: 640 },
        height: { ideal: 360 },
        facingMode: 'environment' 
      } 
    });
    video.srcObject = videoStream;
  } catch (err) {
    console.error("Error accessing camera:", err);
    document.getElementById('video').innerHTML = 
      '<p style="color: white; text-align: center; line-height: 360px;">Camera not available</p>';
  }
}

function stopCamera() {
  if (videoStream) {
    videoStream.getTracks().forEach(track => track.stop());
  }
}

function logout() {
  stopCounting();
  stopCamera();
  total = good = bad = 0;
  updateCounts();
  document.getElementById("login-container").style.display = "block";
  ["home", "data", "inspection"].forEach(p => {
    document.getElementById(`${p}-container`).style.display = "none";
  });
  document.getElementById("nav").style.display = "none";
}

function updateCounts() {
  document.getElementById("total-count").innerText = total;
  document.getElementById("good-count").innerText = good;
  document.getElementById("bad-count").innerText = bad;
}

function startCounting() {
  inspectionInterval = setInterval(() => {
    const newScrews = Math.floor(Math.random() * 5) + 1;
    const newBad = Math.floor(Math.random() * (newScrews + 1));
    const newGood = newScrews - newBad;

    total += newScrews;
    good += newGood;
    bad += newBad;

    updateCounts();
  }, 1000);
}

function stopCounting() {
  clearInterval(inspectionInterval);
}

function updateChart() {
  const ctx = document.getElementById('screwChart').getContext('2d');

  if (screwChart) screwChart.destroy();

  screwChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Total Screws', 'Good Screws', 'Defective Screws'],
      datasets: [{
        label: 'Screw Count',
        data: [total, good, bad],
        backgroundColor: ['#0055aa', '#22bb33', '#cc0000']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Screw Inspection Summary'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      }
    }
  });
}

// Time Functionality
function showTime() {
  document.getElementById('currentTime').innerHTML = new Date().toLocaleString();
}
showTime();
setInterval(showTime, 1000);
