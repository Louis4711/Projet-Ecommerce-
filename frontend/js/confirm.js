document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('id');
  const orderPrice = urlParams.get('price');

  const orderIdElement = document.getElementById('order-id');
  const orderPriceElement = document.getElementById('order-price');

  if (orderId && orderPrice) {
    orderIdElement.textContent = orderId;
    orderPriceElement.textContent = formatPrice(orderPrice);
    
    // Nettoyer le panier une fois la commande validée
    clearCart();
  } else {
    // Si l'URL n'a pas les paramètres, on redirige vers l'accueil
    window.location.href = 'index.html';
  }
});
