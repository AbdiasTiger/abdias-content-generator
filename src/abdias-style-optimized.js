// Système de génération de thématiques variées pour Abdias
class ThematicGenerator {
    constructor() {
        this.business_sujets = [
            'Prospection', 'Closing', 'Personal Branding', 'Mindset Entrepreneur',
            'Leadership', 'Gestion Équipe', 'Productivité', 'Networking',
            'Innovation', 'Négociation', 'Service Client', 'Vente B2B',
            'Marketing Digital', 'Réseaux Sociaux', 'Content Marketing',
            'Stratégie Business', 'Développement Personnel', 'Gestion Temps',
            'Prise Décision', 'Résolution Problèmes'
        ];

        this.angles_approche = [
            'Story personnelle', 'Analogie percutante', 'Tips pratiques',
            'Erreur commune', 'Leçon apprise', 'Révélation spirituelle',
            'Expérience client', 'Moment déclic', 'Échec transformé',
            'Observation sociale', 'Réflexion profonde', 'Conseil direct',
            'Témoignage réel', 'Comparaison surprenante', 'Question dérangeante'
        ];

        this.vie_contextes = [
            'Famille', 'Spiritualité', 'Sport', 'Voyages', 'Amitié',
            'Relations amoureuses', 'Enfance', 'Éducation', 'Santé',
            'Argent', 'Travail', 'Loisirs', 'Communauté', 'Traditions',
            'Défis personnels', 'Objectifs vie', 'Valeurs', 'Croyances',
            'Expériences marquantes', 'Rencontres importantes'
        ];
    }

    // Génère des thématiques variées
    generateThematiques() {
        const thematiques = {};
        let index = 0;

        // Combine business + angles
        this.business_sujets.forEach(sujet => {
            this.angles_approche.slice(0, 3).forEach(angle => {
                const key = `${sujet} - ${angle}`;
                thematiques[key] = `Aborder le ${sujet.toLowerCase()} sous l'angle ${angle.toLowerCase()}`;
                index++;
            });
        });

        // Combine vie + angles
        this.vie_contextes.forEach(contexte => {
            this.angles_approche.slice(0, 2).forEach(angle => {
                const key = `${contexte} - ${angle}`;
                thematiques[key] = `Parler de ${contexte.toLowerCase()} avec approche ${angle.toLowerCase()}`;
                index++;
            });
        });

        return thematiques;
    }
}

// Instance du générateur
const generator = new ThematicGenerator();

// Export pour compatibilité avec content-generator.js
module.exports = {
    // Thématiques générées dynamiquement - compatible avec getThematiques()
    thematiques_reelles: generator.generateThematiques(),

    // Structures narratives - compatible avec getRandomStructure()
    structures_narratives: {
        'story_long': {
            description: 'Histoire détaillée avec contexte, développement et chute',
            longueur: '800-1200 mots',
            elements: ['Contexte précis', 'Dialogue/détails', 'Chiffres réels', 'Leçon finale']
        },
        'punch_analogie': {
            description: 'Analogie surprenante pour expliquer un concept business',
            longueur: '400-600 mots',
            elements: ['Analogie inattendue', 'Parallèle business', 'Explication percutante']
        },
        'reflexion_profonde': {
            description: 'Introspection personnelle liée au business/spiritualité',
            longueur: '600-800 mots',
            elements: ['Questionnement personnel', 'Lien spirituel/business', 'Leçon universelle']
        },
        'tips_actionnable': {
            description: 'Conseils pratiques directs avec étapes concrètes',
            longueur: '300-500 mots',
            elements: ['Problème identifié', 'Solutions concrètes', 'Étapes à suivre']
        },
        'temoignage_client': {
            description: 'Retour d\'expérience client avec résultats chiffrés',
            longueur: '500-700 mots',
            elements: ['Situation initiale', 'Processus suivi', 'Résultats obtenus']
        },
        'revelation_cash': {
            description: 'Vérité cash sans filtre sur le business/entrepreneuriat',
            longueur: '400-600 mots',
            elements: ['Constat brutal', 'Explication directe', 'Appel à l\'action']
        }
    },

    // Expressions typiques d'Abdias - compatible avec getRandomExpression()
    expressions_typiques: [
        "Frère/Sœur, laisse-moi te dire quelque chose...",
        "Tu sais ce qui me dérange le plus ?",
        "Hier soir, j'étais en train de réfléchir et...",
        "Si tu savais le nombre de personnes qui...",
        "Je vais être cash avec toi :",
        "Voici ce qu'on ne te dit jamais :",
        "J'ai envie de partager quelque chose avec toi...",
        "Ça va peut-être te déranger mais...",
        "Laisse-moi te raconter ce qui s'est passé...",
        "Tu veux savoir pourquoi la plupart échouent ?",
        "Hier, un client m'a dit quelque chose qui m'a marqué :",
        "Je vais te dire ce que j'aurais aimé qu'on me dise :",
        "Arrête de chercher des excuses et écoute :",
        "Si j'avais su ça il y a 5 ans...",
        "Voici la différence entre ceux qui réussissent et les autres :"
    ],

    // Types de CTA - compatible avec getRandomCTA()
    cta_types: [
        "Dis-moi en commentaire si tu es d'accord !",
        "Partage si ça peut aider quelqu'un dans ton réseau.",
        "Écris 'OUI' si tu as déjà vécu ça.",
        "Qu'est-ce que tu en penses ? Dis-le moi en commentaire.",
        "Sauvegarde ce post si tu veux le relire plus tard.",
        "Tag quelqu'un qui a besoin de lire ça.",
        "Réagis avec ❤️ si tu approuves.",
        "Raconte-moi ton expérience en commentaire.",
        "Partage ton point de vue, j'aimerais te lire.",
        "Dis-moi : est-ce que ça résonne avec toi ?",
        "Écris 'MERCI' si ce post t'aide.",
        "Qui d'autre devrait lire ça ? Tag-le !",
        "Quelle est ta plus grande difficulté là-dessus ?",
        "Partage si tu penses que c'est important.",
        "Dis-moi en un mot ce que ça t'inspire."
    ],

    // Hashtags globaux
    hashtags: "#AbdiasAffoukou #MarketingDigital #Entrepreneuriat #BusinessMindset #SuccessStory #Motivation #Leadership #PersonalBranding #DigitalMarketing #BusinessTips #Mindset #Inspiration #BusinessCoach #Entrepreneur #Networking #SocialMediaMarketing #Success #GrowthMindset #BusinessStrategy #MotivationQuotes",

    // Style et ton spécifiques à Abdias
    style_ecriture: {
        caracteristiques: [
            "Cash et direct sans être agressif",
            "Mélange spiritualité et business naturellement",
            "Raconte des histoires vraies avec détails précis",
            "Utilise analogies surprenantes et créatives",
            "Partage échecs et vulnérabilités authentiquement",
            "Donne chiffres réels et témoignages concrets",
            "Interpelle directement le lecteur",
            "Alterne phrases courtes percutantes et développements longs"
        ],
        interdits: [
            "Être trop commercial ou vendeur",
            "Utiliser du jargon compliqué",
            "Faire des promesses irréalistes",
            "Copier le style d'autres influenceurs",
            "Être négatif ou décourageant",
            "Parler sans donner de valeur concrète"
        ]
    },

    // Transitions et connecteurs typiques
    transitions_narratives: [
        "Et là, quelque chose d'incroyable s'est passé...",
        "Mais attends, ce n'est pas fini...",
        "Voici où ça devient intéressant :",
        "Tu veux savoir la suite ?",
        "Mais laisse-moi te dire le plus important :",
        "Et c'est là que j'ai compris que...",
        "Maintenant, écoute bien ça :",
        "Ce qui s'est passé après va te surprendre :",
        "Voici la leçon que j'en ai tirée :",
        "Et devine quoi ?",
        "Mais il y a quelque chose que tu dois savoir :",
        "Attends de voir ce qui suit..."
    ]
};