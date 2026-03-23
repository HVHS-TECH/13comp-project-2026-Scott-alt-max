



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
function submit() {}
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