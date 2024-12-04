$(document).ready(function () {

    let now = new Date().toISOString().slice(0, 10);
    document.getElementById('filter-date').value = now;
    FillAppointmentTable();
    Fill_cs();
    Fill_k();

    // add event
    document.getElementById("btn-add").addEventListener("click", function () {
        document.querySelector(".apmt-info").classList.add("show");
    });
    document.getElementById('btn-close-apmt-info').addEventListener('click', function () {
        document.querySelector(".apmt-info").classList.remove("show");
    });
    document.getElementById("apmt-department").addEventListener("change", function () {
        if ($("#apmt-department").value != "none") {
            Fill_bs();
        }
    });
    document.querySelector(".userdropdown-icon").addEventListener("click", function () {
        document.querySelector(".dropdown-menu").classList.toggle("hide"); document.querySelector(".dropdown-menu").classList.toggle("show");
    });
});
// declare
let itemsPerPage = 11;
let CurrentPage_qldl = 1;

// function
{
    // fill data
    function FillAppointmentTable() {
        $.getJSON("/data/LichDat.json",
            function (lstApmt) {
                let lst = JSON.parse(localStorage.getItem("Appointments"));
                Array.from(lst).forEach(a => lstApmt.push(a));

                const startIndex = (CurrentPage_qldl - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const pageData = lstApmt.reverse().slice(startIndex, endIndex);
                let table = document.getElementById("TableAmpt");
                let head = `
                    <thead>
                        <tr>
                            <th>Tên bệnh nhân</th>
                            <th>Thời gian</th>
                            <th>Cơ sở y tế</th>
                            <th>Tên bác sĩ</th>
                            <th>Trạng thái</th>
                            <th>Ghi chú</th>
                        </tr>
                    </thead>
                `;
                // Hiển thị
                FillTable(head, pageData, table);
                // Cập nhật phân trang
                renderPagination(lstApmt.length);
            }
        );
    }
    // fill bảng
    function FillTable(head, body, ElementTable) {
        FillTableHead(head, ElementTable);
        let lstData = [];
        body.forEach(Apmt => {
            let apmtData = [];
            apmtData.push(Apmt.patient.name);
            apmtData.push(Apmt.dateTime);
            apmtData.push(Apmt.facility.name);
            apmtData.push(Apmt.doctor.name);
            apmtData.push(Apmt.status.name);
            apmtData.push(Apmt.note);
            lstData.push(apmtData);
        });
        FillTableBody(lstData, ElementTable);

    }
    function FillTableHead(data, ElementTable) {
        ElementTable.innerHTML = data;
    }
    function FillTableBody(lstData, ElementTable) {
        let tbody = document.createElement("tbody");
        lstData.forEach(row => {
            let ele_tr = document.createElement('tr');
            row.forEach(cell => {
                let ele_td = document.createElement('td');
                ele_td.textContent = cell;
                ele_tr.appendChild(ele_td);
            });
            tbody.appendChild(ele_tr);
        });
        ElementTable.append(tbody);
    }
    function Fill_cs() {
        let lstcs = [
            { "id": "hn", "name": "BVĐK Tâm Anh Hà Nội" },
            { "id": "hcm", "name": "BVĐK Tâm Anh TP.Hồ Chí Minh" },
            { "id": "q8", "name": "BVĐK Tâm Anh Quận 8" },
            { "id": "q7", "name": "Phòng khám ĐK Tâm Anh Quận 7" }
        ]
        let cbo_cs = document.getElementById("apmt-facility");
        lstcs.forEach(cs => {
            let opt = document.createElement('option');
            opt.value = cs.id;
            opt.textContent = cs.name;
            cbo_cs.appendChild(opt);
        });
    }
    function Fill_k() {
        $.getJSON("/data/ChuyenKhoa.json",
            function (lst_k) {
                let cbo_k = document.getElementById("apmt-department");
                lst_k.forEach(department => {
                    let opt = document.createElement('option');
                    opt.value = department.id;
                    opt.textContent = department.name;
                    cbo_k.appendChild(opt);
                });
            }
        );
    }
    function Fill_bs() {
        $.getJSON("/data/BacSi.json",
            function (lst_bs) {
                let cbo_k = document.getElementById("apmt-department");
                let cbo_bs = document.getElementById("apmt-doctor");
                cbo_bs.innerHTML = `<option value="none">Chọn bác sĩ</option>`;
                let lst_bs_show = lst_bs.filter(doc => doc.department == cbo_k.value);
                lst_bs_show.forEach(doc => {
                    let opt = document.createElement('option');
                    opt.value = doc.id;
                    opt.textContent = doc.name;
                    cbo_bs.appendChild(opt);
                });
            });
    }
    // phân trang 
    function renderPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        let pagination = document.querySelector('.pagination');
        pagination.innerHTML = '';
        let pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                i === CurrentPage_qldl ||
                i === CurrentPage_qldl - 2 ||
                i === CurrentPage_qldl - 1 ||
                i === CurrentPage_qldl + 1 ||
                i === CurrentPage_qldl + 2
            ) {
                pageNumbers.push(i);
            }
        }

        pageNumbers.forEach(pageNum => {
            let pageBtn = document.createElement('button');
            pageBtn.classList.add('pagination-item');
            if (pageNum === CurrentPage_qldl) {
                pageBtn.classList.add('active');
            }
            pageBtn.textContent = pageNum;
            pageBtn.onclick = () => changePage(pageNum, totalItems);
            pagination.appendChild(pageBtn);
        });

        // prev - next
        document.querySelector(".btn-prev").onclick = () => changePage(CurrentPage_qldl - 1, totalItems);
        document.querySelector(".btn-next").onclick = () => changePage(CurrentPage_qldl + 1, totalItems);
    }
    function changePage(page, maxPage) {
        if (page < 1 || page > Math.ceil(maxPage / itemsPerPage)) return;
        CurrentPage_qldl = page;
        FillAppointmentTable();
    }
}