let allIng = [];
let allAppliances = [];
let allUstensils = [];
let recipesArray;

fetch('./js/API/recipes.json') 
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(value) {
        const searchParams = new URLSearchParams(window.location.search);
        const recipesId = searchParams.get("id");
        
        //affiche les recettes
        recipeCardBuilder(value.recipes, recipesId);
        recipesArray = value.recipes;

        //récupération des tableaux contenant:
        
        value.recipes.forEach((e) => {
            //ingrédients
            e.ingredients.forEach((el) => {
                if(allIng.indexOf(el.ingredient) == -1) {
                    allIng.push(el.ingredient);
                }
            });
            //appareils
            if(allAppliances.indexOf(e.appliance) == -1) {
                allAppliances.push(e.appliance);
            }
            //ustensiles
            e.ustensils.forEach((el) => {
                if(allUstensils.indexOf(el) == -1) {
                    allUstensils.push(el);
                }
            })
        });
        
        //affiche les tags des champs ingredients, appareils et ustensils
        showTags(allIng, 'ingredientsTaglist', 'ingredients');
        showTags(allAppliances, 'devicesTaglist', 'device');
        showTags(allUstensils, 'ustensilsTaglist', 'ustensils');
    })
    .catch(function(error) {
        console.error(error);
    });

//fonction générique pour afficher dynamiquement les listes des ingredients, appareils et ustensiles
function showTags(items, tagId, type) {
    const tag = document.getElementById(tagId);
    let templateTaglist = ``;
    for (const item  of items) {
        let properItemCase = item[0].toUpperCase() + item.toLowerCase().slice(1);
        templateTaglist += `
        <li><button class="tag--${type} tag" data-type="${type}" data-item="${item}">${properItemCase}</button></li>`;
    }
    tag.innerHTML = templateTaglist;
    const tags = tag.querySelectorAll(".tag")
    const tagsBtn = document.getElementById("tagsBtn")
    tags.forEach((tag) => {
        tag.addEventListener('click', function(event) {
            //affiche les tags selectionnés lors du clic et ajoute la classe is-selected dessus
            const type = event.target.dataset.type;
            const value = event.target.dataset.item;
            if(!event.target.classList.contains("is-selected") && type !== undefined && value !== undefined){                
                let templateTag = ``;
                let properValueCase = value[0].toUpperCase() + value.toLowerCase().slice(1);
                console.log(value, type)
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
            }
        })
    })  
}

// enleve le tag ajouté suite à la selection dans la liste et enleve la classe is-selected quand on le ferme.
window.removeFilter = (filter) => { 
    filter.parentElement.remove();
    let unselectValue = filter.getAttribute("data-controls");
    document.querySelector("[data-item='" + unselectValue + "']").classList.remove("is-selected");
};

// const ingBtn = document.getElementById("ingBtn");
// const devBtn = document.getElementById("devBtn");
// const ustBtn = document.getElementById("ustBtn");
// const ingContainer = document.getElementById("ingredientsContainer");
// const devContainer = document.getElementById("deviceContainer");
// const ustContainer = document.getElementById("ustensilsContainer");

document.querySelectorAll(".filters__dropDown").forEach(btn => btn.addEventListener("click",function(event){
    event.preventDefault();
    openTaglist(btn.getAttribute("aria-controls"))
} ));

//fonction ouverture container des tags au clic sur le dropdown
function openTaglist(idContainer) {
    let tagContainer = document.getElementById(idContainer);
    const filtersForm = tagContainer.previousElementSibling;
    const icoDropDown = filtersForm.querySelector(".ico");
    if (tagContainer.classList.contains("is-expanded")) {
        tagContainer.classList.remove("is-expanded");
        icoDropDown.classList.replace("ico__dropUp", "ico__dropDown");
    } else {
        if (document.querySelector(".filters__inputContainer.is-expanded") != null) {
            document.querySelector(".filters__inputContainer.is-expanded").classList.remove("is-expanded");
        }  
        tagContainer.classList.add("is-expanded");
        icoDropDown.classList.replace("ico__dropDown", "ico__dropUp");
    }  
}

// fonction qui génère les cartes des recettes dynamiquement
function recipeCardBuilder(recipes) {
    const recipeCard = document.getElementById("recipeContainer");
    recipeCard.innerHTML = '';
    for (const recipe of recipes){
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
        </article>`
        const ingredientList = document.getElementById(`recipe-${recipe.id}`);
        for (const ingredient of recipe.ingredients) {
            ingredientList.innerHTML += `
              <li class="recipe__ingredient">${ingredient.ingredient}:
                <span class="recipe__quantity">${ingredient.quantity === undefined ? '' : ingredient.quantity}${ingredient.unit === undefined ? '' : ingredient.unit}</span>
              </li>
            `
        }
    }
}

