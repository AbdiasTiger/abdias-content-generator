const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
require('dotenv').config();

class GoogleSheetsClient {
    constructor() {
        if (!process.env.GOOGLE_SHEETS_ID) {
            throw new Error('GOOGLE_SHEETS_ID manquant dans .env');
        }

        this.sheetsId = process.env.GOOGLE_SHEETS_ID;
        this.doc = null;
        this.sheet = null;
    }

    async initialize() {
        try {
            // Configuration JWT avec le fichier credentials.json que tu as
            const serviceAccountAuth = new JWT({
                keyFile: './credentials.json',
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });

            // Connexion au document
            this.doc = new GoogleSpreadsheet(this.sheetsId, serviceAccountAuth);
            await this.doc.loadInfo();

            // Prendre la première feuille
            this.sheet = this.doc.sheetsByIndex[0];

            console.log('✅ Connexion Google Sheets réussie !');
            console.log(`📊 Feuille: ${this.sheet.title}`);
            return true;
        } catch (error) {
            console.error('❌ Erreur connexion Google Sheets:', error.message);
            throw error;
        }
    }

    async addContent(contenu) {
        try {
            if (!this.sheet) {
                await this.initialize();
            }

            const now = new Date();
            const dateStr = now.toLocaleDateString('fr-FR');
            const heureStr = now.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            });

            // Vérifier et créer les headers si nécessaire
            await this.ensureHeaders();

            // Ajouter une ligne (adapté au format de ton ContentGenerator)
            await this.sheet.addRow({
                'Date': dateStr,
                'Heure': heureStr,
                'Thématique': contenu.thematique,
                'Contenu': contenu.contenu,
                'Hashtags': contenu.hashtags,
                'Statut': 'Généré',
                'Longueur': contenu.longueur || contenu.contenu.length,
                'Structure': contenu.structure_utilisee || 'Non spécifiée'
            });

            console.log(`✅ Contenu ajouté: ${contenu.thematique} (${contenu.contenu.length} caractères)`);
            return true;
        } catch (error) {
            console.error('❌ Erreur ajout contenu:', error.message);
            throw error;
        }
    }

    async ensureHeaders() {
        try {
            const rows = await this.sheet.getRows();

            // Si pas de lignes, créer les headers
            if (rows.length === 0) {
                await this.sheet.setHeaderRow([
                    'Date',
                    'Heure',
                    'Thématique',
                    'Contenu',
                    'Hashtags',
                    'Statut',
                    'Longueur',
                    'Structure'
                ]);
                console.log('✅ Headers créés dans Google Sheets');
            }
        } catch (error) {
            console.log('⚠️  Headers déjà présents ou erreur:', error.message);
        }
    }

    async addMultipleContent(contenus) {
        console.log(`📤 Ajout de ${contenus.length} contenus...`);

        for (let i = 0; i < contenus.length; i++) {
            const contenu = contenus[i];
            await this.addContent(contenu);

            // Petite pause entre chaque ajout
            if (i < contenus.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        const url = `https://docs.google.com/spreadsheets/d/${this.sheetsId}`;
        console.log(`\n🔗 Voir tes contenus: ${url}`);
        console.log(`🎉 ${contenus.length} contenus ajoutés avec succès !`);
    }

    // Méthode pour tester la connexion
    async testConnection() {
        try {
            await this.initialize();
            console.log('✅ Test de connexion réussi !');
            return true;
        } catch (error) {
            console.error('❌ Test de connexion échoué:', error.message);
            return false;
        }
    }
}

module.exports = GoogleSheetsClient;