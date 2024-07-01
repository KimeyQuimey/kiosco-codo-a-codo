const URL_BASE='https://xyberdev.alwaysdata.net/api'

document.getElementById('login').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const response = await fetch(URL_BASE+'/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (response.ok) {

        localStorage.setItem('token', result.token);
        window.location.href = './home.html'; 

    } else {
        alert(result.message);
    }
});