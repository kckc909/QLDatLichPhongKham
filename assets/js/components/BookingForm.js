$(document).ready(function () {
    // declare 
    let _form_booking = document.getElementById('form-booking');
    let _form_booker = document.getElementById('form-booker');
    let _form_check = document.getElementById('form-check');
    let _lst_provinces = [];
    let _lst_districts = [];
    let _lst_wards = [];

    // run
    FillDepartment();
    genderActive();
    serviceActive();

    _form_booking.classList.add("active");
    $.getJSON("/data/TTQHPX.json", function (data) {
        _lst_provinces = data;
        FillProvinces("fc-ad__pro", _lst_provinces);
    })

    // di chuyển giữa các form 
    $(".back-button").click(() => Go_Booking());
    $(".btn-back-div").click(() => Go_Booking());
    $(".next-button").click(function () {
        if (CheckFormBooking()) {
            // Go_Booker();
        }
        Go_Check();
    });
    $(".check-button").click(function () {
        if (CheckFormBooker()) {
            Go_Check();
        }
    });
    $(".btn-submit-div button").click(function (event) {
        event.preventDefault();
        if (CheckFormCheck()) {
            console.log("Đặt lịch thành công");
            SaveAppointment();
            window.location = "/index.html";
        }
        else {
            console.log("Đặt lịch thất bại");
            let element = document.getElementById("form-booking-content");
            let offsetTop = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: offsetTop - 165,
                behavior: "smooth"
            });
        }
    });
    // chọn serivce 
    $("button.service-option").click(function () {
        if (CheckRadioButtonChecked() && CheckServiceSelected()) {
            document.querySelector(".blocker").classList.remove("blocker");
            document.querySelector(".blocker-content").classList.remove("blocker-content");
            let fg_ck = document.getElementById("fg-ck");
            fg_ck.classList.remove("blocker");
            fg_ck.disabled = false;
        }
    });
    // chọn cs -> mở bs
    $("#form-booking input[type=radio]").click(function () {
        if (CheckRadioButtonChecked() && CheckServiceSelected()) {
            document.querySelector(".blocker").classList.remove("blocker");
            document.querySelector(".blocker-content").classList.remove("blocker-content");
            let fg_ck = document.getElementById("fg-ck");
            fg_ck.classList.remove("blocker");
            fg_ck.disabled = false;
        }
    });
    // kh chọn ck -> mở bs
    $("#fg-ck").change(function () {
        let fg_ck = document.getElementById("fg-ck");
        if (fg_ck.value != "none") {
            let fg_bs = document.getElementById("fg-bs");
            fg_bs.classList.remove("blocker");
            fg_bs.disabled = false;

            FillDoctor();
        } else {
            let fg_bs = document.getElementById("fg-bs");
            fg_bs.classList.add("blocker");
            fg_bs.disabled = true;
        }
    });
    // kh chọn bs -> mở dt
    $("#fg-bs").change(function () {
        let fg_bs = document.getElementById("fg-bs");
        if (fg_bs.value != "none") {
            let fg_dt = document.getElementById("fg-dt");
            fg_dt.classList.remove("blocker");
            fg_dt.disabled = false;
        } else {
            let fg_dt = document.getElementById("fg-dt");
            fg_dt.classList.add("blocker");
            fg_dt.disabled = true;
        }
    });
    // chọn tỉnh -> tải huyện
    $("#fc-ad__pro").change(function () {
        let fc_ad__pro = document.getElementById("fc-ad__pro");
        let fc_ad__dis = document.getElementById("fc-ad__dis");
        let fc_ad_ward = document.getElementById("fc-ad__vil");

        if (fc_ad__pro.value != "none") {
            _lst_districts = _lst_provinces.find(pro => pro.level1_id == fc_ad__pro.value).level2s;

            FillDistricts("fc-ad__dis", _lst_districts);
            fc_ad__dis.disabled = false;

            option = document.createElement("option");
            option.value = "none";
            option.textContent = "Chọn phường xã";
            fc_ad_ward.innerHTML = "";
            fc_ad_ward.appendChild(option);
            fc_ad_ward.disabled = true;
        }
        else {
            fc_ad__dis.innerHTML = "";
            let option = document.createElement("option");
            option.value = "none";
            option.textContent = "Chọn quận huyện";
            fc_ad__dis.appendChild(option);
            fc_ad__dis.disabled = true;

            option = document.createElement("option");
            option.value = "none";
            option.textContent = "Chọn phường xã";
            fc_ad_ward.innerHTML = "";
            fc_ad_ward.appendChild(option);
            fc_ad_ward.disabled = true;
        }
    });
    // chọn huyện -> tải xã
    $("#fc-ad__dis").change(function () {
        let fc_ad__dis = document.getElementById("fc-ad__dis");
        let fc_ad_ward = document.getElementById("fc-ad__vil");

        if (fc_ad__dis.value != "none") {
            _lst_wards = _lst_districts.find(dis => dis.level2_id == fc_ad__dis.value).level3s;

            FillWards("fc-ad__vil", _lst_wards);
            fc_ad_ward.disabled = false;
        }
        else {
            fc_ad_ward.innerHTML = "";
            let option = document.createElement("option");
            option.value = "none";
            option.textContent = "Chọn xã phường";
            select.appendChild(option);
            fc_ad_ward.disabled = true;
        }
    });
    // event
    function genderActive() {
        const maleRadio = document.getElementById('male');
        const femaleRadio = document.getElementById('female');
        maleRadio.addEventListener('click', function () {
            maleRadio.parentElement.classList.add('gd-active');
            femaleRadio.parentElement.classList.remove('gd-active');
        });
        femaleRadio.addEventListener('click', function () {
            femaleRadio.parentElement.classList.add('gd-active');
            maleRadio.parentElement.classList.remove('gd-active');
        });
    }
    function serviceActive() {
        document.querySelectorAll(".service-option").forEach(function (option) {
            option.addEventListener('click', function (event) {
                document.querySelectorAll(".service-option").forEach(function (opt) {
                    opt.classList.remove("active");
                });
                event.target.classList.add('active');
            });
        });
    }
    function Go_Booking() {
        _form_booking.classList.add("active");
        _form_booker.classList.remove("active");
        _form_check.classList.remove("active");
    }
    function Go_Booker() {
        _form_booking.classList.remove("active");
        _form_booker.classList.add("active");
        _form_check.classList.remove("active");
    }
    function Go_Check() {
        _form_booking.classList.remove("active");
        _form_booker.classList.remove("active");
        _form_check.classList.add("active");
        Fill_UserloggedIn();
    }

    // Nạp dữ liệu 
    function FillDepartment() {
        let fg_ck = document.getElementById("fg-ck");

        $.getJSON("/data/ChuyenKhoa.json", function (lst_ck) {
            lst_ck.forEach(function (ck) {
                let option = document.createElement("option");
                option.value = ck.id;
                option.textContent = ck.name;
                fg_ck.appendChild(option);
            });
        });
    }
    function FillDoctor() {
        let fg_bs = document.getElementById("fg-bs");
        let departmentId = document.getElementById("fg-ck").value;

        $.getJSON("/data/BacSi.json", function (lst_bs) {
            lst_bs.filter(dt => dt.department == departmentId).forEach(function (bs) {
                let option = document.createElement("option");
                option.value = bs.id;
                option.textContent = bs.name;
                fg_bs.appendChild(option);
            })
        });

    }
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
    function Fill_UserloggedIn() {
        if (CheckLoggedIn()) {
            $.getJSON("/data/TTQHPX.json", function (data) {
                // user
                let userinfo = localStorage.getItem("CurrentUser");
                if (userinfo == null) {
                    return;
                }
                userinfo = JSON.parse(userinfo);
                // address
                _lst_provinces = data;
                _lst_districts = _lst_provinces.find(pro => pro.level1_id == userinfo.province).level2s;
                _lst_wards = _lst_districts.find(dis => dis.level2_id == userinfo.district).level3s

                FillProvinces("fc-ad__pro", _lst_provinces);
                FillDistricts("fc-ad__dis", _lst_districts);
                FillWards("fc-ad__vil", _lst_wards);

                document.getElementById("fc-ad__vil").disabled = false;
                document.getElementById("fc-ad__dis").disabled = false;
                document.getElementById("fc-ad__pro").disabled = false;

                document.getElementById("fc-ad__pro").value = userinfo.province;
                document.getElementById("fc-ad__dis").value = userinfo.district;
                document.getElementById("fc-ad__vil").value = userinfo.ward;
                // info 
                document.getElementById('fc-name').value = userinfo.name;
                document.getElementById('fc-phone').value = userinfo.phonenumber;
                document.getElementById('fc-dob').value = userinfo.birthday;
                let gd = document.getElementById(userinfo.gender);
                gd.checked = true;
                gd.parentElement.classList.add("gd-active");
            })
        }
    }
    // check 
    function CheckLoggedIn() {
        if (localStorage.getItem("LoggedIn")) {
            return true;
        }
    }
    function CheckFormBooking() {
        let flag = true;
        clearAllErrors();
        if (!CheckNoteInputed()) {
            showError(document.getElementById("note"), "Vui lòng điền vấn đề sức khỏe cần khám!", "input");
            flag = false;
        }
        if (!CheckDatetimeSelected()) {
            showError(document.getElementById("fg-dt"), "Vui lòng chọn lịch khám!", "click");
            flag = false;
        }
        if (!CheckDoctorSelected()) {
            showError(document.getElementById("fg-bs"), "Vui lòng chọn bác sĩ!", "change");
            flag = false;
        }
        if (!CheckDepartmentSelected()) {
            showError(document.getElementById("fg-ck"), "Vui lòng chọn khoa!", "change");
            flag = false;
        }
        if (!CheckServiceSelected()) {
            showError(document.getElementById("service"), "Vui lòng chọn dịch vụ khám!", "click");
            flag = false;
        }
        if (!CheckRadioButtonChecked()) {
            showError(document.getElementById("radio-group"), "Vui lòng chọn địa điểm khám!", "check");
            flag = false;
        }



        return flag;
    }
    function CheckFormBooker() {
        let flag = true;
        clearAllErrors();
        let phone = document.getElementById("phone");
        let name = document.getElementById("name");
        let dob = document.getElementById("dob");

        if (!CheckDob(dob.value)) {
            showError(document.getElementById("dob"), "Vui lòng nhập ngày sinh chính xác!", "click");
            flag = false;
        }
        if (!CheckPhone(phone.value)) {
            showError(document.getElementById("phone"), "Vui lòng nhập số điện thoại!", 'input');
            flag = false;
        }
        if (!CheckEmpty(name)) {
            showError(document.getElementById("name"), "Vui lòng nhập tên bệnh nhân!", 'input');
            flag = false;
        }
        return flag;
    }
    function CheckFormCheck() {
        clearAllErrors();
        let flag = true;
        let phone = document.getElementById("fc-phone");
        let name = document.getElementById("fc-name");
        let dob = document.getElementById("fc-dob");

        if (!CheckDob(dob.value)) {
            showError(document.getElementById("fc-dob"), "Vui lòng nhập ngày sinh chính xác!", "change");
            flag = false;
        }
        if (!CheckPhone(phone.value)) {
            showError(document.getElementById("fc-phone"), "Vui lòng nhập số điện thoại!", 'input');
            flag = false;
        }
        if (!CheckEmpty(name.value)) {
            showError(document.getElementById("fc-name"), "Vui lòng nhập tên bệnh nhân!", 'input');
            flag = false;
        }
        if (!CheckGenderSelected()) {
            FormCheckGenderError(document.getElementById("fc-gender"), "Vui lòng chọn giới tính!", "click");
            flag = false;
        }
        if (!CheckWardSelected()) {
            showError(document.getElementById("fc-ad__vil"), "Vui lòng chọn phường xã!", "change");
            flag = false;
        }
        if (!CheckDistrictSelected()) {
            showError(document.getElementById("fc-ad__dis"), "Vui lòng chọn quận huyện!", "change");
            flag = false;
        }
        if (!CheckProvinceSelected()) {
            showError(document.getElementById("fc-ad__pro"), "Vui lòng chọn tỉnh/thành phố!", "change");
            flag = false;
        }
        return flag;
    }
    // form booking
    function CheckRadioButtonChecked() {
        let rads = document.querySelectorAll(".rad-content input[type=radio]");
        let checkedrad = Array.from(rads).filter(r => r.checked);
        if (checkedrad.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    function CheckServiceSelected() {
        let services = document.querySelectorAll(".service-option");
        let checkedservices = Array.from(services).filter(s => s.classList.contains("active"));
        if (checkedservices.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    function CheckDepartmentSelected() {
        let fg_ck = document.getElementById("fg-ck");
        if (fg_ck.value == "none") {
            return false;
        }
        return true;
    }
    function CheckDoctorSelected() {
        let fg_bs = document.getElementById("fg-bs");
        if (fg_bs.value == "none") {
            return false;
        }
        return true;
    }
    function CheckDatetimeSelected() {
        let fg_dt = document.getElementById("fg-dt");
        let today = new Date();
        if (!fg_dt.value || today > fg_dt.value) {
            return false;
        }
        return true;
    }
    function CheckNoteInputed() {
        if (document.getElementById("note").value.trim() == "") {
            return false;
        }
        return true;
    }
    // form check
    function CheckGenderSelected() {
        let maleRadio = document.getElementById('male');
        let femaleRadio = document.getElementById('female');
        if (!maleRadio.checked && !femaleRadio.checked) {
            return false;
        }
        return true;
    }
    function CheckProvinceSelected() {
        let fg_ad_pro = document.getElementById("fc-ad__pro");
        if (fg_ad_pro.value == "none") {
            return false;
        }
        return true;
    }
    function CheckDistrictSelected() {
        let fg_ad_dis = document.getElementById("fc-ad__dis");
        if (fg_ad_dis.value == "none") {
            return false;
        }
        return true;
    }
    function CheckWardSelected() {
        let fg_ad_ward = document.getElementById("fc-ad__vil");
        if (fg_ad_ward.value == "none") {
            return false;
        }
        return true;
    }
    // 
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

    // error
    function showError(element, errorMessage, typeOfEvent) {
        const erlb = document.createElement("div");
        erlb.classList.add("error-message");
        erlb.textContent = errorMessage;
        element.classList.add("error");
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.parentElement.insertBefore(erlb, element.nextSibling);
        element.focus();
        element.addEventListener(typeOfEvent, clearError);
    }
    function clearAllErrors() {
        const ermsg = document.querySelectorAll(".error-message");
        ermsg.forEach((message) => message.remove());
        const elements = document.querySelectorAll(".error");
        elements.forEach((element) => element.classList.remove("error"));
    }
    function clearError(event) {
        const element = event.target;
        const ermsg = element.parentElement.querySelector(".error-message");
        if (ermsg && element.classList.contains("error")) {
            ermsg.remove();
            element.classList.remove("error");
        }
    }
    function FormCheckGenderError(element, errorMessage, typeOfEvent) {
        const erlb = document.createElement("div");
        erlb.classList.add("error-message");
        erlb.textContent = errorMessage;
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.parentElement.insertBefore(erlb, element.nextSibling);
        element.focus();
        element.addEventListener(typeOfEvent, function () {
            element.parentElement.querySelector(".error-message").remove();
        })
    }
    // Lưu lịch đặt
    function SaveAppointment() {
        let AppointmentsList = JSON.parse(localStorage.getItem("Appointments"));
        if (!AppointmentsList) {
            AppointmentsList = [];
        }

        let fac = document.querySelector('input[name="cs"]:checked');
        let gd = document.querySelector('input[name="gender"]:checked');
        let department = document.getElementById("fg-ck");
        let doctor = document.getElementById("fg-bs");

        // Thu thập thông tin từ form

        let Appointment = {
            id : AppointmentsList[length - 1].id + 1,
            facility: {
                id: fac.getAttribute('id'), name: fac.nextElementSibling.textContent.trim()
            },
            department: {
                id: department.value,
                name: department.options[department.selectedIndex].textContent.trim()
            },
            doctor: {
                id: doctor.value, name: doctor.options[doctor.selectedIndex].textContent
            },
            dateTime: document.getElementById("fg-dt").value,
            patient: {
                id: Math.floor(Math.random() * 1000) + 1000,
                name: document.getElementById("fc-name").value,
                phone: document.getElementById("fc-phone").value,
                dob: document.getElementById("fc-dob").value,
                gender: {
                    id: gd.getAttribute("id"),
                    name: gd?.nextElementSibling.textContent.trim()
                },
                address: {
                    province: { id: document.getElementById("fc-ad__pro").value },
                    district: { id: document.getElementById("fc-ad__dis").value },
                    ward: { id: document.getElementById("fc-ad__vil").value },
                }
            },
            status: {
                id: "0",
                name: "Waiting"
            },
            note: document.getElementById("gc").value
        };
        AppointmentsList.push(Appointment);
        localStorage.setItem("Appointments", JSON.stringify(AppointmentsList));
        alert("Lịch hẹn đã được lưu thành công!");
    }
});
