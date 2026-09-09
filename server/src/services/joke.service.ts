import axios from 'axios';

export interface JokeItem {
  id: string;
  setup: string;
  punchline: string;
  category: 'CODING' | 'COUPLE' | 'GEEK';
}

const FALLBACK_JOKES: JokeItem[] = [
  {
    id: 'joke-1',
    setup: 'Why do programmers love relationships?',
    punchline: 'Because they finally found someone who understands their bugs!',
    category: 'COUPLE'
  },
  {
    id: 'joke-2',
    setup: 'Are you a CSS class?',
    punchline: 'Because you\'ve got style and you\'re adding specificity to my life.',
    category: 'COUPLE'
  },
  {
    id: 'joke-3',
    setup: 'How do developer couples resolve an argument?',
    punchline: 'git merge --strategy-option=theirs (because love always wins!).',
    category: 'COUPLE'
  },
  {
    id: 'joke-4',
    setup: 'Why did the JavaScript developer break up with their callback?',
    punchline: 'Because they found someone who made them a Promise.',
    category: 'CODING'
  },
  {
    id: 'joke-5',
    setup: 'There are 10 types of couples in this world...',
    punchline: 'Those who understand binary, and those who haven\'t pair programmed together yet!',
    category: 'GEEK'
  },
  {
    id: 'joke-6',
    setup: 'What did the developer say on their anniversary?',
    punchline: 'You are the semicolons in my code: without you, everything falls apart.',
    category: 'COUPLE'
  },
  {
    id: 'joke-7',
    setup: 'Why was the database developer so romantic?',
    punchline: 'Because they believed in strict foreign key commitments and ACID integrity.',
    category: 'CODING'
  },
  {
    id: 'joke-8',
    setup: 'Why do couples who code together stay together?',
    punchline: 'Because fixing a bug together is cheaper than couples therapy!',
    category: 'COUPLE'
  }
];

export async function getRandomJoke(category?: string): Promise<JokeItem> {
  let pool = FALLBACK_JOKES;
  if (category && ['CODING', 'COUPLE', 'GEEK'].includes(category)) {
    pool = FALLBACK_JOKES.filter(j => j.category === category);
  }
  try {
    if (Math.random() > 0.6) {
      const res = await axios.get('https://official-joke-api.appspot.com/jokes/programming/random', { timeout: 1500 });
      if (res.data && Array.isArray(res.data) && res.data[0]) {
        return {
          id: 'ext-' + res.data[0].id,
          setup: res.data[0].setup,
          punchline: res.data[0].punchline,
          category: 'CODING',
        };
      }
    }
  } catch (err) {
    // fallback
  }
  return pool[Math.floor(Math.random() * pool.length)];
}
