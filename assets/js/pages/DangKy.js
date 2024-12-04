$(document).ready(function () {
    const PhoneRegex = /^(0[3|5|7|8|9])\d{8}$/;
    const EmailRegex = /^(?!.*\.{2})[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    let _lst_provinces = [];
    let _lst_districts = [];
    let _lst_wards = [];
    // run
    // tải tỉnh
    $.getJSON("/data/TTQHPX.json", function (data) {
        _lst_provinces = data;
        FillProvinces("fc-ad__pro", _lst_provinces);
    })
    // chọn tỉnh -> tải huyện
    $("#fc-ad__pro").change(function () {
        let fc_ad__pro = document.getElementById("fc-ad__pro");
        let fc_ad__dis = document.getElementById("fc-ad__dis");
        let fc_ad_ward = document.getElementById("fc-ad__vil");

        if (fc_ad__pro.value != "none") {
            _lst_districts = _lst_provinces.find(pro => pro.level1_id == fc_ad__pro.value).level2s;
            FillDistricts("fc-ad__dis", _lst_districts);
            fc_ad__dis.disabled = false;
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
    $(".btn-register").click( function (){
        SubmitClickHandler();
    });


    if (!CheckExistsUsername('admin')) {
        AddAccount("admin", "123", "AdminMinh", "2004-12-02", "male", "0987654321", "admin@gmail.com", "33", "330", "12271", "admin");
    }
    // add account
    function AddAccount(username, password, name, birthday, gender, phonenumber, email, province, district, ward, role = "customer") {
        let accounts = localStorage.getItem('accounts');
        let newAc = {
            username: username,
            password: password,
            name: name,
            birthday: birthday,
            gender: gender,
            phonenumber: phonenumber,
            email: email,
            province: province,
            district: district,
            ward: ward,
            role: role,
        }
        if (accounts === null) {
            accounts = [];
        } else {
            accounts = JSON.parse(accounts);
        }
        accounts.push(newAc);
        localStorage.setItem('accounts', JSON.stringify(accounts));
    }
    // fill dia chi
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
    // handler click -> đã kích hoạt
    function SubmitClickHandler() {
        let flag = true;
        clearAllErrors();

        let name = document.getElementById("text-name").value.trim();
        let birthday = document.getElementById("birthday").value.trim();
        let gender = document.getElementById("gender").value;
        let username = document.getElementById("text-username").value.trim();
        let password = document.getElementById("text-password").value.trim();
        let rePassword = document.getElementById("text-re-password").value.trim();
        let phone = document.getElementById("text-phone").value.trim();
        let email = document.getElementById("text-email").value.trim();

        let fc_ad__pro = document.getElementById("fc-ad__pro");
        let fc_ad__dis = document.getElementById("fc-ad__dis");
        let fc_ad__ward = document.getElementById("fc-ad__vil");

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
        if (!EmailRegex.test(email)) {
            showError("text-email", "Email không hợp lệ!");
            flag = false;
        }
        if (!PhoneRegex.test(phone)) {
            showError("text-phone", "Số điện thoại không hợp lệ!");
            flag = false;
        }
        if (password !== rePassword) {
            showError("text-re-password", "Mật khẩu và mật khẩu nhập lại không trùng khớp!");
            flag = false;
        }
        if (password === "") {
            showError("text-password", "Mật khẩu không được để trống!");
            flag = false;
        }
        if (username === "") {
            showError("text-username", "Tên tài khoản không được để trống!");
            flag = false;
        } else if (CheckExistsUsername(name)) {
            showError("text-username", "Tên tài khoản đã tồn tại!");
            flag = false;
        }
        if (birthday === "") {
            showError("birthday", "Ngày sinh không được để trống!");
            flag = false;
        }
        if (name === "" || !name) {
            showError("text-name", "Họ và tên không được để trống!");
            flag = false;
        }
        if (flag) {
            AddAccount(username, password, name, birthday, gender, phone, email, fc_ad__pro.value, fc_ad__dis.value, fc_ad__ward.value);
            alert("Đăng ký thành công!");
            window.location.href = "/pages/DangNhap.html";
        }
    }
    //check
    function CheckExistsUsername(username) {
        let acs = JSON.parse(localStorage.getItem("accounts")) || [];
        for (let ac of acs) {
            if (ac.username === username) {
                return true;
            }
        };
        return false;
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
    // error 
    function showError(inputId, errorMessage) {
        const input = document.getElementById(inputId);
        const erlb = document.createElement("div");

        erlb.classList.add("error-message");
        erlb.textContent = errorMessage;

        input.classList.add("error");
        input.scrollIntoView({ behavior: "smooth", block: "center" });

        input.parentElement.insertBefore(erlb, input.nextSibling);
        input.focus();

        input.addEventListener("input", clearErrorOnTyping);
    }
    function clearAllErrors() {
        const ermsg = document.querySelectorAll(".error-message");
        ermsg.forEach((message) => message.remove());
        const inputs = document.querySelectorAll("input");
        inputs.forEach((input) => input.classList.remove("error"));
    }
    function clearErrorOnTyping(event) {
        const input = event.target;
        const ermsg = input.parentElement.querySelector(".error-message");
        if (ermsg && input.classList.contains("error")) {
            ermsg.remove();
            input.classList.remove("error");
        }
    }
});