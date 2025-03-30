// funciton for drawing score on screen (battles won)
function drawScore(playerData) {
    console.log("draw score function runnning...");
    const statsElement = document.querySelector('#stats-container');
    
    statsElement.innerHTML = `<h2 id="battles-won">Battles won: ${playerData.battlesWon}</h2>`
}