let filtres_ingredients = [];
let filtres_appareils = [];
let filtres_ustensils = [];
let recettes = [];
let Count_Recette = 0;
let selectedItems = [];


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




function UpdateRecettes(){
    const container = document.querySelector('.Recettes-Container');
    const Number_Recettes = document.querySelector('.Number-Recettes')
    container.innerHTML = '';
    Count_Recette = 0;

    const filteredRecettes = recettes.filter(recette => {
        const hasSelectedIngredients = selectedItems.every(item => 
            recette.ingredients.some(ingredient => 
                ingredient.ingredient.toLowerCase().includes(item.toLowerCase())
            )
        );

        const hasSelectedAppareils = selectedItems.every(item => 
            recette.appliance && recette.appliance.toLowerCase().includes(item.toLowerCase())
        );

        const hasSelectedUstensils = selectedItems.every(item =>
            recette.ustensils.some(ustensil => 
                ustensil.toLowerCase().includes(item.toLowerCase())
            )
        );

        return hasSelectedIngredients || hasSelectedAppareils || hasSelectedUstensils;
    });

    filteredRecettes.forEach(recette => {
        Count_Recette += 1;

        
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

        
        container.innerHTML += recetteHTML;
    });

    Number_Recettes.innerHTML = Count_Recette + ' Résultats';

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


document.querySelector('.ingredients-select-container').addEventListener('change', handleSelectionChange);
document.querySelector('.appareils-select-container').addEventListener('change', handleSelectionChange);
document.querySelector('.ustensiles-select-container').addEventListener('change', handleSelectionChange);

function handleSelectionChange(event) {
    const selectedValue = event.target.value;

    if (selectedItems.includes(selectedValue)) {
        console.log(`${selectedValue} est déjà ajouté.`);
        return;
    }


    console.log(`Vous avez sélectionné : ${selectedValue}`);

    const ItemContainer = document.querySelector('.Items-Container');

    const FilterItem = document.createElement('div');
    FilterItem.setAttribute('value', selectedValue);
    FilterItem.classList.add('Item');


    FilterItem.innerHTML = `
        <p>${selectedValue}</p>
        <a class="remove-item"><i class="fa-solid fa-xmark"></i></a>
    `;

    
    ItemContainer.appendChild(FilterItem);

    selectedItems.push(selectedValue);

    UpdateRecettes();

    console.log(selectedItems);

    
    FilterItem.querySelector('.remove-item').addEventListener('click', () => {
        FilterItem.remove();
        console.log(`${selectedValue} a été retiré.`);

        selectedItems = selectedItems.filter(item => item !== selectedValue);
        console.log(selectedItems);
        UpdateRecettes();
    });


    if (event.target.classList.contains('ingredients-select-container')) {
    } else if (event.target.classList.contains('appareils-select-container')) {
    } else if (event.target.classList.contains('ustensiles-select-container')) {
    }
}


loadRecettes();