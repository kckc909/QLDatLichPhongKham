$(document).ready(function () {



    BtnToggle();

    function BtnToggle() {
        const list = document.querySelector(".list_thietbi");
        document.querySelectorAll(".btn-toggle-list").forEach(btn => btn.addEventListener("click", function () {
            list.classList.toggle("hidden");
            list.classList.toggle("show");
            document.querySelectorAll(".btn-toggle-list").forEach(btn => btn.classList.toggle("hidden"));
        }));
    }

})