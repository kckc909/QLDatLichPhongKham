$(document).ready(function () {
    var lstdoctorJson;
    var CurrentPage = 1;
    var numberOnPage = 10;
    var minPage = 1;
    var maxPage;

    toggle_content('gt', 'ck-gt');
    toggle_header();
    importDepartment();

    document.getElementById("gt-link").addEventListener("click", () => toggle_content("gt", 'ck-gt'));
    document.getElementById("bs-link").addEventListener("click", () => toggle_content("bs", 'ck-bs'));
    document.getElementById("dv-link").addEventListener("click", () => toggle_content("dv", 'ck-dv'));
    document.getElementById("gt").addEventListener("click", () => toggle_content("gt", 'ck-gt'));
    document.getElementById("bs").addEventListener("click", () => toggle_content("bs", 'ck-bs'));
    document.getElementById("dv").addEventListener("click", () => toggle_content("dv", 'ck-dv'));
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


    function toggle_content(cklink, ckcls) {
        let link = document.getElementById(cklink);
        let ckct = document.getElementsByClassName(ckcls);

        Array.from(document.getElementsByClassName("ck-link-a")).forEach(a => a.classList.remove("active"));
        link.classList.add('active');

        Array.from(document.getElementsByClassName("ck-ct")).forEach(ct => ct.classList.remove("show"));
        Array.from(ckct).forEach(function (ct) {
            if (!ct.classList.contains("hide")) {
                ct.classList.add('show')
            }
        });
    }

    function toggle_header() {
        let header = document.querySelectorAll(".ck-ct .header");
        Array.from(header).forEach(a => a.addEventListener("click", function () {
            Array.from(a.querySelectorAll(".header-icon-toggle")).forEach(b => b.classList.toggle("hide"));
            a.parentElement.querySelector('.body').classList.toggle("show");
        }));
    }

    function importDepartment() {
        let param = new URLSearchParams(window.location.search);
        let id = param.get("id");
        // nạp tt ck
        $.getJSON("/data/ChuyenKhoa.json", function (lstck) {
            let ck = lstck.find(c => c.id == id);
            if (ck.banner) {
                document.querySelector(".banner-bg img").src = ck.banner;
            }
            if (ck.name) {
                document.getElementById("ck-name").innerHTML = ck.name;
            }
            if (ck.introduction) {
                document.getElementById("ck-introduction").querySelector('.body').innerHTML = ck.introduction;
            }
            else {
                document.getElementById("ck-introduction").querySelector('.body').innerHTML = "Chuyên khoa này chưa có mô tả";
            }
            if (ck.equipment) {
                let bdequip = document.getElementById("ck-equipment").querySelector('.body');
                bdequip.innerHTML = "";
                if (Array.isArray(ck.equipment)) {
                    Array.from(ck.equipment).forEach(function (e) {
                        let equipitem = document.createElement('div');
                        let equipname = document.createElement('div');
                        let equipdes = document.createElement('div');

                        equipname.classList.add("ck-equipment-name");
                        equipdes.classList.add("ck-equipment-description");

                        equipname.innerHTML = e.name;
                        equipdes.innerHTML = e.description;
                        equipitem.appendChild(equipname);
                        equipitem.appendChild(equipdes);

                        bdequip.appendChild(equipitem);
                    });
                } else {
                    bdequip.innerHTML = ck.equipment;
                }
            }
            else {
                document.getElementById("ck-equipment").classList.add("hide");
                document.getElementById("ck-equipment").classList.remove("show");
            }
            if (ck.treament) {
                document.getElementById("ck-treatment").querySelector('.body').innerHTML = ck.treatment;
            }
            else {
                document.getElementById("ck-treatment").classList.add("hide");
                document.getElementById("ck-treatment").classList.remove("show");
            }
            if (ck.service) {
                document.getElementById("ck-service").querySelector('.body').innerHTML = ck.service;
            }
            else {
                document.getElementById("ck-service").classList.remove("show");
                document.getElementById("ck-service").classList.add("hide");
            }
            if (ck.forpatient) {
                document.getElementById("ck-forpatient").querySelector('.body').innerHTML = ck.forpatient;
            }
            else {
                document.getElementById("ck-forpatient").classList.add("hide");
                document.getElementById("ck-forpatient").classList.remove("show");
            }
            if (ck.blog) {
                let blog = document.getElementById("ck-blog");
                let blog_body = blog.querySelector('.body');
                blog_body.innerHTML = "";

                if (Array.isArray(ck.blog)) {
                    Array.from(ck.blog).forEach(function (blog) {
                        let blog_content = `
                            <div class="blog-item">
                            <div class="blog-img">
                                <img src="${blog.image}" alt="">
                            </div>
                            <div class="blog-content">
                                <div class="blog-title">
                                    ${blog.title}
                                </div>
                                <div class="blog-description">
                                    ${blog.description}
                                </div>
                            </div>
                        </div>
                        `;
                        blog_body.innerHTML += blog_content;
                    });
                } else {
                    blog.classList.add("hide");
                }
            }
            else {
                document.getElementById("ck-blog").classList.add("hide");
            }
        });
        // nạp danh sách bác sĩ
        $.getJSON("/data/BacSi.json", function (lstbs) {
            lstdoctorJson = lstbs.filter(b => b.department === id);
            maxPage = Math.ceil(lstdoctorJson.length / numberOnPage)
            FillListDoctor(CurrentPage);
        });
    }
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

        if (minPage == maxPage) {
            return;
        }

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