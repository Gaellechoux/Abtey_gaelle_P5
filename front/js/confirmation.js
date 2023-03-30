const orderId = orderNumber();
displayOrderId(orderId);
console.log(orderId);

/**
 *  Récupération du numéro de la commande via l'URL.
 */

function orderNumber() {
  const str = window.location.search;
  const urlParams = new URLSearchParams(str);
  return urlParams.get("orderId");
}

/**
 * Affichage du numéro de la commande.
 */

function displayOrderId(orderId) {
  const orderIdElement = document.getElementById("orderId");
  orderIdElement.textContent = orderId;
}
