var isHost;
var hostID;

/*******************************************
 * Functions that handle all lobby logic
 * Creating, joining, deleting
 *******************************************/
async function createLobby() {
    isHost = true;

    // Write lobby to firebase
    const numToGuess = Math.floor(Math.random() * 101);
    const firstGuesser = (Math.random() < 0.5 ? "host" : "guest")

    hostID = await getUserIDFirebase();

    const hostNameFilePath = "userPublicDetails/" + hostID + "/name";
    const hostName = await readFirebase(hostNameFilePath);

    if (hostName == null || hostID == null) {
        console.log("hostName:" + hostName);
        console.log("hostID:" + hostID);
        return;
    }

    const lobbyInformation = {
        "gameInformation": {
            "number": numToGuess,
            "whoseTurn": firstGuesser
        },
        "playerInformation": {
            "host": {
                "name": hostName
            }
        }
    };

    const lobbyFilePath = "lobbies/" + hostID;
    await writeFirebase(lobbyFilePath, lobbyInformation);

    // Change user to the waiting page
    await changeToGTNBox("waiting-for-guest-box");

    // Set up listener that will redirect to the game-box when a guest joins
    const playerInformationFilePath = "lobbies/" + hostID + "/playerInformation";
    const unsubscribe = addListenerFirebase(playerInformationFilePath, (data) => {
        if (data.guest != null) {
            displayGameBox();
            unsubscribe();
        }
    });
}
async function searchForLobby() {
    const lobbyList = await readFirebase("lobbies");
    
    Object.entries(lobbyList).forEach(([lobbyHostID, lobbyInfo]) => {
        if (lobbyInfo.playerInformation.guest == null) {
            isHost = false;
            hostID = lobbyHostID;
            joinLobby(lobbyInfo);
        }
    });
    
    async function joinLobby(lobbyInfo) {
        // Write the guestName to firebase
        const guestNameFilePath = `userPublicDetails/${await getUserIDFirebase()}/name`;
        const guestName = await readFirebase(guestNameFilePath);

        const playerInfoFilepath = `lobbies/${hostID}/playerInformation/guest`;
        writeFirebase(playerInfoFilepath, {"name": guestName});
        
        // Change user to the game page
        displayGameBox();
    }
}
async function deleteLobby() {
    if (hostID == null) {
        console.log("hostID is null, so cannot delete lobby");
        return;
    }
    
    const lobbyFilePath = "lobbies/" + hostID;
    writeFirebase(lobbyFilePath, null);

    // Change user to the landing page
    await changeToGTNBox("landing-page-box");
}

/*******************************************
 * Functions that handle all game logic
 * Guessing, swapping the GTN box if its not your turn
 *******************************************/
async function guess() {
    const guess = document.getElementById("guess-input").value;

    const whoseTurnFilePath = "lobbies/" + hostID + "/gameInformation/whoseTurn";
    const whoseTurn = await readFirebase(whoseTurnFilePath);

    // Write the guess to firebase
    const guessFilePath = "lobbies/" + hostID + "/playerInformation/" + whoseTurn + "/latestGuess";
    writeFirebase(guessFilePath, guess);

    // Change whose turn it is
    const newWhoseTurn = (whoseTurn == "host" ? "guest" : "host");
    writeFirebase(whoseTurnFilePath, newWhoseTurn);
}
async function displayGameBox(playerInformation) {
    const whoseTurnFilepath = "lobbies/" + hostID + "/gameInformation/whoseTurn";
    const whoseTurn = await readFirebase(whoseTurnFilepath);

    if (playerInformation == undefined) {
        // This is the first time the user has landed on the game page
        // Therefore, they cannot be shown the other users guess, or if they are too high or too low,
        // Because they have not guessed yet
        // Therefore, do not set up the box, just show the defaults

        console.log("first time huh. Can tell by the look of ya");
        if ((whoseTurn == "host" && isHost) || (whoseTurn == "guest" && !isHost)) {
            changeToGTNBox("your-turn-box");
        } else {
            changeToGTNBox("not-your-turn-box");
        }
    } else {
        const targetFilepath = "lobbies/" + hostID + "/gameInformation/number";
        const target = await readFirebase(targetFilepath);

        if ((whoseTurn == "host" && isHost) || (whoseTurn == "guest" && !isHost)) {
            setupNotYourTurnBox(playerInformation, target);
            changeToGTNBox("your-turn-box");
        } else {
            setupNotYourTurnBox(playerInformation, target);
            changeToGTNBox("not-your-turn-box");
        }
    }

    // When the player information changes (the players make a guess), update the gamebox
    const playerInformationFilePath = "lobbies/" + hostID + "/playerInformation";
    const unsubscribe = addListenerFirebase(playerInformationFilePath, (data) => {
        displayGameBox(data);
        unsubscribe();
    });
    function setupNotYourTurnBox(playerInformation, target) {
        // Read the user's previous guess and tell them if they are too high or too low
        const usersGuess = (isHost) ? playerInformation.host.latestGuess : playerInformation.guest.latestGuess;

        if (usersGuess > target) {
            document.getElementById("how-far-off").innerHTML = usersGuess + " is too high";
        } else if (usersGuess < target) {
            document.getElementById("how-far-off").innerHTML = usersGuess + " is too low";
        } else {
            document.getElementById("how-far-off").innerHTML = usersGuess + " is correct! Good job. This should not be showing an you should get redirected";
        }
    }
    function setupYourTurnBox(playerInformation, target) {
        // Display the opponents lastest guess unless they haven't had their first guess yet
        const opponentsGuess = (isHost) ? playerInformation.guest.latestGuess : playerInformation.host.latestGuess;
           
        if (usersGuess > target) {
            document.getElementById("opponent-guess").innerHTML = "Your opponent guessed: " + opponentsGuess + " (it was too high)";
        } else if (usersGuess < target) {
            document.getElementById("opponent-guess").innerHTML = "Your opponent guessed: " + opponentsGuess + " (it was too low)";
        } else {
            document.getElementById("opponent-guess").innerHTML = "Your opponent got it right: " + opponentsGuess;
        }
    }
}

/*******************************************
 * Simple function to swap the GTN box
 *******************************************/
function changeToGTNBox(GTNBox) {
	var allGTNBoxes = document.getElementsByClassName("gtn-box");
	for (var i = 0; i < allGTNBoxes.length; i++) {
		allGTNBoxes[i].style.display = ("none");
	}
   document.getElementById(GTNBox).style.display = ("block");

	/**
	 * GTNboxes:
     * landing-page-box
     * waiting-for-guest-box
     * your-turn-box
     * not-your-turn-box
     * game-over-box
     * waiting-for-rematch-box
     * opponent-left-box
     */
}