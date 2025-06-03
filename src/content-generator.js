require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Anthropic = require('@anthropic-ai/sdk');
const ABDIAS_STYLE = require('./abdias-style-optimized'); // Nouveau fichier

class ContentGenerator {
    constructor() {
        // Configuration APIs
        if (process.env.GOOGLE_API_KEY) {
            this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
            this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            this.apiType = 'google';
        } else if (process.env.ANTHROPIC_API_KEY) {
            this.anthropic = new Anthropic({
                apiKey: process.env.ANTHROPIC_API_KEY,
            });
            this.apiType = 'anthropic';
        } else {
            throw new Error('Aucune API configurée ! Ajoute GOOGLE_API_KEY ou ANTHROPIC_API_KEY dans .env');
        }
    }

    // Tes vraies thématiques optimisées
    getThematiques() {
        return ABDIAS_STYLE.thematiques_reelles;
    }

    // Choix aléatoire de structure narrative
    getRandomStructure() {
        const structures = Object.keys(ABDIAS_STYLE.structures_narratives);
        return structures[Math.floor(Math.random() * structures.length)];
    }

    // Choix aléatoire d'expression
    getRandomExpression() {
        const expressions = ABDIAS_STYLE.expressions_typiques;
        return expressions[Math.floor(Math.random() * expressions.length)];
    }

    // Choix aléatoire de CTA
    getRandomCTA() {
        const ctas = ABDIAS_STYLE.cta_types;
        return ctas[Math.floor(Math.random() * ctas.length)];
    }

    // Prompt ultra-personnalisé basé sur tes vrais posts
    createPrompt(thematique, contexte) {
        const structure = this.getRandomStructure();
        const expression = this.getRandomExpression();
        const cta = this.getRandomCTA();
        const structureInfo = ABDIAS_STYLE.structures_narratives[structure];

        return `Tu es Abdias Affoukou, expert marketing digital qui aide entrepreneurs et petites entreprises à attirer plus de clients via Facebook/réseaux sociaux.

CONTEXTE PERSONNEL IMPORTANT :
- Tu as une approche spirituelle du business (foi + action)
- Tu es cash, authentique, sans filtre mais bienveillant
- Tu partages tes échecs et vulnérabilités 
- Tu utilises des analogies surprenantes pour expliquer
- Tu racontes des histoires vraies avec chiffres réels
- Expérience : plusieurs années, clients qui génèrent millions FCFA

THÉMATIQUE À TRAITER : ${thematique}
CONTEXTE : ${contexte}

STRUCTURE À UTILISER : ${structure}
Description : ${structureInfo.description}
Longueur cible : ${structureInfo.longueur}

CONSIGNES D'ÉCRITURE :
1. OUVERTURE : ${structure === 'punch_analogie' ? 'Analogie surprenante' : structure === 'story_long' ? 'Contexte détaillé avec lieu/moment' : 'Phrase choc ou réflexion'}

2. DÉVELOPPEMENT selon ${structure} :
${structure === 'story_long' ? '- Raconte une histoire vraie et détaillée (client, situation, dialogue, chiffres)\n- Montre le processus, les émotions, les doutes\n- Révèle la leçon apprise' :
                structure === 'punch_analogie' ? '- Développe l\'analogie de manière inattendue\n- Fais le parallèle avec le business\n- Explique pourquoi c\'est "EXACTEMENT la même chose"' :
                    structure === 'reflexion_profonde' ? '- Introspection personnelle authentique\n- Lien entre spiritualité/vie personnelle et business\n- Leçon universelle' :
                        '- Explication directe et cash\n- Exemples concrets\n- Conseil actionnable'}

3. STYLE OBLIGATOIRE :
- Utilise naturellement : "${expression}"
- Ton cash mais bienveillant (comme tes vrais posts)
- Phrases courtes ET paragraphes plus longs selon le rythme
- Listes à puces pour points importants
- Questions rhétoriques pour engager

4. FERMETURE :
- ${cta}
- Signature : "À très vite, Abdias."

EXEMPLES DE TON VRAI STYLE :
- "Tant que tu penses que c'est la faute des autres, tu restes pauvre."
- "Les femmes d'hier soir étaient trop bonnes. Mais si seulement tu savais..."
- "J'ai failli perdre un contrat de 2.000.000 Fcfa/an parce que j'étais trop pressé."

IMPORTANT : Varie la longueur et l'approche. Parfois court et percutant, parfois long et détaillé comme tes vrais posts.

Écris maintenant un post dans ton style authentique :`;
    }

    async generateContent(thematique) {
        const thematiques = this.getThematiques();
        const contexte = thematiques[thematique] || 'Contenu général business';
        const prompt = this.createPrompt(thematique, contexte);

        try {
            let content;

            if (this.apiType === 'google') {
                const result = await this.model.generateContent(prompt);
                content = result.response.text();
            } else {
                const response = await this.anthropic.messages.create({
                    model: "claude-3-5-sonnet-20241022",
                    max_tokens: 1500, // Augmenté pour les longs posts
                    messages: [{ role: "user", content: prompt }]
                });
                content = response.content[0].text;
            }

            // Ajouter les hashtags si pas présents
            if (!content.includes('#')) {
                content += `\n\n${ABDIAS_STYLE.hashtags}`;
            }

            return {
                thematique,
                contenu: content.trim(),
                hashtags: this.extractHashtags(content),
                date: new Date().toISOString().split('T')[0],
                longueur: content.length,
                structure_utilisee: this.getRandomStructure() // Pour tracking
            };

        } catch (error) {
            console.error(`Erreur génération contenu ${thematique}:`, error);
            throw error;
        }
    }

    extractHashtags(content) {
        const hashtags = content.match(/#\w+/g);
        return hashtags ? hashtags.join(' ') : ABDIAS_STYLE.hashtags;
    }

    // Méthode pour voir les thématiques disponibles avec descriptions
    listThematicsWithDetails() {
        console.log('📋 Tes thématiques optimisées :');
        Object.entries(this.getThematiques()).forEach(([thematic, description], index) => {
            console.log(`  ${index + 1}. ${thematic} - ${description}`);
        });
    }
}

module.exports = ContentGenerator;