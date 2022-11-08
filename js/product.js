const queryString_url_id = window.location.search;
let urlSearchParams = new URLSearchParams(queryString_url_id);
let getId = urlSearchParams.get("id");

async function productApi() {
  try {
    const res = await fetch(`http://localhost:3000/api/products/${getId}`);
    console.log(res);
    return res.json();
  } catch (error) {
    alert("Le serveur ne répond pas");
  }
}

async function showProduct() {
  const items = await productApi();
  const name = document.querySelector("#title");
  console.log(items);

  let select = document.getElementById("colors");

  /*let img = document.createElement("img");
  let dotImg = document.querySelector(".item__img");
  img.src = `${items.imageUrl}`;
  img.alt = `${items.altTxt}`;
  dotImg.appendChild(img);*/

  document.querySelector(".item__img").innerHTML = `
  <img src="${items.imageUrl}" alt="${items.altTxt}">`;

  name.innerText = `${items.name}`;

  document.querySelector("#price").innerText = `${items.price}`;

  document.querySelector("#description").innerText = `${items.description}`;

  console.log(items.colors);
  items.colors.forEach((color) => {
    let tagOption = document.createElement("option");
    tagOption.innerHTML = `${color}`;
    tagOption.value = `${color}`;
    select.appendChild(tagOption);
  });
}
showProduct();

//LocalStorage

function addProductToPanier() {
  const panier = document.getElementById("addToCart");

  panier.addEventListener("click", () => {
    const color = document.querySelector("#colors").value;
    const quantite = document.querySelector("#quantity").value;
    const data = {
      id: getId,
      color: color,
      quantity: Number(quantite),
    };
    let storageStatut = JSON.parse(localStorage.getItem("product"));
    const dataPush = () => {
      if (color == null || color === "") {
        alert("veuillez sélectionner une couleur");
      } else if (quantite < 1 || quantite > 100) {
        alert("veuillez choisir entre 1 et 100 articles");
      } else {
        storageStatut.push(data);
        localStorage.setItem("product", JSON.stringify(storageStatut));
        alert("Le produit a été ajouté avec succés");
      }
    };
    if (storageStatut) {
      storageStatut.forEach((items, index) => {
        console.log(items);
        if (items.id === getId && items.color === color) {
          data.quantity = parseInt(data.quantity) + parseInt(items.quantity);
          storageStatut.splice(index, 1);
        }
      });
      dataPush();
    } else {
      storageStatut = [];
      dataPush();
    }
  });
}
addProductToPanier();
