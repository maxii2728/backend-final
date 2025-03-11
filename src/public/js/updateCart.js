document.addEventListener('DOMContentLoaded', function() {
    // Manejar el formulario de actualización de cantidad individual
    const updateQuantityForm = document.querySelector('form[action*="/products/"]');
    if (updateQuantityForm) {
        updateQuantityForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const formData = new FormData(updateQuantityForm);
            const formAction = updateQuantityForm.getAttribute('action');
            
            // Convertir FormData a objeto para enviar como JSON
            const formDataObj = {};
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            
            fetch(formAction, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataObj)
            })
            .then(response => {
                // Verificar si la respuesta es exitosa
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.message || 'Error al actualizar la cantidad');
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    showMessage('success', data.message || 'Cantidad actualizada exitosamente');
                    // Redirigir al carrito después de 2 segundos
                    setTimeout(() => {
                        const cartId = formAction.split('/')[3]; // Extraer el ID del carrito de la URL
                        window.location.href = `/api/cart/${cartId}`;
                    }, 2000);
                } else {
                    showMessage('error', data.message || 'Error al actualizar la cantidad');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('error', error.message || 'Error al procesar la solicitud');
            });
        });
    }
    
    // Manejar el formulario de actualización del carrito completo
    const updateCartForm = document.querySelector('form[action*="/put/"]');
    if (updateCartForm) {
        updateCartForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const formData = new FormData(updateCartForm);
            const formAction = updateCartForm.getAttribute('action');
            
            // Convertir FormData a objeto para enviar como JSON
            const formDataObj = {};
            const quantities = [];
            const productIds = [];
            
            formData.getAll('quantities').forEach(qty => quantities.push(qty));
            formData.getAll('productIds').forEach(id => productIds.push(id));
            
            formDataObj.quantities = quantities;
            formDataObj.productIds = productIds;
            
            fetch(formAction, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataObj)
            })
            .then(response => {
                // Verificar si la respuesta es exitosa
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.message || 'Error al actualizar el carrito');
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    showMessage('success', data.message || 'Carrito actualizado exitosamente');
                    // Redirigir al carrito después de 2 segundos
                    setTimeout(() => {
                        const cartId = formAction.split('/')[4].split('?')[0]; // Extraer el ID del carrito de la URL
                        window.location.href = `/api/cart/${cartId}`;
                    }, 2000);
                } else {
                    showMessage('error', data.message || 'Error al actualizar el carrito');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('error', error.message || 'Error al procesar la solicitud');
            });
        });
    }
    
    // Función para mostrar mensajes al usuario
    function showMessage(type, message) {
        // Eliminar mensajes anteriores
        const existingMessages = document.querySelectorAll('.message-alert');
        existingMessages.forEach(msg => msg.remove());
        
        // Crear elemento para el mensaje
        const messageDiv = document.createElement('div');
        messageDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'} message-alert`;
        messageDiv.textContent = message;
        
        // Agregar estilos para posicionar el mensaje
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '20px';
        messageDiv.style.left = '50%';
        messageDiv.style.transform = 'translateX(-50%)';
        messageDiv.style.zIndex = '1000';
        messageDiv.style.minWidth = '300px';
        messageDiv.style.textAlign = 'center';
        
        // Agregar el mensaje al DOM
        document.body.appendChild(messageDiv);
        
        // Eliminar el mensaje después de 3 segundos
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}); 