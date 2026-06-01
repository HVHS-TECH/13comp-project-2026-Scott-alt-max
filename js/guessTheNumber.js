var isHost;
var hostID;

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
}
async function joinLobby(lobbyInfo) {
    // Write the guestName to firebase
    const guestNameFilePath = `userPublicDetails/${await getUserIDFirebase()}/name`;
    const guestName = await readFirebase(guestNameFilePath);

    const playerInfoFilepath = `lobbies/${hostID}/playerInformation/guest`;
    writeFirebase(playerInfoFilepath, {"name": guestName});
    
    // Change user to the game page
    displayGameBox();
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

/**
 * Write the guess to firebase
 * Either writes to hostGuess or guestGuess
 * Will increase the current round if it is the guestGuess
 * Will also change whoseTurn in firebase, which will trigger the box to change
 */
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

async function displayGameBox() {
    const whoseTurnFilepath = "lobbies/" + hostID + "/gameInformation/whoseTurn";
    const whoseTurn = await readFirebase(whoseTurnFilepath);

    if ((whoseTurn == "host" && isHost) || (whoseTurn == "guest" && !isHost)) {

        // Display the opponents lastest guess unless they haven't had their first guess yet
        const opponentHostOrGuest = (isHost) ? "guest" : "host";
        const opponentsGuessFilepath = "lobbies/" + hostID + "/playerInformation/" + opponentHostOrGuest + "/latestGuess";
        const opponentsGuess = await readFirebase(opponentsGuessFilepath);
        
        console.log(opponentsGuessFilepath);
        document.getElementById("opponent-guess").innerHTML = "Your opponent guessed: " + opponentsGuess;
        // if (opponentsGuess == null) {
        //     document.getElementById("opponent-guess").innerHTML = "";
        // } else {
        //     document.getElementById("opponent-guess").innerHTML = "Your opponent guessed: " + opponentsGuess;
        // }

        changeToGTNBox("your-turn-box");
    } else {
        
        // Read the user's guess and tell them if they are too high or too low
        const userHostOrGuest = (isHost) ? "host" : "guest";
        const usersGuessFilepath = "lobbies/" + hostID + "/userInformation/" + userHostOrGuest + "/latestGuess";
        const usersGuess = await readFirebase(usersGuessFilepath);
        console.log("usersGuess:" + usersGuess)
        // TODOTODO

        const targetFilepath = "lobbies/" + hostID + "/gameInformation/number";
        const target = await readFirebase(targetFilepath);

        console.log("user guess filepath: " + usersGuessFilepath);
        document.getElementById("how-far-off").innerHTML = `target${target} guess${usersGuess}`;
        changeToGTNBox("not-your-turn-box");
    }

    // When whose turn changes, change the box accordingly
    const unsubscribe = addListenerFirebase(whoseTurnFilepath, (data) => {
        if (data != whoseTurn) {
            displayGameBox();
            unsubscribe();
        }
    });
}
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