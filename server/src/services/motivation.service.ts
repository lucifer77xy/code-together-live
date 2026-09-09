export interface DailyMotivation {
  quote: string;
  author: string;
  coupleMotivation: string;
  challenge: string;
}

const MOTIVATION_PRESETS: DailyMotivation[] = [
  {
    quote: 'Great developers build projects. Great couples build dreams together.',
    author: 'Code Together Duo',
    coupleMotivation: 'Every line of code you write together is an investment in your shared future. Cheer each other on today!',
    challenge: 'Complete 3 tasks before lunch and exchange a 5-minute victory coffee break.',
  },
  {
    quote: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    author: 'Martin Fowler',
    coupleMotivation: 'Be patient when pair debugging. The sweetest victory is when you both finally see the green checkmarks.',
    challenge: 'Review each other\'s code commit today and leave at least two positive, encouraging comments.',
  },
  {
    quote: 'The only way to learn a new programming language is by writing programs in it.',
    author: 'Dennis Ritchie',
    coupleMotivation: 'Don\'t fear syntax errors or failed test cases; fear not trying. You two have got this!',
    challenge: 'Spend 45 continuous uninterrupted minutes solving a tricky DSA problem side-by-side.',
  },
  {
    quote: 'First, solve the problem. Then, write the code.',
    author: 'John Johnson',
    coupleMotivation: 'Teamwork makes the dream work. Whiteboard the architecture together before typing the first line.',
    challenge: 'Plan tomorrow\'s sprint together for 10 minutes before turning off screens tonight.',
  },
  {
    quote: 'Simplicity is prerequisite for reliability.',
    author: 'Edsger W. Dijkstra',
    coupleMotivation: 'Keep your goals simple, clear, and celebrate every small milestone. Consistency beats intensity.',
    challenge: 'Log at least 2 hours of study time today to keep your duo flame burning bright!',
  }
];

export function getTodayMotivation(): DailyMotivation {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const index = Math.abs(dayOfYear) % MOTIVATION_PRESETS.length;
  return MOTIVATION_PRESETS[index];
}
