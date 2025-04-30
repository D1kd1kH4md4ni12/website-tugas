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