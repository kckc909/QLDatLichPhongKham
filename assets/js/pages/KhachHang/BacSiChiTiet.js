$(document).ready(function () { 
    toggleBS_content('gt', 'bs-gt') 
    importDoctor();
});

// toggle title 
function toggleBS_content(bslink, bsid) {
    let link = document.getElementById(bslink);
    let id = document.getElementById(bsid);

    Array.from(document.getElementsByClassName('bs-navbar__item')).forEach(function (item) {
        item.classList.remove('active');
    });
    Array.from(document.getElementsByClassName('bs-ct')).forEach(function (item) {
        item.classList.add('hide');
    });

    link.classList.add('active');
    id.classList.remove('hide');
}

// toggle body
function toggleElementById(header_id, body_id, fas = true) {
    document.getElementById(body_id).classList.toggle('hide');
    if (fas) {
        toggleIcon(header_id);
    }
}

// toggle icon
function toggleIcon(elementContainIconId) {
    let ele = document.getElementById(elementContainIconId);
    Array.from(ele.getElementsByClassName('fas')).forEach(fas => {
        fas.classList.toggle('hide');
    });
}

// rating
jQuery(document).ready(function () {
    jQuery(".rd_item").click(function () {
        jQuery(".item").removeClass("active");
        var ratingValue = jQuery(this).val();
        for (let i = 1; i <= ratingValue; i++) {
            jQuery(".rate_" + i).addClass("active");
        }
        jQuery(".rate_total").val(ratingValue);
    });
});

// import doctor
function importDoctor() {
    const urlParams = new URLSearchParams(window.location.search);
    const doctorId = urlParams.get('id');
    $.getJSON('/data/BacSi.json', function (doctors) {
        let doctor = doctors.find(d => d.id == doctorId);
        if (doctor) {
            document.querySelector(".bs-name").innerHTML = doctor.name;
            document.querySelector('.bs-cv').innerHTML = doctor.position;
            document.querySelector('.bs-cs').innerHTML = doctor.facility;
            document.querySelector('.bs-img__img').src = doctor.image;
            document.querySelector('#body-gt').innerHTML = doctor.introduction;
            document.querySelector('#body-tvtc').innerHTML = doctor.organization_membership;
            document.querySelector('#body-dhgt').innerHTML = doctor.awards;
            document.querySelector('#body-ctnc').innerHTML = doctor.research_projects;
            document.querySelector('#body-qtdt').innerHTML = doctor.training;
            document.querySelector('#body-knct').innerHTML = doctor.experience;
        }
    });
}