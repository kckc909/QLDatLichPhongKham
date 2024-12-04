$(document).ready(function () {
    let cu = JSON.parse(localStorage.getItem('CurrentUser'));

    LoadCurrentUserInformation(cu);



    document.querySelector(".userdropdown-icon").addEventListener("click", function () {
        document.querySelector(".dropdown-menu").classList.toggle("hide"); document.querySelector(".dropdown-menu").classList.toggle("show");
    });
});
// function
{
    // load information 
    function LoadCurrentUserInformation(cu) {
        let user_name = document.querySelector(".user-name");
        let user_email = document.querySelector(".user-email");

        if (cu) {
            user_name.innerText = cu.role + ": " + cu.name;
            user_email.innerText = cu.email;
        }
    }
    // Sinh dữ liệu ngẫu nhiên
    function generateRandomData(points, displacement) {
        const data = [];
        let num = Math.ceil(Math.random() * 100);
        for (let i = 0; i < points; i++) {
            let ran = num + Math.floor(Math.random() * displacement) - (displacement / 2);
            if (ran <= 0) {
                ran = - ran;
            }
            data.push(ran);
        }
        return data;
    }
}