var userID;

function signUp() {
    console.log("sign up");
    //googleAuth = runGoogleAuth();
    //userID = googleAuth.user.uid;

    var allreadySignedUp = checkSignedUp();
    if (allreadySignedUp) {

    }
}

function changeToRegBox(regBox) {
    var allRegBoxes = document.getElementsByClassName("reg-box");
    for (var i = 0; i < allRegBoxes.length; i++) {
        allRegBoxes[i].style.display = ("none");
    }
    document.getElementById(regBox).style.display = "flex";
}

function checkSignedUp() {
    console.log("working");

    const FILEPATH = "userPublicDetails/";
    readFirebase(FILEPATH).then((userList) => {
        console.log(userList);
        
        for (user in userList, () => {
            
        });
    });
}
// changeToRegBox("not-logged-in-box");