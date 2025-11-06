// Game State
let sesterces = parseInt(localStorage.getItem('sesterces')) || 50;
let lampLit = false;

// Latin Quotes Database
const latinQuotes = [
    {
        latin: "Laribus familiaribus sacrum",
        english: "Sacred to the family Lares",
        context: "A traditional dedication found on Roman household altars",
        offeringType: "general"
    },
    {
        latin: "Di penates, hanc domum custonite",
        english: "Household gods, protect this home",
        context: "Prayer for household protection during morning rituals",
        offeringType: "general"
    },
    {
        latin: "Lar, propitius esto",
        english: "Lar, be favorable",
        context: "Simple prayer asking for the Lar's favor",
        offeringType: "general"
    },
    {
        latin: "Dis manibus sacrum",
        english: "Sacred to the divine spirits",
        context: "Dedication to ancestral spirits often included in lararium worship",
        offeringType: "general"
    },
    {
        latin: "Hoc mero, Lares, libo",
        english: "With this unmixed wine, Lares, I pour a libation",
        context: "Traditional wine offering formula",
        offeringType: "wine"
    },
    {
        latin: "Pura aqua, pura mente",
        english: "With pure water, with pure mind",
        context: "Water offering for purification rituals",
        offeringType: "water"
    },
    {
        latin: "Luceat lumen vestrum",
        english: "May your light shine",
        context: "Prayer while lighting the ritual lamp",
        offeringType: "light"
    },
    {
        latin: "Ture et precibus",
        english: "With incense and prayers",
        context: "Incense offering to carry prayers to the gods",
        offeringType: "incense"
    },
    {
        latin: "Panem et salem offero",
        english: "I offer bread and salt",
        context: "Traditional food offering for hospitality rituals",
        offeringType: "bread"
    },
    {
        latin: "Salem, symbolum amicitiae",
        english: "Salt, symbol of friendship",
        context: "Salt offering to cement bonds of friendship",
        offeringType: "salt"
    }
];

// DOM Elements
const balanceElement = document.getElementById('balance');
const offeringButtons = document.querySelectorAll('.offering-btn');
const liquidElement = document.getElementById('liquid');
const pourStreamElement = document.getElementById('pour-stream');
const flameElement = document.getElementById('flame');
const smokeElement = document.getElementById('smoke');
const breadElement = document.getElementById('bread');
const saltElement = document.getElementById('salt');
const buyButton = document.getElementById('buy-btn');
const modal = document.getElementById('buy-modal');
const closeModal = document.querySelector('.close');
const packButtons = document.querySelectorAll('.pack-btn');
const shrineImage = document.getElementById('shrine-image');
const latinText = document.getElementById('latin-text');
const englishText = document.getElementById('english-text');

// Initialize
updateBalance();
checkDailyBonus();
preloadImage();

// Image Loading Optimization
function preloadImage() {
    if (shrineImage.complete) {
        shrineImage.classList.add('loaded');
    } else {
        shrineImage.addEventListener('load', function() {
            shrineImage.classList.add('loaded');
        });
        shrineImage.addEventListener('error', function() {
            console.log('Error loading shrine image');
        });
    }
}

// Quote System
function displayRitualQuote(offeringType = 'general') {
    const relevantQuotes = latinQuotes.filter(quote => 
        quote.offeringType === offeringType || quote.offeringType === 'general'
    );
    
    const randomIndex = Math.floor(Math.random() * relevantQuotes.length);
    const ritual = relevantQuotes[randomIndex];
    
    latinText.textContent = ritual.latin;
    englishText.textContent = ritual.english;
    
    let contextElement = document.querySelector('.ritual-context');
    if (!contextElement) {
        contextElement = document.createElement('div');
        contextElement.className = 'ritual-context';
        document.getElementById('quote-display').appendChild(contextElement);
    }
    contextElement.textContent = ritual.context;
    
    const quoteDisplay = document.getElementById('quote-display');
    quoteDisplay.style.opacity = '0';
    setTimeout(() => {
        quoteDisplay.style.opacity = '1';
    }, 300);
}

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
        showMessage('Insufficient sesterces for this offering. Acquire more to continue your devotions.');
        return;
    }
    
    sesterces -= cost;
    updateBalance();
    saveGame();
    displayRitualQuote(type);
    
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
        case 'bread':
            offerBread();
            break;
        case 'salt':
            offerSalt();
            break;
    }
    
    const button = document.querySelector(`[data-type="${type}"]`);
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 200);
}

// Offering Animations
function offerWine() {
    resetAnimations();
    
    setTimeout(() => {
        pourStreamElement.classList.add('wine-pour');
        pourStreamElement.style.animation = 'pour 2s ease-in-out';
        pourStreamElement.style.opacity = '1';
    }, 300);
    
    setTimeout(() => {
        liquidElement.classList.add('wine');
        liquidElement.style.height = '70%';
    }, 800);
    
    setTimeout(() => {
        pourStreamElement.style.animation = '';
        pourStreamElement.style.opacity = '0';
    }, 2300);
    
    setTimeout(() => {
        liquidElement.style.height = '0%';
    }, 8000);
    
    showMessage('Wine offered to the Lares. May your household know joy.');
}

function offerWater() {
    resetAnimations();
    
    setTimeout(() => {
        pourStreamElement.classList.add('water-pour');
        pourStreamElement.style.animation = 'pour 1.5s ease-in-out';
        pourStreamElement.style.opacity = '1';
    }, 300);
    
    setTimeout(() => {
        liquidElement.classList.add('water');
        liquidElement.style.height = '60%';
    }, 600);
    
    setTimeout(() => {
        pourStreamElement.style.animation = '';
        pourStreamElement.style.opacity = '0';
    }, 1800);
    
    setTimeout(() => {
        liquidElement.style.height = '0%';
    }, 6000);
    
    showMessage('Pure water offered for cleansing and purification.');
}

function lightLamp() {
    if (!lampLit) {
        flameElement.classList.add('lit');
        lampLit = true;
        showMessage('The sacred flame is lit. May it illuminate your household.');
        
        setTimeout(() => {
            flameElement.classList.remove('lit');
            lampLit = false;
            showMessage('The sacred flame has faded. Relight to continue its protection.');
        }, 3600000);
    } else {
        showMessage('The sacred flame burns brighter with your continued devotion.');
    }
}

function offerIncense() {
    smokeElement.classList.remove('active');
    void smokeElement.offsetWidth;
    smokeElement.classList.add('active');
    
    showMessage('The sweet smoke of incense rises to the heavens.');
    
    setTimeout(() => {
        smokeElement.classList.remove('active');
    }, 5000);
}

function offerBread() {
    breadElement.classList.remove('active');
    void breadElement.offsetWidth;
    breadElement.classList.add('active');
    
    showMessage('Bread offering made. May your household never know hunger.');
    
    setTimeout(() => {
        breadElement.classList.remove('active');
    }, 3000);
}

function offerSalt() {
    saltElement.classList.remove('active');
    void saltElement.offsetWidth;
    saltElement.classList.add('active');
    
    showMessage('Salt offered for preservation and purity.');
    
    setTimeout(() => {
        saltElement.classList.remove('active');
    }, 3000);
}

function resetAnimations() {
    liquidElement.className = 'liquid';
    liquidElement.style.height = '0%';
    pourStreamElement.className = 'pour-stream';
    pourStreamElement.style.animation = '';
    pourStreamElement.style.opacity = '0';
}

// Currency System
function updateBalance() {
    balanceElement.textContent = sesterces;
    
    offeringButtons.forEach(button => {
        const cost = parseInt(button.dataset.cost);
        button.disabled = sesterces < cost;
    });
}

function saveGame() {
    localStorage.setItem('sesterces', sesterces.toString());
}

// Message System
function showMessage(message) {
    let messageEl = document.getElementById('message-toast');
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.id = 'message-toast';
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(90, 70, 40, 0.95);
            color: #e8d8b8;
            padding: 15px 25px;
            border-radius: 8px;
            border: 2px solid #d4af37;
            font-family: 'Crimson Text', serif;
            z-index: 1001;
            text-align: center;
            max-width: 80%;
            box-shadow: 0 5px 15px rgba(0,0,0,0.5);
            opacity: 0;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(messageEl);
    }
    
    messageEl.textContent = message;
    messageEl.style.opacity = '1';
    
    setTimeout(() => {
        messageEl.style.opacity = '0';
    }, 3000);
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
        
        if (confirm(`Acquire ${amount} sacred sesterces for $${price}?`)) {
            sesterces += amount;
            updateBalance();
            saveGame();
            modal.style.display = 'none';
            showMessage(`${amount} sacred sesterces acquired! May your devotions be plentiful.`);
        }
    });
});

// Daily Bonus
function checkDailyBonus() {
    const lastVisit = localStorage.getItem('lastVisit');
    const today = new Date().toDateString();
    
    if (lastVisit !== today) {
        sesterces += 10;
        updateBalance();
        saveGame();
        localStorage.setItem('lastVisit', today);
        
        if (lastVisit) {
            showMessage('Daily devotion bonus: 10 sacred sesterces acquired!');
        }
    }
}

// Display initial quote
displayRitualQuote();
