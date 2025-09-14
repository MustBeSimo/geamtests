import { NextResponse } from 'next/server';

// Chinese zodiac signs based on birth year
const getChineseZodiac = (year: number): string => {
  const zodiacSigns = [
    'Rat',
    'Ox',
    'Tiger',
    'Rabbit',
    'Dragon',
    'Snake',
    'Horse',
    'Goat',
    'Monkey',
    'Rooster',
    'Dog',
    'Pig',
  ];
  const index = (year - 4) % 12;
  return zodiacSigns[index >= 0 ? index : index + 12] || 'Rat';
};

// Horoscope generation helpers
const moods = [
  'Happy',
  'Energetic',
  'Contemplative',
  'Peaceful',
  'Creative',
  'Ambitious',
  'Romantic',
  'Focused',
];
const colors = [
  'Blue',
  'Red',
  'Green',
  'Purple',
  'Yellow',
  'Orange',
  'Pink',
  'White',
  'Gold',
  'Silver',
];
const luckyNumbers = Array.from({ length: 99 }, (_, i) => i + 1);
const luckyTimes = [
  '1 AM',
  '2 AM',
  '3 AM',
  '4 AM',
  '5 AM',
  '6 AM',
  '7 AM',
  '8 AM',
  '9 AM',
  '10 AM',
  '11 AM',
  '12 PM',
  '1 PM',
  '2 PM',
  '3 PM',
  '4 PM',
  '5 PM',
  '6 PM',
  '7 PM',
  '8 PM',
  '9 PM',
  '10 PM',
  '11 PM',
  '12 AM',
];

const dateRanges = {
  aries: 'March 21 - April 19',
  taurus: 'April 20 - May 20',
  gemini: 'May 21 - June 20',
  cancer: 'June 21 - July 22',
  leo: 'July 23 - August 22',
  virgo: 'August 23 - September 22',
  libra: 'September 23 - October 22',
  scorpio: 'October 23 - November 21',
  sagittarius: 'November 22 - December 21',
  capricorn: 'December 22 - January 19',
  aquarius: 'January 20 - February 18',
  pisces: 'February 19 - March 20',
};

// Prediction templates with placeholders for time context
const westernPredictions = {
  aries: {
    past: [
      'Your leadership decisions yesterday have set a strong foundation.',
      'Recent bold moves are starting to show positive results.',
      'Your past energy investments are bearing fruit.',
    ],
    present: [
      'Your natural leadership abilities will shine through today.',
      'A new opportunity for growth presents itself.',
      'Your energy and enthusiasm will inspire others today.',
    ],
    future: [
      'Tomorrow brings exciting leadership opportunities.',
      'Prepare for a breakthrough in your personal goals.',
      'Your confidence will attract new possibilities tomorrow.',
    ],
  },
  taurus: {
    past: [
      'Your recent practical approach has strengthened your position.',
      "Yesterday's patience has brought valuable insights.",
      'Recent financial decisions are showing promise.',
    ],
    present: [
      'Focus on practical matters and financial stability today.',
      'Your patience will be rewarded with tangible results.',
      'Take time to appreciate the simple pleasures in life.',
    ],
    future: [
      "Tomorrow's ventures will bring material rewards.",
      'Prepare for positive developments in financial matters.',
      'Your steady approach will pay off tomorrow.',
    ],
  },
  gemini: {
    past: [
      "Yesterday's communications have opened new doors.",
      'Recent connections are proving valuable.',
      'Your adaptability has helped you overcome challenges.',
    ],
    present: [
      "Communication is key to resolving today's challenges.",
      'Your adaptability helps you navigate current situations.',
      'New connections bring exciting possibilities today.',
    ],
    future: [
      'Tomorrow brings important conversations.',
      'Prepare for exciting social interactions.',
      'Your versatility will be your strength tomorrow.',
    ],
  },
  cancer: {
    past: [
      'Your intuition yesterday was spot-on.',
      'Recent emotional insights have proven valuable.',
      'Past nurturing efforts are showing results.',
    ],
    present: [
      "Trust your intuition in today's emotional matters.",
      'Focus on nurturing important relationships today.',
      'Home and family bring comfort and joy.',
    ],
    future: [
      'Tomorrow brings emotional clarity.',
      'Prepare for meaningful family connections.',
      'Your intuition will guide you to success tomorrow.',
    ],
  },
  leo: {
    past: [
      'Your recent creative efforts have been noticed.',
      "Yesterday's confidence has opened doors.",
      'Past performances have strengthened your position.',
    ],
    present: [
      'Your creative energy is at its peak today.',
      'Leadership opportunities arise in unexpected places.',
      'Express yourself boldly and confidently now.',
    ],
    future: [
      'Tomorrow spotlights your natural talents.',
      'Prepare for recognition and appreciation.',
      'Your creativity will shine brightly tomorrow.',
    ],
  },
  virgo: {
    past: [
      'Your attention to detail yesterday has paid off.',
      'Recent analytical work is showing value.',
      'Past organizational efforts are bearing fruit.',
    ],
    present: [
      'Pay attention to details but do not lose sight of the big picture.',
      "Your analytical skills help solve today's challenges.",
      'Focus on health and well-being brings positive results.',
    ],
    future: [
      'Tomorrow brings clarity to complex situations.',
      'Prepare for breakthrough in personal projects.',
      'Your methodical approach will be rewarded.',
    ],
  },
  libra: {
    past: [
      "Yesterday's diplomatic approach has paid off.",
      'Recent balanced decisions are showing wisdom.',
      'Past partnerships have strengthened your position.',
    ],
    present: [
      'Balance and harmony are key themes today.',
      'Diplomatic approaches yield the best results now.',
      'Artistic endeavors are especially favored.',
    ],
    future: [
      'Tomorrow brings harmonious interactions.',
      'Prepare for positive partnership developments.',
      'Your diplomatic skills will be valuable tomorrow.',
    ],
  },
  scorpio: {
    past: [
      'Your recent investigations have revealed truth.',
      "Yesterday's intensity has brought results.",
      'Past transformations are showing their value.',
    ],
    present: [
      "Trust your instincts in today's decisions.",
      'Transformation leads to personal growth now.',
      'Deep connections prove meaningful today.',
    ],
    future: [
      'Tomorrow brings powerful revelations.',
      'Prepare for transformative experiences.',
      'Your intuition will guide you to success.',
    ],
  },
  sagittarius: {
    past: [
      'Your recent explorations have brought wisdom.',
      "Yesterday's optimism has opened doors.",
      'Past adventures are enriching your present.',
    ],
    present: [
      'Adventure and exploration bring new insights today.',
      'Your optimistic outlook opens new doors now.',
      'Learning opportunities expand your horizons.',
    ],
    future: [
      'Tomorrow brings exciting adventures.',
      'Prepare for enlightening experiences.',
      'Your enthusiasm will attract opportunities.',
    ],
  },
  capricorn: {
    past: [
      'Your recent hard work is showing results.',
      "Yesterday's discipline has strengthened your position.",
      'Past planning is paying off now.',
    ],
    present: [
      'Professional goals move closer to realization today.',
      'Practical planning leads to concrete results now.',
      'Your dedication and persistence pay off.',
    ],
    future: [
      'Tomorrow brings professional recognition.',
      'Prepare for achievement of long-term goals.',
      'Your ambitions will find support tomorrow.',
    ],
  },
  aquarius: {
    past: [
      'Your recent innovations have sparked interest.',
      "Yesterday's unique approach is proving valuable.",
      'Past humanitarian efforts are bearing fruit.',
    ],
    present: [
      'Innovative ideas lead to breakthrough moments today.',
      'Social connections bring unexpected opportunities now.',
      'Your unique perspective is valued by others.',
    ],
    future: [
      'Tomorrow brings progressive developments.',
      'Prepare for innovative breakthroughs.',
      'Your visionary ideas will find support.',
    ],
  },
  pisces: {
    past: [
      'Your recent intuitive decisions prove wise.',
      "Yesterday's creativity has opened new paths.",
      'Past spiritual insights are guiding you now.',
    ],
    present: [
      'Creative inspiration flows naturally today.',
      'Trust your intuition in current matters.',
      'Spiritual insights guide your path now.',
    ],
    future: [
      'Tomorrow brings spiritual awakening.',
      'Prepare for creative breakthroughs.',
      'Your intuition will be especially strong.',
    ],
  },
};

const chinesePredictions = {
  Rat: {
    past: [
      'Your recent resourcefulness has paid off.',
      "Yesterday's quick thinking brought success.",
      'Past adaptability has proven valuable.',
    ],
    present: [
      'Your quick wit helps you seize opportunities today.',
      'Resourcefulness leads to success in current endeavors.',
      'Adaptability is your greatest strength now.',
    ],
    future: [
      'Tomorrow brings chances to showcase your wit.',
      'Prepare for opportunities that require quick thinking.',
      'Your adaptability will be key tomorrow.',
    ],
  },
  Ox: {
    past: [
      'Your recent diligence has shown results.',
      "Yesterday's patience has been rewarded.",
      'Past persistence is paying off.',
    ],
    present: [
      'Steady progress through diligent effort today.',
      "Your reliability earns others' trust now.",
      'Patience brings rewards in due time.',
    ],
    future: [
      'Tomorrow rewards your consistent effort.',
      'Prepare for breakthrough in long-term projects.',
      'Your reliability will be recognized.',
    ],
  },
  Tiger: {
    past: [
      'Your recent courage has inspired others.',
      "Yesterday's bold moves show promise.",
      'Past leadership decisions prove wise.',
    ],
    present: [
      'Courage leads to breakthrough moments today.',
      'Your natural leadership inspires others now.',
      'Bold moves bring unexpected success.',
    ],
    future: [
      'Tomorrow brings opportunities for leadership.',
      'Prepare for moments that require courage.',
      'Your bold nature will serve you well.',
    ],
  },
  Rabbit: {
    past: [
      'Your recent diplomacy has smoothed paths.',
      "Yesterday's grace has opened doors.",
      'Past artistic efforts show promise.',
    ],
    present: [
      "Diplomacy helps navigate today's situations.",
      'Your gentle approach wins hearts now.',
      'Artistic pursuits are especially favored.',
    ],
    future: [
      'Tomorrow brings diplomatic opportunities.',
      'Prepare for social gatherings.',
      'Your grace will be appreciated.',
    ],
  },
  Dragon: {
    past: [
      'Your recent charisma has drawn attention.',
      "Yesterday's confidence has paid off.",
      'Past ambitions are bearing fruit.',
    ],
    present: [
      'Your charisma attracts new opportunities today.',
      'Innovation leads to success now.',
      'Bold visions become reality.',
    ],
    future: [
      'Tomorrow brings recognition and power.',
      'Prepare for moments in the spotlight.',
      'Your influence will grow stronger.',
    ],
  },
  Snake: {
    past: [
      'Your recent wisdom has proven valuable.',
      "Yesterday's intuition was correct.",
      'Past strategy is showing results.',
    ],
    present: [
      'Wisdom guides important decisions today.',
      'Your intuition reveals hidden truths now.',
      'Strategic thinking leads to victory.',
    ],
    future: [
      'Tomorrow brings clarity and insight.',
      'Prepare for strategic advantages.',
      'Your wisdom will be sought after.',
    ],
  },
  Horse: {
    past: [
      'Your recent adventures have brought wisdom.',
      "Yesterday's energy has opened paths.",
      'Past independence has proven valuable.',
    ],
    present: [
      'Freedom and adventure call to you today.',
      'Your energy inspires positive change now.',
      'New horizons bring exciting possibilities.',
    ],
    future: [
      'Tomorrow brings new adventures.',
      'Prepare for exciting journeys.',
      'Your spirit will find new paths.',
    ],
  },
  Goat: {
    past: [
      'Your recent creativity has been noticed.',
      "Yesterday's kindness has touched hearts.",
      'Past artistic efforts show promise.',
    ],
    present: [
      'Artistic expression brings fulfillment today.',
      'Your sensitivity helps others now.',
      'Harmony in relationships is highlighted.',
    ],
    future: [
      'Tomorrow brings creative inspiration.',
      'Prepare for artistic recognition.',
      'Your gentle nature will be appreciated.',
    ],
  },
  Monkey: {
    past: [
      'Your recent cleverness has paid off.',
      "Yesterday's innovation brought success.",
      'Past versatility has proven valuable.',
    ],
    present: [
      'Clever solutions to complex problems emerge today.',
      'Your versatility is a valuable asset now.',
      'Innovation leads to success.',
    ],
    future: [
      'Tomorrow brings intellectual challenges.',
      'Prepare for opportunities to showcase wit.',
      'Your cleverness will be rewarded.',
    ],
  },
  Rooster: {
    past: [
      'Your recent precision has been noticed.',
      "Yesterday's confidence has paid off.",
      'Past diligence is showing results.',
    ],
    present: [
      'Attention to detail brings recognition today.',
      'Your confidence inspires others now.',
      'Hard work leads to achievement.',
    ],
    future: [
      'Tomorrow brings professional recognition.',
      'Prepare for moments to showcase skills.',
      'Your precision will be valued.',
    ],
  },
  Dog: {
    past: [
      'Your recent loyalty has strengthened bonds.',
      "Yesterday's protection helped others.",
      'Past fairness has earned respect.',
    ],
    present: [
      'Loyalty strengthens important bonds today.',
      'Your protective nature helps others now.',
      'Justice and fairness prevail.',
    ],
    future: [
      'Tomorrow brings trusted partnerships.',
      'Prepare for strengthening relationships.',
      'Your loyalty will be rewarded.',
    ],
  },
  Pig: {
    past: [
      'Your recent generosity has been appreciated.',
      "Yesterday's honesty has earned trust.",
      'Past kindness is returning to you.',
    ],
    present: [
      'Generosity brings unexpected returns today.',
      'Your honesty earns respect now.',
      'Material comfort increases.',
    ],
    future: [
      'Tomorrow brings abundant opportunities.',
      'Prepare for material rewards.',
      'Your kindness will be returned.',
    ],
  },
};

// Add life aspects for more detailed predictions
const aspects = {
  career: {
    positive: [
      'Career opportunities are aligning in your favor',
      'Professional growth shows promising developments',
      'Your leadership qualities are being recognized',
      'New business ventures show potential',
      'Workplace harmony brings productivity',
    ],
    neutral: [
      'Maintain focus on current projects',
      'Consider updating your skills',
      'Network with industry contacts',
      'Review your career goals',
      'Balance work and personal time',
    ],
    challenging: [
      'Navigate workplace changes carefully',
      'Delay major career decisions',
      'Address any professional conflicts',
      'Re-evaluate your work strategy',
      'Seek mentorship or guidance',
    ],
  },
  love: {
    positive: [
      'Romance blooms with new potential',
      'Deeper connections in relationships',
      'Harmony in personal partnerships',
      'Emotional bonds strengthen',
      'New romantic prospects appear',
    ],
    neutral: [
      'Focus on open communication',
      'Nurture existing relationships',
      'Take time for self-reflection',
      'Balance giving and receiving',
      'Express your feelings honestly',
    ],
    challenging: [
      'Address relationship concerns',
      'Give space when needed',
      'Avoid hasty romantic decisions',
      'Work through emotional blocks',
      'Practice patience in love',
    ],
  },
  health: {
    positive: [
      'Energy levels are high',
      'Physical wellness improves',
      'Mental clarity increases',
      'Emotional balance strengthens',
      'Vitality reaches a peak',
    ],
    neutral: [
      'Maintain regular exercise',
      'Focus on balanced nutrition',
      'Practice stress management',
      'Get adequate rest',
      'Stay hydrated and mindful',
    ],
    challenging: [
      'Pay attention to stress levels',
      "Don't ignore minor health issues",
      'Take breaks when needed',
      'Adjust your wellness routine',
      'Seek preventive care',
    ],
  },
  wealth: {
    positive: [
      'Financial opportunities arise',
      'Investments show promise',
      'Money management improves',
      'Resources increase',
      'Material gains are likely',
    ],
    neutral: [
      'Review your budget',
      'Plan for future expenses',
      'Maintain financial balance',
      'Consider long-term savings',
      'Research investment options',
    ],
    challenging: [
      'Avoid impulsive spending',
      'Double-check financial details',
      'Postpone major purchases',
      'Build emergency savings',
      'Seek financial advice',
    ],
  },
};

function getRandomElement<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error('Array cannot be empty');
  }
  return array[Math.floor(Math.random() * array.length)]!;
}

function getDayContext(day: string): 'past' | 'present' | 'future' {
  switch (day.toLowerCase()) {
    case 'yesterday':
      return 'past';
    case 'tomorrow':
      return 'future';
    default:
      return 'present';
  }
}

function generateDetailedPrediction(
  sign: string,
  type: 'western' | 'chinese',
  timeContext: 'past' | 'present' | 'future'
) {
  const predictions =
    type === 'western' ? westernPredictions : chinesePredictions;
  const signPredictions =
    type === 'western'
      ? (predictions as typeof westernPredictions)[
          sign as keyof typeof westernPredictions
        ]?.[timeContext]
      : (predictions as typeof chinesePredictions)[
          sign as keyof typeof chinesePredictions
        ]?.[timeContext];

  // Get base prediction
  const basePrediction = getRandomElement(signPredictions || []);

  // Generate mood for different aspects
  const aspectMoods = {
    career: getRandomElement(['positive', 'neutral', 'challenging']),
    love: getRandomElement(['positive', 'neutral', 'challenging']),
    health: getRandomElement(['positive', 'neutral', 'challenging']),
    wealth: getRandomElement(['positive', 'neutral', 'challenging']),
  };

  // Build detailed prediction
  let detailedPrediction = basePrediction + '\n\n';

  // Add career insights
  detailedPrediction +=
    'Career & Work: ' +
    getRandomElement(
      aspects.career[aspectMoods.career as keyof typeof aspects.career]
    ) +
    '. ';

  // Add love insights
  detailedPrediction +=
    '\n\nLove & Relationships: ' +
    getRandomElement(
      aspects.love[aspectMoods.love as keyof typeof aspects.love]
    ) +
    '. ';

  // Add health insights
  detailedPrediction +=
    '\n\nHealth & Wellness: ' +
    getRandomElement(
      aspects.health[aspectMoods.health as keyof typeof aspects.health]
    ) +
    '. ';

  // Add wealth insights
  detailedPrediction +=
    '\n\nWealth & Finance: ' +
    getRandomElement(
      aspects.wealth[aspectMoods.wealth as keyof typeof aspects.wealth]
    ) +
    '. ';

  // Add advice based on the most challenging aspect
  const challengingAspects = Object.entries(aspectMoods)
    .filter(([_, mood]) => mood === 'challenging')
    .map(([aspect]) => aspect);

  if (challengingAspects.length > 0) {
    detailedPrediction +=
      '\n\nAdvice: Focus on ' +
      challengingAspects.map((aspect) => aspect.toLowerCase()).join(' and ') +
      ' matters with extra attention' +
      (timeContext === 'future'
        ? ' tomorrow'
        : timeContext === 'past'
          ? ' yesterday'
          : ' today') +
      '. Stay positive and approach challenges as opportunities for growth.';
  } else {
    detailedPrediction +=
      '\n\nAdvice: This is a favorable time to pursue your goals and aspirations. ' +
      'Trust your instincts and maintain your positive momentum.';
  }

  return detailedPrediction;
}

function generateHoroscope(
  sign: string,
  type: 'western' | 'chinese',
  day: string
) {
  const dayContext = getDayContext(day);
  const detailedPrediction = generateDetailedPrediction(sign, type, dayContext);

  return {
    type,
    sign: sign,
    description: detailedPrediction,
    mood: getRandomElement(moods),
    color: getRandomElement(colors),
    lucky_number: String(getRandomElement(luckyNumbers)),
    lucky_time: getRandomElement(luckyTimes),
    date_range:
      type === 'western'
        ? dateRanges[sign as keyof typeof dateRanges]
        : undefined,
  };
}

export async function POST(request: Request) {
  try {
    const { sign, day, type = 'western', birthYear } = await request.json();

    // Validate input
    if (!sign && type === 'western') {
      return NextResponse.json(
        { error: 'Sign is required for western horoscope' },
        { status: 400 }
      );
    }

    if (type === 'western') {
      const horoscope = generateHoroscope(
        sign.toLowerCase(),
        'western',
        day || 'today'
      );
      return new NextResponse(JSON.stringify(horoscope), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    } else if (type === 'chinese') {
      if (!birthYear) {
        return NextResponse.json(
          { error: 'Birth year is required for Chinese horoscope' },
          { status: 400 }
        );
      }

      const chineseSign = getChineseZodiac(birthYear);
      const horoscope = generateHoroscope(
        chineseSign,
        'chinese',
        day || 'today'
      );

      return new NextResponse(JSON.stringify(horoscope), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid horoscope type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in horoscope API:', error);
    return NextResponse.json(
      { error: 'Failed to generate horoscope data' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
