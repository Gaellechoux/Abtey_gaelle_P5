        
     function getCart() {
      let cart = localStorage.getItem("basket")
      return cart ? JSON.parse(cart) : false
      
      // Equivalant de ça : 
      // if(cart) {
      //   return JSON.parse(cart) 
      // } else {
      //   return false
      // }
    }
    
    function countCart() {
      let cart = getCart()
      console.log(cart);
      
      let totalPrice = 0
      let totalQuantity = 0
    
      if(cart) {
        cart.forEach(cartItem => {
          fetch("http://localhost:3000/api/products")
          .then(response => response.json())
          .then(apiData => {
            console.log(apiData);
            let fullItem = apiData.find(apiItem => cartItem.id === apiItem._id)
            console.log(fullItem);
    
            totalPrice += fullItem.price * cartItem.quantity
            totalQuantity += cartItem.quantity
    
            document.querySelector('#totalQuantity').textContent = totalQuantity
            document.querySelector('#totalPrice').textContent = totalPrice
            
          })
          .catch(error => console.log(error))
        })
      } else {
        document.querySelector('#totalQuantity').textContent = totalQuantity
        document.querySelector('#totalPrice').textContent = totalPrice
      }
    
    }
    
    async function displayCart() {
      
      let cart = getCart()
      
      if(cart) {
    
        fetch("http://localhost:3000/api/products")
        .then(response => response.json())
        .then(apiData => {
    
          cart.forEach(cartItem => {
            console.log(cartItem);
            
            let fullItem = apiData.find(apiItem => cartItem.id === apiItem._id)
    
            document.querySelector('#cart__items').innerHTML += `
            <article class="cart__item" data-id="${fullItem._id}" data-color="${cartItem.color}">
              <div class="cart__item__img">
                <img src="${fullItem.imageUrl}" alt="${fullItem.altTxt}">
              </div>
              <div class="cart__item__content">
                <div class="cart__item__content__description">
                  <h2>${fullItem.name}</h2>
                  <p>${cartItem.color}</p>
                  <p>${fullItem.price} €</p>
                </div>
                <div class="cart__item__content__settings">
                  <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartItem.quantity}">
                  </div>
                  <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                  </div>
                </div>
              </div>
            </article>
            `
                    const itemQuantity = document.querySelectorAll(".itemQuantity");
                      console.log(itemQuantity);
                     
                      for (let q = 0; q < itemQuantity.length; q++){
                    itemQuantity[q].addEventListener('change', function(){

                    
                      const result = cart.find(item => item.id === fullItem._id && item.color === cartItem.color);
                      console.log(result);
                      // result.quantity = Number(quantityM);
                      
                       result.quantity++;
                      // if (result.quantity > 1) {
                       
                      //   result.quantity--;
                                            
                      // }
                      
                      
                  

                      let basket = cart.filter(item => item.id != cartItem.id || item.color != cartItem.color);

                      console.log(basket);
                       basket.push(result)
                       cart = basket
                                
                                    const data = JSON.stringify(cart);
                                      
                                  localStorage.setItem("basket", data);
                                  
                                  // document.querySelector('#cart__items').innerHTML = itemQuantity;         
                               window.location.reload();   
                    });
                   
                  }

                  
                    const btn_delete = document.querySelectorAll(".deleteItem");
                    console.log(btn_delete);

                    for (let d = 0; d < btn_delete.length; d++){

                    btn_delete[d].addEventListener("click", () => {
                      // event.preventDefault();
          
                      //Selection de l'element à supprimer en fonction de son id ET sa couleur
                      let idDelete = cartItem.id;
                      console.log(idDelete);
                      let colorDelete = cartItem.color;
 
                      // La méthode filter
          
                      basket = cart.filter(ellement => ellement.id !== idDelete || ellement.color !== colorDelete );
                      
                      localStorage.setItem("basket", JSON.stringify(basket));
          
                    // Alerte et rechargement de la page après la suppression d'un produit depuis l'URL actuelle.
                      alert("Voulez-vous vraiment supprimer le produit ?");
                      location.reload();
                  });  
                   }        
                   

          })
    
        })
        .catch(error => console.log(error))
      }
    
      countCart()
      
    
    }
    
    displayCart()
     
    
    function submitForm() {
      let cart = getCart()

      const orderButton = document.getElementById("order");
             
              orderButton.addEventListener("click", async (event) =>{
                event.preventDefault();

           const form = document.querySelector(".cart__order__form");
           console.log(form);  

              // const inputs = form.querySelectorAll("input");
              //           inputs.forEach((input) => {
              //             if (input.value === "") {
              //               alert("remplir le champs")
              //               return 
              //             }

              //           })  
          

              // Récupération des coordonnées du formulaire client
              const inputName = document.getElementById("firstName");
              if (firstName.value === "") {
                alert("Veillez remplir votre Prenom")
                return 
              }

              const inputLastName = document.getElementById("lastName");
              if (lastName.value === "") {
                alert("Veillez remplir votre Nom")
                return 
              }

              const inputAdress = document.getElementById("address");
              if (address.value === "") {
                alert("Veillez remplir votre Adresse")
                return 
              }

             

              const inputCity = document.getElementById("city");
              if (city.value === "") {
                alert("Veillez remplir le nom de votre Ville")
                return 
              }
            
             
              const inputMail = document.getElementById("email");
              console.log(inputMail);
              const regexp = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/g
                      if (regexp.test(email.value) === false) {
                       alert("Veillez remplir un Email valide")
                       return;
                       } 
                       
                //Construction d'un array depuis le local storage  
              let idProducts = [];
              for (let i = 0; i < cart.length; i++) {
                    const ids = cart[i].id;
                    idProducts.push(ids);
                    console.log(idProducts);   
              }
              

                const body = {
                  contact : {
                      firstName: inputName.value,
                      lastName: inputLastName.value,
                      address: inputAdress.value,
                      city: inputCity.value,
                      email: inputMail.value,
                  },
                  products: idProducts,
                  
              } 
              console.log(body);


                fetch("http://localhost:3000/api/products/order", {
                  method: "POST",
                  headers: { 
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json' 
                },
                  body: JSON.stringify(body)

                })

                .then((response) => response.json())
                .then((data) => {
                console.log(data);
                localStorage.clear();
               localStorage.setItem("orderId", data.orderId);

               window.location.href = "confirmation.html";
              })
                  
              .catch((err) => {
                alert ("Problème avec fetch : " + err.message);
              }); 
              });
                  
     }

     submitForm()