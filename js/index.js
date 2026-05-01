

const tbody = document.querySelector(".leaderboard tbody");
var numberOfRows = 5;

async function readLeaderboardByKey(key) {
    const FILEPATH = "userPublicDetails";
    const snapshot = await readSortedFirebase(FILEPATH, key, numberOfRows);

    console.log(snapshot);
}
    // Add the top scores to the highscore table
//     const tableRows = tbody.children;
//     for (const row of tableRows) {

//     }

//     snapshot.forEach((userInformation) => {
//         const row = document.createElement("tr");
//         row.innerHTML = `<td>${userInformation.val().userName}</td><td>${userInformation.val().mazeGameHighScore}</td><td>${userInformation.val().coinGameHighScore}</td>`;
//         tbody.prepend(row);
//     });

//     // Remove arrows from all other elements and add it to this one
//     document.querySelectorAll(".arrows").forEach((span) => span.innerHTML = "");
//     element.querySelector("span").innerHTML = "▼";
// }
// function updateRow(row, userInformation) {
//     row.querySelector("td:nth-child(2)").textContent = userInformation.mazeGameHighScore;
//     row.querySelector("td:nth-child(3)").textContent = userInformation.coinGameHighScore;
// }

// TODO
// Readsorted isnt defined for some reason
// Add checks for invalid keys and filepaths on the readSorted
// Check that the read sorted function actually sorts the children
readLeaderboardByKey("gamesPlayed");