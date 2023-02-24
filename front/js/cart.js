/**
 * Recupère le panier dans le LocalStorage
 * @returns Un taleau de produit
 */
function getCart() {
  let cart = localStorage.getItem("basket");
  return cart ? JSON.parse(cart) : false;
}

function countCart() { 
  let cart = getCart();
  console.log(cart);

  let totalPrice = 0;
  let totalQuantity = 0;

  if (cart) {
    cart.forEach((cartItem) => {
      fetch("http://localhost:3000/api/products")
        .then((response) => response.json())
        .then((apiData) => {
          console.log(apiData);
          let fullItem = apiData.find((apiItem) => cartItem.id === apiItem._id);
          console.log(fullItem);

          totalPrice += fullItem.price * cartItem.quantity;
          totalQuantity += cartItem.quantity;

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

          const btn_delete = document.querySelectorAll(".deleteItem");
          // btn_delete.remove();
          console.log(btn_delete);

          for (let d = 0; d < btn_delete.length; d++) {
            btn_delete[d].addEventListener("click", function(e) {
              //Selection de l'element à supprimer en fonction de son id ET sa couleur
              // let idDelete = cart[d].id;
              // console.log(idDelete);
              // let colorDelete = cart[d].color;
             let idDelete = e.target.closest(".cart__item").dataset.id;
             let colorDelete = e.target.closest(".cart__item").dataset.color;
            
            

              // La méthode filter

              basket = cart.filter(
                (ellement) =>
                  ellement.id !== idDelete || ellement.color !== colorDelete
              );

           cart.splice(basket);

              localStorage.setItem("basket", JSON.stringify(basket));

              // window.location.href = "cart.html"

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

function submitForm() {
  let cart = getCart();

  const orderButton = document.getElementById("order");

  orderButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const form = document.querySelector(".cart__order__form");
    console.log(form);

    // Récupération des coordonnées du formulaire client
    const inputFirstName = document.getElementById("firstName");
    const firstNameRegexp = /^[A-Za-z]{3,20}$/g;
    if (firstNameRegexp.test(firstName.value) === false) {
      firstNameErrorMsg.innerHTML = "Veillez remplir votre Prenom.";
      return;
    }

    const inputLastName = document.getElementById("lastName");
    const lastNameRegexp = /^[A-Za-z]{3,20}$/g;
    if (lastNameRegexp.test(lastName.value) === false) {
      lastNameErrorMsg.innerHTML = "Veillez remplir votre Nom.";
      return;
    }

    const inputAdress = document.getElementById("address");
    if (address.value === "") {
      addressErrorMsg.innerHTML = "Veillez remplir votre Adresse.";
      return;
    }

    const inputCity = document.getElementById("city");
    const cityRegexp = /^[A-Za-z\-]{3,20}$/g;
    if (cityRegexp.test(city.value) === false) {
      cityErrorMsg.innerHTML = "Veillez remplir le nom de votre Ville.";
      return;
    }

    const inputMail = document.getElementById("email");
    console.log(inputMail);
    const mailRegexp =
      /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/g;
    if (mailRegexp.test(email.value) === false) {
      emailErrorMsg.innerHTML = "Veillez remplir un Email valide.";
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

    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        const orderId = data.orderId;
        console.log(orderId);
        localStorage.clear();
        //  localStorage.setItem("orderId", data.orderId);

        window.location.href = "confirmation.html" + "?orderId=" + orderId;
      })

      .catch((err) => {
        alert("Problème avec fetch : " + err.message);
      });
  });
}

submitForm();
