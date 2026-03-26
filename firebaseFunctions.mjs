// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, get, update, query, orderByChild, limitToFirst, limitToLast, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

var database;
var googleAuth;
var userID;

// Functions to initialise and authenticate
function initialiseFirebase() {
    const FB_GAMECONFIG = {
        apiKey: "AIzaSyDyKVbIE0T5C62PV7mFtLm4gAuewL0zPVQ",
        authDomain: "scott-barlow-y13-compsci.firebaseapp.com",
        projectId: "scott-barlow-y13-compsci",
        storageBucket: "scott-barlow-y13-compsci.firebasestorage.app",
        messagingSenderId: "14148227974",
        appId: "1:14148227974:web:73630eff747dc5d0e21207",
        measurementId: "G-2DY0WENQT4",
        databaseURL: "https://scott-barlow-y13-compsci-default-rtdb.asia-southeast1.firebasedatabase.app"
    };
    
    const FB_GAMEAPP = initializeApp(FB_GAMECONFIG);
    database = getDatabase(FB_GAMEAPP);
    console.info(database); //DIAG
}
function runGoogleAuth() {
    const AUTH = getAuth();
    const PROVIDER = new GoogleAuthProvider();

    // The following makes Google ask the user to select the account
    PROVIDER.setCustomParameters({
        prompt: 'select_account'
    });
    return signInWithPopup(AUTH, PROVIDER).then((result) => {
        googleAuth = result;
        console.log(googleAuth); //DIAG

        console.log("Authentication successful"); //DIAG
        console.log("User Email: " + googleAuth._tokenResponse.email); //DIAG
        console.log("User Local ID: " + googleAuth.user.uid); //DIAG

        userID = googleAuth.user.uid;

        return googleAuth;
    }).catch((error) => {
        console.log("Authentication unsuccessful"); //DIAG
        console.log(error); //DIAG
    });
}
// Functions to read stuff from the database
function readFirebase(FILEPATH) {
    const REF = ref(database, FILEPATH);

    return get(REF).then((snapshot) => {
        console.log("get is working"); //DIAG

        var data = snapshot.val();

        if (data != null) {
            console.log("Successfully read database information:");
            console.log(data);
            return data;
        } else {
            console.log("Attempting to read a value that doesn't exist");
            console.log(data);
            return null
        }
    }).catch((error) => {
        console.log("Error with reading the database");
        console.log(error);
        return null
    });
}

// Functions to write to the database
function writeToFirebase(FILEPATH, DATA) {
    const REF = ref(fb_gameDB, FILEPATH);

    set(REF, DATA).then(() => {
        console.log("Written the following information to the database:");
        console.log(DATA);
    }).catch((error) => {
        console.log("Error with writing to the database");
        console.log(error);
    });
}

initialiseFirebase();
window.initialiseFirebase = initialiseFirebase;
window.runGoogleAuth = runGoogleAuth;
window.readFirebase = readFirebase;