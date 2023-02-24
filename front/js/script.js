fetch("http://localhost:3000/api/products")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (products) {
    console.log(products);
    return genererProducts(products);
  });

function genererProducts(products) {
  for (let i = 0; i < products.length; i++) {
    // Récupération de l'élément du DOM qui accueillera les items
    const items = document.querySelector("#items");
    // Récupération de l'id
    const id = products[i]._id;
    console.log(id);

    // const str = "http://localhost:3000/api/products/product.html?[i]=_id";
    // const imageUrl = new URL(str);
    // const id = imageUrl.searchParams.get("i");
    // console.log(i);

    // Création d’un lien dédiée à un product canap
    const linkElement = document.createElement("a");
    linkElement.href = "./product.html?id=" + id;
    // Création d’une balise dédiée à un product meuble
    const productElement = document.createElement("article");
    // productElement.dataset.id = products[i].id;
    // On crée l'élément img.
    const imageUrlElement = document.createElement("img");

    imageUrlElement.src = products[i].imageUrl;
    imageUrlElement.alt = products[i].altTxt;

    productElement.appendChild(imageUrlElement);

    const nameElement = document.createElement("h3");
    nameElement.innerText = products[i].name;
    productElement.appendChild(nameElement);

    const descriptionElement = document.createElement("p");
    descriptionElement.innerText = products[i].description;

    productElement.appendChild(descriptionElement);

    // items.appendChild(productElement);
    linkElement.appendChild(productElement);
    items.appendChild(linkElement);
  }
}
