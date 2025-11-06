// Enhanced Game State with Ritual Tracking
let sesterces = parseInt(localStorage.getItem('sesterces')) || 50;
let lampLit = false;
let ritualProgress = JSON.parse(localStorage.getItem('ritualProgress')) || {
    offeringsMade: 0,
    lastRitualDate: null,
    favoriteOffering: null
};

// Comprehensive Latin Ritual Database
const ritualDatabase = [
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
    },
    {
        latin: "Sic faciendum est",
        english: "Thus it must be done",
        context: "Traditional phrase emphasizing proper ritual observance",
        offeringType: "general"
    },
    {
        latin: "Pax deorum hoc rite facta",
        english: "The peace of the gods, made by this rite",
        context: "Declaration after completing a proper ritual",
        offeringType: "general"
    },
    {
        latin: "Bona precor, Lar familiaris",
        english: "I pray for good things, household Lar",
        context: "General prayer for household blessings",
        offeringType: "general"
    },
    {
        latin: "Hoc rite peracto",
        english: "This rite having been duly performed",
        context: "Formula marking the completion of a ritual sequence",
        offeringType: "general"
    }
];

// Offering-specific educational content
const offeringEducation = {
    wine: {
        title: "Vinum - Wine Offering",
        description: "Wine was the most common liquid offering in Roman household worship. It was usually poured unmixed as a libation to the Lares.",
        significance: "Symbolized joy, celebration, and the blood of life"
    },
    water: {
        title: "Aqua - Water Offering", 
        description: "Pure water represented cleansing and purification. It was offered to seek spiritual purity for the household.",
        significance: "Represented purity, cleansing, and the source of life"
    },
    light: {
        title: "Ignis - Sacred Flame",
        description: "The eternal flame in the lucerna (oil lamp) symbolized the continuous presence and protection of the Lares.",
        significance: "Light against darkness, divine presence, protection"
    },
    incense: {
        title: "Tus - Incense Offering",
        description: "Incense smoke carried prayers to the gods. Frankincense was the most prized incense in Roman rituals.",
        significance: "Prayers rising to heaven, purification through scent"
    },
    bread: {
        title: "Panis - Bread Offering",
        description: "Bread represented sustenance and hospitality. It was often the first fruits offering to household gods.",
        significance: "Sustenance, hospitality, first fruits offering"
    },
    salt: {
        title: "Sal - Salt Offering",
        description: "Salt was precious in antiquity and symbolized preservation, purity, and the binding of agreements.",
        significance: "Preservation, purity, friendship bonds"
    }
};

// DOM Elements
const balanceElement = document.getElementById('balance');
const offeringButtons = document.querySelectorAll('.offering-btn');
const liquidElement = document.getElementById('liquid');
const pourStreamElement = document.getElementById('pour-stream');
const flameElement = document.getElementById('flame');
const smokeElement = document.getElementById('smoke');
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
displayWelcomeMessage();

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

// Enhanced Quote System with Educational Content
function displayRitualQuote(offeringType = 'general') {
    // Filter quotes by offering type or get general quotes
    const relevantQuotes = ritualDatabase.filter(quote => 
        quote.offeringType === offeringType || quote.offeringType === 'general'
    );
    
    const randomIndex = Math.floor(Math.random() * relevantQuotes.length);
    const ritual = relevantQuotes[randomIndex];
    
    // Update quote display
    latinText.textContent = ritual.latin;
    englishText.textContent = ritual.english;
    
    // Add context if available
    let contextElement = document.querySelector('.ritual-context');
    if (!contextElement) {
        contextElement = document.createElement('div');
        contextElement.className = 'ritual-context';
        document.getElementById('quote-display').appendChild(contextElement);
    }
    contextElement.textContent = ritual.context;
    
    // Animate the quote display
    const quoteDisplay = document.getElementById('quote-display');
    quoteDisplay.style.opacity = '0';
    setTimeout(() => {
        quoteDisplay.style.opacity = '1';
    }, 300);
}

// Display educational information about the offering
function showOfferingEducation(offeringType) {
    const education = offeringEducation[offeringType];
    if (education) {
        const message = `${education.title}\n\n${education.description}\n\nSignificance: ${education.significance}`;
        showMessage(message, 5000); // Longer display for educational content
    }
}

// Welcome message for first-time users
function displayWelcomeMessage() {
    const firstVisit = !localStorage.getItem('hasVisitedBefore');
    if (firstVisit) {
        setTimeout(() => {
            showMessage('Welcome to your Digital Lararium! Make offerings to honor the household Lares and learn ancient Roman rituals.', 6000);
            localStorage.setItem('hasVisitedBefore', 'true');
        }, 1000);
    }
}

// Offering Buttons
offeringButtons.forEach(button => {
    button.addEventListener('click', function() {
        const offeringType = this.dataset.type;
        const cost = parseInt(this.dataset.cost);
        
        makeOffering(offeringType, cost);
    });
});

// Enhanced Make Offering with Educational Content
function makeOffering(type, cost) {
    if (sesterces < cost) {
        showMessage('Insufficient sacred sesterces. Acquire more to continue your devotions to the Lares.');
        return;
    }
    
    // Deduct cost
    sesterces -= cost;
    updateBalance();
    saveGame();
    
    // Update ritual progress
    ritualProgress.offeringsMade++;
    ritualProgress.lastRitualDate = new Date().toISOString();
    ritualProgress.favoriteOffering = type;
    localStorage.setItem('ritualProgress', JSON.stringify(ritualProgress));
    
    // Display ritual quote and educational content
    displayRitualQuote(type);
    showOfferingEducation(type);
    
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
        case 'bread':
            offerBread();
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

// Offering Animations (same as before, but with enhanced messages)
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
}

function lightLamp() {
    if (!lampLit) {
        flameElement.classList.add('lit');
        lampLit = true;
        
        // Lamp stays lit for 1 hour
        setTimeout(() => {
            flameElement.classList.remove('lit');
            lampLit = false;
            showMessage('The sacred flame has naturally faded. You may relight it to continue the Lar\'s protection.');
        }, 3600000);
    }
}

function offerIncense() {
    smokeElement.classList.remove('active');
    void smokeElement.offsetWidth;
    smokeElement.classList.add('active');
    
    setTimeout(() => {
        smokeElement.classList.remove('active');
    }, 5000);
}

function offerBread() {
    // Bread offering is visual only through the quote system
}

function offerSalt() {
    // Salt offering is visual only through the quote system
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
    
    // Update button states
    offeringButtons.forEach(button => {
        const cost = parseInt(button.dataset.cost);
        button.disabled = sesterces < cost;
    });
}

function saveGame() {
    localStorage.setItem('sesterces', sesterces.toString());
}

// Enhanced Message System
function showMessage(message, duration = 3000) {
    let messageEl = document.getElementById('message-toast');
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.id = 'message-toast';
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(60, 45, 25, 0.95);
            color: #e8d8b8;
            padding: 20px 30px;
            border-radius: 10px;
            border: 2px solid #d4af37;
            font-family: 'Crimson Text', serif;
            z-index: 1001;
            text-align: center;
            max-width: 90%;
            box-shadow: 0 8px 25px rgba(0,0,0,0.6);
            opacity: 0;
            transition: opacity 0.4s;
            line-height: 1.5;
            white-space: pre-line;
        `;
        document.body.appendChild(messageEl);
    }
    
    messageEl.textContent = message;
    messageEl.style.opacity = '1';
    
    setTimeout(() => {
        messageEl.style.opacity = '0';
    }, duration);
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
        
        if (confirm(`Acquire ${amount} sacred sesterces for $${price} to continue your devotions?`)) {
            sesterces += amount;
            updateBalance();
            saveGame();
            modal.style.display = 'none';
            showMessage(`${amount} sacred sesterces acquired! May your continued offerings please the household Lares.`);
        }
    });
});

// Daily Bonus with ritual encouragement
function checkDailyBonus() {
    const lastVisit = localStorage.getItem('lastVisit');
    const today = new Date().toDateString();
    
    if (lastVisit !== today) {
        sesterces += 10;
        updateBalance();
        saveGame();
        localStorage.setItem('lastVisit', today);
        
        if (lastVisit) {
            const encouragements = [
                "Daily devotion bonus: 10 sacred sesterces! The Lares appreciate regular worship.",
                "10 sesterces for your daily ritual. Consistency in devotion pleases the household gods.",
                "Your daily offering capacity has been renewed. Honor the Lares regularly."
            ];
            const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
            showMessage(randomEncouragement);
        }
    }
}

// Display initial ritual quote
displayRitualQuote();
