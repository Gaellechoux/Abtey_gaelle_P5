// Récupère l'ordreId de l'URL
const orderId = orderNumber();
displayOrderId(orderId);
console.log(orderId);

// Met le N° de commande dans la zone HTML réservé à l'affichage
function orderNumber() {
  const str = window.location.search;
  const urlParams = new URLSearchParams(str);
  return urlParams.get("orderId");
}

// Vide le localStorage
function displayOrderId(orderId) {
  const orderIdElement = document.getElementById("orderId");
  orderIdElement.textContent = orderId;
}
