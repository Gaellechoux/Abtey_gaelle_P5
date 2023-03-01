const orderId = orderNumber();
displayOrderId(orderId);
console.log(orderId);
function orderNumber() {
  const str = window.location.search;
  const urlParams = new URLSearchParams(str);
  return urlParams.get("orderId");
}
function displayOrderId(orderId) {
  const orderIdElement = document.getElementById("orderId");
  orderIdElement.textContent = orderId;
}
