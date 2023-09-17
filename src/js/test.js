var GoogleAuth;
//var SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';
var SCOPE = 'https://www.googleapis.com/auth/youtube';
function handleClientLoad() {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    gapi.load('client:auth2', initClient);
}

function initClient() {
// In practice, your app can retrieve one or more discovery documents.
var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest';

// Initialize the gapi.client object, which app uses to make API requests.
// Get API key and client ID from API Console.
// 'scope' field specifies space-delimited list of access scopes.
gapi.client.init({
    'apiKey': 'AIzaSyAKmYTR0Mb9sVv4R_dYM17fEbd1KBEg7FE',
    'clientId': '951459986087-agp10roobts522ol25equ5dbfv9o7gke.apps.googleusercontent.com',
    //'discoveryDocs': [discoveryUrl],
    'scope': SCOPE
}).then(function () {
    GoogleAuth = gapi.auth2.getAuthInstance();

    // Listen for sign-in state changes.
    GoogleAuth.isSignedIn.listen(updateSigninStatus);
    

    // Handle initial sign-in state. (Determine if user is already signed in.)
    var user = GoogleAuth.currentUser.get();
    setSigninStatus();

    // Call handleAuthClick function when user clicks on
    //      "Sign In/Authorize" button.
    document.querySelector("#login").addEventListener("click" , ()=>{ handleAuthClick() })
    document.querySelector("#logout").addEventListener("click", ()=>{ revokeAccess() })
});
}
function handleAuthClick() {
    if (GoogleAuth.isSignedIn.get()) {
        // User is authorized and has clicked "Sign out" button.
        GoogleAuth.signOut();
    } else {
        // User is not signed in. Start Google auth flow.
        GoogleAuth.signIn();
    }
}


function revokeAccess() {
    GoogleAuth.disconnect();
}

function setSigninStatus() {
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized) {
        /* $('#sign-in-or-out-button').html('Sign out');
        $('#revoke-access-button').css('display', 'inline-block');
        $('#auth-status').html('You are currently signed in and have granted ' +
            'access to this app.');*/
        alert('You are currently signed in and have granted ' + 'access to this app')
    } else {
            /*
            $('#sign-in-or-out-button').html('Sign In/Authorize');
            $('#revoke-access-button').css('display', 'none');
            $('#auth-status').html('You have not authorized this app or you are ' +
            'signed out.');*/
        alert('You have not authorized this app or you are ' + 'signed out')
    }
}

function updateSigninStatus() {
    setSigninStatus();
}
