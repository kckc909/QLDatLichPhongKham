let doctorList;
let doctors = [];
let currentPage = 1;
let itemsPerPage = 10;
// run
$(document).ready(function () {
    $.getJSON("/data/BacSi.json", function (data) {
        doctors = data;
        renderDoctors();
        renderPagination(doctors.length);
    });
});

// function
{

    function renderDoctors() {
        doctorList = document.getElementById('doctor-body');
        doctorList.innerHTML = '';
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        let pagedata = doctors.slice(startIndex, endIndex);

        pagedata.forEach((doctor, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${index + 1}</td>
            <td><img src="${doctor.image}" alt="${doctor.name}" /></td>
            <td>${doctor.name}</td>
            <td>${doctor.position}</td>
            <td>${doctor.department}</td>
            <td>${doctor.facility}</td>
            <td>
            <button class="btn btn-edit">Sửa</button>
            <button class="btn btn-delete">Xóa</button>
            </td>
            `;
            doctorList.appendChild(row);
        });
    }
    ///pagintation
    function renderPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        let pagination = document.querySelector('.pagination');
        pagination.innerHTML = '';
        let pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                i === currentPage ||
                i === currentPage - 2 ||
                i === currentPage - 1 ||
                i === currentPage + 1 ||
                i === currentPage + 2
            ) {
                pageNumbers.push(i);
            }
        }

        pageNumbers.forEach(pageNum => {
            let pageBtn = document.createElement('button');
            pageBtn.classList.add('pagination-item');
            if (pageNum === currentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.textContent = pageNum;
            pageBtn.onclick = () => changePage(pageNum, totalItems);
            pagination.appendChild(pageBtn);
        });

        // prev - next
        document.querySelector(".btn-prev").onclick = () => changePage(currentPage - 1, totalItems);
        document.querySelector(".btn-next").onclick = () => changePage(currentPage + 1, totalItems);
    }
    function changePage(page, maxPage) {
        if (page < 1 || page > Math.ceil(maxPage / itemsPerPage)) return;
        currentPage = page;
        FillAppointmentTable();
    }
}