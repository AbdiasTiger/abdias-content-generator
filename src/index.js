require('dotenv').config();
const { generateDailyContent } = require('./generate-content');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

// Configuration Google Sheets
const GOOGLE_SHEETS_ID = process.env.GOOGLE_SHEETS_ID;
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Validation des variables d'environnement
function validateEnvironment() {
    const requiredVars = [
        'GOOGLE_SHEETS_ID',
        'GOOGLE_SERVICE_ACCOUNT_EMAIL',
        'GOOGLE_PRIVATE_KEY',
        'GOOGLE_API_KEY'  // Tu utilises Google Gemini
    ];

    const missing = requiredVars.filter(varName => !process.env[varName]);

    if (missing.length > 0) {
        console.error('❌ Variables d\'environnement manquantes:', missing.join(', '));
        process.exit(1);
    }

    console.log('✅ Variables d\'environnement validées');
}

// Initialisation Google Sheets avec gestion d'erreur
async function initializeGoogleSheets() {
    try {
        const serviceAccountAuth = new JWT({
            email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: GOOGLE_PRIVATE_KEY,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(GOOGLE_SHEETS_ID, serviceAccountAuth);
        await doc.loadInfo();

        console.log('✅ Google Sheets connecté:', doc.title);
        return doc;
    } catch (error) {
        console.error('❌ Erreur connexion Google Sheets:', error.message);
        throw error;
    }
}

// Sauvegarde optimisée avec gestion des erreurs
async function saveToGoogleSheets(doc, contents) {
    try {
        let sheet = doc.sheetsByIndex[0];

        // Créer les headers si nécessaire
        const headers = ['Date', 'Heure', 'Type', 'Contenu', 'Mots-clés', 'Statut'];
        const rows = await sheet.getRows();

        if (rows.length === 0) {
            await sheet.setHeaderRow(headers);
            console.log('✅ Headers créés dans Google Sheets');
        }

        // Préparer les données avec timezone local (Cotonou)
        const now = new Date();
        const cotonouTime = new Intl.DateTimeFormat('fr-FR', {
            timeZone: 'Africa/Porto-Novo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(now);

        const [date, heure] = cotonouTime.split(' ');

        // Sauvegarder chaque contenu
        for (let i = 0; i < contents.length; i++) {
            const content = contents[i];

            await sheet.addRow({
                'Date': date,
                'Heure': heure,
                'Type': content.thematique, // Corrigé : utilise thematique au lieu de type
                'Contenu': content.contenu, // Corrigé : utilise contenu au lieu de content
                'Mots-clés': content.hashtags || '',
                'Statut': 'Généré'
            });

            console.log(`✅ Contenu ${i + 1}/${contents.length} sauvegardé: ${content.thematique}`);
        }

        console.log(`🎉 ${contents.length} contenus sauvegardés avec succès !`);

    } catch (error) {
        console.error('❌ Erreur sauvegarde:', error.message);
        throw error;
    }
}

// Mode preview pour tester sans sauvegarder
async function previewContent(themeFilter = null) {
    console.log('🔍 MODE PREVIEW - Génération de contenu test...\n');

    try {
        // Utilise ta classe DailyContentGenerator existante
        const DailyContentGenerator = require('./generate-content');
        const generator = new DailyContentGenerator();

        if (themeFilter) {
            const content = await generator.previewContent(themeFilter);
            return;
        }

        // Preview d'une thématique au hasard
        const thematics = generator.listThematics();
        const randomThematic = thematics[Math.floor(Math.random() * thematics.length)];

        console.log(`📝 Preview de: ${randomThematic}\n`);
        await generator.previewContent(randomThematic);

    } catch (error) {
        console.error('❌ Erreur preview:', error.message);
    }
}

// Fonction principale
async function main() {
    const args = process.argv.slice(2);
    const isPreview = args.includes('preview');
    const themeFilter = args.find(arg => !['preview'].includes(arg));

    console.log('🚀 Générateur de contenu Abdias - Démarrage...\n');

    try {
        // Validation environnement
        validateEnvironment();

        if (isPreview) {
            // Mode preview
            await previewContent(themeFilter);
            return;
        }

        // Mode production - Utilise ta classe existante
        console.log('📊 MODE PRODUCTION - Génération et sauvegarde...\n');

        const DailyContentGenerator = require('./generate-content');
        const generator = new DailyContentGenerator();

        console.log('🤖 Génération des contenus...');
        const contents = await generator.generateDailyContent();

        if (!contents || contents.length === 0) {
            console.log('⚠️  Aucun contenu généré');
            return;
        }

        // Résumé final
        console.log('\n🎉 GÉNÉRATION TERMINÉE !');
        console.log(`✅ ${contents.length} contenus générés et sauvegardés`);
        console.log('📊 Types générés:', contents.map(c => c.thematique).join(', '));

    } catch (error) {
        console.error('\n❌ ERREUR CRITIQUE:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesse rejetée non gérée:', reason);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Exception non capturée:', error.message);
    process.exit(1);
});

// Exécution si appelé directement
if (require.main === module) {
    main();
}

module.exports = { main, previewContent, saveToGoogleSheets };