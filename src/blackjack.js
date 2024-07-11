let playerTotal;
let dealerTotal;
let playerAces = 0;
let dealerAces = 0;
let canHit = true;

const flipSound = new Audio('../public/sounds/flip.wav');
const dealSound = new Audio('../public/sounds/deal.wav');
const winSound = new Audio('../public/sounds/win.wav');
const tieSound = new Audio('../public/sounds/tie.wav');
const loseSound = new Audio('../public/sounds/lose.wav');

function playSound(sound) {
    sound.currentTime = 0;
    sound.play().catch(error => {
        console.error('Error playing sound:', error);
    });
}

const dealerHand = document.querySelector('#dealer-hand')
const playerHand = document.querySelector('#player-hand')
const curPlayerTotal = document.querySelector('#player-total')
const curDealerTotal = document.querySelector('#dealer-total')
const hitButton = document.querySelector('#hit')

hitButton.addEventListener('click', () => {
    if (!canHit) {
        return;
    }

    const card = createCard();
    playerHand.append(card);

    if (card.cardValue === 11) {
        playerAces += 1;
    }

    playerTotal += card.cardValue;
    
    if (playerTotal > 21 && playerAces > 0) {
        playerTotal -= 10;
        playerAces--; 
    }
    
    curPlayerTotal.textContent = playerTotal.toString();

    if (playerTotal === 21) {
        hitButton.classList.add('disabled');
        standButton.classList.add('disabled');
        canHit = false;
        dealerDrawUpTo17();
        return;
    }

    setTimeout(() => {
        if (playerTotal > 21) {
            playSound(loseSound);
            alert('Bust! You lose!');
            resetGame();
        }
    }, 400);
});


const standButton = document.querySelector('#stand')
standButton.addEventListener('click', () => {
    hitButton.classList.add('disabled')
    standButton.classList.add('disabled')
    canHit = false
    dealerDrawUpTo17()
})
    

function createCard() {
    playSound(dealSound);
    const card = document.createElement('img')
    card.classList.add('card')

    let cardValue = Math.floor(Math.random() * 13) + 1
    if (cardValue === 1) {
        displayValue = 'A';
        card.cardValue = 11;
    } else if (cardValue === 11) {
        displayValue = 'J';
        card.cardValue = 10;
    } else if (cardValue === 12) {
        displayValue = 'Q';
        card.cardValue = 10;
    } else if (cardValue === 13) {
        displayValue = 'K';
        card.cardValue = 10;
    } else {
        displayValue = cardValue.toString();
        card.cardValue = cardValue;
    }

    let cardSuit = Math.floor(Math.random() * 4) + 1
    if (cardSuit === 1) {
        cardSuit = 'C'
    }
    else if (cardSuit === 2) {
        cardSuit = 'D'
    }
    else if (cardSuit === 3) {
        cardSuit = 'H'
    }
    else if (cardSuit === 4) {
        cardSuit = 'S'
    }

    card.cardSuit = cardSuit;
    card.displayValue = displayValue;
    card.src = `../public/cards/${displayValue}-${cardSuit}.png`
    return card
}

let dealerCard1; // Add this line to reference the hidden card

function resetGame() {
    playerHand.innerHTML = '';
    dealerHand.innerHTML = '';
    playerAces = 0;
    dealerAces = 0;

    const playerCard1 = createCard();
    const playerCard2 = createCard();

    dealerCard1 = createCard(); // Use createCard function for dealerCard1
    const dealerCard2 = createCard();

    const dealerCard1Back = document.createElement('img'); // Create a back card element
    dealerCard1Back.classList.add('card');
    dealerCard1Back.src = '../public/cards/BACK.png';

    playerHand.append(playerCard1);
    playerHand.append(playerCard2);
    dealerHand.append(dealerCard1Back);
    dealerHand.append(dealerCard2);

    if (playerCard1.cardValue === 11) {
        playerAces += 1;
    }
    if (playerCard2.cardValue === 11) {
        playerAces += 1;
    }

    playerTotal = playerCard1.cardValue + playerCard2.cardValue;
    if (playerCard1.cardValue === 11 && playerCard2.cardValue === 11) {
        playerTotal -= 10;
        playerAces -= 1;
    }

    if (dealerCard2.cardValue === 11) {
        dealerAces += 1;
    }

    dealerTotal = dealerCard2.cardValue;

    curPlayerTotal.textContent = playerTotal.toString();
    curDealerTotal.textContent = dealerTotal.toString();

    if (playerTotal === 21) {
        hitButton.classList.add('disabled');
        standButton.classList.add('disabled');
        canHit = false;
        blackjack();
        return;
    }

    hitButton.classList.remove('disabled');
    standButton.classList.remove('disabled');
    canHit = true;
}


window.onload = (() => {
    resetGame()
})

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerDrawUpTo17() {
    await delay(800);
    playSound(flipSound);
    const dealerCard1Back = dealerHand.querySelector('img[src="../public/cards/BACK.png"]');
    dealerCard1Back.src = `../public/cards/${dealerCard1.displayValue}-${dealerCard1.cardSuit}.png`;
    dealerTotal += dealerCard1.cardValue;
    if (dealerCard1.cardValue === 11) {
        dealerAces += 1;
    }
    if (dealerTotal > 21 && dealerAces > 0) {
        dealerTotal -= 10;
        dealerAces -= 1;
    }
    curDealerTotal.textContent = dealerTotal.toString();
    await delay(800);

    while (dealerTotal < 17) {
        const card = createCard();
        dealerHand.append(card);

        if (card.cardValue === 11) {
            dealerAces += 1;
        }

        dealerTotal += card.cardValue;
        if (dealerTotal > 21 && dealerAces > 0) {
            dealerTotal -= 10;
            dealerAces -= 1;
        }
        
        curDealerTotal.textContent = dealerTotal.toString();
        await delay(800);
    }
    checkWin();
}

async function blackjack() {
    // Reveal the hidden dealer card
    await delay(800);
    playSound(flipSound);
    const dealerCard1Back = dealerHand.querySelector('img[src="../public/cards/BACK.png"]');
    dealerCard1Back.src = `../public/cards/${dealerCard1.displayValue}-${dealerCard1.cardSuit}.png`;
    dealerTotal += dealerCard1.cardValue;
    if (dealerTotal == 22) {    // Case of double aces
        dealerTotal -= 10;
    }
    curDealerTotal.textContent = dealerTotal.toString();

    await delay(400); // Wait for a moment before checking further
    // Check for push
    checkWin();
}

function checkWin () {
    if (dealerTotal > 21) {
        playSound(winSound);
        alert('Dealer bust! You win!')
    }
    else if (playerTotal > dealerTotal) {
        playSound(winSound);
        alert('You win!')
    }
    else if (playerTotal < dealerTotal) {
        playSound(loseSound);
        alert('You lose')
    }
    else {
        playSound(tieSound);
        alert('Push')
    }
    resetGame()
}
