document.addEventListener('DOMContentLoaded', () => {
  const cartContainer = document.getElementById('cart-container');
  const cart = getCart();

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <h2>Votre panier est vide</h2>
        <a href="index.html" class="btn" style="width: auto; margin-top: 1rem;">Retour à la boutique</a>
      </div>
    `;
    return;
  }

  // Affichage des articles
  let cartItemsHtml = '<div class="cart-items"><h2>Articles</h2>';
  let totalPrice = 0;

  cart.forEach((item, index) => {
    totalPrice += item.price;
    cartItemsHtml += `
      <div class="cart-item">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <img src="${item.imageUrl}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
          <div>
            <div style="font-weight: 600;">${item.name}</div>
            <div style="font-size: 0.875rem; color: var(--text-muted);">Couleur: ${item.color}</div>
          </div>
        </div>
        <div style="font-weight: 600; color: var(--primary-color);">
          ${formatPrice(item.price)}
        </div>
      </div>
    `;
  });
  cartItemsHtml += '</div>';

  // Formulaire et Résumé
  const formHtml = `
    <div class="cart-summary">
      <h2>Résumé</h2>
      <div class="cart-total">
        <span>Total:</span>
        <span>${formatPrice(totalPrice)}</span>
      </div>
      
      <form id="order-form" style="margin-top: 2rem;">
        <h3 style="margin-bottom: 1rem;">Informations de livraison</h3>
        
        <div class="form-group">
          <label for="firstName">Prénom</label>
          <input type="text" id="firstName" required>
          <div id="firstNameError" class="form-error">Veuillez entrer un prénom valide (lettres uniquement).</div>
        </div>
        
        <div class="form-group">
          <label for="lastName">Nom</label>
          <input type="text" id="lastName" required>
          <div id="lastNameError" class="form-error">Veuillez entrer un nom valide (lettres uniquement).</div>
        </div>
        
        <div class="form-group">
          <label for="address">Adresse</label>
          <input type="text" id="address" required>
          <div id="addressError" class="form-error">Veuillez entrer une adresse valide.</div>
        </div>
        
        <div class="form-group">
          <label for="city">Ville</label>
          <input type="text" id="city" required>
          <div id="cityError" class="form-error">Veuillez entrer une ville valide.</div>
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" required>
          <div id="emailError" class="form-error">Veuillez entrer un email valide.</div>
        </div>
        
        <button type="submit" class="btn" id="submit-btn" style="margin-top: 1rem;">Commander et Payer</button>
      </form>
    </div>
  `;

  cartContainer.innerHTML = cartItemsHtml + formHtml;

  // Validation du formulaire
  const form = document.getElementById('order-form');
  
  // Regex de validation
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{2,}$/;
  const addressRegex = /^[a-zA-Z0-9À-ÿ\s,'-]{5,}$/;
  const cityRegex = /^[a-zA-ZÀ-ÿ\s'-]{2,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateInput(input, regex, errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    if (regex.test(input.value.trim())) {
      errorElement.style.display = 'none';
      input.style.borderColor = 'var(--border-color)';
      return true;
    } else {
      errorElement.style.display = 'block';
      input.style.borderColor = '#DC2626';
      return false;
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const isFirstNameValid = validateInput(document.getElementById('firstName'), nameRegex, 'firstNameError');
    const isLastNameValid = validateInput(document.getElementById('lastName'), nameRegex, 'lastNameError');
    const isAddressValid = validateInput(document.getElementById('address'), addressRegex, 'addressError');
    const isCityValid = validateInput(document.getElementById('city'), cityRegex, 'cityError');
    const isEmailValid = validateInput(document.getElementById('email'), emailRegex, 'emailError');

    if (isFirstNameValid && isLastNameValid && isAddressValid && isCityValid && isEmailValid) {
      
      const submitBtn = document.getElementById('submit-btn');
      submitBtn.textContent = 'Envoi en cours...';
      submitBtn.disabled = true;

      // Création de l'objet contact
      const contact = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value.trim(),
        email: document.getElementById('email').value.trim()
      };

      // Création du tableau products contenant les ID
      const products = cart.map(item => item._id);

      const orderData = { contact, products };
      
      const response = await sendOrder(orderData);
      
      if (response && response.orderId) {
        // Redirection vers la page de confirmation
        window.location.href = `confirmation.html?id=${response.orderId}&price=${totalPrice}`;
      } else {
        alert("Une erreur est survenue lors de la commande.");
        submitBtn.textContent = 'Commander et Payer';
        submitBtn.disabled = false;
      }
    }
  });
});
