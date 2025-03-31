// function for getting a random enemy
function createRandomEnemy(battlesWon = 0) {
    // random names list and list of enemy images file names as strings
    const names = ['High Roller', 'Big Bettor', 'Mr. Loser', 'Cledos', 'Ichiban', 'Gerg', 'Bossman', 'Street Thug', 'Bing Chilling', 'Big Gangster', 'Gang Leader', 'Squad Boss', 'Michael', 'Trevor', 'Franklin'];
    const images = ["media/img/enemy/bad_character2.jpg", "media/img/enemy/dark_enemy.jpg", "media/img/enemy/gun_enemy1.jpg", "media/img/enemy/gun_enemy2.jpg", "media/img/enemy/gun_enemy3.jpg", "media/img/enemy/gun_enemy4.jpg", "media/img/enemy/mafiaboss_character2.jpg", "media/img/enemy/mafiaboss_character3.jpg", "media/img/enemy/mafia_woman_enemy1.jpg", "media/img/enemy/mafia_woman_enemy2.jpg", "media/img/enemy/mafia_woman_enemy3.jpg", "media/img/enemy/mafia_woman_enemy4.jpg", "media/img/enemy/money_enemy1.jpg", "media/img/enemy/money_enemy2.jpg", "media/img/enemy/money_enemy3.jpg", "media/img/enemy/money_enemy4.jpg", "media/img/enemy/poker-chips_enemy1.jpg", "media/img/enemy/poker-chips_enemy2.jpg", "media/img/enemy/poker-chips_enemy3.jpg", "media/img/enemy/poker-chips_enemy4.jpg", "media/img/enemy/sales_woman_enemy1.jpg", "media/img/enemy/sales_woman_enemy2.jpg", "media/img/enemy/sales_woman_enemy3.jpg", "media/img/enemy/sales_woman_enemy4.jpg"];

    // choose random and image from list
    let name = names[Math.floor(Math.random() * names.length)];
    let img = images[Math.floor(Math.random() * images.length)];

    // Difficulty scaling factor
    let scale = 1 + battlesWon * 0.2; // Increases stats by 25% per win
    console.log(scale)
    // get random base stats
    let baseHealth = Math.floor(Math.random() * ((140 - 60) / 10 + 1)) * 10 + 60; //60-140, nearest 10.
    let baseDamage = Math.floor(Math.random() * 5) * 5 + 15; //15-35, nearest 5.
    let baseShield = Math.floor(Math.random() * 20) + 1; // 1-20
    
    // Scale stats with battlesWon (propgressivly harder)
    let health = Math.floor(baseHealth * scale);
    let damage = Math.floor(baseDamage * scale);
    let shield = Math.floor(baseShield * scale);
    
    return {
        'name' : name,
        'health' : health,
        'damage' : damage,
        'shield' : shield,
        'img' : img
    };
}

// function for creating new enemy
function newEnemy(battlesWon = 0) {
    let npcContent = document.querySelector('#npc-container')
    // get npc data
    const npc = createRandomEnemy(battlesWon);
    npcContent.style.backgroundColor = "#7A6052"
    // create new enemy
    npcContent.innerHTML = `
        <img class="character-img" src=${npc.img} alt="Image of enemy character.">
        <h2 id="npc-name">${npc.name}</h2>
        <div class="card-stats">
            <p><b>Damage:</b> <span id="npc-damage">${npc.damage}</span></p>
            <p><b>Health:</b> <span id="npc-health">${npc.health}</span></p>
            <p><b>Shield:</b> <span id="npc-shield">${npc.shield}</span></p>
        </div>
    `;
    const player = JSON.parse(localStorage.getItem('Saved-Game-Data'));
    initializeControls(player, npc);

    // clear dialog and boost output
    document.querySelector('#dialog-content').innerHTML = "";
    document.querySelector('#boost-output').style.display = "none";
}

// function for when enemy dies
function enemyDead(playerData, enemyData) {
    console.log("enemy dead");
    
    // de-activate controls
    disableControls();

    // set set visible health to 0 and card as red
    document.querySelector('#npc-health').textContent = 0;
    document.querySelector('#npc-container').style.backgroundColor = "#8b0000";
    
    // update dialog (enemy dead)
    dialogElement.style.display = "flex";
    dialogElement.innerHTML = `<p><b class="enemy-name">${enemyData.name}</b> has died...</p>`;
    
    // update player battles won stat
    playerData.battlesWon += 1;

    // draw/update score for winning fight
    drawScore(playerData);

    // reset has run away status, and perk flags
    playerData.hasRunAway = false;
    playerData.lifesteal = false;
    playerData.doubledamage = false;
    playerData.invincibility = false;

    // draw boosts and save game when one is picked
    drawBoosts(playerData);

    // play random sound for enemy dying
    const deadSounds = ['media/audio/sfx/dead/male_death1.mp3', 'media/audio/sfx/dead/male_death2.wav', 'media/audio/sfx/dead/male_death3.wav', 'media/audio/sfx/dead/male-death4.wav'];
    const randomDeadSound = deadSounds[Math.floor(Math.random() * deadSounds.length)];
    playSoundEffect(randomDeadSound);
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
function enemyMove(playerData, enemyData, hpChangeAmount=0, damage=false) {  
    // ENEMY IS DEAD
    if (enemyData.health <= 0) {
        document.querySelector('#npc-health').textContent = 0;
        enemyDead(playerData, enemyData);
        return;
    }

    // player has invincibility, doesnt take damage
    else if (playerData.invincibility == true) {
        console.log("enemy attack blocked by invincibility")
        // update dialog with no damage msg
        dialogElement.innerHTML = `<p><b class="enemy-name">${enemyData.name}</b>'s attack wasn't very effective...</p>`;
        window.scrollTo(0, document.body.scrollHeight); // scroll to dialog

        // play sfx 
        playSoundEffect('media/audio/sfx/offense/attack-blocked1.wav');//shield blocking sound

        enableControls();

        return;
    }
    // ENEMY RESPONSE TO PLAYER USED DAMAGING HIT
    else if (damage && enemyData.health > 0) {
        // enemy takes damage
        enemyDamage(enemyData, hpChangeAmount);
        window.scrollTo(0, document.body.scrollHeight); // scroll down to see damage taken dialog

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
