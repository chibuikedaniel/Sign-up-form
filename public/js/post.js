// Select the form element
const form = document.getElementById('signupForm');

// Add event listener for form submission
form.addEventListener('submit', async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Serialize form data
    const formData = new FormData(form);

    // Convert form data to JSON object
    const jsonData = {};
    formData.forEach((value, key) => {
        jsonData[key] = value;
    });

    // Send POST request to the backend server
    try {
        const response = await fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        });

        if (!response.ok) {
            throw new Error('Error signing up');
        }

        const data = await response.json();
        // Handle successful signup response
        console.log(data);
    } catch (error) {
        // Handle error
        console.error(error);
    }
});
