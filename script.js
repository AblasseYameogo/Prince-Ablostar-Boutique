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
const reveals = document.querySelectorAll('.reveal');
const revealOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.15 });

reveals.forEach(reveal => revealOnScroll.observe(reveal));
// Force l'affichage si le JS met du temps
setTimeout(() => { document.querySelectorAll('.reveal').forEach(el => el.classList.add('active')); }, 1000);


// 3. SYSTÈME DE FILTRES DES PRODUITS
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Enlever la classe active de tous les boutons
        filterBtns.forEach(button => button.classList.remove('active'));
        // Ajouter la classe active au bouton cliqué
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        productCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// 4. RECHERCHE EN TEMPS RÉEL
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keyup', () => {
    let filter = searchInput.value.toLowerCase();
    let cards = document.querySelectorAll('.product-card, .projet-code');
    
    cards.forEach(card => {
        let text = card.textContent.toLowerCase();
        card.style.display = text.includes(filter) ? "flex" : "none";
    });
});

// 5. GESTION DU PANIER E-COMMERCE (Le bon !)
let panier = {};

// Écouteur global pour les boutons d'ajout au panier
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
        let nomProduit = e.target.getAttribute('data-name');
        ajouterAuPanier(nomProduit);
    }
});

function ajouterAuPanier(nom) {
    panier[nom] = (panier[nom] || 0) + 1;
    mettreAJourCompteur();
    afficherToast(`${nom} ajouté au panier !`);
}

function retirerDuPanier(nom) {
    delete panier[nom];
    mettreAJourCompteur();
    construireAffichagePanier(); 
}

function mettreAJourCompteur() {
    let total = Object.values(panier).reduce((a, b) => a + b, 0);
    document.getElementById('cart-counter').innerText = total;
    
    // Animation rebond sur l'icône
    const cartBtn = document.getElementById('cartBtn');
    cartBtn.style.transform = "scale(1.1)";
    setTimeout(() => cartBtn.style.transform = "scale(1)", 200);
}

// 6. GESTION DE LA FENÊTRE MODALE (PANIER)
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
        liste.innerHTML = '<p style="text-align:center; color:var(--text-gray); padding: 20px;">Votre panier est vide.</p>';
        return;
    }
    
    for (let produit in panier) {
        liste.innerHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid var(--card-border);">
                <span style="color: var(--text-dark); font-weight: 500;">${produit}</span>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span style="background: var(--bg-light); padding: 5px 10px; border-radius: 10px; color: var(--text-dark);">x${panier[produit]}</span>
                    <button onclick="retirerDuPanier('${produit}')" style="color: var(--accent); cursor: pointer; background: none; border: none; font-size: 1.2rem;"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    }
}

// 7. VALIDATION WHATSAPP
document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (Object.keys(panier).length === 0) { alert("Votre panier est vide !"); return; }
    
    let message = "Salut Prince Ablostar ! 👋\nJe souhaite commander sur ta boutique :\n\n";
    for (let produit in panier) { 
        message += `▪ ${produit} (Quantité: ${panier[produit]})\n`; 
    }
    message += "\nPeux-tu me donner les prix et la disponibilité ? Merci !";
    
    window.open(`https://wa.me/22676604963?text=${encodeURIComponent(message)}`, '_blank');
});

// 8. SYSTÈME DE NOTIFICATION (TOAST)
function afficherToast(msg) {
    const toast = document.getElementById('toastMsg');
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
