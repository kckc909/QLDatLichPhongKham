
// run


// event Login
function LoginClickHandler() {
    clearAllErrors();
    CheckUsernamePassword();
}

// check
function CheckUsernamePassword() {
    const username = document.getElementById("text-username").value.trim();
    const password = document.getElementById("text-password").value.trim();
    const accounts = JSON.parse(localStorage.getItem("accounts"));

    if (username == "") {
        showError("text-username", "Vui lòng nhập tài khoản");
        return false;
    }

    if (password == "") {
        showError("text-password", "Vui lòng nhập mật khẩu");
        return false;
    }

    for (let ac of accounts) {
        if (ac.username == username && ac.password == password) {
            alert("Đăng nhập thành công!");
            localStorage.setItem("LoggedIn", "true");
            localStorage.setItem("CurrentUser", JSON.stringify(ac));
            window.location.href = "/index.html";
            return true;
        }
    };

    showError("text-username", "");
    showError("text-password", "Sai tài khoản hoặc mật khẩu");
    return false;
}

// error 
function showError(inputId, errorMessage) {
    const input = document.getElementById(inputId);
    const erlb = document.createElement("div");

    erlb.classList.add("error-message");
    erlb.textContent = errorMessage;

    input.classList.add("error");
    input.scrollIntoView({ behavior: "smooth", block: "center" });

    input.parentElement.insertBefore(erlb, input.nextSibling);
    input.focus();

    input.addEventListener("input", clearErrorOnTyping);
}

function clearAllErrors() {
    const ermsg = document.querySelectorAll(".error-message");
    ermsg.forEach((message) => message.remove());
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => input.classList.remove("error"));
}

function clearErrorOnTyping(event) {
    const input = event.target;
    const ermsg = input.parentElement.querySelector(".error-message");
    if (ermsg && input.classList.contains("error")) {
        ermsg.remove();
        input.classList.remove("error");
    }
}   
