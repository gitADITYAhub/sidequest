import { createConnection } from 'typeorm';
import { QuestTemplate } from '../quest/quest-template.entity';

async function seed() {
    const connection = await createConnection({
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 3306,
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || 'my-secret-pw',
        database: process.env.DB_NAME || 'sidequest',
        entities: [QuestTemplate],
        synchronize: true,
    });

    const questRepository = connection.getRepository(QuestTemplate);

    const quests = [
        // Exploration
        { description: 'Find a red flower growing through concrete', difficulty: 'Easy', type: 'Solo', tags: ['exploration', 'nature'] },
        { description: 'Take a picture of a street art mural', difficulty: 'Easy', type: 'Solo', tags: ['exploration', 'art'] },
        { description: 'Visit a park you have never been to', difficulty: 'Medium', type: 'Solo', tags: ['exploration', 'outdoors'] },
        { description: 'Find a building with a clock tower', difficulty: 'Easy', type: 'Solo', tags: ['exploration', 'urban'] },
        { description: 'Spot a bird building a nest', difficulty: 'Medium', type: 'Solo', tags: ['exploration', 'nature'] },
        { description: 'Find a statue of a person', difficulty: 'Easy', type: 'Solo', tags: ['exploration', 'history'] },
        { description: 'Locate a public fountain', difficulty: 'Easy', type: 'Solo', tags: ['exploration', 'urban'] },
        { description: 'Find a tree that looks older than 100 years', difficulty: 'Medium', type: 'Solo', tags: ['exploration', 'nature'] },
        { description: 'Discover a hidden alleyway', difficulty: 'Medium', type: 'Solo', tags: ['exploration', 'urban'] },
        { description: 'Find a place with a great view of the sunset', difficulty: 'Medium', type: 'Solo', tags: ['exploration', 'nature'] },
        { description: 'Locate a library', difficulty: 'Easy', type: 'Solo', tags: ['exploration', 'knowledge'] },
        { description: 'Find a local bakery', difficulty: 'Easy', type: 'Solo', tags: ['exploration', 'food'] },
        { description: 'Spot a classic car', difficulty: 'Hard', type: 'Solo', tags: ['exploration', 'cars'] },
        { description: 'Find a neon sign', difficulty: 'Medium', type: 'Solo', tags: ['exploration', 'urban'] },
        { description: 'Locate a bridge', difficulty: 'Easy', type: 'Solo', tags: ['exploration', 'urban'] },
        { description: 'Find a body of water (pond, river, lake)', difficulty: 'Medium', type: 'Solo', tags: ['exploration', 'nature'] },
        { description: 'Spot a squirrel', difficulty: 'Easy', type: 'Solo', tags: ['exploration', 'nature'] },
        { description: 'Find a bench with a dedication plaque', difficulty: 'Medium', type: 'Solo', tags: ['exploration', 'history'] },
        { description: 'Locate a post office', difficulty: 'Easy', type: 'Solo', tags: ['exploration', 'urban'] },
        { description: 'Find a street musician', difficulty: 'Hard', type: 'Solo', tags: ['exploration', 'music'] },

        // Social
        { description: 'Compliment a stranger on their outfit', difficulty: 'Medium', type: 'Solo', tags: ['social', 'kindness'] },
        { description: 'Hold the door open for someone', difficulty: 'Easy', type: 'Solo', tags: ['social', 'kindness'] },
        { description: 'Call a friend you haven\'t spoken to in a while', difficulty: 'Medium', type: 'Solo', tags: ['social', 'connection'] },
        { description: 'Ask a barista for their recommendation', difficulty: 'Easy', type: 'Solo', tags: ['social', 'interaction'] },
        { description: 'High-five a friend', difficulty: 'Easy', type: 'Solo', tags: ['social', 'fun'] },
        { description: 'Write a thank you note to someone', difficulty: 'Medium', type: 'Solo', tags: ['social', 'gratitude'] },
        { description: 'Smile at 5 strangers', difficulty: 'Medium', type: 'Solo', tags: ['social', 'kindness'] },
        { description: 'Ask someone for directions (even if you know the way)', difficulty: 'Hard', type: 'Solo', tags: ['social', 'courage'] },
        { description: 'Pay for the person behind you in line', difficulty: 'Hard', type: 'Solo', tags: ['social', 'generosity'] },
        { description: 'Leave a nice comment on a social media post', difficulty: 'Easy', type: 'Solo', tags: ['social', 'digital'] },
        { description: 'Send a funny meme to a family member', difficulty: 'Easy', type: 'Solo', tags: ['social', 'connection'] },
        { description: 'Introduce yourself to a neighbor', difficulty: 'Hard', type: 'Solo', tags: ['social', 'community'] },
        { description: 'Give a genuine compliment to a coworker/classmate', difficulty: 'Medium', type: 'Solo', tags: ['social', 'kindness'] },
        { description: 'Ask an elder about their favorite memory', difficulty: 'Medium', type: 'Solo', tags: ['social', 'wisdom'] },
        { description: 'Make someone laugh', difficulty: 'Medium', type: 'Solo', tags: ['social', 'fun'] },
        { description: 'Help someone carry something heavy', difficulty: 'Medium', type: 'Solo', tags: ['social', 'kindness'] },
        { description: 'Recommend a song to a friend', difficulty: 'Easy', type: 'Solo', tags: ['social', 'music'] },
        { description: 'Wave at a baby', difficulty: 'Easy', type: 'Solo', tags: ['social', 'fun'] },
        { description: 'Say "Good Morning" to 3 people', difficulty: 'Easy', type: 'Solo', tags: ['social', 'politeness'] },
        { description: 'Listen to someone without interrupting', difficulty: 'Medium', type: 'Solo', tags: ['social', 'patience'] },

        // Fitness
        { description: 'Do 10 pushups', difficulty: 'Easy', type: 'Solo', tags: ['fitness', 'strength'] },
        { description: 'Walk 5,000 steps', difficulty: 'Medium', type: 'Solo', tags: ['fitness', 'cardio'] },
        { description: 'Hold a plank for 1 minute', difficulty: 'Medium', type: 'Solo', tags: ['fitness', 'core'] },
        { description: 'Take the stairs instead of the elevator', difficulty: 'Easy', type: 'Solo', tags: ['fitness', 'habit'] },
        { description: 'Stretch for 10 minutes', difficulty: 'Easy', type: 'Solo', tags: ['fitness', 'flexibility'] },
        { description: 'Go for a 15-minute jog', difficulty: 'Medium', type: 'Solo', tags: ['fitness', 'cardio'] },
        { description: 'Do 20 jumping jacks', difficulty: 'Easy', type: 'Solo', tags: ['fitness', 'cardio'] },
        { description: 'Drink 2 liters of water', difficulty: 'Easy', type: 'Solo', tags: ['fitness', 'health'] },
        { description: 'Eat a piece of fruit', difficulty: 'Easy', type: 'Solo', tags: ['fitness', 'nutrition'] },
        { description: 'Do 10 squats', difficulty: 'Easy', type: 'Solo', tags: ['fitness', 'strength'] },
        { description: 'Balance on one leg for 1 minute', difficulty: 'Medium', type: 'Solo', tags: ['fitness', 'balance'] },
        { description: 'Do a handstand (against a wall is okay)', difficulty: 'Hard', type: 'Solo', tags: ['fitness', 'skill'] },
        { description: 'Walk backwards for 1 minute', difficulty: 'Easy', type: 'Solo', tags: ['fitness', 'fun'] },
        { description: 'Skip rope for 2 minutes', difficulty: 'Hard', type: 'Solo', tags: ['fitness', 'cardio'] },
        { description: 'Do 5 lunges on each leg', difficulty: 'Easy', type: 'Solo', tags: ['fitness', 'strength'] },
        { description: 'Touch your toes', difficulty: 'Easy', type: 'Solo', tags: ['fitness', 'flexibility'] },
        { description: 'Go for a bike ride', difficulty: 'Medium', type: 'Solo', tags: ['fitness', 'cardio'] },
        { description: 'Dance to your favorite song', difficulty: 'Easy', type: 'Solo', tags: ['fitness', 'fun'] },
        { description: 'Do 10 sit-ups', difficulty: 'Easy', type: 'Solo', tags: ['fitness', 'core'] },
        { description: 'Park far away and walk to the store', difficulty: 'Easy', type: 'Solo', tags: ['fitness', 'habit'] },

        // Creativity
        { description: 'Draw a doodle of your surroundings', difficulty: 'Easy', type: 'Solo', tags: ['creativity', 'art'] },
        { description: 'Write a haiku', difficulty: 'Easy', type: 'Solo', tags: ['creativity', 'writing'] },
        { description: 'Take a photo of something blue', difficulty: 'Easy', type: 'Solo', tags: ['creativity', 'photography'] },
        { description: 'Make a paper airplane', difficulty: 'Easy', type: 'Solo', tags: ['creativity', 'craft'] },
        { description: 'Cook a new recipe', difficulty: 'Medium', type: 'Solo', tags: ['creativity', 'cooking'] },
        { description: 'Write a short poem about coffee', difficulty: 'Easy', type: 'Solo', tags: ['creativity', 'writing'] },
        { description: 'Create a new playlist', difficulty: 'Easy', type: 'Solo', tags: ['creativity', 'music'] },
        { description: 'Rearrange a shelf or desk', difficulty: 'Medium', type: 'Solo', tags: ['creativity', 'design'] },
        { description: 'Learn a magic trick', difficulty: 'Medium', type: 'Solo', tags: ['creativity', 'skill'] },
        { description: 'Build a house of cards', difficulty: 'Hard', type: 'Solo', tags: ['creativity', 'skill'] },
        { description: 'Draw a self-portrait blindfolded', difficulty: 'Medium', type: 'Solo', tags: ['creativity', 'fun'] },
        { description: 'Write a letter to your future self', difficulty: 'Medium', type: 'Solo', tags: ['creativity', 'writing'] },
        { description: 'Invent a new word and define it', difficulty: 'Easy', type: 'Solo', tags: ['creativity', 'language'] },
        { description: 'Take a photo from a worm\'s eye view', difficulty: 'Easy', type: 'Solo', tags: ['creativity', 'photography'] },
        { description: 'Make a collage from old magazines', difficulty: 'Medium', type: 'Solo', tags: ['creativity', 'art'] },
        { description: 'Whistle a tune', difficulty: 'Easy', type: 'Solo', tags: ['creativity', 'music'] },
        { description: 'Write a 6-word story', difficulty: 'Easy', type: 'Solo', tags: ['creativity', 'writing'] },
        { description: 'Create a secret handshake', difficulty: 'Easy', type: 'Party', tags: ['creativity', 'social'] },
        { description: 'Draw a map of your neighborhood from memory', difficulty: 'Medium', type: 'Solo', tags: ['creativity', 'memory'] },
        { description: 'Make a sock puppet', difficulty: 'Medium', type: 'Solo', tags: ['creativity', 'craft'] },

        // Mindfulness
        { description: 'Meditate for 5 minutes', difficulty: 'Easy', type: 'Solo', tags: ['mindfulness', 'peace'] },
        { description: 'Watch the sunset', difficulty: 'Easy', type: 'Solo', tags: ['mindfulness', 'nature'] },
        { description: 'List 3 things you are grateful for', difficulty: 'Easy', type: 'Solo', tags: ['mindfulness', 'gratitude'] },
        { description: 'Take 10 deep breaths', difficulty: 'Easy', type: 'Solo', tags: ['mindfulness', 'calm'] },
        { description: 'Listen to the sounds of nature for 2 minutes', difficulty: 'Easy', type: 'Solo', tags: ['mindfulness', 'nature'] },
        { description: 'Eat a meal without looking at a screen', difficulty: 'Medium', type: 'Solo', tags: ['mindfulness', 'focus'] },
        { description: 'Declutter one drawer', difficulty: 'Medium', type: 'Solo', tags: ['mindfulness', 'organization'] },
        { description: 'Read a chapter of a book', difficulty: 'Medium', type: 'Solo', tags: ['mindfulness', 'reading'] },
        { description: 'Write down your dreams from last night', difficulty: 'Easy', type: 'Solo', tags: ['mindfulness', 'journaling'] },
        { description: 'Spend 10 minutes doing absolutely nothing', difficulty: 'Hard', type: 'Solo', tags: ['mindfulness', 'rest'] },
        { description: 'Observe a plant for 2 minutes', difficulty: 'Easy', type: 'Solo', tags: ['mindfulness', 'nature'] },
        { description: 'Walk barefoot on grass', difficulty: 'Easy', type: 'Solo', tags: ['mindfulness', 'grounding'] },
        { description: 'Smell a flower', difficulty: 'Easy', type: 'Solo', tags: ['mindfulness', 'senses'] },
        { description: 'Look at the stars', difficulty: 'Easy', type: 'Solo', tags: ['mindfulness', 'nature'] },
        { description: 'Journal about your day', difficulty: 'Medium', type: 'Solo', tags: ['mindfulness', 'reflection'] },
        { description: 'Turn off your phone for 1 hour', difficulty: 'Hard', type: 'Solo', tags: ['mindfulness', 'detox'] },
        { description: 'Listen to a classical music piece', difficulty: 'Easy', type: 'Solo', tags: ['mindfulness', 'music'] },
        { description: 'Notice 5 things you can see, 4 you can touch...', difficulty: 'Easy', type: 'Solo', tags: ['mindfulness', 'grounding'] },
        { description: 'Forgive someone (internally)', difficulty: 'Hard', type: 'Solo', tags: ['mindfulness', 'peace'] },
        { description: 'Say a positive affirmation', difficulty: 'Easy', type: 'Solo', tags: ['mindfulness', 'self-love'] },
    ];

    console.log(`Seeding ${quests.length} quests...`);

    for (const quest of quests) {
        const exists = await questRepository.findOne({ where: { description: quest.description } });
        if (!exists) {
            await questRepository.save(quest);
        }
    }

    console.log('Seeding complete!');
    await connection.close();
}

seed().catch((error) => console.log(error));
