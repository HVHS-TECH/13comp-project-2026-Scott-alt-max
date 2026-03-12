


//document.getElementById("not-logged-in-box").style.display = ("none");
//document.getElementById("not-a-user-box").style.display = ("none");
//document.getElementById("already-a-user-box").style.display = ("none");
//document.getElementById("sign-up-box").style.display = ("none");

function changeToRegBox(regBox) {
    var allRegBoxes = document.getElementsByClassName("reg-box");
    for (var i = 0; i < allRegBoxes.length; i++) {
        allRegBoxes[i].style.display = ("none");
    }
    document.getElementById(regBox).style.display = "flex";
}

changeToRegBox("not-logged-in-box");