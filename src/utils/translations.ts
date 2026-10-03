import { AppLanguage } from '../types';

export interface TranslationStrings {
  appName: string;
  tagline: string;
  selectLevel: string;
  level: string;
  remaining: string;
  moves: string;
  mistakes: string;
  combo: string;
  hint: string;
  undo: string;
  reset: string;
  theme: string;
  howToPlay: string;
  endlessMode: string;
  allLevels: string;
  nextPuzzle: string;
  replay: string;
  congrats: string;
  rulesTitle: string;
  rule1Title: string;
  rule1Desc: string;
  rule2Title: string;
  rule2Desc: string;
  rule3Title: string;
  rule3Desc: string;
  rule4Title: string;
  rule4Desc: string;
  archeryMode: string;
  puzzleMode: string;
  gridSize: string;
  newPuzzle: string;
  soundOn: string;
  soundOff: string;
}

export const translations: Record<AppLanguage, TranslationStrings> = {
  en: {
    appName: 'Arrow Puzzle Game',
    tagline: 'Tap unblocked arrows in sequence to escape the board!',
    selectLevel: 'Select Level',
    level: 'Level',
    remaining: 'Remaining',
    moves: 'Moves',
    mistakes: 'Mistakes',
    combo: 'Combo',
    hint: 'Hint',
    undo: 'Undo',
    reset: 'Reset',
    theme: 'Theme',
    howToPlay: 'How to Play',
    endlessMode: 'Endless Puzzles',
    allLevels: 'All Levels',
    nextPuzzle: 'Next Puzzle',
    replay: 'Replay',
    congrats: 'Level Cleared!',
    rulesTitle: 'How to Play Arrow Puzzle',
    rule1Title: '1. Check the Arrow Direction',
    rule1Desc: 'Each arrow points Up, Down, Left, or Right towards the edge of the grid.',
    rule2Title: '2. Tap Unblocked Arrows',
    rule2Desc: 'Tap an arrow whose straight line towards the exit is completely clear to make it fly off!',
    rule3Title: '3. Avoid Collisions',
    rule3Desc: 'If an arrow hits another tile or stone block, it bumps back. Clear outer arrows first to free the inner ones!',
    rule4Title: '4. Hints & Undo',
    rule4Desc: 'Use the lightbulb (💡) for an instant clue, or Undo (↩️) to reverse your last move.',
    archeryMode: 'Archery Range',
    puzzleMode: 'Arrow Puzzle',
    gridSize: 'Grid Size',
    newPuzzle: 'New Board',
    soundOn: 'Sound On',
    soundOff: 'Sound Off',
  },
  hi: {
    appName: 'तीर पहेली गेम (Arrow Puzzle)',
    tagline: 'रास्ता साफ़ होने पर तीरों को टैप करें और बाहर निकालें!',
    selectLevel: 'लेवल चुनें',
    level: 'लेवल',
    remaining: 'बचे हुए तीर',
    moves: 'चालें',
    mistakes: 'गलतियां',
    combo: 'कॉम्बो',
    hint: 'संकेत',
    undo: 'वापस',
    reset: 'रीसेट',
    theme: 'थीम',
    howToPlay: 'खेलने का नियम',
    endlessMode: 'अनंत पहेलियां',
    allLevels: 'सभी लेवल',
    nextPuzzle: 'अगली पहेली',
    replay: 'फिर खेलें',
    congrats: 'शानदार! लेवल पूरा हुआ!',
    rulesTitle: 'तीर पहेली कैसे खेलें?',
    rule1Title: '1. तीर की दिशा देखें',
    rule1Desc: 'प्रत्येक तीर ऊपर, नीचे, बाएं या दाएं की तरफ इशारा करता है।',
    rule2Title: '2. रास्ता खुला हो तो टैप करें',
    rule2Desc: 'जिस तीर के सामने कोई दूसरा तीर या पत्थर नहीं है, उस पर क्लिक करें। वह तुरंत स्क्रीन से बाहर उड़ जाएगा!',
    rule3Title: '3. रुकावट से बचें',
    rule3Desc: 'अगर आगे कोई तीर या पत्थर है, तो वह टकराकर रुक जाएगा। पहले बाहर के तीरों को निकालें ताकि अंदर के तीरों को रास्ता मिले!',
    rule4Title: '4. संकेत और वापस',
    rule4Desc: 'अटक जाने पर संकेत (💡) दबाएं या अपनी पिछली चाल बदलने के लिए वापस (↩️) दबाएं।',
    archeryMode: 'धनुर्विद्या (Archery)',
    puzzleMode: 'तीर पहेली (Arrow Puzzle)',
    gridSize: 'ग्रिड आकार',
    newPuzzle: 'नया बोर्ड',
    soundOn: 'ध्वनि चालू',
    soundOff: 'ध्वनि बंद',
  },
};
