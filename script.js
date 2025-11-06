// Game State
let sesterces = parseInt(localStorage.getItem('sesterces')) || 50;
let lampLit = false;

// DOM Elements
const balanceElement = document.getElementById('balance');
const offeringButtons = document.querySelectorAll('.offering-btn');
const liquidElement = document.getElementById('liquid');
const flameElement = document.getElementById('flame');
const smokeElement = document.getElementById('smoke');
const fruitElement = document.getElementById('fruit');
const saltElement = document.getElementById('salt');
const buyButton = document.getElementById('buy-btn');
const modal = document.getElementById('buy-modal');
const closeModal = document.querySelector('.close');
const packButtons = document.querySelectorAll('.pack-btn');

// Initialize
updateBalance();

// Offering Buttons
offeringButtons.forEach(button => {
    button.addEventListener('click', function() {
        const offeringType = this.dataset.type;
        const cost = parseInt(this.dataset.cost);
        
        makeOffering(offeringType, cost);
    });
});

// Make Offering
function makeOffering(type, cost) {
    if (sesterces < cost) {
        alert('Not enough sesterces! Purchase more to make this offering.');
        return;
    }
    
    // Deduct cost
    sesterces -= cost;
    updateBalance();
    saveGame();
    
    // Handle different offering types
    switch(type) {
        case 'wine':
            offerWine();
            break;
        case 'water':
            offerWater();
            break;
        case 'light':
            lightLamp();
            break;
        case 'incense':
            offerIncense();
            break;
        case 'fruit':
            offerFruit();
            break;
        case 'salt':
            offerSalt();
            break;
    }
    
    // Visual feedback
    const button = document.querySelector(`[data-type="${type}"]`);
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 200);
}

// Offering Animations
function offerWine() {
    liquidElement.className = 'liquid wine';
    liquidElement.style.height = '70%';
    
    setTimeout(() => {
        liquidElement.style.height = '0%';
    }, 5000);
}

function offerWater() {
    liquidElement.className = 'liquid water';
    liquidElement.style.height = '60%';
    
    setTimeout(() => {
        liquidElement.style.height = '0%';
    }, 4000);
}

function lightLamp() {
    if (!lampLit) {
        flameElement.classList.add('lit');
        lampLit = true;
        
        // Lamp stays lit for 1 hour (or until page refresh for demo)
        setTimeout(() => {
            flameElement.classList.remove('lit');
            lampLit = false;
        }, 3600000); // 1 hour
    } else {
        // Extend lamp time
        flameElement.classList.add('lit');
    }
}

function offerIncense() {
    smokeElement.classList.add('active');
    
    setTimeout(() => {
        smokeElement.classList.remove('active');
    }, 4000);
}

function offerFruit() {
    fruitElement.textContent = '🍎';
    fruitElement.classList.add('active');
    
    setTimeout(() => {
        fruitElement.classList.remove('active');
    }, 3000);
}

function offerSalt() {
    saltElement.textContent = '🧂';
    saltElement.classList.add('active');
    
    setTimeout(() => {
        saltElement.classList.remove('active');
    }, 3000);
}

// Currency System
function updateBalance() {
    balanceElement.textContent = sesterces;
    
    // Update button states
    offeringButtons.forEach(button => {
        const cost = parseInt(button.dataset.cost);
        button.disabled = sesterces < cost;
    });
}

function saveGame() {
    localStorage.setItem('sesterces', sesterces.toString());
}

// Modal Functions
buyButton.addEventListener('click', function() {
    modal.style.display = 'block';
});

closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Purchase Currency
packButtons.forEach(button => {
    button.addEventListener('click', function() {
        const pack = this.parentElement;
        const amount = parseInt(pack.dataset.amount);
        const price = parseFloat(pack.dataset.price);
        
        // In a real implementation, this would connect to a payment processor
        // For demo purposes, we'll just add the currency
        if (confirm(`Purchase ${amount} HS for $${price}?`)) {
            sesterces += amount;
            updateBalance();
            saveGame();
            modal.style.display = 'none';
            alert(`Thank you! ${amount} HS have been added to your balance.`);
        }
    });
});

// Daily Bonus (simplified)
function checkDailyBonus() {
    const lastVisit = localStorage.getItem('lastVisit');
    const today = new Date().toDateString();
    
    if (lastVisit !== today) {
        sesterces += 10; // Daily login bonus
        updateBalance();
        saveGame();
        localStorage.setItem('lastVisit', today);
        
        if (lastVisit) { // Only show alert if not first visit
            alert('Daily login bonus: 10 HS added!');
        }
    }
}

// Check for daily bonus on page load
checkDailyBonus();
