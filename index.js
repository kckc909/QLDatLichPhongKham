{
    // slide show
    var myIndex = 0;
    var lstImg = document.getElementsByClassName("img-slide");
    let timer;
    let ColdDown = 3000;

    AddImgSlide();
    NextSlide();
    function AddImgSlide() {
        document.getElementsByClassName("slide")[0]
            .querySelectorAll("img")
            .forEach(is => {
                // is.classList.add("carousel-item");
                is.classList.add("img-slide");
            });
    }

    function NextSlide() {
        lstImg[myIndex].style.display = "none";
        myIndex++;

        if (myIndex >= lstImg.length) {
            myIndex = 0
        }

        lstImg[myIndex].style.display = "block";
        ResetRunTime();
    }

    function PrevSlide() {
        lstImg[myIndex].style.display = "none";
        myIndex--;
        if (myIndex <= 0) {
            myIndex = lstImg.length - 1;
        }
        lstImg[myIndex].style.display = "block";
        ResetRunTime();
    }

    function ResetRunTime() {
        if (timer) {
            clearInterval(timer);
        }
        timer = setInterval(NextSlide, ColdDown);
    }

    document.querySelector(".btn-prev").addEventListener("click", PrevSlide);
    document.querySelector(".btn-next").addEventListener("click", NextSlide);

    // scroll to element with id
    function scrollToSection(event, id) {
        event.preventDefault();

        window.scrollTo({
            top: document.getElementById(id).offsetTop - 200,
            behavior: "smooth"
        });
    }

    function renderdvdb(visibleImagesCount = 5) {
        const db_images = [
            "/assets/image/index/dv-db/dich-vu-cap-cuu-247-tam-anh-1.jpg "
            , "assets/image/index/dv-db/dich-vu-dac-biet-vo-sinh-hiem-muon.jpg "
            , "/assets/image/index/dv-db/dich-vu-tiem-chung-tam-anh.jpg "
            , "/assets/image/index/dv-db/dvdb-giai-phau-benh.jpg "
            , "/assets/image/index/dv-db/dvdb-te-bao-goc.jpg "
            , "/assets/image/index/dv-db/kham-tam-soat-tim-nguoi-lon.jpg"
            , "/assets/image/index/dv-db/khoa-hau-mon-truc-trang.jpg "
            , "/assets/image/index/dv-db/khu-kham-vip-tam-anh.jpg "
            , "/assets/image/index/dv-db/thumbnail-dich-vu-kham-tim-nguoi-lon.jpg "
            , "/assets/image/index/dv-db/thumb-tim-bam-sinh.jpg"
        ];
        const db_imgnames = [
            "Dịch vụ cấp cứu 24/7 tại bệnh viên - phòng khám đa khoa tâm anh"
            , "khám, tư vấn & điều trị vô sinh hiếm muộn"
            , "Triển khai dịch vụ tiêm chủng tại BVĐK Tâm Anh TP.HCM"
            , "Dịch vụ giải phẫu bệnh & tế bào"
            , "Lưu trữ tế bào gốc từ máu và mô dây rốn"
            , "Khám, tầm soát & điều trị bệnh lý mạch máu"
            , "Các dịch vụ của Đơn vị Hậu môn – Trực tràng"
            , "Khu khám vip"
            , "Dịch vụ khám, điều trị bệnh tim mạch cho người lớn"
            , "Khám, tầm soát &amp; Điều trị bệnh tim bẩm sinh"
        ];
        let images =  db_images;
        imgnames = db_imgnames;
        let startIndex = 0;
        const sec = document.getElementById("index-db");
        const carouselImagesContainer = sec.querySelector(".carousel-images");

        function renderImages() {
            carouselImagesContainer.innerHTML = "";
            for (let i = 0; i < visibleImagesCount; i++) {
                const imgIndex = (startIndex + i) % images.length;

                const itemContainer = document.createElement("div");
                itemContainer.classList.add("carousel-item");

                const imgElement = document.createElement("img");
                imgElement.src = images[imgIndex];
                imgElement.classList.add("carousel-image");

                const nameElement = document.createElement("div");
                nameElement.classList.add("carousel-caption");
                nameElement.textContent = imgnames[imgIndex];

                itemContainer.appendChild(imgElement);
                itemContainer.appendChild(nameElement);
                itemContainer.addEventListener("click", function(e) {
                    window.location.href = `/pages/KhachHang/DichVuDacbiet.html`;
                });
                carouselImagesContainer.appendChild(itemContainer);
            }
        }

        // Thêm sự kiện cho các nút trong phạm vi của từng phần tử sec
        sec.querySelector(".carousel-container #nextButton").addEventListener("click", function () {
            startIndex = (startIndex + 1) % images.length;
            renderImages();
        });

        sec.querySelector(".carousel-container #prevButton").addEventListener("click", function () {
            startIndex = (startIndex - 1 + images.length) % images.length;
            renderImages();
        });

        renderImages();
    }
    renderdvdb(4);
    function renderChuyenKhoa() {
        $.getJSON("/data/ChuyenKhoa.json", function (data) {
            let lst = data.slice(0, 10);
            let visibleImagesCount = 5;

            let startIndex = 0;
            const sec = document.getElementById("index-ck");
            const imgsContainer = sec.querySelector(".carousel-images");

            function renderImages() {
                imgsContainer.innerHTML = "";
                for (let i = 0; i < visibleImagesCount; i++) {
                    const index = (startIndex + i) % lst.length;

                    const itemContainer = document.createElement("div");
                    itemContainer.classList.add("carousel-item");

                    const imgElement = document.createElement("img");
                    imgElement.src = lst[index].imagePath;
                    imgElement.classList.add("carousel-image");

                    const nameElement = document.createElement("div");
                    nameElement.classList.add("carousel-caption");
                    nameElement.textContent = lst[index].name;

                    itemContainer.appendChild(imgElement);
                    itemContainer.appendChild(nameElement);
                    itemContainer.addEventListener("click", function(e) {
                        window.location.href = `/pages/KhachHang/ChuyenKhoaChiTiet.html?id=${lst[index].id}`;
                    });

                    imgsContainer.appendChild(itemContainer);
                }
            }

            // Thêm sự kiện cho các nút trong phạm vi của từng phần tử sec
            sec.querySelector(".carousel-container #nextButton").addEventListener("click", function () {
                startIndex = (startIndex + 1) % lst.length;
                renderImages();
            });

            sec.querySelector(".carousel-container #prevButton").addEventListener("click", function () {
                startIndex = (startIndex - 1 + images.length) % lst.length;
                renderImages();
            });

            renderImages();
        });
    }
    renderChuyenKhoa();
}