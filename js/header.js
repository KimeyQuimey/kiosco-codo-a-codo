document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const limpiarToken = document.getElementById('limpiar-token');

    if (!token) {
        window.location.href = './index.html'; 
    } 

    if (limpiarToken) {
        limpiarToken.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('token'); 
            window.location.href = './index.html';
        });
    }
});
