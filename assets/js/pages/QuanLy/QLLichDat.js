// declare
let itemsPerPage = 11;
let CurrentPage_qldl = 1;
let lstAppointments = [];
let _lst_provinces = [];
let _lst_districts = [];
let _lst_wards = [];
let address_province = document.getElementById("address-province");
let address_district = document.getElementById("address-district");
let address_ward = document.getElementById("address-ward");
let Current_Appointment = null;
$(document).ready(function () {

    let now = new Date().toISOString().slice(0, 10);
    document.getElementById('filter-date').value = now;
    FillAppointmentTable();
    Fill_cs();
    Fill_k();

    // add event
    document.getElementById("btn-add").addEventListener("click",
        function () {
            document.getElementById("apmt-facility").value = "none";
            document.getElementById("apmt-department").value = "none";
            document.getElementById("apmt-doctor").innerHTML = `<option value="none">Chọn bác sĩ</option>`;
            document.getElementById('apmt-datetime').value = "";
            document.getElementById("apmt-note").value = "";
            document.getElementById("apmt-result").value = "";
            document.getElementById('patient-name').value = "";
            document.getElementById('patient-phone').value = "";
            document.getElementById('patient-dob').value = "";
            document.getElementById('patient-gender').value = "none";
            document.getElementById('patient-nationality').value = "vn";
            FillProvinces("address-province", _lst_provinces);
            document.getElementById('address-province').value = "none";
            LoadDistrictFromProvince();
            document.getElementById('address-district').value = "none";
            LoadWardFromDistrict();
            document.getElementById('address-ward').value = "none";
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
    document.getElementById("btn-del").addEventListener("click", function () {
        btn_del_click();
    });
    document.getElementById("btn-reset").addEventListener("click", function () {
        btn_reset_click();
    });
    document.getElementById("btn-submit").addEventListener("click", function () {
        btn_submit_click();
    });
    $.getJSON("/data/TTQHPX.json", function (data) {
        _lst_provinces = data;
        FillProvinces("address-province", _lst_provinces);
    })
    $("#address-province").change(function () {
        LoadDistrictFromProvince();
    });
    $("#address-district").change(function () {
        LoadWardFromDistrict();
    });
});

// function 
{
    async function AppointmentSelected(Apmt) {
        document.querySelector(".apmt-info").classList.add("show");
        document.getElementById("apmt-facility").value = Apmt.facility.id;
        document.getElementById("apmt-department").value = Apmt.department.id;
        await Fill_bs();
        document.getElementById('apmt-doctor').value = Apmt.doctor.id;
        document.getElementById('apmt-datetime').value = Apmt.dateTime;
        document.getElementById('apmt-note').value = Apmt.note;
        document.getElementById('apmt-result').value = Apmt.result;
        document.getElementById('patient-name').value = Apmt.patient.name;
        document.getElementById('patient-phone').value = Apmt.patient.phone;
        document.getElementById('patient-dob').value = Apmt.patient.dob;
        document.getElementById('patient-gender').value = Apmt.patient.gender.id;
        document.getElementById('patient-nationality').value = Apmt.patient.nationality;
        FillProvinces("address-province", _lst_provinces);
        document.getElementById('address-province').value = Apmt.patient.address.province.id;
        LoadDistrictFromProvince();
        document.getElementById('address-district').value = Apmt.patient.address.district.id;
        LoadWardFromDistrict();
        document.getElementById('address-ward').value = Apmt.patient.address.ward.id;
    }
    function FillAppointmentTable() {
        $.getJSON("/data/LichDat.json",
            function (lstApmt) {
                let lst = localStorage.getItem("Appointments");
                if (!lst || lst == null) {
                    lst = [];
                }
                Array.from(lst).forEach(a => lstApmt.push(a));
                lstAppointments = lstApmt.reverse();
                const startIndex = (CurrentPage_qldl - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const pageData = lstAppointments.slice(startIndex, endIndex);
                let table = document.getElementById("TableAmpt");
                let head = `
                    <thead>
                        <tr>
                            <th>Mã lịch đặt</th>
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
        let tbody = document.createElement("tbody");
        body.forEach(Apmt => {
            let ele_tr = document.createElement('tr');
            ele_tr.innerHTML = `
                <td>${Apmt.id}</td>
                <td>${Apmt.patient.name}</td>
                <td>${Apmt.dateTime}</td>
                <td>${Apmt.facility.name}</td>
                <td>${Apmt.doctor.name}</td>
                <td>${Apmt.status.name}</td>
                <td>${Apmt.note}</td>
            `
            ele_tr.addEventListener('click', function (e) {
                AppointmentSelected(Apmt);
                Current_Appointment = Apmt;
                console.log(Apmt);
            });
            tbody.appendChild(ele_tr);
        });
        ElementTable.append(tbody);
    }
    function FillTableHead(data, ElementTable) {
        ElementTable.innerHTML = data;
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
    // nạp dữ liệu tỉnh huyện xã
    function FillProvinces(selectId, lst) {
        let select = document.getElementById(selectId);
        let defaultOption = document.createElement("option");

        select.innerHTML = "";
        defaultOption.value = "none";
        defaultOption.textContent = "Chọn tỉnh/thành phố";
        select.appendChild(defaultOption);

        lst.forEach(function (province) {
            let option = document.createElement("option");
            option.value = province.level1_id;
            option.textContent = province.name;
            select.appendChild(option);
        });
    }
    function FillDistricts(selectId, lstDistricts) {
        let select = document.getElementById(selectId);
        let defaultOption = document.createElement("option");

        select.innerHTML = "";
        defaultOption.value = "none";
        defaultOption.textContent = "Chọn quận huyện";
        select.appendChild(defaultOption);

        lstDistricts.forEach(function (district) {
            let option = document.createElement("option");
            option.value = district.level2_id;
            option.textContent = district.name;
            select.appendChild(option);
        });
    }
    function FillWards(selectId, lstWards) {
        let select = document.getElementById(selectId);
        let defaultOption = document.createElement("option");

        select.innerHTML = "";
        defaultOption.value = "none";
        defaultOption.textContent = "Chọn quận huyện";
        select.appendChild(defaultOption);

        lstWards.forEach(function (ward) {
            let option = document.createElement("option");
            option.value = ward.level3_id;
            option.textContent = ward.name;
            select.appendChild(option);
        });
    }
    // sự kiện chọn tỉnh huyện xã
    function LoadDistrictFromProvince() {
        let address_province = document.getElementById("address-province");
        let address_district = document.getElementById("address-district");
        let address_ward = document.getElementById("address-ward");

        if (address_province.value != "none") {
            _lst_districts = _lst_provinces.find(pro => pro.level1_id == address_province.value).level2s;

            FillDistricts("address-district", _lst_districts);
            address_district.disabled = false;

            option = document.createElement("option");
            option.value = "none";
            option.textContent = "Chọn phường xã";
            address_ward.innerHTML = "";
            address_ward.appendChild(option);
            address_ward.disabled = true;
        }
        else {
            let option = document.createElement("option");
            option.value = "none";
            option.textContent = "Chọn quận huyện";
            address_district.innerHTML = "";
            address_district.appendChild(option);
            address_district.disabled = true;

            option = document.createElement("option");
            option.value = "none";
            option.textContent = "Chọn phường xã";
            address_ward.innerHTML = "";
            address_ward.appendChild(option);
            address_ward.disabled = true;
        }
    }
    function LoadWardFromDistrict() {
        let address_district = document.getElementById("address-district");
        let address_ward = document.getElementById("address-ward");

        if (address_district.value != "none") {
            _lst_wards = _lst_districts.find(dis => dis.level2_id == address_district.value).level3s;

            FillWards("address-ward", _lst_wards);
            address_ward.disabled = false;
        }
        else {
            address_ward.innerHTML = "";
            let option = document.createElement("option");
            option.value = "none";
            option.textContent = "Chọn xã phường";
            address_ward.appendChild(option);
            address_ward.disabled = true;
        }
    }
    // check
    function CheckPhone(phone) {
        const phoneRegex = /^[0-9]{10,11}$/;
        return phoneRegex.test(phone);
    }
    function CheckEmpty(str) {
        str = String(str);
        return (str != undefined && str.trim() !== "");
    }
    function CheckDob(dob) {
        const selectedDate = new Date(dob);
        const today = new Date();
        return selectedDate < today && !isNaN(selectedDate.getTime());
    }
    // exec btn click
    function btn_del_click() {
        if (Current_Appointment != null) {
            let lstApmts = localStorage.getItem("Appointments");
            if (lstApmts == null || lstApmts.length == "") {
                lstApmts = [];
            }
            for (let i = 0; i < lstApmts.length; i++) {
                const Apmt = lstApmts[i];
                if (Apmt.id == Current_Appointment.id) {
                    lstApmts.remove(i);
                    break;
                }   
            }
            localStorage.setItem("Appointments", lstApmts);
        }
    }
    function btn_reset_click() {

    }
    function btn_submit_click() {
        
    }
}