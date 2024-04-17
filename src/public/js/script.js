function fetchClients(emailCount) {
    fetch(`/clients/${emailCount}`)
        .then(response => response.json())
        .then(clients => {
            const list = document.getElementById('clientList');
            list.innerHTML = ''; 
            clients.forEach(client => {
                list.innerHTML += `<div class="client-item">${client.nombre} ${client.apellido} <button class="btn-send" onclick="sendEmail('${client.email}', ${emailCount + 1})">Enviar Email Numero ${emailCount + 1}</button></div>`;
            });
        })
        .catch(error => console.error('Error:', error));
}

function sendEmail(email, emailType) {
    let url = '';
    switch (emailType) {
        case 1:
            url = '/sendfirstclaimemail';
            break;
        case 2:
            url = '/sendsecondemail';
            break;
        case 3:
            url = '/sendthirdemail';
            break;
        default:
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Tipo de correo no válido',
                timer: 1500,
                timerProgressBar: true
            });
            return;
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to: email, usuario: email })
    })
    .then(response => response.json())  
    .then(data => {
        if (data.success) {

            const Toast = Swal.mixin({
                toast: true,
                position: "center-center",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: 'success',
                title: data.message
            });
            fetchClients(emailType - 1); 
        } else {
            throw new Error(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al enviar email',
            text: 'No se pudo enviar el correo. Por favor, intenta de nuevo.',
            timer: 1500,
            timerProgressBar: true
        });
    });
}
