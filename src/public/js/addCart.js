document.addEventListener('DOMContentLoaded', function() {
    
    const productForms = document.querySelectorAll('.product-form');

    productForms.forEach(form => {
        const quantityInput = form.querySelector('.quantity-input');
        const addToCartBtn = form.querySelector('.add-to-cart-btn');
        const stockElement = form.querySelector('.stock'); 

        
        if (!stockElement) {
            console.error('El elemento stock no se encontró en el formulario.');
            return; 
        }

        const stock = parseInt(stockElement.value, 10); 

        quantityInput.addEventListener('input', function() {
            const quantity = parseInt(quantityInput.value, 10);

            
            if (quantity > stock) {
                addToCartBtn.style.display = 'none'; 
            } else {
                addToCartBtn.style.display = 'inline-block'; 
            }
        });

        
        if (parseInt(quantityInput.value, 10) > stock) {
            addToCartBtn.style.display = 'none'; 
        } else {
            addToCartBtn.style.display = 'inline-block';
        }

        // Manejar el envío del formulario con fetch para que no se tenga que recargar laa página
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const formData = new FormData(form);
            const formDataObj = {};
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });

            fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataObj)
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Mostrar mensaje de éxito
                    showMessage('success', data.message || 'Producto agregado al carrito correctamente');
                } else {
                    // Mostrar mensaje de error
                    showMessage('error', data.message || 'Error al agregar el producto al carrito');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('error', 'Error al procesar la solicitud');
            });
        });
    });

    // Función para mostrar mensajes al usuario
    function showMessage(type, message) {
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