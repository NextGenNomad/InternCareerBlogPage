window.addEventListener('load', function() {
    var showcase = document.querySelector('.small__showcase')
    if (!showcase) return
    
    var navbar = document.getElementById('navbar')
    
 
    window.addEventListener('scroll', function() {
        var showcaseBottom = showcase.getBoundingClientRect().bottom
        var navbarBottom = navbar.getBoundingClientRect().bottom
     
        if ( navbarBottom >= showcaseBottom) {
       
            navbar.style.backgroundColor = '#08213b'
            navbar.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
        } else {

            navbar.style.backgroundColor = 'transparent'
            navbar.style.boxShadow = '0 0 #000000'
        }
    });
});

//show password
const eyeIcon = document.querySelector(".input__password i");
const confirmPassEyeIcon = document.querySelector(".confirm__password i");
const passwordInput = document.querySelector(".input__password input");
const ConfirmpasswordInput = document.querySelector(".confirm__password input");

eyeIcon.addEventListener("click", function() {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    } else {
        passwordInput.type = "password";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    }
});



// JavaScript code to handle dropdown menu and delete account functionality
document.addEventListener('DOMContentLoaded', function() {
    const dropdownToggle = document.querySelector('.dropdown__toggle');
    const dropdownMenu = document.querySelector('.dropdown__menu');
    const deleteForm = document.querySelector('.delete__form');
    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener('click', function() {
            dropdownMenu.classList.toggle('show');
        });
    }
    if (deleteForm) {
        deleteForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const confirmation = confirm('Are you sure you want to delete your account? This action cannot be undone.');
            if (confirmation) {
                fetch(this.action, {
                    method: 'DELETE',
                })
                .then(response => response.json())
                .then(data => {
                    alert(data);
                    window.location.href = '/'; // Redirect to home page or sign-in page
                })
                .catch(error => console.error('Error deleting account:', error));
            }
        });
    }
});





