require('dotenv').config();
const ContentGenerator = require('./content-generator');
const GoogleSheetsClient = require('./google-sheets-client'); // ✅ Remplacé NotionClient

class DailyContentGenerator {
    constructor() {
        this.contentGenerator = new ContentGenerator();
        this.sheetsClient = new GoogleSheetsClient(); // ✅ Remplacé notionClient
        this.postsPerDay = parseInt(process.env.POSTS_PER_DAY) || 5;
    }

    // Sélectionne 5 thématiques différentes pour la journée
    selectDailyThematics() {
        const allThematics = Object.keys(this.contentGenerator.getThematiques());
        const selected = [];

        // Mélange aléatoire
        const shuffled = [...allThematics].sort(() => 0.5 - Math.random());

        // Prend les X premiers (selon POSTS_PER_DAY)
        return shuffled.slice(0, this.postsPerDay);
    }

    async generateDailyContent() {
        console.log(`🚀 Génération de ${this.postsPerDay} contenus pour aujourd'hui...`);

        try {
            // Tester la connexion Google Sheets d'abord
            const sheetsOK = await this.testSheetsConnection();
            if (!sheetsOK) {
                throw new Error('Connexion Google Sheets échouée');
            }

            const selectedThematics = this.selectDailyThematics();
            console.log('📝 Thématiques sélectionnées:', selectedThematics.join(', '));

            const contents = [];

            // Générer chaque contenu
            for (let i = 0; i < selectedThematics.length; i++) {
                const thematic = selectedThematics[i];
                console.log(`\n⏳ Génération ${i + 1}/${selectedThematics.length}: ${thematic}...`);

                try {
                    const content = await this.contentGenerator.generateContent(thematic);
                    contents.push(content);
                    console.log(`✅ Contenu "${thematic}" généré (${content.contenu.length} caractères)`);

                    // Pause entre générations pour éviter rate limit
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } catch (error) {
                    console.error(`❌ Erreur pour ${thematic}:`, error.message);
                }
            }

            // Envoyer tous les contenus à Google Sheets
            if (contents.length > 0) {
                console.log(`\n📤 Envoi des ${contents.length} contenus vers Google Sheets...`);
                await this.sheetsClient.addMultipleContent(contents);
                console.log('✅ Tous les contenus ont été ajoutés à Google Sheets !');
            }

            return contents;

        } catch (error) {
            console.error('❌ Erreur génération quotidienne:', error);
            throw error;
        }
    }

    // Test de connexion Google Sheets
    async testSheetsConnection() {
        try {
            await this.sheetsClient.initialize();
            console.log('✅ Connexion Google Sheets OK');
            return true;
        } catch (error) {
            console.error('❌ Erreur connexion Google Sheets:', error.message);
            return false;
        }
    }

    // Preview d'un contenu sans l'envoyer à Google Sheets
    async previewContent(thematic) {
        console.log(`👁️ Aperçu contenu: ${thematic}`);

        try {
            const content = await this.contentGenerator.generateContent(thematic);

            console.log('\n' + '='.repeat(50));
            console.log(`THÉMATIQUE: ${content.thematique}`);
            console.log('='.repeat(50));
            console.log(content.contenu);
            console.log('='.repeat(50));
            console.log(`HASHTAGS: ${content.hashtags}`);
            console.log('='.repeat(50));

            return content;
        } catch (error) {
            console.error('❌ Erreur preview:', error);
        }
    }

    // Méthode pour voir toutes les thématiques disponibles
    listThematics() {
        const thematics = Object.keys(this.contentGenerator.getThematiques());
        console.log('📋 Thématiques disponibles:');
        thematics.forEach((thematic, index) => {
            console.log(`  ${index + 1}. ${thematic}`);
        });
        return thematics;
    }
}

module.exports = DailyContentGenerator;