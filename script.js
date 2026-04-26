// --- 1. INIT AOS (ANIMATION LIBRARY) ---
AOS.init({ once: true, offset: 50, duration: 1000, easing: 'ease-out-cubic' });

// --- 2. PERSONALISASI NAMA (URL PARAMETER) ---
const urlParams = new URLSearchParams(window.location.search);
const guestName = urlParams.get('to');

if (guestName) {
    const decodedName = decodeURIComponent(guestName);
    const nameElement = document.getElementById('guestNameDisplay');
    
    if (nameElement) {
        nameElement.innerText = decodedName;
        nameElement.style.transition = "all 0.5s ease";
        nameElement.style.transform = "scale(1.1)";
        setTimeout(() => { nameElement.style.transform = "scale(1)"; }, 500);
    }
    
    document.title = "Undangan untuk " + decodedName + " | Arman & Sari";
}

// --- 3. LOGIC OPENING COVER & INIT MAP ---
function openInvitation() {
    const body = document.body;
    const overlay = document.getElementById('opening-overlay');
    const navbar = document.getElementById('navbar');
    const musicBtn = document.getElementById('musicBtn');
    
    body.classList.remove("locked");
    overlay.classList.add('hide-overlay');
    
    setTimeout(() => {
        navbar.classList.add('visible');
        musicBtn.classList.add('visible');
        initMap();
    }, 500);

    playMusic();
}

// --- 4. COPY REKENING (FUNGSI UNIVERSAL UNTUK BCA) ---
function copyToClipboard(text, btnElement) {
    navigator.clipboard.writeText(text).then(() => {
        const originalHTML = btnElement.innerHTML;
        
        btnElement.innerHTML = '<i class="fas fa-check"></i> Tersalin';
        btnElement.classList.add('copied');

        const toast = document.getElementById("toast");
        if(toast) {
            toast.innerText = "Nomor Rekening Berhasil Disalin!";
            toast.className = "show";
        }

        setTimeout(() => {
            btnElement.innerHTML = originalHTML;
            btnElement.classList.remove('copied');
            if(toast) toast.className = toast.className.replace("show", "");
        }, 2000);
    }).catch(err => {
        console.error('Gagal menyalin: ', err);
        alert("Gagal menyalin otomatis. Silakan blok dan copy manual: " + text);
    });
}

// --- 5. PETA LEAFLET ---
let map;

function initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement || map) return;

    const lat = -7.004227;
    const lng = 106.590067;

    map = L.map('map', {
        attributionControl: false
    }).setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const iconLokasi = L.icon({
        iconUrl: 'https://i.imgur.com/QJHCWmN.jpeg',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -30]
    });

    const marker = L.marker([lat, lng], { icon: iconLokasi }).addTo(map);

    marker.bindPopup(`
        <div style="text-align:center; font-family: Arial, sans-serif; line-height:1.5;">
            <strong>Resepsi Pernikahan</strong><br>
            Jl. Babakan Peundeuy<br>
            <small>Desa Citarik, Palabuhanratu</small><br><br>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" 
               target="_blank" 
               style="padding:6px 10px; background:#2c7be5; color:#fff; text-decoration:none; border-radius:6px; font-size:12px;">
               Petunjuk Arah
            </a>
        </div>
    `).openPopup();
}

// --- 6. MENU & SCROLL SPY ---
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const body = document.body;
    
    const isActive = mobileMenu.classList.toggle('active');
    hamburger.classList.toggle('active');

    if (isActive) {
        body.classList.add('locked');
    } else {
        body.classList.remove('locked');
    }
}

const sections = document.querySelectorAll("section, header");
const navLinks = document.querySelectorAll(".nav-link, .mobile-menu a");

const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.remove("active-link");
                if(link.classList.contains('nav-link')) link.classList.remove("active");
            });

            const id = entry.target.getAttribute("id");
            const activeLink = document.querySelector(`.nav-link[href="#${id}"], .mobile-menu a[href="#${id}"]`);
            
            if(activeLink) {
                if(activeLink.classList.contains('nav-link')) {
                    activeLink.classList.add("active");
                } else {
                    activeLink.classList.add("active-link");
                }
            }
        }
    });
}, observerOptions);

sections.forEach((section) => {
    observer.observe(section);
});

window.addEventListener("scroll", () => {
    const backToTop = document.getElementById('backToTop');
    if(window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- 7. LOGIC MUSIK ---
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
let isPlaying = false;

function playMusic() {
    if(!bgMusic) return;
    
    var playPromise = bgMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            musicBtn.classList.add('playing');
            musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
            isPlaying = true;
        })
        .catch(error => {
            console.log("Autoplay dicegah browser. User harus klik tombol musik manual.");
        });
    }
}

function toggleMusic() {
    if(!bgMusic) return;

    if (isPlaying) { 
        bgMusic.pause(); 
        musicBtn.classList.remove('playing'); 
        musicBtn.innerHTML = '<i class="fas fa-music"></i>'; 
    } else { 
        bgMusic.play(); 
        musicBtn.classList.add('playing'); 
        musicBtn.innerHTML = '<i class="fas fa-pause"></i>'; 
    }
    isPlaying = !isPlaying;
}

// --- 8. COUNTDOWN TIMER ---
const weddingDate = new Date("2026-05-24T08:00:00+07:00").getTime();

const countdownFunction = setInterval(function() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
        clearInterval(countdownFunction);
        const message = "<div style='font-size:1rem;color:white; text-align:center; width:100%'>💍 Acara Telah Dimulai</div>";
        const elDays = document.getElementById("days");
        if(elDays) elDays.parentElement.parentElement.innerHTML = message;
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const d = days < 10 ? '0' + days : days;
    const h = hours < 10 ? '0' + hours : hours;
    const m = minutes < 10 ? '0' + minutes : minutes;
    const s = seconds < 10 ? '0' + seconds : seconds;

    const elDays = document.getElementById("days");
    const elHours = document.getElementById("hours");
    const elMins = document.getElementById("minutes");
    const elSecs = document.getElementById("seconds");

    if(elDays) elDays.innerText = d;
    if(elHours) elHours.innerText = h;
    if(elMins) elMins.innerText = m;
    if(elSecs) elSecs.innerText = s;
}, 1000);

// --- 9. MODAL & RSVP ---
const modal = document.getElementById('rsvpModal');

function openModal() { 
    if(modal) modal.classList.add('show'); 
    
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');
    
    if(mobileMenu && mobileMenu.classList.contains('active')){
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.classList.remove('locked');
    }
} 

function closeModal() { 
    if(modal) modal.classList.remove('show'); 
}

window.onclick = function(event) { 
    if (event.target == modal) {
        closeModal();
    }
}

function updateCharCounter(textarea) {
    const counter = document.getElementById("charCounter");
    if(counter) {
        counter.innerText = textarea.value.length + "/500";
    }
}

function submitForm(event) {
    event.preventDefault();
    
    const form = document.getElementById("rsvpForm");
    if(!form) return;
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    submitBtn.disabled = true;
    
    const formData = new FormData(form);
    const data = {
        _subject: "[UNDANGAN] RSVP Baru dari " + (formData.get('nama') || 'Tamu'),
        _template: "table",
        _captcha: "false",
        timestamp: new Date().toLocaleString('id-ID', { 
            timeZone: 'Asia/Jakarta',
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        }),
        nama: formData.get('nama') || '',
        jumlah_tamu: formData.get('jumlah_tamu') || '1',
        konfirmasi: formData.get('konfirmasi') || 'hadir',
        ucapan: formData.get('ucapan') || '',
        source: 'Undangan Pernikahan Arman & Sari'
    };
    
    console.log('📤 Mengirim RSVP:', data);
    
    // GANTI URL INI DENGAN URL EMAIL KLIEN ANDA (BACA CATATAN DI BAWAH)
    const EMAIL_URL = "https://formsubmit.co/ajax/hsarihesti@gmail.com"; 
    
    fetch(EMAIL_URL, {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(() => {
        closeModal();
        
        const toast = document.getElementById("toast");
        if(toast) {
            toast.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <i class="fas fa-check-circle" style="font-size: 1.2rem; margin-right: 10px; color: #2ecc71;"></i>
                    <div>
                        <strong>Terima kasih, ${data.nama}!</strong><br>
                        <small>RSVP Anda telah tercatat</small>
                    </div>
                </div>
            `;
            toast.className = "show success";
        }
        
        form.reset();
        updateCharCounter(document.querySelector('textarea'));
        
        try {
            const rsvpHistory = JSON.parse(localStorage.getItem('amuy_intan_rsvp') || '[]');
            rsvpHistory.push({ ...data, localTimestamp: new Date().toISOString() });
            localStorage.setItem('amuy_intan_rsvp', JSON.stringify(rsvpHistory));
            updateRSVPCounter();
        } catch(e) { console.warn("Storage penuh/error", e); }
        
        setTimeout(() => {
            if(toast) toast.className = toast.className.replace("show", "");
        }, 5000);
    })
    .catch(err => {
        console.error('❌ Error mengirim RSVP:', err);
        
        const toast = document.getElementById("toast");
        if(toast) {
            toast.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 1.2rem; margin-right: 10px; color: #f39c12;"></i>
                    <div>
                        <strong>Koneksi gagal</strong><br>
                        <small>Silakan coba lagi beberapa saat.</small>
                    </div>
                </div>
            `;
            toast.className = "show warning";
        }
        
        closeModal();
        
        setTimeout(() => {
            if(toast) toast.className = toast.className.replace("show", "");
        }, 5000);
    })
    .finally(() => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    });
}

function updateRSVPCounter() {
    const counterElement = document.getElementById('rsvpCounter');
    if (counterElement) {
        let total = 0;
        try {
            const rsvpHistory = JSON.parse(localStorage.getItem('amuy_intan_rsvp') || '[]');
            total = rsvpHistory.length;
        } catch(e){}
        
        counterElement.textContent = total > 0 ? `${total}+ tamu sudah konfirmasi` : '';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    updateRSVPCounter();
    
    const namaFromUrl = urlParams.get('to');
    if (namaFromUrl) {
        const namaField = document.querySelector('input[name="nama"]');
        if (namaField) {
            namaField.value = decodeURIComponent(namaFromUrl);
        }
    }
});
