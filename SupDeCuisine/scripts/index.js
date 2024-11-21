let filtres_ingredients = [];
let filtres_appareils = [];
let filtres_ustensils = [];
let recettes = [];
let Count_Recette = 0;


async function loadRecettes() {
    try {
        const response = await fetch('scripts/Recettes.json'); // Charge le fichier JSON
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
        }
        recettes = await response.json();
        console.log('Recettes chargées :', recettes);

        const ingredientsSet = new Set();
        const appareilsSet = new Set();
        const ustensilsSet = new Set();

        recettes.forEach(recette => {
            // Ajouter chaque ingrédient au Set
            recette.ingredients.forEach(ingredient => {
                ingredientsSet.add(ingredient.ingredient.toLowerCase());
            });

            // Ajouter l'appareil au Set
            if (recette.appliance) {
                appareilsSet.add(recette.appliance.toLowerCase());
            }

            // Ajouter chaque ustensile au Set
            recette.ustensils.forEach(ustensil => {
                ustensilsSet.add(ustensil.toLowerCase());
            });
        });

        // Convertir les Sets en tableaux
        filtres_ingredients = Array.from(ingredientsSet);
        filtres_appareils = Array.from(appareilsSet);
        filtres_ustensils = Array.from(ustensilsSet);

        console.log('Filtres ingrédients :', filtres_ingredients);
        console.log('Filtres appareils :', filtres_appareils);
        console.log('Filtres ustensiles :', filtres_ustensils);

        UpdateRecettes();
        UpdateFiltres();
    } catch (error) {
        console.error('Erreur lors du chargement des recettes :', error);
    }
}




function UpdateRecettes(){
    const container = document.querySelector('.Recettes-Container');
    const Number_Recettes = document.querySelector('.Number-Recettes')
    container.innerHTML = '';
    Count_Recette = 0;

    recettes.forEach(recette => {
        Count_Recette += 1;
        // Construire le HTML pour chaque recette
        const recetteHTML = `
        <div class="card" id="Card-${recette.id}">
            <div class="card-top">
                <img class="card-img" src="img/${recette.image}" alt="${recette.name}">
            </div>
            <div class="card-content">
                <div class="ContentCard">
                    <h1>${recette.name}</h1>
                    <h2>Temps : ${recette.time} min</h2>
                    <p>${recette.description}</p>
                    <h2>Ingrédients</h2>
                    <div class="Ingredients-List">
                        ${recette.ingredients.map(ingredient => `
                            <div class="Ingredients-Item">
                                <h3>${ingredient.ingredient}</h3>
                                <p>${ingredient.quantity || ''} ${ingredient.unit || ''}</p>
                            </div>
                        `).join('')}
                    </div>
                    <h2>Appareil</h2>
                    <p>${recette.appliance}</p>
                    <h2>Ustensiles</h2>
                    <ul>
                        ${recette.ustensils.map(ustensil => `<li>${ustensil}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;

        // Ajouter le HTML généré au conteneur
        container.innerHTML += recetteHTML;
        Number_Recettes.innerHTML = Count_Recette + ' recettes';

    });

}

function UpdateFiltres(){
    const ingredientcontainer = document.querySelector('.ingredients-select-container');
    const appareilscontainer = document.querySelector('appareils-select-container');
    const ustensilescontainer = document.querySelector('ustensiles-select-container');

    filtres_ingredients.forEach(ingredients =>{
        const ingredienthtml = `<option value="${ingredients}">${ingredients}</option>`;

        ingredientcontainer.innerHTML += ingredienthtml;
    });
}   


loadRecettes();