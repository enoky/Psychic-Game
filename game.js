$(document).ready(function() {
    // Load 3 random cards when the game starts
    resetCards();
    $("#restartBtn").hide();  // Initially hide the restart button
});

let wins = 0;
let losses = 0;
let attempts = 0;
const maxAttempts = 10;
let randomCards = [];  // Store the current set of random cards

$(".guess").click(guessHandler);  // Attach guess handler initially

function guessHandler() {
    if (attempts >= maxAttempts) {
        return; // Prevent further clicks after reaching max attempts
    }
    
    let cardIndex = $(this).attr("id").replace("card", "") - 1;  // Get card index (1-based to 0-based)
    let cardChosen = randomCards[cardIndex];
    let cardToGuess = randomCards[Math.floor(Math.random() * 3)];  // Random card from the set

    if (cardChosen === cardToGuess) {
        wins++;
        $("#won").text(wins);
        $("h3").text("You got it!");
        playSound("green");
    } else {
        losses++;
        $("#lost").text(losses);
        $("h3").text("Wrong card!");
        playSound("red");
    }
    
    attempts++;
    
    if (attempts < maxAttempts) {
        $(".guess").prop("disabled", true); // Temporarily disable further guesses
        
        setTimeout(function () {
            resetCards();
            $(".guess").prop("disabled", false); // Enable guesses after cards reset
        }, 500);
    } else {
        endGame();  // Show result immediately after 10 attempts
    }
}

const playSound = (name) => {
    const audio = new Audio(`./sounds/${name}.mp3`);
    audio.play();
};

function resetCards() {
    let cardSet = new Set();

    // Generate three unique random numbers
    while (cardSet.size < 3) {
        cardSet.add(Math.floor(Math.random() * 78));
    }

    // Convert the set to an array and store it
    randomCards = Array.from(cardSet);

    let [randCard1, randCard2, randCard3] = randomCards;

    let card1 = "./images/" + randCard1 + ".jpg";
    let card2 = "./images/" + randCard2 + ".jpg";
    let card3 = "./images/" + randCard3 + ".jpg";

    // Apply a short delay before showing new cards for better visual effect
    setTimeout(function () {
        $("#card1").attr("src", card1);
        $("#card2").attr("src", card2);
        $("#card3").attr("src", card3);

        // Re-apply the fade-in animation on cards after reset
        $(".guess").addClass("reset-animation");
        
        setTimeout(function() {
            $(".guess").removeClass("reset-animation");  // Clean up class after animation
        }, 600);  // Match the CSS animation duration
    }, 300);
}

function endGame() {
    // Disable further clicks
    $(".guess").off("click");
    
    // Calculate percentage
    let percentage = (wins + losses > 0) ? Math.round((wins / (wins + losses)) * 100) : 0;
    $("#percent").text("You are " + percentage + "% Psychic");
    
    $("h3").text("Game over! You made " + attempts + " attempts.");
    
    // Show the restart button now that the game is over
    $("#restartBtn").show();
}

$("#restartBtn").click(function() {
    // Reset the game state
    wins = 0;
    losses = 0;
    attempts = 0;
    
    // Update the UI
    $("#won").text(wins);
    $("#lost").text(losses);
    $("#percent").text("");
    $("h3").text("Pick a card!");
    
    // Reset the cards and re-enable click events
    resetCards();
    $(".guess").off("click").on("click", guessHandler);  // Ensure old handlers are removed and re-attach click events
    $("#restartBtn").hide();  // Hide the restart button again for the next game
});
