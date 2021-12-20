fetch('./js/API/recipes.json') 
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(value) {
        const searchParams = new URLSearchParams(window.location.search);
        const recipesId = searchParams.get("id");
        
        // ingredientsTags(value.ingredient, recipesId);
        recipeCardBuilder(value.recipes, recipesId);
        recipesArray = value.recipes;
    })
    .catch(function(error) {
        console.error(error);
    });

let recipesArray;
let ingredientsArray;
let deviceArray;
let ustensilsArray;


// function ingredientsTags(jsonObj, ing) {
//     const ingredientsTaglist = document.getElementById("ingredientTaglist");
//     const ingredients = jsonObj.filter(ingredient => ingredient.recipesId == ing );
//     // ingredients.forEach(ingredient => {
//     //     ingredientsTaglist.innerHTML += `
//     //         <li class="tag--ingredients tag">${ingredient}</li>`
//     //     });
            
        
// }


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

