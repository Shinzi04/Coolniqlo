const jumbo = document.querySelector('.displayImage');
const child = document.querySelectorAll('.miniImage');

child.forEach(child => {
    child.addEventListener('click', function (e) {
        jumbo.classList.add('hide');

        setTimeout(function() {
            jumbo.src = e.target.src;
            jumbo.classList.remove('hide');
        }, 150);
    });
});

