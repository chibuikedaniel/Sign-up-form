
(function ($) {
    "use strict";

    const validateForm = document.querySelector(".validate-form");
    const inputFields = [...validateForm.querySelectorAll(".validate-input .input100")];
    const passwordErrorDiv = document.querySelector(".password-error");

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/;

    validateForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let isValid = true;

        inputFields.forEach((input) => {
            const isInputValid = validateInput(input);
            isValid = isValid && isInputValid;
            toggleValidationUI(input, !isInputValid);
        });

        if (isValid) {
            validateForm.submit();
        }
    });

    inputFields.forEach((input) => {
        input.addEventListener("focus", () => {
            toggleValidationUI(input, false);
        });
    });

    function validateInput(input) {
        const inputValue = input.value.trim();

        if (input.type === "email" || input.name === "email") {
            return emailRegex.test(inputValue);
        } else if (input.type === "password" || input.name === "password") {
            if (!passwordRegex.test(inputValue)) {
                passwordErrorDiv.textContent = "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*)";
                passwordErrorDiv.style.display = "block";
                return false;
            } else {
                passwordErrorDiv.textContent = "";
                passwordErrorDiv.style.display = "none";
                return true;
            }
        } else {
            return inputValue !== "";
        }
    }

    function toggleValidationUI(input, showError) {
        const parentElement = input.parentElement;
        parentElement.classList.toggle("alert-validate", showError);
    }
})(jQuery);

