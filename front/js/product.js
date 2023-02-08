"use scrict";

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const id = urlParams.get("id")
console.log(id);

fetch("http://localhost:3000/api/products/" + id)
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function(res) {
      console.log(res)

      genererProduct(res)

    });

    function genererProduct(product) {
      
        const imageElement = document.createElement("img");
        imageElement.src = product.imageUrl;
        imageElement.alt = product.altTxt;
      
       const h1 = document.querySelector("#title");
       h1.textContent = product.name;
       
       const span = document.querySelector("#price");
       span.textContent = product.price;
      

       const p = document.querySelector("#description");
       p.textContent = product.description;

       const item__img = document.querySelector(".item__img");
        item__img.appendChild(imageElement);

      const select = document.querySelector("#colors");
      // select.textContent = product.colors;

       product.colors.forEach((color) => {

        const option = document.createElement("option");
        option.value = color;
        option.textContent = color;
        //  console.log(option); 
         select.appendChild(option);

       });
       
    }
      
    
     const button = document.querySelector("#addToCart");
     console.log(button);
     
      if (button != null) {  
      button.addEventListener("click", () => {

        // const id =  "_id";
        console.log(id);
        const color = document.querySelector("#colors").value
        console.log(color);
        const quantity = document.querySelector("#quantity").value
        console.log(quantity);

        if (color == null || color === "" || quantity == null || quantity == 0){
          alert("Selectionnez une couleur et une quantitée")
          return
        }


        let product = {
          id: id,
          color: color,
          quantity: Number(quantity),
        }

        console.log(product);
        

      //  récupération du contenu du panier 

      let basketJSON = localStorage.getItem("basket");
      let basket = basketJSON ? JSON.parse(basketJSON) : []  
      console.log(basket);


        //  Lorsqu’on ajoute un produit au panier, si celui-ci n'était pas déjà
          //  présent dans le panier, on ajoute un nouvel élément dans l’array.


    //  si le panier contient déjà un produit avec le même id et la même couleur alors j'incréménte la quantité
      // si non j'ajoute le produit.

      if (basket) {
        const resultFind = basket.find(
            (ellement) => ellement.id === id && ellement.color === color);
            //Si le produit commandé est déjà dans le panier
            if (resultFind) {
                let newQuantite =
                parseInt(product.quantity) + parseInt(resultFind.quantity);
                resultFind.quantity = newQuantite;
                  
               
            //Si le produit commandé n'est pas dans le panier
            } else {
                 basket.push(product)
               
            }
         }
        
        
    //  var index = basket.indexOf((x) => x.id == product.id && x.color == product.color)
    //  if(index != -1){  
    //  basket[index].quantity = +product.quantity 
    // } else{
    //   basket.push(product)
    //  }
  
          localStorage.setItem("basket", JSON.stringify(basket));
       
        window.location.href = "cart.html"
        
     })

  }