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
    });
});