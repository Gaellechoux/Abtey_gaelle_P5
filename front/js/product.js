/**
 *  Récupération de l’id du produit à afficher
 */
const str = window.location.search;
const urlParams = new URLSearchParams(str);
const id = urlParams.get("id");
console.log(id);

// Récupération d'un produit et ses détails de l'API pour l'insérer dans la page produit
fetch("http://localhost:3000/api/products/" + id)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (res) {
    console.log(res);

    genererProduct(res);
  });

  // Fonction qui génère toute la page produit
function genererProduct(product) {
  // On crée l'élément img.
  const imageElement = document.createElement("img");
  imageElement.src = product.imageUrl;
  imageElement.alt = product.altTxt;

  // Récupération de lélément du DOM qui accueillera le titre d'un produit
  const h1 = document.querySelector("#title");
  h1.textContent = product.name;
 
  const span = document.querySelector("#price");
  span.textContent = product.price;

  const p = document.querySelector("#description");
  p.textContent = product.description;

  const item__img = document.querySelector(".item__img");
  item__img.appendChild(imageElement);

  const select = document.querySelector("#colors");
  
   // Insertion des options de couleurs
  product.colors.forEach((color) => {
    const option = document.createElement("option");
    option.value = color;
    option.textContent = color;
     console.log(option);
    select.appendChild(option);
  });
}


const button = document.querySelector("#addToCart");
console.log(button);

if (button != null) {
  button.addEventListener("click", () => {
    console.log(id);
    const color = document.querySelector("#colors").value;
    console.log(color);
    const quantity = document.querySelector("#quantity").value;
    console.log(quantity);
  
    if (color == null || color === "" || quantity == null || quantity == 0) {
      alert("Selectionnez une couleur et une quantité");
      return;
    }
  if (quantity > 100) {
      alert("Quantités maximale atteinte");
      return;  
    }

 //Récupération des options de l'article à ajouter au panier
    let product = {
      id: id,
      color: color,
      quantity: Number(quantity),
    };

    console.log(product);

    //  récupération du contenu du panier

    let basketJSON = localStorage.getItem("basket");
    let basket = basketJSON ? JSON.parse(basketJSON) : [];
    console.log(basket);

    //  si le panier contient déjà un produit avec le même id et la même couleur alors j'incréménte la quantité
    // si non j'ajoute le produit.

    if (basket) {
      const resultFind = basket.find(
        (ellement) => ellement.id === id && ellement.color === color
      );
      //Si le produit commandé est déjà dans le panier
      if (resultFind) {
        let newQuantite =
          parseInt(product.quantity) + parseInt(resultFind.quantity);
        resultFind.quantity = newQuantite;

        //Si le produit commandé n'est pas dans le panier
      } else {
        basket.push(product);
      }
    }
    
      // Stockage du panier dans le localStorage en JSON
    localStorage.setItem("basket", JSON.stringify(basket));
    
    window.location.href = "cart.html";
  });
}
