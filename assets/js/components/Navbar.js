$(document).ready(function () {
    document.addEventListener("click", closeUserMoreInfo);
    CheckLoggedIn();
    CheckPermission();
});

// đăng nhập chưa
function CheckLoggedIn() {
    let LoggedIn = localStorage.getItem("LoggedIn");
    if (LoggedIn === 'true') {
        document.querySelector(".login-register").classList.add("hide");
        document.querySelector(".login-register").classList.remove("show");
        document.querySelector(".user-div").classList.remove("hide");
        document.querySelector(".user-div").classList.add("show");
    } else {
        document.querySelector(".login-register").classList.remove("hide");
        document.querySelector(".login-register").classList.add("show");
        document.querySelector(".user-div").classList.add("hide");
        document.querySelector(".user-div").classList.remove("show");
    }
}

// check permission 
function CheckPermission() {
    let user_role = document.querySelector("#user-role");
    let CurrentUser = JSON.parse(localStorage.getItem("CurrentUser"));
    if (CurrentUser == null) {
        return;
    }
    if (!(CurrentUser.role == 'admin')) {
        user_role.classList.add('hide');
    }
}

// dropdown 
function UserClickHandler() {
    const userInfo = document.querySelector('.user-more-info');
    userInfo.classList.toggle('hide');
    userInfo.classList.toggle('show');
}

// close dropdown
function closeUserMoreInfo(event) {
    const umi = document.querySelector(".user-more-info");
    const user = document.querySelector(".user");
    if (!user.contains(event.target) && !umi.contains(event.target)) {
        umi.classList.add('hide');
        umi.classList.remove('show');
    }
}

// đăng xuất
function LoggedOut() {
    localStorage.setItem("LoggedIn", false);
    localStorage.setItem("CurrentUser", null);
    UserClickHandler();
    CheckLoggedIn();
    location.reload();
}
