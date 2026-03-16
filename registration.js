

function signUp() {
    console.log("sing up");
    runGoogleAuth();
}

function changeToRegBox(regBox) {
    var allRegBoxes = document.getElementsByClassName("reg-box");
    for (var i = 0; i < allRegBoxes.length; i++) {
        allRegBoxes[i].style.display = ("none");
    }
    document.getElementById(regBox).style.display = "flex";
}

// changeToRegBox("not-logged-in-box");