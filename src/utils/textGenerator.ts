import { Difficulty, PracticeCategory } from '../types';

const COMMON_WORDS_EASY = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not',
  'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from',
  'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would',
  'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which',
  'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
  'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see',
  'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think',
  'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well',
  'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
];

const COMMON_WORDS_MEDIUM = [
  'system', 'program', 'design', 'future', 'speed', 'challenge', 'focus', 'accuracy',
  'keyboard', 'screen', 'action', 'motion', 'energy', 'record', 'improve', 'practice',
  'result', 'memory', 'create', 'search', 'listen', 'master', 'rhythm', 'digital',
  'balance', 'journey', 'moment', 'talent', 'effort', 'vision', 'stream', 'engine',
  'quantum', 'circuit', 'network', 'signal', 'vector', 'matrix', 'beacon', 'galaxy',
  'puzzle', 'module', 'driver', 'sensor', 'portal', 'dynamo', 'horizon', 'zenith',
  'vertex', 'binary', 'stride', 'velocity', 'tempo', 'metric', 'reflex', 'target'
];

const COMMON_WORDS_HARD = [
  'extraordinary', 'infrastructure', 'synchronization', 'philosophical', 'quintessential',
  'counterintuitive', 'unprecedented', 'kaleidoscope', 'phenomenological', 'idiosyncrasy',
  'microarchitecture', 'cryptographic', 'juxtaposition', 'characteristics', 'comprehensive',
  'indispensable', 'metamorphosis', 'polyglot', 'paraphernalia', 'connoisseur',
  'circumlocution', 'anachronistic', 'serendipity', 'perspicacity', 'magnanimous',
  'surreptitious', 'recalcitrant', 'ephemeral', 'ubiquitous', 'vicissitude'
];

const QUOTES_MEDIUM = [
  "Do not go where the path may lead, go instead where there is no path and leave a trail.",
  "Simplicity is prerequisite for reliability. Complex systems always fail in complex ways.",
  "The only way to do great work is to love what you do. If you haven't found it yet, keep looking.",
  "The beautiful thing about learning is that nobody can take it away from you.",
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
  "It is not that we have a short time to live, but that we waste a lot of it.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Programs must be written for people to read, and only incidentally for machines to execute.",
  "In the middle of difficulty lies opportunity. Keep your hands moving and eyes ahead.",
  "Speed without accuracy is reckless; accuracy without speed is hesitation. Balance both.",
  "A journey of a thousand miles begins with a single confident step on the home row keys."
];

const QUOTES_PUNCTUATION = [
  "\"The code works!\" he shouted; however, the tests—which had passed earlier—now failed.",
  "Did you know? Over 75% of developers type at 60+ WPM, but accuracy matters more: 98% is ideal.",
  "Focus: (1) Keep wrists elevated, (2) return fingers to home row (A-S-D-F / J-K-L-;), and (3) breathe!",
  "She asked: 'Can we optimize this algorithm?' 'Yes,' he replied, 'if O(n log n) is acceptable.'",
  "Warning: Do not rush! High speed + high errors = low net score; precision generates real velocity.",
  "Between 'practice' and 'perfection' lies patience: 10,000 keystrokes of deliberate muscle memory."
];

const CODE_SNIPPETS = [
  "const speed = calculateWpm(chars, time); if (speed > 100) return 'Lightning';",
  "function binarySearch(arr, target) { let left = 0, right = arr.length - 1; }",
  "export default function App() { const [wpm, setWpm] = useState(0); return <Hud />; }",
  "const result = items.filter(x => x.score >= 90).map(x => ({ ...x, verified: true }));",
  "async function fetchData(url: string): Promise<Response> { return await fetch(url); }",
  "const matrix = Array.from({ length: 10 }, (_, row) => row * 2 + 1);"
];

const BEGINNER_WORDS = [
  'cat', 'dog', 'sun', 'sky', 'cup', 'pen', 'box', 'run', 'red', 'big', 'hot', 'cold',
  'hat', 'man', 'map', 'top', 'sea', 'bed', 'car', 'bus', 'net', 'pie', 'fan', 'air',
  'day', 'eye', 'key', 'leg', 'arm', 'ear', 'cow', 'hen', 'fox', 'pig', 'owl', 'bee',
  'egg', 'nut', 'jam', 'tea', 'ice', 'oil', 'pan', 'pot', 'rug', 'tub', 'toy', 'van'
];

// Seeded PRNG for daily challenges
function seedRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateDailySeed(): number {
  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  return parseInt(dateStr, 10);
}

export function getDailyChallengeDateStr(): string {
  const now = new Date();
  return now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function generateTypingPassage(
  category: PracticeCategory,
  difficulty: Difficulty = 'medium',
  targetWordCount: number = 80
): string {
  if (category === 'daily') {
    const seed = generateDailySeed();
    const rng = seedRandom(seed);
    const pool = [...QUOTES_MEDIUM, ...QUOTES_PUNCTUATION];
    // Pick 3 connected inspiring thoughts using seed
    const chosen: string[] = [];
    for (let i = 0; i < 3; i++) {
      const idx = Math.floor(rng() * pool.length);
      chosen.push(pool[idx]);
    }
    return chosen.join(' ');
  }

  if (category === 'code') {
    const pool = [...CODE_SNIPPETS];
    // Shuffle and join enough code snippets
    const shuffled = pool.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4).join(' ');
  }

  if (category === 'punctuation') {
    const pool = [...QUOTES_PUNCTUATION];
    const shuffled = pool.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3).join(' ');
  }

  if (category === 'sentences') {
    const pool = [...QUOTES_MEDIUM];
    const shuffled = pool.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3).join(' ');
  }

  if (category === 'beginner') {
    const words: string[] = [];
    for (let i = 0; i < targetWordCount; i++) {
      const w = BEGINNER_WORDS[Math.floor(Math.random() * BEGINNER_WORDS.length)];
      words.push(w);
    }
    return words.join(' ');
  }

  // Common words mode with difficulty
  let sourcePool = COMMON_WORDS_MEDIUM;
  if (difficulty === 'easy') {
    sourcePool = COMMON_WORDS_EASY;
  } else if (difficulty === 'hard') {
    // Mix of hard multisyllabic words and medium words
    sourcePool = [...COMMON_WORDS_HARD, ...COMMON_WORDS_MEDIUM];
  }

  const generatedWords: string[] = [];
  let lastWord = '';

  while (generatedWords.length < targetWordCount) {
    const candidate = sourcePool[Math.floor(Math.random() * sourcePool.length)];
    if (candidate !== lastWord) {
      generatedWords.push(candidate);
      lastWord = candidate;
    }
  }

  return generatedWords.join(' ');
}
