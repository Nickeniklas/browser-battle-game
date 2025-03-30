// function for choosing a character and setting it to localstorage
function setSavedCharacter(characterId) {
    const characterData = JSON.stringify(playableChars[characterId])
    localStorage.setItem('Saved-Game-Data', characterData);    
    document.querySelector('#select-char-container').innerHTML = "";
    initializeCharacters(characterData);
}
// function for saving game and setting the data to localstorage
function saveGame(playerData) {
    // Save the updated data back to localStorage
    localStorage.setItem('Saved-Game-Data', JSON.stringify(playerData));

    console.log("Game saved successfully with updated stats:", playerData);
}
// delete localstorage (reset game)
function deleteSave() {
    console.log("removed saved data");
    localStorage.removeItem('Saved-Game-Data');
    location.reload();
}

// function for initializing fight controls again
function initializeControls(player, npc) {
    getControlElements();

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
        skillRun(player);
    });    
    enableControls();
}

// function to initialize characters for first fight
function initializeCharacters(characterData) {
    // player charachter data
    const player = JSON.parse(characterData);
    // get random enemy/npc stats
    const npc = createRandomEnemy(characterData.battlesWon); 

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
            <p><b>Shield:</b> <span id="player-shield">${player.shield}</span></p>
            <p><b>Tactical:</b> <span id="player-tactical">${player.tacticalBoost}</span></p>
            <p><b>Speciality:</b> <span id="player-speciality">${player.special}</span></p>
        </div>
    </div>
    <h2 id="vs-card-divider">VS</h2>
    <div class="character-cards" id="npc-container">
        <img class="character-img" src=${npc.img} alt="Image of enemy character.">
        <h2 id="npc-name">${npc.name}</h2>
        <div class="card-stats">
            <p><b>Damage:</b> <span id="npc-damage">${npc.damage}</span></p>
            <p><b>Health:</b> <span id="npc-health">${npc.health}</span></p>
            <p><b>Shield:</b> <span id="npc-shield">${npc.shield}</span></p>
        </div>
    </div>
    `;
    // get fight controls (buttons)
    initializeControls(player, npc);
}

// function to initialize whole game, main function
function initializeGame() {
    // if saved game data exists in local storage -> start the game
    if (localStorage.getItem('Saved-Game-Data')) {
        initializeCharacters(localStorage.getItem('Saved-Game-Data'));
    } else {
        // character selection eventlisteners
        const charactersElements = document.querySelectorAll('.starter-char');
        
        charactersElements.forEach(character => {
            character.addEventListener('click', (event) => {
                const characterId = event.currentTarget.id; // Get the id of the clicked element

                // play sound effect 
                playSoundEffect(playableChars[characterId].startAudio);
                
                // save chosen character to localstorage
                setSavedCharacter(characterId);
                console.log(characterId,  'saved!');
            });
        });
    }

    initializeBGAudio();

    // initialize restart game button event listener
    document.querySelector('#top-nav-btn-restart').addEventListener('click', deleteSave);
}
initializeGame();