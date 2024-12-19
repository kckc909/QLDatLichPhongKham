$(document).ready(function () {
    
});

// function
{
    
    // Sinh dữ liệu ngẫu nhiên
    function generateRandomData(points, displacement) {
        const data = [];
        let num = Math.ceil(Math.random() * 100);
        for (let i = 0; i < points; i++) {
            let ran = num + Math.floor(Math.random() * displacement) - (displacement / 2);
            if (ran <= 0) {
                ran = - ran;
            }
            data.push(ran);
        }
        return data;
    }
}