/**
 * Recupère le panier dans le LocalStorage
 * @returns Un taleau de produit
 */
function getCart() {
  let cart = localStorage.getItem("basket");
  return cart ? JSON.parse(cart) : false;
}

/**
 * Calcule le prix et la quantité des produits total dans le panier
 *
 */
function countCart() {
  let cart = getCart();
  console.log(cart);

  let totalPrice = 0;
  let totalQuantity = 0;

  if (cart && cart.length !== 0) {
    cart.forEach((cartItem) => {
      fetch("http://localhost:3000/api/products")
        .then((response) => response.json())
        .then((apiData) => {
          console.log(apiData);

          let fullItem = apiData.find((apiItem) => cartItem.id === apiItem._id);
          console.log(fullItem);

          totalPrice += fullItem.price * cartItem.quantity;
          totalQuantity += cartItem.quantity;

          //  Affiche le prix total et la quantité de produit dans le panier
          document.querySelector("#totalQuantity").textContent = totalQuantity;
          document.querySelector("#totalPrice").textContent = totalPrice;
        })
        .catch((error) => console.log(error));
    });
  } else {
    document.querySelector("#totalQuantity").textContent = totalQuantity;
    document.querySelector("#totalPrice").textContent = totalPrice;
  }
}
/**
 * Affichage d'un tableau récapitulatif des achats dans le panier.
 *
 */

async function displayCart() {
  let cart = getCart();

  if (cart) {
    fetch("http://localhost:3000/api/products")
      .then((response) => response.json())
      .then((apiData) => {
        cart.forEach((cartItem) => {
          console.log(cartItem);

          let fullItem = apiData.find((apiItem) => cartItem.id === apiItem._id);

          document.querySelector("#cart__items").innerHTML += `
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
            `;

          //  Modification de la quantité d'un produit dans le panier, en fonction de son id et de sa couleur.

          const itemQuantity = document.querySelectorAll(".itemQuantity");
          console.log(itemQuantity);

          for (let q = 0; q < itemQuantity.length; q++) {
            itemQuantity[q].addEventListener("change", function (e) {
              let id = e.target.closest(".cart__item").dataset.id;
              let color = e.target.closest(".cart__item").dataset.color;

              const result = cart.find(
                (item) => item.id === id && item.color === color
              );
              console.log(result);
              result.quantity = Number(e.target.value);
              const data = JSON.stringify(cart);
              localStorage.setItem("basket", data);
              countCart();
            });
          }

          //  Suppression d'un produit dans le panier en fonction de son id et de sa couleur.

          const btn_delete = document.querySelectorAll(".deleteItem");
          console.log(btn_delete);

          for (let d = 0; d < btn_delete.length; d++) {
            btn_delete[d].addEventListener("click", function (e) {
              let idDelete = e.target.closest(".cart__item").dataset.id;
              let colorDelete = e.target.closest(".cart__item").dataset.color;

              //  La méthode filter.

              let basket = cart.filter(
                (ellement) =>
                  ellement.id !== idDelete || ellement.color !== colorDelete
              );
              cart = basket;

              //  Vidage du panier

              e.target.closest(".cart__item").remove();
              localStorage.setItem("basket", JSON.stringify(basket));
              countCart();
            });
          }
        });
      })
      .catch((error) => console.log(error));
  }

  countCart();
}

displayCart();

/**
 * Vérification et envoi des informations client au localstorage
 */

function submitForm() {
  let cart = getCart();

  const orderButton = document.getElementById("order");

  orderButton.addEventListener("click", (e) => {
    e.preventDefault();

    const form = document.querySelector(".cart__order__form");
    console.log(form);

    const inputFirstName = document.getElementById("firstName");
    const inputLastName = document.getElementById("lastName");
    const inputAdress = document.getElementById("address");
    const inputCity = document.getElementById("city");
    const inputMail = document.getElementById("email");

    const firstNameRegexp = /^[A-Za-z]{3,20}$/g;
    const lastNameRegexp = /^[A-Za-z]{3,20}$/g;
    const cityRegexp = /^[A-Za-z-]{3,20}$/g;
    const mailRegexp =
      /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/g;
    const addressRegexp =
      /[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+/;

    const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
    const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
    const addressErrorMsg = document.getElementById("addressErrorMsg");
    const cityErrorMsg = document.getElementById("cityErrorMsg");
    const emailErrorMsg = document.getElementById("emailErrorMsg");

    //  Validation du formulaire.

    function validForm(regexp, input, errorMsg, message) {
      if (regexp.test(input.value) === false) {
        errorMsg.innerHTML = message;
        return false;
      } else {
        errorMsg.innerHTML = "";

        return true;
      }
      // return regexp.test(input.value);
    }
    
    
   if (cart !== false) {
    if (
      validForm(
        firstNameRegexp,
        inputFirstName,
        firstNameErrorMsg,
        "Veillez remplir votre prenom."
      ) &&
      validForm(
        lastNameRegexp,
        inputLastName,
        lastNameErrorMsg,
        "Veillez remplir votre nom."
      ) &&
      validForm(
        addressRegexp,
        inputAdress,
        addressErrorMsg,
        "Veillez remplir votre adresse."
      ) &&
      validForm(
        cityRegexp,
        inputCity,
        cityErrorMsg,
        "Veillez remplir votre ville."
      ) &&
      validForm(
        mailRegexp,
        inputMail,
        emailErrorMsg,
        "Veillez remplir un Email valide."
      ) 
    ) {
      
    
      //Construction d'un array depuis le local storage

      let idProducts = [];
      for (let i = 0; i < cart.length; i++) {
        const ids = cart[i].id;
        idProducts.push(ids);
        console.log(idProducts);
      }

      const body = {
        contact: {
          firstName: inputFirstName.value,
          lastName: inputLastName.value,
          address: inputAdress.value,
          city: inputCity.value,
          email: inputMail.value,
        },
        products: idProducts,
      };
      console.log(body);

      const options = {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

      fetch("http://localhost:3000/api/products/order", options)
        .then((response) => response.json())
        .then((data) => {
          const orderId = data.orderId;
          console.log(orderId);
          window.location.href = "confirmation.html" + "?orderId=" + orderId;
          localStorage.clear();
        })
        .catch((err) => {
          alert("Problème avec fetch : " + err.message);
        });
    } else {
      alert("Veillez bien remplir le formulaire.");
    }
  }else{
    alert("Veuillez ajouter un article dans le panier.");
  }
  });
    
} 
submitForm();
