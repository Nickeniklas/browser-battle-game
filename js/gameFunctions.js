// controls and dialogbox variables
let skillBtn1, skillBtn2, skillBtnRun, dialogElement
function getControls() {
    // skill buttons
    skillBtn1 = document.querySelector('#skill-btn-1');
    skillBtn2 = document.querySelector('#skill-btn-2');
    skillBtnRun = document.querySelector('#skill-btn-run');
    // element to write gameplay text
    dialogElement = document.querySelector('#dialog-content');
}

function enableControls() {
    // enable controls and dialogbox
    document.querySelector('#fight-controls-container').style.display = "flex";
    getControls();
    skillBtn1.disabled = false;
    skillBtn2.disabled = false;
    skillBtnRun.disabled = false;
    dialogElement.innerHTML = "";
    dialogElement.style.display = "flex";
}

function disableControls() {
    getControls();
    // disable controls and dialogbox
    skillBtn1.disabled = true;
    skillBtn2.disabled = true;
    skillBtnRun.disabled = true;
    dialogElement.style.display = "none";
}
// function for when enemy dies
function enemyDead(enemyData) {
    console.log("enemy dead");
    console.log(dialogElement);
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
    // taking damage texts
    damagedTexts = ["Senkin runkkari!", "Peeerkele!", "Ai saaatana.", "Nyt saatana mä sanon.", "Ai saatana!", "HEJ!", "that aint cool yo.", "AUCH!", "OUCH!", "STOP THAT!", "HEJ, LOPETA!"];
    // pick random text
    const randomText = damagedTexts[Math.floor(Math.random() * damagedTexts.length)];
    // display in dialogbox
    dialogElement.style.display = "flex";
    dialogElement.innerHTML += `<p><b>${enemyData.name} took some damage...</b></p>`;
    dialogElement.innerHTML += `<p><b>${enemyData.name}:</b> ${randomText}</p>`;
}
// player take damage
function playerDamage(playerData, enemyData) {
    console.log("PLAYER DAMAGE: player hp before: " + playerData.health);
    // determine damage amount
    const randomness = 1//parseFloat(Math.random().toFixed(2));
    console.log("Blow hit precentage: " + randomness * 100 + "%");
    let damage = enemyData.damage * randomness;
    // remove player health
    playerData.health -= damage
    //visualize damage in dom
    let playerHp = document.querySelector('#player-health');
    playerHp.textContent = playerData.health;
    playerHp.style.color = "#8b0000";
    // dialog box for taking damage
    dialogElement.innerHTML += `<p><b>${playerData.name} took some damage...</b></p>`;
    console.log("player hp after: " + playerData.health);
}
// enemy does something function
function enemyMove(playerData, enemyData) {  
    // enemy is dead
    if (enemyData.health <= 0) {
        enemyDead(enemyData);
        return;
    }
    // enemy still has HP left
    else if (enemyData.health > 0) {
        enemyDamage(enemyData);
    }else {
        dialogElement.style.display = "flex";
        dialogElement.innerHTML = `<p>Somethings went wrong... Your characters data should be saved, please refresh.</p>`
    }
    // preparing for return attack dialog
    dialogElement.innerHTML += `<p><b>${enemyData.name}:</b> You are going to feel the pain!!</p>`;
    // deal damage to player
    playerDamage(playerData, enemyData);

    // scroll down to see messages
    window.scrollTo(0, document.body.scrollHeight);
}

// main damage function (skill 1)
function skillPrimary(playerData, enemyData) {
    // hide dialog
    getControls();
    dialogElement.innerHTML = "";
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

    // enemy response
    enemyMove(playerData, enemyData); 
}

// secondary skill function (skill 2)
function skillSecondary(playerData, enemyData) {
    // boolean if the action deals damage
    damage = false;
    // array of possible items
    const items = ['Apple', 'Banana', 'Cherry', 'Grapes', 'Mango', 'Pineapple', 'Strawberry', 'Watermelon', 'Blueberry', 'Orange', 'Niksapussi', 'Mallugoldi', 'Denssirotta', 'vanhat vedet', 'Metukka', 'Karhu kolmonen', 'warm chair', 'exhaust fumes'];
    const randomItem = items[Math.floor(Math.random() * items.length)]; //random fruit
    // enable dialogbox and write gameplay text 
    dialogElement.style.display = "flex";
    dialogElement.innerHTML = `<p><b>${playerData.name}</b> smelled and tasted a ${randomItem}....</p>`;

    // determine if deals damage
    if (items.includes(randomItem)) {
        damage = true
        dialogElement.innerHTML += `<p><b>${enemyData.name}</b> also smelled that ${randomItem} and took some damage....</p>`;
    }
    // enemy response
    enemyMove(playerData, enemyData); 
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
// set function on title button
document.querySelector('#title-btn').addEventListener('click', deleteSave);

// get the controls and dialog variable on load
document.addEventListener('DOMContentLoaded', getControls);