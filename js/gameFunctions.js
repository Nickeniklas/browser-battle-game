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
    document.querySelector('#fight-controls-container').style.display = "";

    // game over message in dialog box 
    dialogElement.style.display = "flex";
    dialogElement.innerHTML = "<h1 id='gameover-title'>Better luck next time....</h1>";
    //play sound effect for dying
    playSoundEffect(playerData.deathAudio);
} 
// function for when enemy dies
function enemyDead(playerData, enemyData) {
    console.log("enemy dead");
    
    // de-activate controls
    disableControls();

    // set set visible health to 0
    document.querySelector('#npc-health').textContent = 0;
    //red enemy
    document.querySelector('#npc-container').style.backgroundColor = "#8b0000";
    // dialog
    dialogElement.style.display = "flex";
    dialogElement.innerHTML = `<p><b class="enemy-name">${enemyData.name}</b> has died...</p>`;
    // draw/update score for winning fight
    console.log("draw score function runnning in enemyDead...");
    console.log(playerData.battlesWon);
    playerData.battlesWon += 1;
    console.log(playerData.battlesWon);
    drawScore(playerData);
    // reset has run away status
    playerData.hasRunAway = false;
    saveGame(playerData);

    // play random sound for enemy dying
    const deadSounds = ['media/audio/sfx/dead/male_death1.mp3', 'media/audio/sfx/dead/male_death2.wav', 'media/audio/sfx/dead/male_death3.wav', 'media/audio/sfx/dead/male-death4.wav'];
    const randomDeadSound = deadSounds[Math.floor(Math.random() * deadSounds.length)];
    playSoundEffect(randomDeadSound);

    // button for generating new enemy
    document.querySelector('#npc-container h2').innerHTML = `<button type="button" class="btn btn-success" id="new-enemy-btn">New Enemy</button>`
    // eventlistener to create new enemy
    document.querySelector('#new-enemy-btn').addEventListener('click', ()=> {
        newEnemy();
    })
}
// enemy take damage function
function enemyDamage(enemyData, damageAmount) {
    // dialog for taking damage
    dialogElement.style.display = "flex";
    dialogElement.innerHTML = `<p><b class="enemy-name">${enemyData.name}</b> took ${damageAmount} damage!!</p>`;
    
    // play random sound for taking damage
    const damagedSounds = ['media/audio/sfx/damaged/auch1.wav', 'media/audio/sfx/damaged/auch2.wav', 'media/audio/sfx/damaged/ohhh1.wav', 'media/audio/sfx/damaged/oof1.flac', 'media/audio/sfx/damaged/ouch1.mp3', 'media/audio/sfx/damaged/ouch2.wav', 'media/audio/sfx/damaged/ouch3.wav'];
    const randomDamagedSound = damagedSounds[Math.floor(Math.random() * damagedSounds.length)];
    playSoundEffect(randomDamagedSound);
}
// player take damage
function playerDamage(playerData, enemyData) {
    console.log("player damage")
    //console.log("original health:", playerData.health)
    // determine damage amount
    const randomness = parseFloat(Math.random().toFixed(2));
    console.log("Blow hit precentage: " + randomness * 100 + "%");
    let damage = parseFloat(enemyData.damage * randomness);
    damage = Math.round(damage * 100) / 100;

    // remove player health
    playerData.health -= damage
    //console.log("after damage health:", playerData.health)

    // PLAYER DEAD (no hp left)
    if (playerData.health <= 0) {
        playerDead(playerData);
        return;
    }
    // DEAL DAMAGE TO PLAYER
    else {
        //visualize damage in dom
        let playerHp = document.querySelector('#player-health');
        playerHp.textContent = playerData.health.toFixed(2);
        playerHp.style.color = "#8b0000";

        // dialog box for taking damage
        dialogElement.innerHTML += `<p><b class="player-name">${playerData.name}</b> took ${damage} damage...</p>`;

        // play sound effect for player taking damage
        let damagedSoundFile = 'media/audio/sfx/damaged/player_damaged.wav';
        playSoundEffect(damagedSoundFile);
    }
}
// enemy does something function
function enemyMove(playerData, enemyData, hpChangeAmount, damage=false) {  
    // ENEMY IS DEAD
    if (enemyData.health <= 0) {
        document.querySelector('#npc-health').textContent = 0;
        enemyDead(playerData, enemyData);
        return;
    }

    // ENEMY RESPONSE TO PLAYER USED DAMAGING HIT
    if (damage && enemyData.health > 0) {
        // enemy takes damage
        enemyDamage(enemyData, hpChangeAmount);
        window.scrollTo(0, document.body.scrollHeight);
        // 0.8 sec delayed enemy attack response
        setTimeout(()=> {
            // dialog for attacking player
            dialogElement.innerHTML = `<p><b class="enemy-name">${enemyData.name}</b> is attacking!!</p>`;
           
            // play sound effect for enemy attacking player
            const files = ['slap_wet.wav', 'impact-metal1.wav', 'slap_wet2.mp3'];
            let randomSfx = files[Math.floor(Math.random() * files.length)]; //random item
            let enemyAttackAudioFile = 'media/audio/sfx/offense/' + randomSfx;
            playSoundEffect(enemyAttackAudioFile);
            
            enableControls();
            
            // deal damage to player
            playerDamage(playerData, enemyData, hpChangeAmount);
            
            //scroll to dialog
            window.scrollTo(0, document.body.scrollHeight);
        }, 800);
        return;
    }    
    // ENEMY RESPONSE TO PLAYER USED NON DAMAGING 
    setTimeout(()=> {// 0.8 sec delayed enemy attack response
        // dialog for attacking player
        dialogElement.innerHTML = `<p><b class="enemy-name">${enemyData.name}</b> is attacking!!</p>`;
        // play sound effect for enemy attacking player
        const files = ['slap_wet.wav', 'impact-metal1.wav', 'slap_wet2.mp3'];
        let randomSfx = files[Math.floor(Math.random() * files.length)]; //random item
        let enemyAttackAudioFile = 'media/audio/sfx/offense/' + randomSfx;
        playSoundEffect(enemyAttackAudioFile);
        // deal damage to player
        playerDamage(playerData, enemyData, hpChangeAmount);
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
    const randomness = parseFloat((0.25 + Math.random() * 0.59).toFixed(2));
    //console.log("Blow hit precentage: " + randomness * 100 + "%");
    let damage = parseFloat(playerData.damage * randomness);
    damage = Math.round(damage * 100) / 100;
    // deal damage to enemy
    enemyData.health -= damage ;
    //visualize damage in dom
    let enemyHp = document.querySelector('#npc-health');
    enemyHp.textContent = enemyData.health.toFixed(2);
    enemyHp.style.color = "#8b0000";

    //console.log("enemy hp after: " + enemyData.health);

    // play player-offensive audio
    playSoundEffect(playerData.offenseAudio)

    disableControls();

    // enemy response
    enemyMove(playerData, enemyData, damage, true); 
}

// secondary skill function (skill 2)
function skillSecondary(playerData, enemyData) {
    damage = false;
    let timeOutDuration = 1500;
    let amount = 0;
    // array of possible items
    const items = ['Apple', 'Banana', 'Cherry', 'Grapes', 'Mango', 'Pineapple', 'Strawberry', 'Watermelon', 'Blueberry', 'Orange', 'Niksapussi', 'Mallugoldi', 'Denssirotta', 'vanhat vedet', 'Metukka', 'Karhu kolmonen', 'warm chair', 'exhaust fumes'];
    let randomItem = items[Math.floor(Math.random() * items.length)]; //random item

    disableControls();

    // enable dialogbox and write gameplay text 
    dialogElement.style.display = "flex";
    dialogElement.innerHTML = `<p><b class="player-name">${playerData.name}</b> smelled and tasted a ${randomItem}....</p>`;
    
    // determine if item heals player
    const healItems = ['Apple', 'Banana', 'Cherry', 'Grapes', 'Mango', 'Pineapple', 'Strawberry', 'Watermelon', 'Blueberry', 'Orange'];
    if (healItems.includes(randomItem)) {
        timeOutDuration = 1500 // longer time to read 
        // heal player for random amount
        let healAmount = Math.floor(Math.random() * 30) + 15;
        healAmount = Math.round(healAmount * 100) / 100;
        playerData.health += healAmount;
        // dialog message healing player 
        dialogElement.innerHTML += `<p><b class="player-name">${playerData.name}</b> got healed for ${healAmount}!</p>`;
        // display healing
        let hpElement = document.querySelector('#player-health');
        hpElement.textContent = playerData.health.toFixed(2);
        hpElement.style.color = "#198754";

        amount = healAmount;
    }

    // determine if item deals damage enemy
    const lethalItems = ['Niksapussi', 'Mallugoldi', 'Denssirotta', 'vanhat vedet', 'Metukka', 'Karhu kolmonen', 'warm chair', 'exhaust fumes'];
    if (lethalItems.includes(randomItem)) {
        damage = true // deals damage true for function call
        timeOutDuration = 2500 // longer time to read 

        // deal damage to enemy for random amount
        let damageAmount = Math.floor(Math.random() * 35) + 15;
        damageAmount = Math.round(damageAmount * 100) / 100;
        enemyData.health -= damageAmount;
        // dialog message enemy smelling bad stuff 
        dialogElement.innerHTML += `<p><b class="enemy-name">${enemyData.name}</b> also smelled that ${randomItem} and took ${damageAmount} damage!</p>`;
        
        // display damage
        let hpElement = document.querySelector('#npc-health');
        hpElement.textContent = Math.max(0, enemyData.health);
        hpElement.style.color = "#8b0000";

        amount = damageAmount;
    }

    // scroll down to messages
    window.scrollTo(0, document.body.scrollHeight);

    setTimeout(()=> {
        // enemy response
        enemyMove(playerData, enemyData, amount, damage);
        
    }, timeOutDuration);
    
}

// run away from fight function
function skillRun(playerData) {
    // allow run away only once per won fight
    if (playerData.hasRunAway) {
        // Prevent running away again
        dialogElement.style.display = "flex";
        dialogElement.innerHTML = `<p><b class="player-name">${playerData.name}</b> has already run away once in this battle!</p>`;
        return;
    }

    // set run away status to true
    playerData.hasRunAway = true;

    // save character
    saveGame(playerData);
    
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
        "media/audio/background/city-uplifting-vibes.mp3",
        "media/audio/background/funky-beat.mp3",
        "media/audio/background/happy-rock-corporate-loop.wav",
        "media/audio/background/nice_violin-beat.wav",
        "media/audio/background/rock-hellye.wav"
    ];
    const randomFile = audioFiles[Math.floor(Math.random() * audioFiles.length)];
    audioContent.src = randomFile;
    audioContent.play();
}

//sound effect
function playSoundEffect(soundFile) {
    //EX: soundFile = "../media/audio/effects/click-sound.mp3"
    soundFile = new Audio(soundFile);
    soundFile.play();
}

// funciton for drawing score on screen (battles won)
function drawScore(playerData) {
    console.log("draw score function runnning...");
    const statsElement = document.querySelector('#stats-container');
    
    statsElement.innerHTML = `<h2 id="battles-won">Battles won: ${playerData.battlesWon}</h2>`
}


// get the controls and dialog variable on load
document.addEventListener('DOMContentLoaded', getControlElements);