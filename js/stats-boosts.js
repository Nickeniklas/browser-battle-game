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

// BOOSTS/PERKS/LOOT
function createBoost(amount = 1) {
    //  boost types 
    let boostTypeList = ['Gain Health', 'Uppgrade Damage', 'Gain Shield', 'Upgrade Tactical'];
    // return list
    let boostList = [];

    // loop and create as many sets of perks as parameter amount
    for (let i = 0; i < amount; i++) {
        let boostType = boostTypeList[Math.floor(Math.random() * boostTypeList.length)];
        let boostAmount = Math.floor(Math.random() * 25) + 1;

        //console.log("Created boost of type:", boostType, "amount:", boostAmount);
        boostList.push({ type: boostType, amount: boostAmount });
    }

    return boostList;
}

function useBoost(playerData, boostType, boostAmount) {
    const boostsContainer = document.querySelector('#boosters-container');
    // gain health
    if (boostType == "Gain Health") {
        // hide buttons and draw upgrade instead
        boostsContainer.innerHTML = `
        <div id="boost-output">
            <h2>Player healed for ${boostAmount}</h2>
        </div>
        `
        console.log("BOOST: Player healed for", boostAmount);

        // update stat
        playerData.health += boostAmount;

        // visualize update
        const healthElement = document.querySelector('#player-health');
        healthElement.textContent = playerData.health.toFixed(2);
        healthElement.style.color = "#198754";

        saveGame(playerData);

        return;
    }
    // Add damage
    else if (boostType == "Uppgrade Damage") {
        // hide buttons and draw upgrade instead
        boostsContainer.innerHTML = `
        <div id="boost-output">
            <h2>Player damage upgraded for ${boostAmount}</h2>
        </div>
        `
        console.log("BOOST: Player damage increased by", boostAmount);

        // update stat
        playerData.damage += boostAmount;

        // visualize update
        const damageElement = document.querySelector('#player-damage');
        damageElement.textContent = playerData.damage.toFixed(2);
        damageElement.style.color = "#198754";

        saveGame(playerData);

        return;
    }
    // Add damage block
    else if (boostType == "Gain Shield") {
        // hide buttons and draw upgrade instead
        boostsContainer.innerHTML = `
        <div id="boost-output">
            <h2>Player damage block increased by ${boostAmount}</h2>
        </div>
        `
        console.log("BOOST: Player damage block increased by", boostAmount);

        // update stat
        playerData.shield += boostAmount;

        // visualize update
        const shieldElement = document.querySelector('#player-shield');
        shieldElement.textContent = playerData.shield.toFixed(2);
        shieldElement.style.color = "#198754";

        saveGame(playerData);

        return;
    }
    // Upgrade Tactical heal / smell damage
    else if (boostType == "Upgrade Tactical") {
        // hide buttons and draw upgrade instead
        boostsContainer.innerHTML = `
        <div id="boost-output">
            <h2>Player tactical upgraded by ${boostAmount}</h2>
        </div>
        `;
        console.log("BOOST: Player tactical upgraded by", boostAmount);

        // update stat
        playerData.tacticalBoost += boostAmount;

        // visualize update
        const tacticalElement = document.querySelector('#player-tactical');
        tacticalElement.textContent = playerData.tacticalBoost.toFixed(2);
        tacticalElement.style.color = "#198754";

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
        `
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
            `
            // eventlistener to create new enemy
            document.querySelector('#new-enemy-btn').addEventListener('click', ()=> {
                newEnemy(playerData.battlesWon);
            })
        });
    });
    
}
