



var userID;



/**
 * Sign up button logic, will check if the user is already signed up
 * If they are, take them to the already a user box,
 * if they aren't take them to the sign up page
 */
async function signUp() {
    console.log("sign up");

    if (userID == null) {
        googleAuth = await runGoogleAuth();
        userID = googleAuth.user.uid;
    }

    var alreadySignedUp = await checkIsUser();
    if (alreadySignedUp) {
        changeToRegBox("already-a-user-box");
    } else {
        changeToRegBox("sign-up-box");
    }
}
async function checkIsUser() {
    console.log("check is user");

    const FILEPATH = "userPublicDetails/";
    const USERLIST = await readFirebase(FILEPATH);

    console.log(USERLIST);
        
    for (var user in USERLIST) {
        if (user == userID) {
            console.log("User is already signed up");
            return true;
        }
    }
    return false;
}

async function login() {
    console.log("login");
    
    googleAuth = await runGoogleAuth();
    userID = googleAuth.user.uid;

    var alreadySignedUp = await checkIsUser();
    if (alreadySignedUp) {
        goToHomePage();
    } else {
        changeToRegBox("not-a-user-box");
    }
}

function submit() {
    console.log("submit called");
    const NAME = checkValid(document.getElementById('name'));
    const AGE = document.getElementById('age').value;
    const ADDRESS = document.getElementById('address').value;
    const EMAIL = document.getElementById('email').value;
    const SKILL = document.getElementById('skill').value;
    const GAMES_PLAYED = document.getElementById('games-played').value;
    
    const FORM_PRIVATE_DETAILS = {
        age: AGE,
        address: ADDRESS,
        email: EMAIL,
    };
    const FORM_PUBLIC_DETAILS = {
        name: NAME,
        skill: SKILL,
        winRate: 0.00,
        gamesPlayed: GAMES_PLAYED
    };
    
    const PRIVATE_FILEPATH = userID + "/userPrivateDetails";
    const PUBLIC_FILEPATH = userID + "/userPublicDetails";
    //writeToFirebase(PRIVATE_FILEPATH, FORM_PRIVATE_DETAILS);
    //writeToFirebase(PUBLIC_FILEPATH, FORM_PUBLIC_DETAILS);

    //goToHomePage();
}
function checkValid(inputObject) {
    try {
        var value = inputObject.value;

        if (value == null) {
            inputObject.style.border = "2px solid red";
            throw "Value cannot be null";
        } else { 
            return value 
        }
    }
    catch(error) {
        console.log(error);
        return null;
    }
}
function keepOldAccount() {}
function makeNewAccount() {}

function goToHomePage() { window.location.href = "index.html"; }
function changeToRegBox(regBox) {
    var allRegBoxes = document.getElementsByClassName("reg-box");
    for (var i = 0; i < allRegBoxes.length; i++) {
        allRegBoxes[i].style.display = ("none");
    }
    document.getElementById(regBox).style.display = "flex";

    /**
     * Regboxes: 
     * not-logged-in-box
     * not-a-user-box
     * already-a-user-box
     * sign-up-box
     */
}