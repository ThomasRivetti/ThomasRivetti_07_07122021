/**
 * to do:
 * revoir la sélection du multifiltres: charge les recettes par rapport au dernier filtre selectionné actuellement sans tenir compte des autres filtres
 * voir le tri par champs de recherche
 */

let allIng = [];
let filteredIng = [];
let allDevices = [];
let filteredDevices = [];
let allUstensils = [];
let filteredUstensils = [];
let recipesArray = [];
let recipesArrayFiltered = [];

fetch("./js/API/recipes.json")
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
  })
  .then(function (value) {
    // const searchParams = new URLSearchParams(window.location.search);
    // const recipesId = searchParams.get("id");

    //affiche les recettes
    recipeCardBuilder(value.recipes);
    recipesArray = value.recipes;

    // //affiche les tags des champs ingredients, appareils et ustensils
    // showTags(allIng, 'ingredientsTaglist', 'ingredients');
    // showTags(allDevices, 'devicesTaglist', 'device');
    // showTags(allUstensils, 'ustensilsTaglist', 'ustensils');
  })
  .catch(function (error) {
    console.error(error);
  });
// filtrer les elements dans les listes en fonction des valeurs saisies dans les inputs
const filtersInput = document.querySelectorAll(".filters__input");
filtersInput.forEach((input) => {
  input.addEventListener("keyup", function (event) {
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
        console.log("erreur");
    }
  });
});

//fonction générique pour afficher dynamiquement les listes des ingredients, appareils et ustensiles
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
  const tagsBtn = document.getElementById("tagsBtn");
  tags.forEach((tag) => {
    tag.addEventListener("click", function (event) {
      //affiche les tags selectionnés lors du clic et ajoute la classe is-selected dessus
      const type = event.target.dataset.type;
      const value = event.target.dataset.item;
      if (
        !event.target.classList.contains("is-selected") &&
        type !== undefined &&
        value !== undefined
      ) {
        let templateTag = ``;
        let properValueCase =
          value[0].toUpperCase() + value.toLowerCase().slice(1);
        templateTag += `
                <li>
                <button onclick="removeFilter(this)" data-controls="${value}" class="filters__tag filters__btn filters__btn--${type}">
                    ${properValueCase}
                    <img src="/assets/img/ico/ico_close.svg" alt="close selected filter" class="ico ico__close">
                </button>
                </li>
                `;
        tagsBtn.innerHTML += templateTag;
        event.target.classList.add("is-selected");

        switch (type) {
          case "ingredients":
            filteredIng.push(value);
            break;
          case "device":
            //console.log("device",type, filteredDevices, value)
            filteredDevices.push(value);
            break;
          case "ustensils":
            console.log("ustensils", type, filteredUstensils, value);
            filteredUstensils.push(value);
            break;
          default:
            console.log("erreur");
        }

        // maj liste des recettes
        recipeCardBuilder(
          recipesArray.filter((recipe) => {
            let globalBoolean = false;
            let ingBoolean = false;
            let devBoolean = false;
            let ustBoolean = false;
            if (filteredIng.length > 0) {
              recipe.ingredients.forEach((ing) => {
                if (filteredIng.indexOf(ing.ingredient) != -1)
                  ingBoolean = true;
              });
            } else {
              ingBoolean = true;
            }

            if (filteredDevices.length > 0) {
              if (filteredDevices.indexOf(recipe.appliance) != -1)
                devBoolean = true;
            } else {
              devBoolean = true;
            }
            if (filteredUstensils.length > 0) {
              recipe.ustensils.forEach((ust) => {
                if (filteredUstensils.indexOf(ust) != -1) ustBoolean = true;
              });
            } else {
              ustBoolean = true;
            }

            console.log(
              ingBoolean,
              devBoolean,
              ustBoolean,
              filteredIng,
              filteredDevices,
              filteredUstensils
            );
            if (ingBoolean && devBoolean && ustBoolean) globalBoolean = true;
            return globalBoolean;
          })
        );
      }
    });
  });
}

// enleve le tag ajouté suite à la selection dans la liste et enleve la classe is-selected quand on le ferme.
window.removeFilter = (filter) => {
  filter.parentElement.remove(); //supprime le <li>
  let unselectValue = filter.getAttribute("data-controls"); //variable qui obtient l'attribut data-controls

  //nettoyage des tags lorsque il a été déselectionné

  if (filteredIng.indexOf(unselectValue) != -1) {
    filteredIng.splice(filteredIng.indexOf(unselectValue), 1);
  }
  if (filteredDevices.indexOf(unselectValue) != -1) {
    filteredDevices.splice(filteredDevices.indexOf(unselectValue), 1);
  }
  if (filteredUstensils.indexOf(unselectValue) != -1) {
    filteredUstensils.splice(filteredUstensils.indexOf(unselectValue), 1);
  }

  document
    .querySelector('[data-item="' + unselectValue + '"]')
    .classList.remove("is-selected"); // enleve la classe is-selected
  recipeCardBuilder(
    recipesArray.filter((recipe) => {
      let globalBoolean = false;
      let ingBoolean = false;
      let devBoolean = false;
      let ustBoolean = false;
      if (filteredIng.length > 0) {
        recipe.ingredients.forEach((ing) => {
          if (filteredIng.indexOf(ing.ingredient) != -1) ingBoolean = true;
        });
      } else {
        ingBoolean = true;
      }

      if (filteredDevices.length > 0) {
        if (filteredDevices.indexOf(recipe.appliance) != -1) devBoolean = true;
      } else {
        devBoolean = true;
      }
      if (filteredUstensils.length > 0) {
        recipe.ustensils.forEach((ust) => {
          if (filteredUstensils.indexOf(ust) != -1) ustBoolean = true;
        });
      } else {
        ustBoolean = true;
      }

      console.log(
        ingBoolean,
        devBoolean,
        ustBoolean,
        filteredIng,
        filteredDevices,
        filteredUstensils
      );
      if (ingBoolean && devBoolean && ustBoolean) globalBoolean = true;
      return globalBoolean;
    })
  );
};

document.querySelectorAll(".filters__dropDown").forEach((btn) =>
  btn.addEventListener("click", function (event) {
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

/** fonction qui génère les cartes des recettes dynamiquement
 * @params {recipes} charge les données JSON pour construire les articles de recherches
 */
function recipeCardBuilder(recipes) {
  console.log("recipeCardBuilder", recipes);
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
                        <span class="recipe__time"><img src="/assets/img/ico/ico_clock.svg" alt=""> ${recipe.time}min</span>
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
  //récupération des tableaux contenant:
  allUstensils = [];
  allDevices = [];
  allIng = [];

  recipes.forEach((e) => {
    //ingrédients
    e.ingredients.forEach((el) => {
      if (allIng.indexOf(el.ingredient) == -1) {
        allIng.push(el.ingredient);
      }
    });
    //appareils
    if (allDevices.indexOf(e.appliance) == -1) {
      allDevices.push(e.appliance);
    }
    //ustensiles
    e.ustensils.forEach((el) => {
      if (allUstensils.indexOf(el) == -1) {
        allUstensils.push(el);
      }
    });
  });
  //affiche les tags des champs ingredients, appareils et ustensils
  showTags(allIng, "ingredientsTaglist", "ingredients");
  showTags(allDevices, "devicesTaglist", "device");
  showTags(allUstensils, "ustensilsTaglist", "ustensils");
}

//champ de recherche dans la barre principale
/**
 * todo: afficher les tags
 *       bloquer le chargement via ENTER
 */
const searchBarInput = document.getElementById("search");

searchBarInput.addEventListener("keyup", (e) => {
  let searchString = searchBarInput.value.toLowerCase();
  let foundedRecipes = recipesArray.filter((recipe) => {
    const ingredients = recipe.ingredients;
    const ustensils = recipe.ustensils.join(", ");
    const ingString = ingredients.map((ing) => ing.ingredient).join(", ");
    return (
      recipe.name.toLowerCase().indexOf(searchString) !== -1 ||
      ingString.toLowerCase().indexOf(searchString) !== -1 ||
      ustensils.toLowerCase().indexOf(searchString) !== -1 ||
      recipe.appliance.toLowerCase().indexOf(searchString) !== -1
    );
  });
  recipeCardBuilder(foundedRecipes);
});
