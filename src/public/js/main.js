let currentEmailId;
let isEditing = false;

function openCreateModal() {
    isEditing = false;
    document.getElementById('modalTitle').textContent = 'Crear Email';
    document.getElementById('emailForm').reset();
    document.getElementById('emailType').readOnly = false;
    CKEDITOR.instances.emailBody.setData('');
    document.getElementById('emailModal').style.display = 'block';
    loadExistingImages();
}

function openEditModal(id) {
    isEditing = true;
    currentEmailId = id;
    fetch(`/emails/${id}`)
        .then(response => response.json())
        .then(email => {
            document.getElementById('modalTitle').textContent = 'Editar Email';
            document.getElementById('emailType').value = email.type;
            document.getElementById('emailType').readOnly = true;
            document.getElementById('emailSubject').value = email.subject;
            CKEDITOR.instances.emailBody.setData(email.body);
            document.getElementById('emailModal').style.display = 'block';
            loadExistingImages();
        })
        .catch(error => console.error('Error al obtener el email:', error));
}

function closeEmailModal() {
    document.getElementById('emailModal').style.display = 'none';
}

document.getElementById('emailForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    formData.set('body', CKEDITOR.instances.emailBody.getData());
    const url = isEditing ? `/emails/edit/${currentEmailId}` : '/emails';
    const method = isEditing ? 'POST' : 'PUT';
    
    fetch(url, {
        method: method,
        body: formData
    })
    .then(response => {
        if (response.ok) {
            closeEmailModal();
            location.reload();
        } else {
            throw new Error('Error al guardar los cambios.');
        }
    })
    .catch(error => alert(error.message));
});

function openUploadImageModal() {
    document.getElementById('uploadImageModal').style.display = 'block';
}

function closeUploadImageModal() {
    document.getElementById('uploadImageModal').style.display = 'none';
}

function openDeleteModal(id) {
    currentEmailId = id;
    document.getElementById('deleteModal').style.display = 'block';
}

function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
}

document.getElementById('confirmDelete').addEventListener('click', function() {
    fetch(`/emails/delete/${currentEmailId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            closeDeleteModal();
            location.reload();
        } else {
            throw new Error('Error al eliminar el email.');
        }
    })
    .catch(error => alert(error.message));
});

// Inicializar CKEditor
CKEDITOR.replace('emailBody');

// Cargar imágenes existentes
function loadExistingImages() {
    fetch('/images/images')
        .then(response => response.json())
        .then(images => {
            const select = document.getElementById('existingImages');
            select.innerHTML = '<option value="">Selecciona una imagen</option>';
            images.forEach(img => {
                const option = document.createElement('option');
                option.value = img.path;
                option.textContent = img.name;
                select.appendChild(option);
            });
        });
}

document.getElementById('existingImages').addEventListener('change', function() {
    const selectedImage = this.value;
    if (selectedImage) {
        const imgElement = document.createElement('img');
        imgElement.src = selectedImage;
        imgElement.alt = 'Preview';
        imgElement.style.maxWidth = '100px';
        imgElement.style.maxHeight = '100px';

        const previewContainer = document.getElementById('imagePreview');
        previewContainer.innerHTML = '';
        previewContainer.appendChild(imgElement);
    } else {
        document.getElementById('imagePreview').innerHTML = '';
    }
});

document.getElementById('imageUploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    
    fetch('/images/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert('Imagen subida exitosamente');
            closeUploadImageModal();
            loadExistingImages();
        } else {
            throw new Error('Error al subir la imagen.');
        }
    })
    .catch(error => alert(error.message));
});

// Previsualizar imagen nueva seleccionada
document.getElementById('emailImageFile').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgElement = document.createElement('img');
            imgElement.src = e.target.result;
            imgElement.alt = 'Preview';
            imgElement.style.maxWidth = '100px';
            imgElement.style.maxHeight = '100px';

            const previewContainer = document.getElementById('imagePreview');
            previewContainer.innerHTML = '';
            previewContainer.appendChild(imgElement);
        };
        reader.readAsDataURL(file);
    } else {
        document.getElementById('imagePreview').innerHTML = '';
    }
});

// Cerrar el modal cuando el usuario hace clic fuera del contenido del modal
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});
