let recettes = [];

export async function loadRecettes() {
    try {
        const response = await fetch('../scripts/Recettes.json');
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
        }
        global.recettes = await response.json();
        console.log('Recettes chargées :', global.recettes);
        return global.recettes;
        
    } catch (error) {
        console.error('Erreur lors du chargement des recettes :', error);
    }
}

loadRecettes();
