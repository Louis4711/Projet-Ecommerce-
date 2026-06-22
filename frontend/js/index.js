document.addEventListener('DOMContentLoaded', async () => {
  const productsContainer = document.getElementById('products-container');
  const errorContainer = document.getElementById('error-container');

  try {
    const products = await getProducts();
    
    if (!products || products.length === 0) {
      throw new Error("Aucun produit trouvé.");
    }

    products.forEach(product => {
      const card = document.createElement('a');
      card.href = `product.html?id=${product._id}`;
      card.className = 'card';

      card.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}" class="card-img" loading="lazy">
        <div class="card-content">
          <h2 class="card-title">${product.name}</h2>
          <div class="card-price">${formatPrice(product.price)}</div>
          <p class="card-desc">${product.description}</p>
          <span class="btn">Voir le produit</span>
        </div>
      `;

      productsContainer.appendChild(card);
    });

  } catch (error) {
    errorContainer.innerHTML = `
      <div class="error-message">
        Une erreur est survenue lors du chargement des produits. Veuillez vérifier que le serveur backend est démarré.
      </div>
    `;
    console.error(error);
  }
});
