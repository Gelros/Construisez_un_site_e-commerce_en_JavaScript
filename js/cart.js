function getProductForm() {
  return JSON.parse(localStorage.getItem("product"));
}

async function returnProduit() {
  let products = getProductForm();

  let cartItems = "";
  let prixTotal = 0;
  let quantiteTotal = 0;
  for (const product of products) {
    await fetch(`http://localhost:3000/api/products/${product.id}`)
      .then((res) => res.json())
      .then((item) => {
        quantiteTotal += parseInt(product.quantity);
        prixTotal += parseInt(item.price) * parseInt(product.quantity);
        cartItems += `<article class="cart__item" data-id="${
          product.id
        }" data-color="${product.color}">
                <div class="cart__item__img">
                  <img src="${item.imageUrl}" alt="${item.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${item.name}</h2>
                    <p>${product.color}</p>
                    <p>${(item.price *= product.quantity)}€</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté :</p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${
                        product.quantity
                      }">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;
      });
  }
  document.querySelector("#cart__items").innerHTML = cartItems;
  document.querySelector("#totalQuantity").innerHTML = quantiteTotal;
  document.querySelector("#totalPrice").innerHTML = prixTotal;

  /***********Suppress cart***********/
  function suppression() {
    let products = getProductForm();
    let deleteItem = document.querySelectorAll(".deleteItem");
    deleteItem.forEach((e) => {
      e.addEventListener("click", (e) => {
        const couleur = e.target.closest("article").dataset.color;
        const id = e.target.closest("article").dataset.id;
        const productRemove = products.filter(
          (el) => !(el.id == id && el.color === couleur)
        );
        console.log(productRemove);
        let confirmation = confirm("Voulez-vous supprimer cet article");

        if (confirmation) {
          localStorage.setItem("product", JSON.stringify(productRemove));
          returnProduit();
        }
      });
    });
  }

  suppression();
  /**************************/

  /************Edit*************/

  function edition() {
    let quantityFinal = 0;
    let input = document.querySelectorAll(".itemQuantity");
    for (let l = 0; l < input.length; l++) {
      input[l].addEventListener("click", (e) => {
        quantityFinal = e.target.value;
        products[l].quantity = quantityFinal;
        localStorage.setItem("product", JSON.stringify(products));
        returnProduit();
      });
    }
  }
  edition();
  /**********************/
}
returnProduit();

/*********Formulaire **************/
let form = document.querySelector(".cart__order__form");

/********EMAIL*********/

email = false;

form.email.addEventListener("change", () => {
  validEmail(this);
});

const validEmail = () => {
  let emailRegex = new RegExp(
    "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$",
    "g"
  );
  if (emailRegex.test(form.email.value)) {
    emailErrorMsg.innerHTML = "";

    return true;
  } else {
    emailErrorMsg.innerHTML = "Adresse non valide";

    return false;
  }
};

/**************/

/***********Ville*********/

city.addEventListener("change", () => {
  validVille(this);
});

const validVille = () => {
  let villeRegex = new RegExp("\\w+", "g");
  if (villeRegex.test(city.value)) {
    cityErrorMsg.innerHTML = "";
    return true;
  } else {
    cityErrorMsg.innerHTML = "Nom de ville non valide";
    return false;
  }
};

/******************/

/***********Adresse*********/

address.addEventListener("change", () => {
  validAdresse(this);
});

const validAdresse = () => {
  let adresseRegex = new RegExp(/[A-Za-z0-9]{4,30}/);
  if (adresseRegex.test(address.value)) {
    addressErrorMsg.innerHTML = "";
    return true;
  } else {
    addressErrorMsg.innerHTML = "L'adresse est pas valide";
    return false;
  }
};

/******************/

/***********Nom*********/

lastName.addEventListener("change", () => {
  validNom(this);
});

const validNom = () => {
  let nomRegex = new RegExp(/[A-Za-z]{2,30}/);
  if (nomRegex.test(lastName.value)) {
    lastNameErrorMsg.innerHTML = "";
    return true;
  } else {
    lastNameErrorMsg.innerHTML = "Les nom est pas valide";
    return false;
  }
};

/******************/

/***********Prénom*********/

firstName.addEventListener("change", () => {
  validPrenom(this);
});

const validPrenom = () => {
  let prenomRegex = new RegExp("^[A-Z][A-Za-zéèêöôùëäâàûü-]{2,30}$", "g");
  if (prenomRegex.test(firstName.value)) {
    firstNameErrorMsg.innerHTML = "";

    return true;
  } else {
    firstNameErrorMsg.innerHTML = "Les prénom est pas valide";

    return false;
  }
};

/************Validation du formulaire***********/
(async function formValidate() {
  let input = document.querySelectorAll(".cart__order__form__question");

  order.addEventListener("click", async (e) => {
    const produitLocal = getProductForm();
    console.log(produitLocal);
    e.preventDefault();
    if (
      validPrenom() &&
      validAdresse() &&
      validNom() &&
      validVille() &&
      validEmail()
    ) {
      let contact = {
        firstName: document.querySelector("#firstName").value,
        lastName: document.querySelector("#lastName").value,
        city: document.querySelector("#city").value,
        address: document.querySelector("#address").value,
        email: document.querySelector("#email").value,
      };
      let products = [];
      produitLocal.forEach((product) => {
        products.push(product.id);
      });
      let dataForm = {
        contact,
        products,
      };
      await fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify(dataForm),
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.clear();
          location.href = `../confirmation.html?id=${data.orderId}`;
        })
        .catch((err) => console.log(err));
    } else {
      alert("Veuillez remplir le formulaire");
    }
  });
})();

/*********************/

/******************/

/******************/

// function showProduct() {
//   let storageStatut = JSON.parse(localStorage.getItem("product"));
//   let cartItem = document.getElementById("cart__items");
//   storageStatut.forEach((e) => {
//     async function productApi() {
//       try {
//         const res = await fetch(`http://localhost:3000/api/products/${e.id}`);
//         console.log(res);
//         return res.json();
//       } catch (error) {
//         alert("Le serveur ne répond pas");
//       }
//     }
//     productApi();
//     let quantiteTotal = 0;

//     async function showProductApi() {
//       const items = await productApi();

//       quantiteTotal += parseInt(e.quantity);
//       let sectionItems = document.createElement("article");
//       sectionItems.innerHTML = `<article class="cart__item" data-id="${
//         e.id
//       }" data-color="${e.color}">
//                 <div class="cart__item__img">
//                   <img src="${items.imageUrl}" alt="${items.altTxt}">
//                 </div>
//                 <div class="cart__item__content">
//                   <div class="cart__item__content__description">
//                     <h2>${items.name}</h2>
//                     <p>${e.color}</p>
//                     <p>${(items.price *= quantiteTotal)}€</p>
//                   </div>
//                   <div class="cart__item__content__settings">
//                     <div class="cart__item__content__settings__quantity">
//                       <p>Qté :</p>
//                       <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${
//                         e.quantity
//                       }">
//                     </div>
//                     <div class="cart__item__content__settings__delete">
//                       <p class="deleteItem">Supprimer</p>
//                     </div>
//                   </div>
//                 </div>
//               </article>`;

//       sectionItems.classList.add("cart__items");
//       cartItem.appendChild(sectionItems);

//       //*********** quantité total ************/
//       const quantTot = document.getElementById("totalQuantity");
//       quantTot.innerText = `${quantiteTotal}`;

//       console.log(quantiteTotal);
//       //********* ********/

//       //*********Afficher le prix total  **********/

//       //********* bouton de suppression **********/
//       function cartSuppress() {
//         const buttonSuppress = document.querySelectorAll(".deleteItem");
//         for (let i = 0; i < buttonSuppress.length; i++) {
//           buttonSuppress[i].addEventListener("click", (e) => {
//             buttonSuppress[
//               i
//             ].parentElement.parentElement.parentElement.parentElement.remove();
//           });
//         }
//       }
//       cartSuppress();
//       //********* ********/
//     }

//     //*********
//     showProductApi();
//   });
//   //*********
// }
// showProduct();
