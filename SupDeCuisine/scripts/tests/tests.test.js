import { loadRecettes } from './loadrecettes.js';
global.fetch = jest.fn(); // Simuler fetch

global.recettes = []; // Simuler la variable globale `recettes`

describe('loadRecettes', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Réinitialiser les mocks avant chaque test
        global.recettes = []; // Réinitialiser les recettes
    });

    test('Vérifie que le premier ID est correct', async () => {
        // Données JSON simulées
        const mockData = [
            {
                id: 1,
                name: "Limonade de Coco",
                ingredients: [
                    { ingredient: "Lait de coco", quantity: 400 , unit: "ml"},
                    { ingredient: "Jus de citron", quantity: 2},
                    { ingredient: "Crème de coco", quantity: 2, unit:"cuillères à soupe"},
                    { ingredient: "Sucre", quantity: 30, unit:"grammes"},
                    { ingredient: "Glaçons",},
                ],
                time: 10,
                description: "Mettre les glaçons à votre goût dans le blender, ajouter le lait, la crème de coco, le jus de 2 citrons et le sucre. Mixer jusqu'à avoir la consistence désirée",
                appliance: "Blender",
                ustensils: ["cuillère à Soupe", "verres", "presse citron"]
            },
        ];

        // Simuler la réponse de fetch
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData
        });

        // Appeler la fonction pour charger les recettes
        await loadRecettes();

        // Vérifier que le premier ID est correct après avoir chargé les recettes
        expect(global.recettes[0].id).toBe(1);
    });
});
