// DRAW SCORE FOR WINNING BATTLES
function drawScore(playerData) {
    const statsElement = document.querySelector('#stats-container');
    const titleContainer = document.querySelector('#title-container');
    
    titleContainer.innerHTML = `
    <div id="battles-won-container">
        <h1 id="battles-won">Battles won: ${playerData.battlesWon}</h1>
    </div>
    `
}

// SPECIAL PERK (from tactical when upgraded enough)
function createPerk(amount = 1) {
    // list of possible perks
    let perkTypeList = ['Life Steal', 'Double Damage'/*, 'Invincibility'*/];

    // Shuffle the array
    let shuffledPerks = perkTypeList.sort(() => Math.random() - 0.5);

    // Slice the first 'amount' elements
    let selectedPerks = shuffledPerks.slice(0, Math.min(amount, perkTypeList.length));

    console.log("perks:", selectedPerks);
    return selectedPerks;
}

function usePerk(playerData, perkType) {
    const boostsContainer = document.querySelector('#boosters-container');
    // Life Steal
    if (perkType == "Life Steal") {
        // hide buttons and draw upgrade instead
        boostsContainer.innerHTML = `
        <div id="boost-output">
            <h2><b>${playerData.name}</b> has <span class="perk-text">${perkType}</span>!</h2>
        </div>
        `;

        // update lifesteal flag on player, other flags false, and save
        playerData.lifesteal = true;
        playerData.doubledamage = false;
        playerData.invincibility = false;
        saveGame(playerData);

        return;
    }
    // Double Damage
    else if (perkType == "Double Damage") {
        // hide buttons and draw upgrade instead
        boostsContainer.innerHTML = `
        <div id="boost-output">
            <h2><b>${playerData.name}</b> has <span class="perk-text">${perkType}</span>!</h2>
        </div>
        `;

        // update doubledamage flag on player, other flags false, and save
        playerData.doubledamage = true;
        playerData.lifesteal = false;
        playerData.invincibility = false;
        saveGame(playerData);

        return;
    }
    // Add damage block
    else if (perkType == "Invincibility") {
        // hide buttons and draw upgrade instead
        boostsContainer.innerHTML = `
        <div id="boost-output">
            <h2><b>${playerData.name}</b> is <span class="perk-text">${perkType}</span>!</h2>
        </div>
        `;

        // update invincibility flag on player, other flags false, and save
        playerData.invincibility = true;
        playerData.doubledamage = false;
        playerData.lifesteal = false;
        saveGame(playerData);

        return;
    }
}

function drawPerks(playerData, enemyData) {
    let perksData = []
    // tacticalBoost thresholds for 1, 2, or 3 perks
    if (playerData.tacticalBoost >= 60) {
        perksData = createPerk(3);
    }
    else if (playerData.tacticalBoost >= 45) {
        perksData = createPerk(2);
    }
    else if (playerData.tacticalBoost >= 30) {
        perksData = createPerk(1);
    }

    // boosts element, empty old data, visible
    const boostsContainer = document.querySelector('#boosters-container');
    boostsContainer.innerHTML = ""
    boostsContainer.style.display = "flex";

    // draw new boosts
    perksData.forEach(perk => {
        boostsContainer.innerHTML += `
        <div class="flex-column boost-card">
            <button type="button" class="btn btn-info boost-card-btn">
                <h3>${perk}</h3>
            </button>
        </div>
        `;
    });

    // Select all booster cards and attach event listeners
    document.querySelectorAll('.boost-card-btn').forEach((button, index) => {
        button.addEventListener("click", () => {
            usePerk(playerData, perksData[index]);
            enemyMove(playerData, enemyData)
        });
    });
    
}

// BOOSTS
function createBoost(amount = 1) {
    // Define boost types and their specific amount logic
    let boostTypeList = [
        { type: 'Gain Health', getAmount: () => Math.floor(Math.random() * 9) * 5 + 30 }, // Random between 20-50, step 5
        { type: 'Upgrade Damage', getAmount: () => Math.floor(Math.random() * 4) * 5 + 5 }, // Random between 5-20, step 5
        { type: 'Gain Shield', getAmount: () => Math.floor(Math.random() * 5) * 5 + 10 }, // Random between 10-30, step 5
        { type: 'Upgrade Tactical', getAmount: () => Math.floor(Math.random() * 4) * 5 + 5 } // Random between 5-20, step 5
    ];

    // Shuffle boost types to ensure randomness
    let shuffledBoosts = boostTypeList.sort(() => Math.random() - 0.5);

    // Limit the selection to the requested amount, avoiding duplicates
    let selectedBoosts = shuffledBoosts.slice(0, Math.min(amount, boostTypeList.length)).map(boost => ({
        type: boost.type,
        amount: boost.getAmount() // Use the specific logic for each type
    }));

    return selectedBoosts;
}

function useBoost(playerData, boostType, boostAmount) {
    const boostsContainer = document.querySelector('#boosters-container');
    // gain health
    if (boostType == "Gain Health") {
        // hide buttons and draw upgrade instead
        boostsContainer.innerHTML = `
        <div id="boost-output">
            <h2><b>${playerData.name}</b> healed for ${boostAmount}</h2>
        </div>
        `;

        // update stat
        playerData.health += boostAmount;

        // visualize update
        const healthElement = document.querySelector('#player-health');
        healthElement.textContent = playerData.health.toFixed(2);
        healthElement.style.color = "#07c06a";

        saveGame(playerData);

        return;
    }
    // Add damage
    else if (boostType == "Upgrade Damage") {
        // hide buttons and draw upgrade instead
        boostsContainer.innerHTML = `
        <div id="boost-output">
            <h2><b>${playerData.name}</b> damage upgraded for ${boostAmount}</h2>
        </div>
        `;

        // update stat
        playerData.damage += boostAmount;

        // visualize update
        const damageElement = document.querySelector('#player-damage');
        damageElement.textContent = playerData.damage.toFixed(2);
        damageElement.style.color = "#07c06a";

        saveGame(playerData);

        return;
    }
    // Add damage block
    else if (boostType == "Gain Shield") {
        // hide buttons and draw upgrade instead
        boostsContainer.innerHTML = `
        <div id="boost-output">
            <h2><b>${playerData.name}</b> damage block increased by ${boostAmount}</h2>
        </div>
        `;

        // update stat
        playerData.shield += boostAmount;

        // visualize update
        const shieldElement = document.querySelector('#player-shield');
        shieldElement.textContent = playerData.shield.toFixed(2);
        shieldElement.style.color = "#07c06a";

        saveGame(playerData);

        return;
    }
    // Upgrade Tactical heal / smell damage
    else if (boostType == "Upgrade Tactical") {
        // hide buttons and draw upgrade instead
        boostsContainer.innerHTML = `
        <div id="boost-output">
            <h2><b>${playerData.name}</b> tactical upgraded by ${boostAmount}</h2>
        </div>
        `;

        // update stat
        playerData.tacticalBoost += boostAmount;

        // visualize update
        const tacticalElement = document.querySelector('#player-tactical');
        tacticalElement.textContent = playerData.tacticalBoost.toFixed(2);
        tacticalElement.style.color = "#07c06a";

        saveGame(playerData);

        return;
    }
}

function drawBoosts(playerData) {
    // create 3 boosts
    let boostsData = createBoost(3);

    // boosts element, empty old data, visible
    const boostsContainer = document.querySelector('#boosters-container');
    boostsContainer.innerHTML = ""
    boostsContainer.style.display = "flex";

    // draw new boosts
    boostsData.forEach(boost => {
        boostsContainer.innerHTML += `
        <div class="flex-column boost-card">
            <button type="button" class="btn btn-info boost-card-btn">
                <h3>${boost.type}</h3>
                <p>+${boost.amount}</p>
            </button>
        </div>
        `;
    });

    // Select all booster cards and attach event listeners
    document.querySelectorAll('.boost-card-btn').forEach((button, index) => {
        button.addEventListener("click", () => {
            useBoost(playerData, boostsData[index].type, boostsData[index].amount);

            // when boost is selected button for generating new enemy
            document.querySelector('#npc-container h2').innerHTML = `
            <button type="button" class="btn btn-success" id="new-enemy-btn">
            <h2>New Battle</h2>
            </button>
            `;
            // eventlistener to create new enemy
            document.querySelector('#new-enemy-btn').addEventListener('click', ()=> {
                newEnemy(playerData.battlesWon);
            })
        });
    });
    
}
