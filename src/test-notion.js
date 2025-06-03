const { Client } = require('@notionhq/client');
require('dotenv').config();

async function testNotionConnection() {
    try {
        console.log('🔍 Test de connexion Notion...');
        console.log('Token starts with:', process.env.NOTION_TOKEN?.substring(0, 10) + '...');
        console.log('Database ID:', process.env.NOTION_DATABASE_ID);

        const notion = new Client({
            auth: process.env.NOTION_TOKEN
        });

        // Test 1: Connexion basique
        console.log('\n1️⃣ Test connexion basique...');
        const response = await notion.users.me();
        console.log('✅ Connexion OK, utilisateur:', response.name);

        // Test 2: Accès à la base
        console.log('\n2️⃣ Test accès base de données...');
        const database = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID
        });
        console.log('✅ Base accessible, nombre de pages:', database.results.length);

        console.log('\n🎉 Tous les tests réussis !');

    } catch (error) {
        console.error('\n❌ Erreur détaillée:');
        console.error('Code:', error.code);
        console.error('Message:', error.message);
        console.error('Status:', error.status);

        if (error.code === 'unauthorized') {
            console.log('\n🔧 Solutions possibles:');
            console.log('1. Token invalide - regénère un nouveau token');
            console.log('2. Intégration non connectée à la base');
            console.log('3. Permissions insuffisantes');
        }

        if (error.code === 'object_not_found') {
            console.log('\n🔧 Solutions possibles:');
            console.log('1. ID de base incorrect');
            console.log('2. Base non partagée avec l\'intégration');
        }
    }
}

testNotionConnection();