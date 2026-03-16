// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, get, update, query, orderByChild, limitToFirst, limitToLast, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

var fb_gameDB;
var googleAuth;
var uid;

// Functions to initialise and authenticate
function initialiseFirebase() {
    const FB_GAMECONFIG = {
        apiKey: "AIzaSyDyKVbIE0T5C62PV7mFtLm4gAuewL0zPVQ",
        authDomain: "scott-barlow-y13-compsci.firebaseapp.com",
        projectId: "scott-barlow-y13-compsci",
        storageBucket: "scott-barlow-y13-compsci.firebasestorage.app",
        messagingSenderId: "14148227974",
        appId: "1:14148227974:web:73630eff747dc5d0e21207",
        measurementId: "G-2DY0WENQT4"
        // databaseURL: "https://scotty13compsci-default-rtdb.asia-southeast1.firebasedatabase.app"
    };
    
    const FB_GAMEAPP = initializeApp(FB_GAMECONFIG);
    fb_gameDB = getDatabase(FB_GAMEAPP);
    console.info(fb_gameDB); //DIAG
}
function runGoogleAuth() {
    const AUTH = getAuth();
    const PROVIDER = new GoogleAuthProvider();

    // The following makes Google ask the user to select the account
    PROVIDER.setCustomParameters({
        prompt: 'select_account'
    });
    signInWithPopup(AUTH, PROVIDER).then((result) => {
        googleAuth = result;

        console.log("Authentication successful"); //DIAG
        console.log("User Email: " + googleAuth._tokenResponse.email); //DIAG
        console.log("User Local ID: " + googleAuth.user.uid); //DIAG

        uid = googleAuth.user.uid;
    }).catch((error) => {
        console.log("Authentication unsuccessful"); //DIAG
        console.log(error); //DIAG
    });
}

initialiseFirebase();
window.initialiseFirebase = initialiseFirebase;
window.runGoogleAuth = runGoogleAuth;