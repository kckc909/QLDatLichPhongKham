$(document).ready(async function () {
    var CurrentPage = 1;
    var lstdoctorJson = await $.getJSON("/data/BacSi.json");
    var numberOnPage = 10;
    var minPage = 1;
    var maxPage = Math.ceil(lstdoctorJson.length / numberOnPage);

    // run
    FilterLocationClickHandler();
    changePage(1);
    document.querySelector(".prev-page").addEventListener("click", function () {
        let num = localStorage.getItem("CurrentPage") - 1;
        if (num < 1) {
            num = 1;
        }
        changePage(num);
    });
    document.querySelector(".next-page").addEventListener("click", function () {
        let num = localStorage.getItem("CurrentPage") + 1;
        if (num > 10) {
            num = 10;
        }
        changePage(num);
    });

    // filter location click
    function FilterLocationClickHandler() {
        jQuery(".filter-location").trigger('click');
        jQuery(".click_location").click(function () {
            jQuery(".click_location").removeClass('active');
            jQuery(this).addClass('active');
        });
    };

    // change page
    function changePage(num) {
        CurrentPage = num;
        FillListDoctor(num);
    }

    // doctor -> lstdoctor
    function FillListDoctor(page) {
        let lstdoctor = document.querySelector(".list-doctor");
        let start = (page - 1) * numberOnPage;
        let end = start + numberOnPage;

        lstdoctor.innerHTML = "";
        if (lstdoctorJson.length < end) {
            end = lstdoctorJson.length;
        }
        // create doctor information
        for (let i = start; i < end; i++) {
            let doctor = lstdoctorJson[i];
            // declare
            let doctorCard = document.createElement("div");
            let doctorImg = document.createElement("div");
            let doctorImage = document.createElement("img");
            let doctorinfo = document.createElement("div");
            let doctorname = document.createElement("div");
            let doctorvc = document.createElement("div");
            let doctorhhhv = document.createElement("div");
            let doctorintro = document.createElement("div");
            let moredetail = document.createElement("div");
            // add class
            doctorCard.classList.add("doctor-card");
            doctorCard.classList.add("row");
            doctorImg.classList.add("doctor-img");
            doctorImg.classList.add("col-md-3");
            doctorinfo.classList.add("doctor-info");
            doctorinfo.classList.add("col-md-9");
            doctorname.classList.add("doctor-name");
            doctorvc.classList.add("doctor-cv");
            doctorhhhv.classList.add("doctor-hhhv");
            doctorintro.classList.add("doctor-intro");
            moredetail.classList.add("more-detail");
            // fill content 
            doctorImage.src = doctor.image;
            doctorname.textContent = doctor.name;
            doctorvc.textContent = doctor.position;
            doctorhhhv.textContent = doctor.academic_rank == null ? doctor.academic_rank : "" + " " + doctor.academic_degree == null ? doctor.academic_degree : "";
            doctorintro.textContent = doctor.introduction;
            moredetail.textContent = "Xem chi tiết";
            // event
            doctorCard.addEventListener("click", () => {
                localStorage.setItem('selectedDoctor', JSON.stringify(doctor));
                window.location.href = `/pages/KhachHang/BacSiChiTiet.html?id=${doctor.id}`;
            });
            // import elements
            doctorImg.appendChild(doctorImage);// img
            doctorinfo.appendChild(doctorname);// info
            doctorinfo.appendChild(doctorvc);
            doctorinfo.appendChild(doctorhhhv);
            doctorinfo.appendChild(doctorintro);
            doctorinfo.appendChild(moredetail);
            doctorCard.appendChild(doctorImg);// card
            doctorCard.appendChild(doctorinfo);
            lstdoctor.appendChild(doctorCard);//lst
        };
        SetPageNumbers();
    }

    // create pagenumber
    function SetPageNumbers() {
        let pagination = document.querySelector(".pagination");
        pagination.innerHTML = "";

        let pageNumber = document.createElement("div");
        pageNumber.classList.add("page-number");
        if (CurrentPage == minPage) {
            pageNumber.classList.add("active");
        }
        pageNumber.textContent = minPage;
        pageNumber.addEventListener("click", () => changePage(minPage));
        pagination.appendChild(pageNumber);


        if (CurrentPage - 2 > minPage) {
            pageNumber = document.createElement("div");
            pageNumber.classList.add("page-number");
            pageNumber.textContent = CurrentPage - 2;
            pageNumber.addEventListener("click", () => changePage(CurrentPage - 2));
            pagination.appendChild(pageNumber);
        }
        if (CurrentPage - 1 > minPage) {
            pageNumber = document.createElement("div");
            pageNumber.classList.add("page-number");
            pageNumber.textContent = CurrentPage - 1;
            pageNumber.addEventListener("click", () => changePage(CurrentPage - 1));
            pagination.appendChild(pageNumber);
        }
        if (CurrentPage != minPage && CurrentPage != maxPage) {
            pageNumber = document.createElement("div");
            pageNumber.classList.add("page-number");
            pageNumber.classList.add("active");
            pageNumber.textContent = CurrentPage;
            pageNumber.addEventListener("click", () => changePage(CurrentPage));
            pagination.appendChild(pageNumber);
        }
        if (CurrentPage + 1 < maxPage) {
            pageNumber = document.createElement("div");
            pageNumber.classList.add("page-number");
            pageNumber.textContent = CurrentPage + 1;
            pageNumber.addEventListener("click", () => changePage(CurrentPage + 1));
            pagination.appendChild(pageNumber);
        }
        if (CurrentPage + 2 < maxPage) {
            pageNumber = document.createElement("div");
            pageNumber.classList.add("page-number");
            pageNumber.textContent = CurrentPage + 2;
            pageNumber.addEventListener("click", () => changePage(CurrentPage + 2));
            pagination.appendChild(pageNumber);
        }
        pageNumber = document.createElement("div");
        pageNumber.classList.add("page-number");
        if (CurrentPage == maxPage) {
            pageNumber.classList.add("active");
        }
        pageNumber.textContent = maxPage;
        pageNumber.addEventListener("click", () => changePage(maxPage));
        pagination.appendChild(pageNumber);
    }
});


