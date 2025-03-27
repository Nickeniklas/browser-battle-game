/* hardcoded charcaters */
const playableChars = {
    'char1': {
        'name' : 'stänkkishänkki',
        'health' : 300,
        'damage' : 30,
        'special': 'Hemo Loud',
        'img' : 'media/img/bad_character1.jpg' 
    },
    'char2' : {
        'name' : 'Cigar Seppo',
        'health' : 200,
        'damage' : 50,
        'special': 'Gooner',
        'img' : 'media/img/mafiaboss_character1.jpg'
    }, 
    'char3' : {
        'name' : 'Skeffe Boss',
        'health' : 500,
        'damage' : 15,
        'special': 'Karsta Yskä',
        'img' : 'media/img/bad_character3.jpg'
    }
};
/* Hard coded NPC's */
const npcs = {
    'npc1' : {
        'name' : 'Mr. Loser',
        'health' : 100,
        'damage' : 20,
        'img' : 'media/img/mafiaboss_character2.jpg'
    },
    'npc2' : {
        'name' : 'Cledos',
        'health' : 80,
        'damage' : 45,
        'img' : 'media/img/mafiaboss_character3.jpg'
    },
    'npc3' : {
        'name' : 'ichiban',
        'health' : 120,
        'damage' : 30,
        'img' : 'media/img/bad_character2.jpg'
    }
};

// function for choosing a character and setting it to localstorage
function setSavedCharacter(characterId) {
    const characterData = JSON.stringify(playableChars[characterId])
    localStorage.setItem('Saved-Game-Data', characterData);    
    document.querySelector('#select-char-container').innerHTML = "";
    initializeCharacters(characterData);
}
// function for saving mid game and setting the data to localstorage
function saveGame() {
    // take the current data from the card
    const damageText = document.querySelector('#player-damage').textContent;
    const healthText = document.querySelector('#player-health').textContent;
    if (!damageText || !healthText) {
        console.error("Player damage or health element not found in the DOM.");
        return;
    }
    // Convert to number
    const damage = parseInt(damageText); 
    const health = parseInt(healthText); 
    //console.log("player damage value:", damage, "player health value", health)

    // Retrieve the saved character data from localStorage
    const savedData = JSON.parse(localStorage.getItem('Saved-Game-Data'));
    // Update the stats in the saved data
    savedData.damage = damage;
    savedData.health = health;

    // Save the updated data back to localStorage
    localStorage.setItem('Saved-Game-Data', JSON.stringify(savedData));

    console.log("Game saved successfully with updated stats:", savedData);
}

// function for getting a random enemy
function createRandomEnemy() {
    // npc data (choose random npc)
    const npcName = 'npc' + (Math.floor(Math.random() * 3) + 1); //random integer between 1-3
    const npc = npcs[npcName];
    return npc;
}

// function for initializing fight controls again
function initializeControls(player, npc) {
    const skillBtn1 = document.querySelector('#skill-btn-1');
    const skillBtn2 = document.querySelector('#skill-btn-2');
    const skillBtnRun = document.querySelector('#skill-btn-run');

    // Remove any existing event listeners
    skillBtn1.replaceWith(skillBtn1.cloneNode(true));
    skillBtn2.replaceWith(skillBtn2.cloneNode(true));
    skillBtnRun.replaceWith(skillBtnRun.cloneNode(true));

    // Re-select the newly cloned elements
    const newSkillBtn1 = document.querySelector('#skill-btn-1');
    const newSkillBtn2 = document.querySelector('#skill-btn-2');
    const newSkillBtnRun = document.querySelector('#skill-btn-run');
    
    newSkillBtn1.addEventListener('click', ()=> {
        skillPrimary(player, npc);
    });
    newSkillBtn2.addEventListener('click', ()=> {
        skillSecondary(player, npc);
    }); 
    newSkillBtnRun.addEventListener('click', ()=> {
        skillRun();
    });    
    enableControls();
}

// function to initialize characters for first fight
function initializeCharacters(characterData) {
    // player charachter data
    const player = JSON.parse(characterData);
    // npc data (choose random npc)
    const npcName = 'npc' + (Math.floor(Math.random() * 3) + 1); //random integer between 1-3
    const npc = npcs[npcName];

    // add characters to DOM
    document.querySelector('#select-char-container').innerHTML = "";
    document.querySelector('#active-chars-container').innerHTML = `
    <!-- CHARACTERS -->
    <div class="character-cards" id="player-container">
        <img class="character-img" src=${player.img} alt="Image of player character.">
        <h2 id="player-name">${player.name}</h2>
        <div class="card-stats">
            <p><b>Damage:</b> <span id="player-damage">${player.damage}</span></p>
            <p><b>Health:</b> <span id="player-health">${player.health}</span></p>
            <p><b>Speciality:</b> <span id="player-speciality">${player.special}</span></p>
        </div>
    </div>
    <h2>VS.</h2>
    <div class="character-cards" id="npc-container">
        <img class="character-img" src=${npc.img} alt="Image of enemy character.">
        <h2 id="npc-name">${npc.name}</h2>
        <div class="card-stats">
            <p><b>Damage:</b> <span id="npc-damage">${npc.damage}</span></p>
            <p><b>Health:</b> <span id="npc-health">${npc.health}</span></p>
            <p><b>Speciality:</b> <span id="npc-speciality">Hävytön Äijä</span></p>
        </div>
    </div>
    `;
    // get fight controls (buttons)
    initializeControls(player, npc);
}

// function for creating new enemy
function newEnemy() {
    let npcContent = document.querySelector('#npc-container')
    // use createRandomEnemy() to get npc data
    const npc = createRandomEnemy();
    npcContent.style.backgroundColor = "#7A6052"
    // create new enemy
    npcContent.innerHTML = `
        <img class="character-img" src=${npc.img} alt="Image of enemy character.">
        <h2 id="npc-name">${npc.name}</h2>
        <div class="card-stats">
            <p><b>Damage:</b> <span id="npc-damage">${npc.damage}</span></p>
            <p><b>Health:</b> <span id="npc-health">${npc.health}</span></p>
            <p><b>Speciality:</b> <span id="npc-speciality">Hävytön Äijä</span></p>
        </div>
    `;
    const player = JSON.parse(localStorage.getItem('Saved-Game-Data'));
    initializeControls(player, npc);
}
// if saved game data exists in local storage -> start the game
if (localStorage.getItem('Saved-Game-Data')) {
    initializeCharacters(localStorage.getItem('Saved-Game-Data'));
} else {
    // character selection eventlisteners
    const charactersElements = document.querySelectorAll('.starter-char');
    
    charactersElements.forEach(character => {
        character.addEventListener('click', (event) => {
            const characterId = event.currentTarget.id; // Get the id of the clicked element
            // save chosen character to localstorage
            setSavedCharacter(characterId);
            console.log(characterId,  'saved!');
        });
    });
}
