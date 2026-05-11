

const tbody = document.querySelector(".leaderboard tbody");
var desiredNumberOfRows = 5;

// Functions for sorting the leaderboard and adding rows to the table

async function sortBy(key, element) {
    // Read the highscores from firebase
    const FILEPATH = "userPublicDetails";
    const sortedData = Object.values(
        await readSortedFirebase(FILEPATH, key, desiredNumberOfRows));

    //Add the top scores to the highscore table
    tbody.innerHTML = "";

    sortedData.forEach((userInformation) => {
        prependRow(userInformation, sortedData.length);
    });

    // Change the arrow to be on the column that is being sorted by
    document.querySelectorAll(".sortable").forEach((header) => {
        header.classList.remove("sort-by");
    });
    element.classList.add("sort-by");
}
function prependRow(userInformation, totalRows) {
    const row = document.createElement("tr");
    var rank = totalRows - tbody.childElementCount;
    row.innerHTML = `
        <td>${rank}</td>
        <td>${userInformation.name}</td>
        <td>${userInformation.mazeGameHighScore}</td>
        <td>${userInformation.gamesPlayed}</td>
        <td>${userInformation.winRate}</td>
        <td class="edit"><span class="material-symbols-outlined" onclick="editRow(this.parentElement.parentElement)">edit</span></td>`;
    tbody.prepend(row);
}

// Functions for all of the admin editing stuff

// TODO
// Make it write the information to the database with each users' userID
// Make it be able to read all of the private information
// Make it so that this only works for admins
function editRow(row) {
    // Read the current values from the row and store them in a array
    const oldRow = row;

    // Skip the rank and edit columns, but change the other cells to be inputs
    for (let i = 1; i < row.children.length - 1; i++) {
        row.children[i].innerHTML = `
            <input class="edit-input" type="text" value="${row.children[i].innerText}">`;
    }

    // Now change the edit icon to be both a check mark and an X
    const editCell = row.children[row.children.length - 1];
    editCell.innerHTML = `
        <span class="material-symbols-outlined" onclick="cancelEdit(${row}, ${oldRow})">close</span>
        <span class="material-symbols-outlined" onclick="submitEdit(${row})">check</span>
    `;

    // TODO
    // const editCell = row.lastElementChild;

    // const closeBtn = Object.assign(document.createElement("span"), {
    //     className: "material-symbols-outlined",
    //     textContent: "close"
    // });

    // const checkBtn = Object.assign(document.createElement("span"), {
    //     className: "material-symbols-outlined",
    //     textContent: "check"
    // });

    // closeBtn.onclick = () => cancelEdit(row, oldRow);
    // checkBtn.onclick = () => submitEdit(row);

    // editCell.replaceChildren(closeBtn, checkBtn);
}

// Runs when the check is clicked for submitting an edit
function submitEdit(row) {
    // Get the updated values from the input fields
    const updatedValues = [];
    for (let i = 1; i < row.children.length - 1; i++) {
        updatedValues.push(row.children[i].querySelector(".edit-input").value);
    }

    // Here you would typically update the database with the new values
    // For now, we'll just log them
    console.log("Updated Values:", updatedValues);
}

// Runs when the X is clicked for canceling an edit
function cancelEdit(row, oldRow) {
    // Change the cells back to their original values
    row = oldRow;
}


// By default, sort by maze game high score
sortBy("mazeGameHighScore", document.querySelector(".sort-by"));
