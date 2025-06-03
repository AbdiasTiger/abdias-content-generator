require('dotenv').config();
const { Client } = require('@notionhq/client');

class NotionClient {
    constructor() {
        if (!process.env.NOTION_TOKEN) {
            throw new Error('NOTION_TOKEN manquant dans .env');
        }
        if (!process.env.NOTION_DATABASE_ID) {
            throw new Error('NOTION_DATABASE_ID manquant dans .env');
        }

        this.notion = new Client({
            auth: process.env.NOTION_TOKEN,
        });
        this.databaseId = process.env.NOTION_DATABASE_ID;
    }

    async addContent(contentData) {
        try {
            const response = await this.notion.pages.create({
                parent: {
                    database_id: this.databaseId,
                },
                properties: {
                    'Date': {
                        date: {
                            start: contentData.date,
                        },
                    },
                    'Thématique': {
                        select: {
                            name: contentData.thematique,
                        },
                    },
                    'Contenu': {
                        rich_text: [
                            {
                                text: {
                                    content: contentData.contenu,
                                },
                            },
                        ],
                    },
                    'Hashtags': {
                        rich_text: [
                            {
                                text: {
                                    content: contentData.hashtags,
                                },
                            },
                        ],
                    },
                    'Statut': {
                        select: {
                            name: 'À poster',
                        },
                    },
                },
            });

            console.log(`✅ Contenu ajouté à Notion: ${contentData.thematique}`);
            return response;
        } catch (error) {
            console.error('❌ Erreur Notion:', error.message);
            throw error;
        }
    }

    async addMultipleContents(contentsArray) {
        const results = [];
        for (const content of contentsArray) {
            try {
                const result = await this.addContent(content);
                results.push(result);
                // Pause entre chaque ajout pour éviter rate limit
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`Erreur pour ${content.thematique}:`, error.message);
            }
        }
        return results;
    }

    async testConnection() {
        try {
            const response = await this.notion.databases.retrieve({
                database_id: this.databaseId,
            });
            console.log('✅ Connexion Notion OK');
            console.log('📊 Base de données:', response.title[0]?.plain_text || 'Sans titre');
            return true;
        } catch (error) {
            console.error('❌ Erreur connexion Notion:', error.message);
            return false;
        }
    }
}

module.exports = NotionClient;