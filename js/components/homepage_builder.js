fetch('./js/API/recipes.json') 
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(value) {
        recipeCardBuilder(value.recipes);
        recipesArray = value.recipes;
        console.log(value.recipes);

    })
    .catch(function(error) {
        console.error(error);
    });

let recipesArray;

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
                            <ul class="recipe__ingredList">
                                <li class="recipe__ingredient">Lait de coco:
                                    <span class="recipe__quantity"> 400ml</span>
                                </li>
                                <li class="recipe__ingredient">Jus de citron:
                                    <span class="recipe__quantity"> 2</span>
                                </li>
                                <li class="recipe__ingredient">Crème de coco: 
                                    <span class="recipe__quantity"> 4 cuillères</span>
                                </li>
                                <li class="recipe__ingredient">Sucre:
                                    <span class="recipe__quantity"> 20g</span>
                                </li>
                                <li class="recipe__ingredient">Glaçons:
                                    <span class="recipe__quantity"> 2</span>
                                </li>
                            </ul>                    
                        </div>
                    <div class="recipe__instructionsBlock">
                        <p class="recipe__instructions">${recipe.description}</p>
                    </div>
                </div>
            </div>
        </article>`
    }
}

