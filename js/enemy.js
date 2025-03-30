// function for getting a random enemy
function createRandomEnemy() {
    const names = ['Mr. Loser', 'Cledos', 'Ichiban', 'Gerg', 'Bossman', 'Street Thug', 'Bing Chilling'];
    let name = names[Math.floor(Math.random() * names.length)];
    let health = Math.floor(Math.random() * ((300 - 80) / 10 + 1)) * 10 + 80;
    let damage = Math.floor(Math.random() * ((60 - 20) / 10 + 1)) * 10 + 20;
    const images = ['media/img/mafiaboss_character2.jpg', 'media/img/mafiaboss_character3.jpg', 'media/img/bad_character2.jpg'];
    let img = images[Math.floor(Math.random() * images.length)];

    let npc = {
        'name' : name,
        'health' : health,
        'damage' : damage,
        'img' : img
    }

    // npc data (choose random npc)
    //const npcName = 'npc' + (Math.floor(Math.random() * 3) + 1); //random integer between 1-3
    //const npc = npcs[npcName];
    return npc;
}

// function for creating new enemy
function newEnemy() {
    let npcContent = document.querySelector('#npc-container')
    console.log(npcContent)
    // get npc data
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
    console.log("new enemy: " + player.hasRunAway)
    initializeControls(player, npc);
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
