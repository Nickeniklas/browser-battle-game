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

// player take damage
function playerDamage(playerData, enemyData) {
    console.log("player damage")
    //console.log("original health:", playerData.health)
    // determine damage amount
    const randomness = (0.6 + Math.random() * 0.4);
    console.log("Blow hit precentage: " + randomness * 100 + "%");
    let damage = enemyData.damage * randomness; // apply randomness
    damage = parseFloat(damage / (playerData.shield / 100 + 1).toFixed(2)); // scale down damage with players shield 
    damage = Math.round(damage * 100) / 100; // round 
    console.log("enemy damage scaled down by:", (playerData.shield / 100 + 1), "and randomness:", randomness);
    

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

// main damage function (skill 1)
function skillPrimary(playerData, enemyData) {
    // hide dialog
    getControlElements();
    dialogElement.innerHTML = "";
    
    // randomness
    const randomness = (0.7 + Math.random() * 0.3);
    //console.log("Blow hit precentage: " + randomness * 100 + "%");
    
    // damage amount
    let damage = playerData.damage * randomness;
    damage = parseFloat(damage / (enemyData.shield / 100 + 1)); // scale down damage with enemy shield 
    damage = Math.round(damage * 100) / 100;
    
    //console.log("player damage scaled down by:", (enemyData.shield / 100 + 1));
    
    // double the damage if double damage flag is true
    if (playerData.doubledamage == true) {
        damage *= 2;
        console.log("player dd amount", damage);
    }  

    // heal player for half damage if life steal flag is true
    else if (playerData.lifesteal == true) {
        // add half of the damage as health to player
        playerData.health += damage / 2;

        // update health visually/in dom 
        let hpElement = document.querySelector('#player-health');
        hpElement.textContent = Math.max(0, playerData.health.toFixed(2)); // min 0, rounded 0 decimals
        hpElement.style.color = "#07c06a"; // green for gaining health
    } 

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
    const items = ['Apple', 'Banana', 'Cherry', 'Grapes', 'Mango', 'Pineapple', 'Strawberry', 'Watermelon', 'Blueberry', 'Orange', 'Niksapussi', 'Mallugoldi', 'Denssirotta', 'vanhat vedet', 'Metukka', 'Karhu kolmonen', 'warm chair', 'exhaust fumes', 'Peach', 'Pear', 'Plum', 'Kiwi', 'Coconut', 'Fig', 'Papaya', 'Guava'];
    let randomItem = items[Math.floor(Math.random() * items.length)]; //random item

    disableControls();

    // enable dialogbox and write gameplay text 
    dialogElement.style.display = "flex";
    dialogElement.innerHTML = `<p><b class="player-name">${playerData.name}</b> smelled and tasted a ${randomItem}....</p>`;
    
    // healing items
    const healItems = ['Apple', 'Banana', 'Cherry', 'Grapes', 'Mango', 'Pineapple', 'Strawberry', 'Watermelon', 'Blueberry', 'Orange'];
    // items that damage the enemy
    const lethalItems = ['Niksapussi', 'Mallugoldi', 'Denssirotta', 'vanhat vedet', 'Metukka', 'Karhu kolmonen', 'warm chair', 'exhaust fumes'];
    // items that do nothing
    const nonItems = ['Peach', 'Pear', 'Plum', 'Kiwi', 'Pomegranate', 'Coconut', 'Fig', 'Papaya', 'Guava', 'Lychee'];

    // determine if item heals player
    if (healItems.includes(randomItem)) {
        timeOutDuration = 800 // longer time to read 
        // heal player for random amount
        let healAmount = Math.floor(Math.random() * 46) + 25; // 25 - 80
        healAmount = parseFloat(healAmount * (playerData.tacticalBoost / 100 + 1).toFixed(2)); // scale with boost
        healAmount = Math.round(healAmount * 100) / 100;
        playerData.health += healAmount;
        // dialog message healing player 
        dialogElement.innerHTML += `<p><b class="player-name">${playerData.name}</b> got healed for ${healAmount}!</p>`;
        // display healing
        let hpElement = document.querySelector('#player-health');
        hpElement.textContent = Math.max(0, playerData.health.toFixed(2));
        hpElement.style.color = "#07c06a";

        amount = healAmount;
    }
    // if item does damage to enemy
    else if (lethalItems.includes(randomItem)) {
        damage = true // deals damage true for function call
        timeOutDuration = 2000 // longer time to read 

        // deal damage to enemy for random amount
        let damageAmount = Math.floor(Math.random() * 46) + 25;
        damageAmount = parseFloat(damageAmount * (playerData.tacticalBoost / 100 + 1).toFixed(2)); // scale with boost, 10 tacticalBoost += 0.1 scale
        damageAmount = Math.round(damageAmount * 100) / 100;
        console.log("scale factor: " + (playerData.tacticalBoost / 100 + 1));
        enemyData.health -= damageAmount;
        // dialog message enemy smelling bad stuff 
        dialogElement.innerHTML += `<p><b class="enemy-name">${enemyData.name}</b> also smelled that ${randomItem} and took ${damageAmount} damage!</p>`;
        
        // display damage
        let enemyHPElement = document.querySelector('#npc-health');
        enemyHPElement.textContent = enemyData.health.toFixed(2);
        enemyHPElement.style.color = "#8b0000";

        amount = damageAmount;
    }
    // non item and player has tactical level 50 - nonItems give special perks
    else if (nonItems.includes(randomItem) && playerData.tacticalBoost >= 30) {
        // disable controls until perk is drawn and chosen
        disableControls();
        drawPerks(playerData, enemyData);
        
        // dialog message enemy smelling bad stuff 
        dialogElement.innerHTML += `<p>The fruit gave ${playerData.name} perks!</p>`;
        return;
    }
    // item is uselss (does nothing unless tacticalBoost > 30)
    else if (nonItems.includes(randomItem)) {
        timeOutDuration = 500;

        // update dialog 
        // dialog message enemy smelling bad stuff 
        dialogElement.innerHTML += `<p>Nothing happened...</p>`;
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
        newEnemy(playerData.battlesWon);
    })

    
}

// get the controls and dialog variable on load
document.addEventListener('DOMContentLoaded', getControlElements);