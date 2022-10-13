function showProduct() {
  let storageStatut = JSON.parse(localStorage.getItem("product"));
  let cartItem = document.getElementById("cart__items");
  storageStatut.forEach((e) => {
    async function productApi() {
      try {
        const res = await fetch(`http://localhost:3000/api/products/${e.id}`);
        console.log(res);
        return res.json();
      } catch (error) {
        alert("Le serveur ne répond pas");
      }
    }
    productApi();
    async function showProductApi() {
      const items = await productApi();

      let itemPrice = items.price;
      console.log(itemPrice);

      let sectionItems = document.createElement("article");
      sectionItems.innerHTML = `<article class="cart__item" data-id="${
        e.id
      }" data-color="${e.color}">
                <div class="cart__item__img">
                  <img src="${items.imageUrl}" alt="${items.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${items.name}</h2>
                    <p>${e.color}</p>
                    <p>${(items.price *= e.quantity)}€</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté :</p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${
                        e.quantity
                      }">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;
      sectionItems.classList.add("cart__items");
      cartItem.appendChild(sectionItems);
      //*********** quantité total ************/
      let quantiteTotal = [];
      for (let t = 0; t < storageStatut.length; t++) {
        let quantiteTotalDansLePanier = storageStatut[t].quantity;
        quantiteTotal.push(quantiteTotalDansLePanier);
      }
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      {
        quantiteTotal = quantiteTotal.reduce(reducer);
      }
      const totalQuantity = document.getElementById("totalQuantity");
      totalQuantity.innerText = `${quantiteTotal}`;
      //********* ********/

      //*********Afficher le prix total  **********/

      //********* bouton de suppression **********/
      function cartSuppress() {
        const buttonSuppress = document.querySelectorAll(".deleteItem");
        for (let i = 0; i < buttonSuppress.length; i++) {
          buttonSuppress[i].addEventListener("click", (e) => {
            buttonSuppress[
              i
            ].parentElement.parentElement.parentElement.parentElement.remove();

          });
        }
      }
      cartSuppress();
      //********* ********/
    }

    //*********
    showProductApi();
  });
  //*********
}
showProduct();
