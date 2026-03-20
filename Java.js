// 1. GESTION DU MODE SOMBRE
const themeBtn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeBtn.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    let newTheme = theme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeBtn.innerHTML = '<i class="fas fa-sun" style="color: #fbbf24;"></i>';
    } else {
        themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// 2. ANIMATIONS AU DÉFILEMENT (INTERSECTION OBSERVER)
// C'est ce qui impressionne les recruteurs !
const reveals = document.querySelectorAll('.reveal');

const revealOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.15 });

reveals.forEach(reveal => revealOnScroll.observe(reveal));

// 3. RECHERCHE EN TEMPS RÉEL
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keyup', () => {
    let filter = searchInput.value.toLowerCase();
    let cards = document.querySelectorAll('.produit-card, .projet-code');
    
    cards.forEach(card => {
        let text = card.textContent.toLowerCase();
        card.style.display = text.includes(filter) ? "" : "none";
    });
});

// 4. GESTION DU PANIER E-COMMERCE
let panier = {};

// Écouteurs d'événements pour les boutons d'ajout
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        let nomProduit = e.target.closest('.add-to-cart').dataset.name;
        ajouterAuPanier(nomProduit);
    });
});

function ajouterAuPanier(nom) {
    panier[nom] = (panier[nom] || 0) + 1;
    mettreAJourCompteur();
    afficherToast(`${nom} ajouté !`);
}

function retirerDuPanier(nom) {
    delete panier[nom];
    mettreAJourCompteur();
    construireAffichagePanier(); 
}

function mettreAJourCompteur() {
    let total = Object.values(panier).reduce((a, b) => a + b, 0);
    document.getElementById('cart-counter').innerText = total;
}

// 5. GESTION DE LA FENÊTRE MODALE (PANIER)
const overlay = document.getElementById('overlay');
const cartModal = document.getElementById('cartModal');

document.getElementById('cartBtn').addEventListener('click', () => {
    construireAffichagePanier();
    overlay.classList.add('active');
    cartModal.classList.add('active');
});

const fermerPanier = () => {
    overlay.classList.remove('active');
    cartModal.classList.remove('active');
};

document.getElementById('closeCart').addEventListener('click', fermerPanier);
overlay.addEventListener('click', fermerPanier);

function construireAffichagePanier() {
    const liste = document.getElementById('cartItemsList');
    liste.innerHTML = ''; 
    
    if (Object.keys(panier).length === 0) {
        liste.innerHTML = '<p style="text-align:center; color:var(--text-gray);">Votre panier est vide.</p>';
        return;
    }
    
    for (let produit in panier) {
        liste.innerHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--card-border);">
                <span class="item-name" style="color: var(--text-dark);">${produit}</span>
                <span style="background: var(--bg-light); padding: 2px 8px; border-radius: 10px; color: var(--text-dark);">x${panier[produit]}</span>
                <button onclick="retirerDuPanier('${produit}')" style="color: var(--accent); cursor: pointer; background: none; border: none; font-size: 1.2rem;"><i class="fas fa-trash"></i></button>
            </div>
        `;
    }
}

// 6. VALIDATION WHATSAPP
document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (Object.keys(panier).length === 0) { alert("Votre panier est vide !"); return; }
    
    let message = "Bonjour Prince Ablostar ! Je souhaite commander :\n\n";
    for (let produit in panier) { message += `▪ ${produit} (x${panier[produit]})\n`; }
    message += "\nPouvez-vous me donner les prix ? Merci !";
    
    window.open(`https://wa.me/22676604963?text=${encodeURIComponent(message)}`, '_blank');
});

// 7. SYSTÈME DE NOTIFICATION (TOAST)
function afficherToast(msg) {
    const toast = document.getElementById('toastMsg');
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
