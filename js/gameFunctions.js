// controls and dialogbox variables
let skillBtn1, skillBtn2, skillBtnRun, dialogElement
function getControlElements() {
    // skill buttons
    skillBtn1 = document.querySelector('#skill-btn-1');
    skillBtn2 = document.querySelector('#skill-btn-2');
    skillBtnRun = document.querySelector('#skill-btn-run');
    // element to write gameplay text
    dialogElement = document.querySelector('#dialog-content');
}

function enableControls() {
    getControlElements();

    // enable controls and dialogbox
    document.querySelector('#fight-controls-container').style.display = "flex"; // for initial start
    
    skillBtn1.disabled = false;
    skillBtn2.disabled = false;
    skillBtnRun.disabled = false;
    dialogElement.style.display = "flex";
}

function disableControls() {
    getControlElements();
    console.log("Disabling controls...");
    // disable controls and dialogbox
    skillBtn1.disabled = true;
    skillBtn2.disabled = true;
    skillBtnRun.disabled = true;
    dialogElement.style.display = "none";
}
// function for game over/player dead
function playerDead(playerData) {
    console.log("player dead");
    // display health as 0
    document.querySelector('#player-health').textContent = 0;
    // disable and hide controls
    document.querySelector('#fight-controls-container').style.display = "none";
    disableControls();
    // death message in dialog box 
    dialogElement.innerHTML = "<p>Better luck next time....</p>";
    //play sound effect for dying
    playSoundEffect(playerData.deathAudio);
} 
// function for when enemy dies
function enemyDead(enemyData) {
    console.log("enemy dead");
    // set set visible health to 0
    document.querySelector('#npc-health').textContent = 0;
    // de-activate controls
    disableControls();
    //red enemy
    document.querySelector('#npc-container').style.backgroundColor = "#8b0000";
    // dialog
    dialogElement.style.display = "flex";
    dialogElement.innerHTML = `<p><b>${enemyData.name}</b> has died...</p>`;
}
// enemy take damage function
function enemyDamage(enemyData) {
    // dialog for taking damage
    dialogElement.style.display = "flex";
    dialogElement.innerHTML = `<p><b>${enemyData.name}</b> took some damage!!</p>`;
    
    // play random sound for taking damage
    const damagedSounds = ['media/audio/sfx/damaged/auch1.wav', 'media/audio/sfx/damaged/auch2.wav', 'media/audio/sfx/damaged/ohhh1.wav', 'media/audio/sfx/damaged/oof1.flac', 'media/audio/sfx/damaged/ouch1.mp3', 'media/audio/sfx/damaged/ouch2.wav', 'media/audio/sfx/damaged/ouch3.wav'];
    const randomDamagedSound = damagedSounds[Math.floor(Math.random() * damagedSounds.length)];
    playSoundEffect(randomDamagedSound);
}
// player take damage
function playerDamage(playerData, enemyData) {
    // determine damage amount
    const randomness = 1//parseFloat(Math.random().toFixed(2));
    //console.log("Blow hit precentage: " + randomness * 100 + "%");
    let damage = enemyData.damage * randomness;

    // remove player health
    playerData.health -= damage

    // player dead (no hp left)
    if (playerData.health <= 0) {
        playerDead(playerData);
        return;
    }
    //visualize damage in dom
    let playerHp = document.querySelector('#player-health');
    playerHp.textContent = playerData.health;
    playerHp.style.color = "#8b0000";

    // dialog box for taking damage
    dialogElement.innerHTML += `<p><b>${playerData.name}</b> took some damage...</p>`;

    // play sound effect for player taking damage
    let damagedSoundFile = 'media/audio/sfx/damaged/player_damaged.wav';
    playSoundEffect(damagedSoundFile);
}
// enemy does something function
function enemyMove(playerData, enemyData, damage=false) {  
    // enemy is dead
    if (enemyData.health <= 0) {
        document.querySelector('#npc-health').textContent = 0;
        enemyDead(enemyData);
        return;
    }

    // enemy still has HP left and damage=true
    if (damage && enemyData.health > 0) {
        // enemy takes damage
        enemyDamage(enemyData);
        window.scrollTo(0, document.body.scrollHeight);
        // 1 sec delayed enemy attack response
        setTimeout(()=> {
            // dialog for attacking player
            dialogElement.innerHTML = `<p><b>${enemyData.name}</b> is attacking!!</p>`;
            // play sound effect for enemy attacking player
            const files = ['slap_wet.wav', 'impact-metal1.wav', 'slap_wet2.mp3'];
            let randomSfx = files[Math.floor(Math.random() * files.length)]; //random item
            let enemyAttackAudioFile = 'media/audio/sfx/offense/' + randomSfx;
            playSoundEffect(enemyAttackAudioFile);
            // deal damage to player
            playerDamage(playerData, enemyData);
            // enable controls and scroll down
            enableControls();
            window.scrollTo(0, document.body.scrollHeight);
        }, 800);
    }        
    // 1 sec delayed enemy attack response
    setTimeout(()=> {
        // dialog for attacking player
        dialogElement.innerHTML = `<p><b>${enemyData.name}</b> is attacking!!</p>`;
        // play sound effect for enemy attacking player
        const files = ['slap_wet.wav', 'impact-metal1.wav', 'slap_wet2.mp3'];
        let randomSfx = files[Math.floor(Math.random() * files.length)]; //random item
        let enemyAttackAudioFile = 'media/audio/sfx/offense/' + randomSfx;
        playSoundEffect(enemyAttackAudioFile);
        // deal damage to player
        playerDamage(playerData, enemyData);
        // enable controls and scroll down
        if (playerData.health > 0) enableControls();
        window.scrollTo(0, document.body.scrollHeight);
    }, 800);
}

// main damage function (skill 1)
function skillPrimary(playerData, enemyData) {
    // hide dialog
    getControlElements();
    dialogElement.innerHTML = "";
    
    // determine damage
    //console.log("enemy hp before: " + enemyData.health);
    // randomness
    const randomness = 1//parseFloat(Math.random().toFixed(2));
    //console.log("Blow hit precentage: " + randomness * 100 + "%");
    let damage = playerData.damage * randomness;
    // deal damage to enemy
    enemyData.health -= damage ;
    //visualize damage in dom
    let enemyHp = document.querySelector('#npc-health');
    enemyHp.textContent = enemyData.health;
    enemyHp.style.color = "#8b0000";

    //console.log("enemy hp after: " + enemyData.health);

    // play player-offensive audio
    playSoundEffect(playerData.offenseAudio)

    disableControls();

    // enemy response
    enemyMove(playerData, enemyData, true); 
}

// secondary skill function (skill 2)
function skillSecondary(playerData, enemyData) {
    damage = false;
    // array of possible items
    const items = ['Apple', 'Banana', 'Cherry', 'Grapes', 'Mango', 'Pineapple', 'Strawberry', 'Watermelon', 'Blueberry', 'Orange', 'Niksapussi', 'Mallugoldi', 'Denssirotta', 'vanhat vedet', 'Metukka', 'Karhu kolmonen', 'warm chair', 'exhaust fumes'];
    let randomItem = items[Math.floor(Math.random() * items.length)]; //random item

    disableControls();

    // enable dialogbox and write gameplay text 
    dialogElement.style.display = "flex";
    dialogElement.innerHTML = `<p><b>${playerData.name}</b> smelled and tasted a ${randomItem}....</p>`;

    // determine if deals damage
    const lethalItems = ['Niksapussi', 'Mallugoldi', 'Denssirotta', 'vanhat vedet', 'Metukka', 'Karhu kolmonen', 'warm chair', 'exhaust fumes'];
    if (lethalItems.includes(randomItem)) {
        damage = true
        dialogElement.innerHTML += `<p><b>${enemyData.name}</b> also smelled that ${randomItem} and took some damage....</p>`;
    }

    // enemy response
    setTimeout(()=> { // TO DO FIX THIS STRUCTURE
        enemyMove(playerData, enemyData, damage); 
    }, 1000);
}

// run away from fight function
function skillRun() {
    // save character
    saveGame();
    
    disableControls();
    // button for generating new enemy
    document.querySelector('#npc-container').innerHTML = `<button type="button" class="btn btn-success" id="new-enemy-btn">New Enemy</button>`
    // eventlistener to create new enemy
    document.querySelector('#new-enemy-btn').addEventListener('click', ()=> {
        newEnemy();
    })
}
// delete localstorage (reset game)
function deleteSave() {
    console.log("removed saved data");
    localStorage.removeItem('Saved-Game-Data');
    location.reload();
}
/*  FUNCTIONS FOR MUSIC AND SOUND EFFECTS */
//background music
function backgroundMusic(audioContent) {
    // random background song
    const audioFiles = [
        "../media/audio/background/city-uplifting-vibes.mp3",
        "../media/audio/background/funky-beat.mp3",
        "../media/audio/background/happy-rock-corporate-loop.wav",
        "../media/audio/background/nice_violin-beat.wav",
        "../media/audio/background/rock-hellye.wav"
    ];
    const randomFile = audioFiles[Math.floor(Math.random() * audioFiles.length)];
    audioContent.src = randomFile;
    //audioContent.play();
}

//sound effect
function playSoundEffect(soundFile) {
    //EX: soundFile = "../media/audio/effects/click-sound.mp3"
    soundFile = new Audio(soundFile);
    soundFile.play();
}


// get the controls and dialog variable on load
document.addEventListener('DOMContentLoaded', getControlElements);