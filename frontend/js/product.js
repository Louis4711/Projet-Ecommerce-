document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const productContainer = document.getElementById('product-container');
  const errorContainer = document.getElementById('error-container');

  if (!productId) {
    errorContainer.innerHTML = '<div class="error-message">Produit non trouvé (ID manquant).</div>';
    return;
  }

  try {
    const product = await getProductById(productId);
    
    if (!product) {
      throw new Error("Le produit n'existe pas.");
    }

    // Création des options de couleurs
    let colorsOptions = '';
    product.colors.forEach(color => {
      colorsOptions += `<option value="${color}">${color}</option>`;
    });

    productContainer.innerHTML = `
      <div class="product-layout">
        <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
        <div class="product-details">
          <h1>${product.name}</h1>
          <div class="card-price" style="font-size: 1.5rem; margin-bottom: 1.5rem;">${formatPrice(product.price)}</div>
          <p class="card-desc" style="font-size: 1rem; margin-bottom: 2rem;">${product.description}</p>
          
          <div class="form-group">
            <label for="color-select">Choisissez une couleur :</label>
            <select id="color-select">
              ${colorsOptions}
            </select>
          </div>
          
          <button id="add-to-cart-btn" class="btn">Ajouter au panier</button>
        </div>
      </div>
    `;

    document.getElementById('add-to-cart-btn').addEventListener('click', () => {
      const selectedColor = document.getElementById('color-select').value;
      const productToAdd = {
        _id: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        color: selectedColor
      };
      
      addToCart(productToAdd);
      showToast();
    });

  } catch (error) {
    errorContainer.innerHTML = `
      <div class="error-message">
        Une erreur est survenue lors du chargement du produit.
      </div>
    `;
    console.error(error);
  }
});

function showToast() {
  const toast = document.getElementById("toast");
  toast.className = "show";
  setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}
