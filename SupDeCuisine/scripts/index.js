let filtres_ingredients = [];
let filtres_appareils = [];
let filtres_ustensils = [];
let recettes = [];
let Count_Recette = 0;
let selectedItems = [];
let searchbar = document.querySelector('.SearchBar');


async function loadRecettes() {
    try {
        const response = await fetch('scripts/Recettes.json');
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
        }
        recettes = await response.json();
        console.log('Recettes chargées :', recettes);

        const ingredientsSet = new Set();
        const appareilsSet = new Set();
        const ustensilsSet = new Set();

        recettes.forEach(recette => {
            
            recette.ingredients.forEach(ingredient => {
                ingredientsSet.add(ingredient.ingredient.toLowerCase());
            });

            
            if (recette.appliance) {
                appareilsSet.add(recette.appliance.toLowerCase());
            }

            
            recette.ustensils.forEach(ustensil => {
                ustensilsSet.add(ustensil.toLowerCase());
            });
        });

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


function matchesSelectedItems(recette, selectedItems) {
    return selectedItems.every(item => {
        const lowerItem = item.toLowerCase();
        const ingredientMatch = recette.ingredients.some(ingredient =>
            ingredient.ingredient.toLowerCase().includes(lowerItem)
        );
        const applianceMatch = recette.appliance?.toLowerCase().includes(lowerItem);
        const ustensilMatch = recette.ustensils.some(ustensil =>
            ustensil.toLowerCase().includes(lowerItem)
        );
        return ingredientMatch || applianceMatch || ustensilMatch;
    });
}




function UpdateRecettes() {
    const container = document.querySelector('.Recettes-Container');
    const Number_Recettes = document.querySelector('.Number-Recettes');
    container.innerHTML = '';

    const filteredRecettes = recettes.filter(recette =>
        matchesSelectedItems(recette, selectedItems)
    );

    filteredRecettes.forEach(recette => {
        container.innerHTML += generateRecetteHTML(recette);
    });

    Number_Recettes.textContent = `${filteredRecettes.length} Résultat(s)`;

    const NoResultContainer = document.querySelector(`.NoResult-Container`);

    if (filteredRecettes.length == 0) {
        //NoResultContainer.innerHTML += `<img src="img/NoResult.png">`
    };

}



function generateRecetteHTML(recette) {
    return `
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
                        ${recette.ingredients
                            .map(
                                ingredient => `
                            <div class="Ingredients-Item">
                                <h3>${ingredient.ingredient}</h3>
                                <p>${ingredient.quantity || ''} ${ingredient.unit || ''}</p>
                            </div>`
                            )
                            .join('')}
                    </div>
                    <h2>Appareil</h2>
                    <p>${recette.appliance}</p>
                    <h2>Ustensiles</h2>
                    <ul>
                        ${recette.ustensils
                            .map(ustensil => `<li>${ustensil}</li>`)
                            .join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
}




function UpdateFiltres(){
    const ingredientcontainer = document.querySelector('.ingredients-select-container');
    const appareilscontainer = document.querySelector('.appareils-select-container');
    const ustensilescontainer = document.querySelector('.ustensiles-select-container');

    filtres_ingredients.forEach(ingredient =>{
        const ingredienthtml = `<option value="${ingredient}">${ingredient}</option>`;

        ingredientcontainer.innerHTML += ingredienthtml;
    });
    
    filtres_appareils.forEach(appareil =>{
        const appareilshtml = `<option value="${appareil}">${appareil}</option>`;

        appareilscontainer.innerHTML += appareilshtml;
    });

    filtres_ustensils.forEach(ustensil =>{
        const ustensilshtml = `<option value="${ustensil}">${ustensil}</option>`;

        ustensilescontainer.innerHTML += ustensilshtml;
    });
}


['ingredients', 'appareils', 'ustensiles'].forEach(type => {
    document.querySelector(`.${type}-select-container`).addEventListener('change', event => {
        addFilterTag(event.target.value);
    });
});

function addFilterTag(value) {
    if (selectedItems.includes(value)) return;

    const tagContainer = document.querySelector('.Items-Container');
    const tag = document.createElement('div');
    tag.classList.add('Item');
    tag.innerHTML = `
        <p>${value}</p>
        <a class="remove-item"><i class="fa-solid fa-xmark"></i></a>
    `;
    tag.querySelector('.remove-item').addEventListener('click', () => {
        removeFilterTag(value);
        tag.remove();
    });

    tagContainer.appendChild(tag);
    selectedItems.push(value);
    UpdateRecettes();
}

function removeFilterTag(value) {
    selectedItems = selectedItems.filter(item => item !== value);
    UpdateRecettes();
}


searchbar.addEventListener('input', event => {
    const query = event.target.value.toLowerCase().trim();

    const filteredRecettes = recettes.filter(recette => {
        const nameMatch = recette.name.toLowerCase().includes(query);
        const matchesFilters = matchesSelectedItems(recette, selectedItems);
        return nameMatch && matchesFilters;
    });

    const container = document.querySelector('.Recettes-Container');
    container.innerHTML = '';
    filteredRecettes.forEach(recette => {
        container.innerHTML += generateRecetteHTML(recette);
    });

    document.querySelector('.Number-Recettes').textContent = `${filteredRecettes.length} Résultat(s)`;
});

loadRecettes();