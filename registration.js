



var userID;



/**
 * Sign up button logic, will check if the user is already signed up
 * If they are, take them to the already a user box,
 * if they aren't take them to the sign up page
 */
function signUp() {
    console.log("sign up");
    googleAuth = runGoogleAuth();
    userID = googleAuth.user.uid;

    var allreadySignedUp = checkSignedUp();
    if (allreadySignedUp) {
        changeToRegBox("already-a-user-box");
    } else {
        changeToRegBox("sign-up-box");
    }
}
function checkSignedUp() {
    console.log("working");

    const FILEPATH = "userPublicDetails/";
    readFirebase(FILEPATH).then((userList) => {
        console.log(userList);
        
        for (let user in userList) {
            if (user == userID) {
                console.log("User is already signed up");
                return true;
            }
        }
        return false;
    }).catch((error) => {
        console.log("Error with checking if user is signed up");
        console.log(error);
        return null;
    });
}

function skipToSignUpPage() {}
function login() {}
function submit() {}
function keepOldAccount() {}
function makeNewAccount() {}

function changeToRegBox(regBox) {
    var allRegBoxes = document.getElementsByClassName("reg-box");
    for (var i = 0; i < allRegBoxes.length; i++) {
        allRegBoxes[i].style.display = ("none");
    }
    document.getElementById(regBox).style.display = "flex";
}