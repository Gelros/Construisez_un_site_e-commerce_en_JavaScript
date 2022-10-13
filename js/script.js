async function getProductApi() {
  try {
    const rest = await fetch("http://localhost:3000/api/products");
    return rest.json();
  } catch (error) {
    alert("Le serveur ne répond pas");
  }
}

function showProduct(item) {
  console.log(item);
  document.querySelector(
    "#items"
  ).innerHTML += `<a href="./product.html?id=${item._id}">
        <article>
          <img src="${item.imageUrl}" alt="${item.altTxt}">
          <h3 class="productName">${item.name}</h3>
          <p class="productDescription">${item.description}</p>
        </article>
      </a>`;
}

async function afficherProducts() {
  const items = await getProductApi();
  console.log(items);
  items.forEach((item) => {
    showProduct(item);
  });
}
afficherProducts();

//getProduct();
//getProductApi();
