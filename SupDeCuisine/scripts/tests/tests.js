// Importer les fonctions à tester
import { loadRecettes } from './yourScriptFile.js'; // Remplacez par le chemin de votre fichier
global.fetch = jest.fn(); // Simulez fetch

// Variables globales simulées
global.filtres_ingredients = [];
global.filtres_appareils = [];
global.filtres_ustensils = [];
global.recettes = [];
global.UpdateRecettes = jest.fn();
global.UpdateFiltres = jest.fn();

describe('loadRecettes', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Réinitialiser les mocks avant chaque test
        global.fetch.mockClear();
    });

    test('Charge correctement les recettes et met à jour les filtres', async () => {
        // Données JSON simulées
        const mockData = [
            {
                id: 1,
                name: "Poulet rôti",
                ingredients: [
                    { ingredient: "Poulet", quantity: 1 },
                    { ingredient: "Beurre", quantity: 50, unit: "g" }
                ],
                appliance: "Four",
                ustensils: ["Couteau", "Plat"]
            },
            {
                id: 2,
                name: "Salade César",
                ingredients: [
                    { ingredient: "Laitue", quantity: 1 },
                    { ingredient: "Poulet", quantity: 200, unit: "g" },
                    { ingredient: "Parmesan", quantity: 50, unit: "g" }
                ],
                appliance: "Saladier",
                ustensils: ["Fourchette", "Couteau"]
            }
        ];

        // Simuler la réponse de fetch
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData
        });

        // Appeler la fonction
        await loadRecettes();

        // Vérifier que fetch a été appelé avec le bon URL
        expect(fetch).toHaveBeenCalledWith('scripts/Recettes.json');

        // Vérifier que les recettes ont été chargées
        expect(global.recettes).toEqual(mockData);

        // Vérifier les filtres
        expect(global.filtres_ingredients).toEqual(["poulet", "beurre", "laitue", "parmesan"]);
        expect(global.filtres_appareils).toEqual(["four", "saladier"]);
        expect(global.filtres_ustensils).toEqual(["couteau", "plat", "fourchette"]);

        // Vérifier que UpdateRecettes et UpdateFiltres ont été appelés
        expect(global.UpdateRecettes).toHaveBeenCalled();
        expect(global.UpdateFiltres).toHaveBeenCalled();
    });

    test('Gère les erreurs lorsque fetch échoue', async () => {
        // Simuler une erreur réseau
        fetch.mockRejectedValueOnce(new Error('Erreur réseau'));

        // Espionner console.error
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        await loadRecettes();

        // Vérifier que console.error a été appelé
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Erreur lors du chargement des recettes :',
            expect.any(Error)
        );

        consoleErrorSpy.mockRestore(); // Restaurer console.error
    });

    test('Gère les erreurs de statut HTTP', async () => {
        // Simuler une réponse HTTP avec un statut d'erreur
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 404
        });

        // Espionner console.error
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        await loadRecettes();

        // Vérifier que console.error a été appelé avec le bon message
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Erreur lors du chargement des recettes :',
            expect.any(Error)
        );

        consoleErrorSpy.mockRestore(); // Restaurer console.error
    });
});