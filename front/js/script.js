/**
 * Recupèration des articles depuis l'API HTTP
 * @returns retourne une promise
 */
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

// Fonction qui génère toute la page web
function genererProducts(products) {
  // Création des items produits
  for (let i = 0; i < products.length; i++) {
    // Récupération de l'élément du DOM qui accueillera les items
    const items = document.querySelector("#items");
    // Récupération de l'id
    const id = products[i]._id;
    console.log(id);
    //  const str = "http://localhost:3000/api/products/index.html?id=products[i]._id";
    // const url = new URL(str);
    // const id = url.searchParams.get("id");
    // console.log(id);

    // Création d’un lien dédiée à un product canap
    const linkElement = document.createElement("a");
    linkElement.href = "./product.html?id=" + id;

    // Création d’une balise dédiée à un produit canap
    const productElement = document.createElement("article");
    // On crée l'élément img.
    const imageUrlElement = document.createElement("img");

    // On accède à l’indice i de la liste produit pour configurer la source de l’image.
    imageUrlElement.src = products[i].imageUrl;
    imageUrlElement.alt = products[i].altTxt;

    // On rattache l’image à produitElement (la balise article)
    productElement.appendChild(imageUrlElement);

    // Idem pour le nom et la description ...
    const nameElement = document.createElement("h3");
    nameElement.innerText = products[i].name;
    productElement.appendChild(nameElement);

    const descriptionElement = document.createElement("p");
    descriptionElement.innerText = products[i].description;
    productElement.appendChild(descriptionElement);

    // On rattache la balise article au lien et le lien a la sectionla section items
    linkElement.appendChild(productElement);
    items.appendChild(linkElement);
  }
}
