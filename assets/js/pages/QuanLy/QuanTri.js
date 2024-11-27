$(document).ready(function () {
    let cu = JSON.parse(localStorage.getItem('CurrentUser'));

    LoadCurrentUserInformation();


    // load information 
    function LoadCurrentUserInformation() {
        let user_name = document.querySelector(".user-name");
        let user_email = document.querySelector(".user-email");

        if (cu) {
            user_name.innerText = cu.role + ": " + cu.name;
            user_email.innerText = cu.email;
        }
    }

});

