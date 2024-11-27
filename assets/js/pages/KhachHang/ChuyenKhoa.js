$(document).ready(function () {
    localStorage.setItem("currentPage_ck", "1");
    let _currentPage = 1;
    const _numOnPage = 12;
    let _minOfPage = 1;
    let _maxOfPage = null;
    let data_lst_ck = [];

    // Lấy dữ liệu JSON
    $.getJSON("/data/ChuyenKhoa.json", function (data) {
        data_lst_ck = data;
        _maxOfPage = Math.ceil(data_lst_ck.length / _numOnPage);

        ChangePage(1);

        // Gán sự kiện cho nút chuyển trang
        $(".prev-page").click(PrevPageClickHandler);
        $(".next-page").click(NextPageClickHandler);
    });

    // Hiển thị danh sách chuyên khoa
    function LoadListCK() {
        let _list_ck = document.querySelector(".list-ck");
        _list_ck.innerHTML = "";

        let start = (_currentPage - 1) * _numOnPage;
        let end = start + _numOnPage;
        if (end > data_lst_ck.length) {
            end = data_lst_ck.length;
        }

        for (let i = start; i < end; i++) {
            let data_ck = data_lst_ck[i];
            let card_ck = document.createElement("div");
            let img_ck = document.createElement("div");
            let img = document.createElement("img");
            let name_ck = document.createElement("div");

            img.src = data_ck.imagePath;
            name_ck.textContent = data_ck.name;
            card_ck.classList.add("card-ck");
            img_ck.classList.add("img-ck");
            name_ck.classList.add("name-ck");

            card_ck.addEventListener("click", function () {
                window.location.href = `/pages/KhachHang/ChuyenKhoaChiTiet.html?id=${data_ck.id}`;
            });

            img_ck.appendChild(img);
            card_ck.appendChild(img_ck);
            card_ck.appendChild(name_ck);
            _list_ck.appendChild(card_ck);
        }
    }

    // Tạo số trang
    function CreatePagination() {
        let _pagination = document.querySelector(".pagination");
        _pagination.innerHTML = "";

        AddPageNumber(_minOfPage, _pagination, _currentPage == _minOfPage? true: false);
        if (_currentPage - 2 > _minOfPage) {
            AddPageNumber(_currentPage - 2, _pagination);
        }
        if (_currentPage - 1 > _minOfPage) {
            AddPageNumber(_currentPage - 1, _pagination);
        }
        if (_currentPage != _minOfPage && _currentPage != _maxOfPage) {
            AddPageNumber(_currentPage, _pagination, true);
        }
        if (_currentPage + 1 < _maxOfPage) {
            AddPageNumber(_currentPage + 1, _pagination);
        }
        if (_currentPage + 2 < _maxOfPage) {
            AddPageNumber(_currentPage + 2, _pagination);
        }
        AddPageNumber(_maxOfPage, _pagination, _currentPage == _maxOfPage? true: false);
    }

    // Thêm số trang
    function AddPageNumber(num, pagination, isActive = false) {
        let pageNumber = document.createElement("div");
        pageNumber.classList.add("page-number");
        if (isActive) {
            pageNumber.classList.add("active");
        }
        pageNumber.textContent = num;
        pageNumber.addEventListener("click", () => ChangePage(num));
        pagination.appendChild(pageNumber);
    }

    // Chuyển trang trước
    function PrevPageClickHandler() {
        if (_currentPage > _minOfPage) {
            ChangePage(_currentPage - 1);
        }
    }

    // Chuyển trang tiếp theo
    function NextPageClickHandler() {
        if (_currentPage < _maxOfPage) {
            ChangePage(_currentPage + 1);
        }
    }

    // Thay đổi trang
    function ChangePage(num) {
        _currentPage = num;
        localStorage.setItem("currentPage_ck", num);
        LoadListCK();
        CreatePagination();
    }


});
