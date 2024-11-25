let filtres_ingredients = [];
let filtres_appareils = [];
let filtres_ustensils = [];
let recettes = [];
let Count_Recette = 0;
let selectedItems = [];
let searchbar = document.querySelector('.SearchBar');


document.addEventListener('DOMContentLoaded', () => {
    const selectContainers = document.querySelectorAll('.select-container');
    const optionContainers = document.querySelectorAll('.option-container');

    let areOptionsVisible = false; // État pour vérifier si les options sont visibles

    selectContainers.forEach(selectContainer => {
        selectContainer.addEventListener('click', () => {
            if (areOptionsVisible) {
                optionContainers.forEach(container => container.classList.remove('visible'));
                areOptionsVisible = false;
            } else {
                optionContainers.forEach(container => container.classList.add('visible'));
                areOptionsVisible = true;
            }
        });
    });
});

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




function UpdateFiltres() {
    const ingredientcontainer = document.getElementById('ingredients-Content');
    const appareilscontainer = document.getElementById('appareils-Content');
    const ustensilescontainer = document.getElementById('ustensiles-Content');

    
    filtres_ingredients.forEach(ingredient => {
        const ingredienthtml = `<p value="${ingredient}">${ingredient}</p>`;
        ingredientcontainer.innerHTML += ingredienthtml;
    });

    
    filtres_appareils.forEach(appareil => {
        const appareilshtml = `<p value="${appareil}">${appareil}</p>`;
        appareilscontainer.innerHTML += appareilshtml;
    });

    
    filtres_ustensils.forEach(ustensil => {
        const ustensilshtml = `<p value="${ustensil}">${ustensil}</p>`;
        ustensilescontainer.innerHTML += ustensilshtml;
    });

    
    ['ingredients', 'appareils', 'ustensiles'].forEach(type => {
        const contentElement = document.getElementById(`${type}-Content`);
        contentElement.addEventListener('click', event => {
            if (event.target.tagName.toLowerCase() === 'p') {
                addFilterTag(event.target.innerText);
            }
        });
    });

    
    addSearchFilter('ingredients');
    addSearchFilter('appareils');
    addSearchFilter('ustensiles');
}


function addSearchFilter(type) {
    const searchInput = document.getElementById(`${type}-search`);
    const contentContainer = document.getElementById(`${type}-Content`);

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const items = contentContainer.querySelectorAll('p');
        
        items.forEach(item => {
            const itemText = item.innerText.toLowerCase();
            if (itemText.includes(searchTerm)) {
                item.style.display = 'block'; // Afficher l'élément
            } else {
                item.style.display = 'none'; // Masquer l'élément
            }
        });
    });
}


document.addEventListener('DOMContentLoaded', () => {
    ['ingredients', 'appareils', 'ustensiles'].forEach(type => {
        // Récupérer l'élément parent (par exemple: ingredients-Content)
        const contentElement = document.getElementById(`${type}-Content`);

        // S'assurer que l'élément existe avant d'ajouter un gestionnaire d'événement
        if (contentElement) {
            // Ajouter un événement 'click' au parent, mais gérer les clics sur les éléments <p>
            contentElement.addEventListener('click', event => {
                // Vérifier si l'élément cliqué est un <p>
                if (event.target.tagName.toLowerCase() === 'p') {
                    console.log("Clique sur :", event.target.innerText);
                    addFilterTag(event.target.innerText); // Ajouter à la fonction de filtrage
                }
            });
        } else {
            console.warn(`L'élément ${type}-Content n'existe pas`);
        }
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