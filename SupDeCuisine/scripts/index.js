let filtres = [];
let recettes = [];


async function loadRecettes() {
    try {
        const response = await fetch('scripts/Recettes.json'); // Charge le fichier JSON
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
        }
        recettes = await response.json();
        console.log('Recettes chargées :', recettes);
        UpdateRecettes();
    } catch (error) {
        console.error('Erreur lors du chargement des recettes :', error);
    }
}



function UpdateRecettes(){
    const container = document.querySelector('.Recettes-Container');
    container.innerHTML = '';

}

function UpdateFiltres(){

}


loadRecettes();