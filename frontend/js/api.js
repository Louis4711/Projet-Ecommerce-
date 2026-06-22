const API_URL = 'http://localhost:3000/api/teddies';

// Fonction globale pour récupérer tous les produits
async function getProducts() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Impossible de récupérer les produits:", error);
    return null;
  }
}

// Fonction globale pour récupérer un produit par son ID
async function getProductById(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Impossible de récupérer le produit ${id}:`, error);
    return null;
  }
}

// Fonction globale pour envoyer la commande
async function sendOrder(orderData) {
  try {
    const response = await fetch(`${API_URL}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de l'envoi de la commande:", error);
    return null;
  }
}

// Gestion du panier (localStorage)
function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

function addToCart(product) {
  const cart = getCart();
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function clearCart() {
  localStorage.removeItem('cart');
  updateCartCount();
}

function updateCartCount() {
  const countElement = document.getElementById('cart-count');
  if (countElement) {
    const cart = getCart();
    countElement.textContent = cart.length;
  }
}

// Formatage du prix (en euros, divisé par 100 car l'API renvoie des centimes)
function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price / 100);
}

// Initialisation globale
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
});
