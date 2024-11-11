fetch('/api/t_profile', {
    method: 'GET', // Specify the HTTP method
    headers: {
        'Content-Type': 'application/json' // Optional, but good to include for JSON data
    }
})
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
        console.log(data); // Process the data received from the backend
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });