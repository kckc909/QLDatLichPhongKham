$(document).ready(function () {
    let cu = JSON.parse(localStorage.getItem('CurrentUser'));
    LoadCurrentUserInformation(cu);

    document.querySelector(".userdropdown-icon").addEventListener("click", function () {
        document.querySelector(".dropdown-menu").classList.toggle("hide"); document.querySelector(".dropdown-menu").classList.toggle("show");
    });
    document.getElementById('bs-dd-toggle').addEventListener("click", function () {
        dropdownToggle();
    });
    document.getElementById("btn-logout").addEventListener("click", function () {
        localStorage.setItem('CurrentUser', null);
        window.location.href = "/index.html";
    });
});

// load information 
function LoadCurrentUserInformation(cu) {
    let user_name = document.querySelector(".user-name");
    let user_email = document.querySelector(".user-email");

    if (cu) {
        user_name.innerText = cu.role + ": " + cu.name;
        user_email.innerText = cu.email;
    }
}
// dropdown toggle
function dropdownToggle(){
    document.getElementById("bs-dd-menu").classList.toggle("open");
}