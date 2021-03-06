// supported in IE
function isLocalHost(url) {
  return url.indexOf("localhost") !== -1 || url.indexOf("127.0.0.1") !== -1;
}
const JSONURL = isLocalHost(window.location.href)
  ? "./js/API/recipes.json"
  : "https://thomasrivetti.github.io/ThomasRivetti_07_07122021/js/API/recipes.json";

var allIng = [];
var filteredIng = [];
var allDevices = [];
var filteredDevices = [];
var allUstensils = [];
var filteredUstensils = [];
var searchBarValue = "";
var recipesArray = [];
var recipesArrayFiltered = [];

//fetch API JSON
fetch(JSONURL)
  .then((response) => {
    if (response.ok) return response.json();
  })
  .then((value) => {
    //affiche les recettes
    recipeCardBuilder(value.recipes);
    recipesArray = value.recipes;
  })
  .catch((error) => console.error(error));

// filtrer les elements dans les listes en fonction des valeurs saisies dans les inputs
const filtersInput = document.querySelectorAll(".filters__input");
filtersInput.forEach((input) => {
  input.addEventListener("keyup", (event) => {
    if (event.target.value.length > 0) {
      event.target.parentElement.nextElementSibling.classList.add(
        "is-expanded"
      );
    } else {
      event.target.parentElement.nextElementSibling.classList.remove(
        "is-expanded"
      );
    }
    switch (event.target.dataset.search) {
      case "ingredients":
        showTags(
          allIng.filter(
            (ing) =>
              ing.toLowerCase().indexOf(event.target.value.toLowerCase()) != -1
          ),
          "ingredientsTaglist",
          "ingredients"
        );
        break;
      case "devices":
        showTags(
          allDevices.filter(
            (device) =>
              device.toLowerCase().indexOf(event.target.value.toLowerCase()) !=
              -1
          ),
          "devicesTaglist",
          "device"
        );
        break;
      case "ustensils":
        showTags(
          allUstensils.filter(
            (ustensil) =>
              ustensil
                .toLowerCase()
                .indexOf(event.target.value.toLowerCase()) != -1
          ),
          "ustensilsTaglist",
          "ustensils"
        );
        break;
      default:
        break;
    }
  });
});

//fonction g??n??rique pour afficher dynamiquement les listes des ingredients, appareils et ustensiles
function showTags(items, tagId, type) {
  const tag = document.getElementById(tagId);
  let templateTaglist = ``;
  items.sort();
  for (const item of items) {
    let properItemCase = item[0].toUpperCase() + item.toLowerCase().slice(1);
    if (
      filteredIng.indexOf(item) != -1 ||
      filteredDevices.indexOf(item) != -1 ||
      filteredUstensils.indexOf(item) != -1
    ) {
      templateTaglist += `
            <li><button aria-label="${properItemCase}" title="${properItemCase}" class="tag--${type} tag is-selected" data-type="${type}" data-item="${item}">${properItemCase}</button></li>`;
    } else {
      templateTaglist += `
            <li><button aria-label="${properItemCase}" title="${properItemCase}" class="tag--${type} tag" data-type="${type}" data-item="${item}">${properItemCase}</button></li>`;
    }
  }
  tag.innerHTML = templateTaglist;
  const tags = tag.querySelectorAll(".tag");

  tags.forEach((tag) => tag.addEventListener("click", addFilter));
}

//affiche les tags selectionn??s lors du clic et ajoute la classe is-selected dessus
function addFilter(event) {
  const tagsBtn = document.getElementById("tagsBtn");
  const type =
    event.target.dataset.type !== undefined
      ? event.target.dataset.type
      : "default";
  const value =
    event.target.dataset.item !== undefined
      ? event.target.dataset.item
      : event.target.value;
  if (!event.target.classList.contains("is-selected")) {
    let properValueCase = value[0].toUpperCase() + value.toLowerCase().slice(1);
    if (
      type == "default" &&
      document.querySelector(".filters__btn--default") !== null
    ) {
      const filterDefault = document.querySelector(".filters__btn--default");
      filterDefault.dataset.controls = value;
      filterDefault.innerHTML =
        properValueCase +
        '<img src="./assets/img/ico/ico_close.svg" alt="close selected filter" class="ico ico__close">';
    } else {
      let templateTag = `
              <li>
              <button onclick="removeFilter(this)" data-controls="${value}" class="filters__tag filters__btn filters__btn--${type}">
                  ${properValueCase}
                  <img src="./assets/img/ico/ico_close.svg" alt="close selected filter" class="ico ico__close">
              </button>
              </li>
              `;
      tagsBtn.innerHTML += templateTag;
      if (type !== "default") event.target.classList.add("is-selected");
    }

    switch (type) {
      case "ingredients":
        filteredIng.push(value);
        break;
      case "device":
        filteredDevices.push(value);
        break;
      case "ustensils":
        filteredUstensils.push(value);
        break;
      default:
        break;
    }

    // maj liste des recettes
    const filtered = recipeFilter();
    recipeCardBuilder(filtered);
  }
}

//permet de filtrer les recettes lorsqu'on selectionne un tag
function recipeFilter() {
  recipesArrayFiltered = recipesArray.filter((recipe) => {
    let globalBoolean = false;
    let ingBoolean = false;
    let devBoolean = false;
    let ustBoolean = false;
    let searchBarBoolean = false;
    const ustString = recipe.ustensils.join(", ");
    const ingString = recipe.ingredients
      .map((ing) => ing.ingredient)
      .join(", ");

    ingBoolean = filteredIng.every((el) => {
      let condition = false;
      if (ingString.indexOf(el) != -1) condition = true;
      return condition;
    });

    devBoolean = filteredDevices.every((el) => {
      let condition = false;
      if (el.indexOf(recipe.appliance) != -1) condition = true;
      return condition;
    });

    ustBoolean = filteredUstensils.every((el) => {
      let condition = false;
      if (ustString.indexOf(el) != -1) condition = true;
      return condition;
    });

    if (
      recipe.name.toLowerCase().indexOf(searchBarValue) !== -1 ||
      ingString.toLowerCase().indexOf(searchBarValue) !== -1 ||
      ustString.toLowerCase().indexOf(searchBarValue) !== -1 ||
      recipe.appliance.toLowerCase().indexOf(searchBarValue) !== -1
    ) {
      searchBarBoolean = true;
    }

    if (ingBoolean && devBoolean && ustBoolean && searchBarBoolean)
      globalBoolean = true;
    return globalBoolean;
  });

  return recipesArrayFiltered;
}

// enleve le tag ajout?? suite ?? la selection dans la liste et enleve la classe is-selected quand on le ferme.
window.removeFilter = (filter) => {
  filter.parentElement.remove(); //supprime le <li>
  let unselectValue = filter.getAttribute("data-controls"); //variable qui obtient l'attribut data-controls

  //nettoyage des tags lorsque il a ??t?? d??selectionn??

  if (filteredIng.indexOf(unselectValue) != -1) {
    filteredIng.splice(filteredIng.indexOf(unselectValue), 1);
  }
  if (filteredDevices.indexOf(unselectValue) != -1) {
    filteredDevices.splice(filteredDevices.indexOf(unselectValue), 1);
  }
  if (filteredUstensils.indexOf(unselectValue) != -1) {
    filteredUstensils.splice(filteredUstensils.indexOf(unselectValue), 1);
  }

  if (!filter.classList.contains("filters__btn--default")) {
    document
      .querySelector('[data-item="' + unselectValue + '"]')
      .classList.remove("is-selected"); // enleve la classe is-selected
  } else {
    searchBarValue = "";
    searchBarInput.value = "";
    noRecipesMessage.innerHTML = "";
  }

  const filtered = recipeFilter();
  recipeCardBuilder(filtered);
};

document.querySelectorAll(".filters__dropDown").forEach((btn) =>
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    openTaglist(btn.getAttribute("aria-controls"));
  })
);

//fonction ouverture container des tags au clic sur le dropdown
function openTaglist(idContainer) {
  let tagContainer = document.getElementById(idContainer);
  const filtersForm = tagContainer.previousElementSibling;
  const icoDropDown = filtersForm.querySelector(".ico");

  let tempPlaceholder = filtersForm.childNodes[1].placeholder;
  filtersForm.childNodes[1].placeholder =
    filtersForm.childNodes[1].dataset.placeholder;
  filtersForm.childNodes[1].dataset.placeholder = tempPlaceholder;

  if (tagContainer.classList.contains("is-expanded")) {
    tagContainer.classList.remove("is-expanded");
    icoDropDown.classList.replace("ico__dropUp", "ico__dropDown");
  } else {
    if (
      document.querySelector(".filters__inputContainer.is-expanded") != null
    ) {
      let input = document.querySelector(".filters__inputContainer.is-expanded")
        .previousElementSibling.childNodes[1];
      let removePlaceholder = input.placeholder;
      input.placeholder = input.dataset.placeholder;
      input.dataset.placeholder = removePlaceholder;

      document
        .querySelector(".filters__inputContainer.is-expanded")
        .classList.remove("is-expanded");
    }
    tagContainer.classList.add("is-expanded");
    icoDropDown.classList.replace("ico__dropDown", "ico__dropUp");
  }
}

/** fonction qui g??n??re les cartes des recettes dynamiquement
 * @params {recipes} charge les donn??es JSON pour construire les articles de recherches
 */
function recipeCardBuilder(recipes) {
  const recipeCard = document.getElementById("recipeContainer");
  recipeCard.innerHTML = "";
  for (const recipe of recipes) {
    recipeCard.innerHTML += `
        <article class="recipe__container">
            <div class="recipe__picture">
                </div>
                <div class="recipe__infoBlock">
                    <div class="recipe__legend">
                        <h2 class="recipe__name">${recipe.name}</h2>
                        <span class="recipe__time"><img src="./assets/img/ico/ico_clock.svg" alt=""> ${recipe.time}min</span>
                    </div>
                    <div class="recipe__infos">
                        <div class="recipe__ingredients">
                            <ul id="recipe-${recipe.id}" class="recipe__ingredList"></ul>
                        </div>
                    <div class="recipe__instructionsBlock">
                        <p class="recipe__instructions">${recipe.description}</p>
                    </div>
                </div>
            </div>
        </article>`;
    const ingredientList = document.getElementById(`recipe-${recipe.id}`);
    for (const ingredient of recipe.ingredients) {
      ingredientList.innerHTML += `
              <li class="recipe__ingredient">${ingredient.ingredient}:
                <span class="recipe__quantity">${
                  ingredient.quantity === undefined ? "" : ingredient.quantity
                } ${ingredient.unit === undefined ? "" : ingredient.unit}</span>
              </li>
            `;
    }
  }
  //r??cup??ration des tableaux contenant:
  allUstensils = [];
  allDevices = [];
  allIng = [];

  recipes.forEach((e) => {
    //ingr??dients
    e.ingredients.forEach((el) => {
      if (allIng.indexOf(el.ingredient) == -1) allIng.push(el.ingredient);
    });
    //appareils
    if (allDevices.indexOf(e.appliance) == -1) allDevices.push(e.appliance);

    //ustensiles
    e.ustensils.forEach((el) => {
      if (allUstensils.indexOf(el) == -1) allUstensils.push(el);
    });
  });
  //affiche les tags des champs ingredients, appareils et ustensils
  showTags(allIng, "ingredientsTaglist", "ingredients");
  showTags(allDevices, "devicesTaglist", "device");
  showTags(allUstensils, "ustensilsTaglist", "ustensils");
}

//champ de recherche dans la barre principale
const searchBarInput = document.getElementById("search");
const noRecipesMessage = document.getElementById("filtersMessage");
const templateMessage = `
  <p class="filters__message">
    Aucune recette ne correspond ?? votre recherche... Vous pouvez chercher "tarte aux pommes", "poisson", etc.
    <button id="closeMessage">
      <img src="./assets/img/ico/ico_close_dark.svg" alt="ferme le bloc d'informations" class="ico ico__close filters__icoClose">
    </button>
  </p>        
  `;

//sert ?? bloquer l'??v??vement "ENTER" sur la barre de recherche lorsque le champ a ??t?? saisi par l'utilsateur
document.querySelector("form.searchBar").addEventListener("submit", (e) => {
  e.preventDefault();
});

searchBarInput.addEventListener("keyup", (e) => {
  if (e.target.value.length >= 3) {
    searchBarValue = searchBarInput.value.toLowerCase();
    addFilter(e);
    noRecipesMessage.innerHTML = "";
    if (recipesArrayFiltered.length == 0) showErrorMessage();
  } else showErrorMessage();
});

//fonctions de suppression du message d'absence de recettes
function showErrorMessage() {
  noRecipesMessage.innerHTML = templateMessage;
  document
    .getElementById("closeMessage")
    .addEventListener("click", removeErrorMessage);
}
function removeErrorMessage() {
  noRecipesMessage.innerHTML = "";
  searchBarValue = "";
  searchBarInput.value = "";
  if (document.querySelector(".filters__btn--default") !== null)
    document.querySelector(".filters__btn--default").remove();

  const filtered = recipeFilter();
  recipeCardBuilder(filtered);
}
