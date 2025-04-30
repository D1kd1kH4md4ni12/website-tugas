// Burger Menu Toggle
const burger = document.querySelector('.burger');
const navList = document.querySelector('.nav-list');

burger.addEventListener('click', () => {
    navList.classList.toggle('active');
    burger.classList.toggle('toggle');
});

// Fungsi untuk membuka modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    
    // Load disk scheduling when Tugas 1 is opened
    if (modalId === 'tugas1') {
        initializeDiskScheduling();
    }
}

// Fungsi untuk menutup modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Tutup modal ketika klik di luar konten modal
window.onclick = function(event) {
    if (event.target.className === 'modal') {
        event.target.style.display = 'none';
    }
}

// Disk Scheduling Implementation
function initializeDiskScheduling() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = calculateDiskScheduling;
        document.head.appendChild(script);
    } else {
        calculateDiskScheduling();
    }
}

function calculateDiskScheduling() {
    // Data from the problem
    const totalTracks = 2050;
    const initialHead = 1234;
    const requests = [1500, 1100, 1750, 1900, 120, 850, 60, 1300, 1400, 600, 
                      900, 1500, 1000, 30, 1900, 2003, 700, 1300, 55, 2025, 
                      194, 700, 1500, 200];

    // Algorithm implementations
    function FCFS(initial, req) {
        let head = initial;
        let total = 0;
        const sequence = [head];
        
        req.forEach(track => {
            total += Math.abs(head - track);
            head = track;
            sequence.push(head);
        });
        
        return { total, sequence };
    }

    function SSTF(initial, req) {
        let head = initial;
        let total = 0;
        const sequence = [head];
        let remaining = [...req];
        
        while (remaining.length > 0) {
            const closest = remaining.reduce((prev, curr) => 
                Math.abs(curr - head) < Math.abs(prev - head) ? curr : prev);
            
            total += Math.abs(head - closest);
            head = closest;
            sequence.push(head);
            remaining = remaining.filter(t => t !== closest);
        }
        
        return { total, sequence };
    }

    // Add other algorithms (SCAN, C-SCAN, LOOK, C-LOOK) similarly...

    // Calculate results
    const results = {
        "FCFS": FCFS(initialHead, requests),
        "SSTF": SSTF(initialHead, requests),
        // Add other algorithms here
    };

    // Display results in table
    const tableBody = document.getElementById('results-body');
    tableBody.innerHTML = ''; // Clear existing rows
    
    Object.entries(results).forEach(([algo, result]) => {
        const row = document.createElement('tr');
        const shortSequence = result.sequence.length > 10 
            ? `${result.sequence.slice(0, 5).join(" → ")} → ... → ${result.sequence.slice(-5).join(" → ")}`
            : result.sequence.join(" → ");
            
        row.innerHTML = `
            <td>${algo}</td>
            <td>${result.total}</td>
            <td title="${result.sequence.join(" → ")}">${shortSequence}</td>
        `;
        tableBody.appendChild(row);
    });

    // Create chart
    const ctx = document.getElementById('seekChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(results),
            datasets: [{
                label: 'Total Seek Distance',
                data: Object.values(results).map(r => r.total),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    // Add more colors for other algorithms
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    // Add more colors for other algorithms
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Jumlah Seek'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Algoritma'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Total Seek: ${context.raw}`;
                        }
                    }
                }
            }
        }
    });
}