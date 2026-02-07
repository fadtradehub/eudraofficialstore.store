// ==========================================
// 1. SETTINGAN WEBSITE
// ==========================================
const config = {
    // LINK PEMBAYARAN MIDTRANS
    linkPayment: "https://app.sandbox.midtrans.com/payment-links/eudrafashion",

    // WAKTU MULAI WAR
    // Format: Tahun-Bulan-Tanggal Jam:Menit:Detik
    waktuMulai: "2026-02-07 00:00:00", 
    
    // INFO PRODUK
    nama: "EUDRA CHAOS V1",
    harga: "Rp 185.000",
    stokAwal: 1, 
    
    // GAMBAR PRODUK (Link PostImages Mas)
    gambar: "https://i.postimg.cc/pdKSTntv/baju.png"
};

// ==========================================
// 2. LOGIKA SYSTEM (JANGAN DIUBAH)
// ==========================================
let stok = config.stokAwal;
let intervalTimer;

// Set Tampilan Awal
document.getElementById('productImage').src = config.gambar;
document.getElementById('productName').innerText = config.nama;
document.getElementById('productPrice').innerText = config.harga;
document.getElementById('stockDisplay').innerText = stok;

function startSystem() {
    intervalTimer = setInterval(hitungMundur, 10);
}

function hitungMundur() {
    const sekarang = new Date().getTime();
    const target = new Date(config.waktuMulai).getTime();
    const sisa = target - sekarang;

    if (sisa > 0) {
        const jam = Math.floor((sisa / (1000 * 60 * 60)));
        const menit = Math.floor((sisa % (1000 * 60 * 60)) / (1000 * 60));
        const detik = Math.floor((sisa % (1000 * 60)) / 1000);
        const mili = Math.floor((sisa % 1000) / 10);
        document.getElementById('t-jam').innerText = jam.toString().padStart(2, '0');
        document.getElementById('t-menit').innerText = menit.toString().padStart(2, '0');
        document.getElementById('t-detik').innerText = detik.toString().padStart(2, '0');
        document.getElementById('t-mili').innerText = mili.toString().padStart(2, '0');
    } else {
        clearInterval(intervalTimer);
        document.getElementById('waitingRoom').style.display = 'none';
        document.getElementById('shopPage').classList.remove('hidden');
    }
}

// === FUNGSI UTAMA BELI ===
function kunciSlot() {
    if (stok <= 0) return;

    const btn = document.getElementById('btnBeli');
    
    // 1. Kunci tombol
    btn.disabled = true;
    btn.innerText = "MENUJU PEMBAYARAN...";
    
    // 2. Kurangi Stok
    stok--; 
    updateTampilanStok();

    // 3. Redirect ke Midtrans (Di Tab Sama)
    setTimeout(() => {
        window.location.href = config.linkPayment;
    }, 500);
}

// === FUNGSI UPDATE TAMPILAN STOK ===
function updateTampilanStok() {
    document.getElementById('stockDisplay').innerText = stok;
    const persen = (stok / config.stokAwal) * 100;
    document.getElementById('stockBar').style.width = persen + "%";
    
    // JIKA STOK HABIS (0)
    if (stok === 0) {
        document.getElementById('btnBeli').classList.add('hidden');
        document.getElementById('msgHabis').classList.remove('hidden');
        document.getElementById('overlaySold').classList.remove('hidden');
    }
}

// === ADMIN PANEL (Klik Logo 5x) ===
let klikLogo = 0;
document.getElementById('logoBrand').addEventListener('click', () => {
    klikLogo++;
    if (klikLogo === 5) {
        document.getElementById('adminPanel').classList.remove('hidden');
        document.getElementById('adminPanel').classList.add('flex');
        document.getElementById('inputStok').value = stok;
        klikLogo = 0;
    }
});

function simpanAdmin() {
    const val = document.getElementById('inputStok').value;
    if(val !== "") {
        stok = parseInt(val);
        config.stokAwal = stok;
        updateTampilanStok();
        
        if(stok > 0) {
            document.getElementById('btnBeli').classList.remove('hidden');
            document.getElementById('btnBeli').disabled = false;
            document.getElementById('btnBeli').innerText = "AMANKAN SLOT";
            document.getElementById('msgHabis').classList.add('hidden');
            document.getElementById('overlaySold').classList.add('hidden');
        }
    }
    tutupAdmin();
}

function tutupAdmin() {
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('flex');
}

startSystem();