// LEVEL 1: "Blast from the Past" — 4 Reusable OTP/PIN Character Box Cards
// `prefilledIndices` is a map of { index: character } that will be prefilled & locked (disabled)
export const LEVEL_1_CARDS_CONFIG = [
  {
    id: 'lvl1-card-1',
    title: '1. Joining Date',
    subtitle: 'On which date did you join TCS(DDMMYY)',
    answer: '270121',
    prefilledIndices: {  }, // T _ _ R _ -> User types A, P, I
    hint: 'Hatttttt!'
  },
  {
    id: 'lvl1-card-2',
    title: '2. First Slowest Person',
    subtitle: 'Who was the first slowest person you met in TCS after joining (FirstName Only)',
    answer: 'WAQAR',
    prefilledIndices: { 1: 'A', 4: 'R' }, // C _ _ _ U -> User types H, O, M
    hint: 'Waah! Car Zehar'
  },
  {
    id: 'lvl1-card-3',
    title: '3. First TCS guy you went on a date with',
    subtitle: 'Kon tha? hmmmm.....',
    answer: 'YATHARTHA',
    prefilledIndices: { 5: 'R' }, // _ L _ _ -> User types D, 4, S
    hint: 'Name starts with why'
  },
  {
    id: 'lvl1-card-4',
    hasPhoto: true, // Uses the reusable PhotoCharacterBoxPuzzleCard component!
    title: '4. Guess Who Is In This Snapshot!',
    subtitle: 'Judge from this hairstyle and write the name(first name)',
    answer: 'SAGNIK',
    prefilledIndices: { 1: 'A' }, // M _ N _ _ -> User types A, G, O
    hint: 'Girls think he is cute',
    // CLOUDINARY PICTURE CONFIG FOR CARD 4:
    // Replace `cloudinaryPublicId` with your uploaded image's Public ID in Cloudinary
    // (or paste a full https://res.cloudinary.com/... URL in `directUrl`).
    cloudinaryPublicId: 'data/sagnik',
    directUrl: '',
    label: 'Blast from the Past — Mystery Picture #4',
    caption: 'Zulfe to dekho bhai ki!',
    fallbackArt: {
      title: 'Mystery Snapshot #4',
      subtitle: 'Cloudinary Picture Clue',
      bgStart: '#4a154b',
      bgEnd: '#1b1030',
      accent: '#ffd43b',
      iconType: 'star'
    }
  }
];

// LEVEL 2: "Match it" — VerticalPhotoGallery Photos + Upper Match Cards + Bottom 2 Drop Cards
// Note: We include 8 photos in the gallery for 6 cards so that when all 6 right photos are placed,
// the 2 leftover decoy/funny blooper photos (or any unplaced photos) get flushed down the Western Toilet!
export const LEVEL_2_GALLERY_PHOTOS = [
  {
    id: 'data/prabhansh',
    label: 'prabhansh',
    caption: 'bullet wali ladki mil jati to maza aa jata',
    cloudinaryPublicId: 'data/prabhansh',
    fallbackArt: {
      title: '2 AM Kulhad Chai',
      subtitle: 'Hostel Gate Tapri • Oct',
      bgStart: '#3b1d5e',
      bgEnd: '#1b1030',
      accent: '#f59f00',
      iconType: 'chai'
    }
  },
  {
    id: 'data/anubhav',
    label: 'Anubhav',
    caption: 'Vo Mera thoda chulbula swabhav hai',
    cloudinaryPublicId: 'data/anubhav',
    fallbackArt: {
      title: 'Out of Petrol Again',
      subtitle: 'Highway Breakdown • Jan',
      bgStart: '#1b3a4b',
      bgEnd: '#0f172a',
      accent: '#4dabf7',
      iconType: 'scooty'
    }
  },
  {
    id: 'data/ayushi',
    label: 'Ayushi',
    caption: 'Pune aa jao friends',
    cloudinaryPublicId: 'data/ayushi',
    fallbackArt: {
      title: 'Monsoon Cloudburst',
      subtitle: 'Hilltop Point • July',
      bgStart: '#183a37',
      bgEnd: '#0b1d1b',
      accent: '#38d9a9',
      iconType: 'rain'
    }
  },
  {
    id: 'data/ashlesha',
    label: 'Ashlesha',
    caption: 'mein na bolungi',
    cloudinaryPublicId: 'data/ashlesha',
    fallbackArt: {
      title: 'Rooftop Jam Session',
      subtitle: '3 AM Acoustic Chaos • Dec',
      bgStart: '#4a154b',
      bgEnd: '#1f0a24',
      accent: '#f783ac',
      iconType: 'karaoke'
    }
  },
  {
    id: 'data/yathartha',
    label: 'Yathartha',
    caption: '...',
    cloudinaryPublicId: 'data/yathartha',
    fallbackArt: {
      title: 'Sheru The VIP',
      subtitle: 'Canteen Steps • Daily',
      bgStart: '#4f2d12',
      bgEnd: '#1f1209',
      accent: '#ffa94d',
      iconType: 'dog'
    }
  },
  {
    id: 'data/rohini',
    label: 'rohini',
    caption: 'Mahima bohut screenshot le rhi h.. kch to gadbad hai',
    cloudinaryPublicId: 'data/rohini',
    fallbackArt: {
      title: 'Suitcase Express',
      subtitle: 'Coach S4 Doorway • Mar',
      bgStart: '#2b2d42',
      bgEnd: '#12131f',
      accent: '#ffd43b',
      iconType: 'train'
    }
  },
  {
    id: 'data/faraz',
    label: 'faraz',
    caption: 'lets create an excel',
    cloudinaryPublicId: 'data/faraz',
    fallbackArt: {
      title: 'Burnt Oven Pizza',
      subtitle: 'Decoy Blooper #1',
      bgStart: '#4a1c1c',
      bgEnd: '#1f0b0b',
      accent: '#ff6b6b',
      iconType: 'pizza'
    }
  },
  {
    id: 'data/pranav',
    label: 'Pranav',
    caption: 'Mein genius hu',
    cloudinaryPublicId: 'data/pranav',
    fallbackArt: {
      title: '90% Camera Thumb',
      subtitle: 'Decoy Blooper #2',
      bgStart: '#2d3142',
      bgEnd: '#151722',
      accent: '#ced4da',
      iconType: 'star'
    }
  },
  {
    id: 'data/luv',
    label: 'Luv',
    caption: 'Bodmoshi mera kaam | love is in the air',
    cloudinaryPublicId: 'data/luv',
    fallbackArt: {
      title: '90% Camera Thumb',
      subtitle: 'Decoy Blooper #2',
      bgStart: '#2d3142',
      bgEnd: '#151722',
      accent: '#ced4da',
      iconType: 'star'
    }
  },
  {
    id: 'data/aditi',
    label: 'Aditi',
    caption: 'Validation Manager pro max',
    cloudinaryPublicId: 'data/aditi',
    fallbackArt: {
      title: '90% Camera Thumb',
      subtitle: 'Decoy Blooper #2',
      bgStart: '#2d3142',
      bgEnd: '#151722',
      accent: '#ced4da',
      iconType: 'star'
    }
  },
  {
    id: 'data/tarun',
    label: 'Tarun',
    caption: 'tarun',
    cloudinaryPublicId: 'data/tarun',
    fallbackArt: {
      title: '90% Camera Thumb',
      subtitle: 'Decoy Blooper #2',
      bgStart: '#2d3142',
      bgEnd: '#151722',
      accent: '#ced4da',
      iconType: 'star'
    }
  },
  {
    id: 'data/arzoo',
    label: 'Arzoo',
    caption: 'Aesthetic',
    cloudinaryPublicId: 'data/arzoo',
    fallbackArt: {
      title: '90% Camera Thumb',
      subtitle: 'Decoy Blooper #2',
      bgStart: '#2d3142',
      bgEnd: '#151722',
      accent: '#ced4da',
      iconType: 'star'
    }
  },
  {
    id: 'data/rehan',
    label: 'Rehan',
    caption: 'Mein SQL se nhi, SQL mujhse hai',
    cloudinaryPublicId: 'data/rehan',
    fallbackArt: {
      title: '90% Camera Thumb',
      subtitle: 'Decoy Blooper #2',
      bgStart: '#2d3142',
      bgEnd: '#151722',
      accent: '#ced4da',
      iconType: 'star'
    }
  },
  {
    id: 'data/maithri',
    label: 'Maithri',
    caption: 'Pari hu mein - N ki :P',
    cloudinaryPublicId: 'data/maithri',
    fallbackArt: {
      title: '90% Camera Thumb',
      subtitle: 'Decoy Blooper #2',
      bgStart: '#2d3142',
      bgEnd: '#151722',
      accent: '#ced4da',
      iconType: 'star'
    }
  },
  {
    id: 'data/rachita',
    label: 'Rachita',
    caption: 'Mein to Mahima ki side hu',
    cloudinaryPublicId: 'data/rachita',
    fallbackArt: {
      title: '90% Camera Thumb',
      subtitle: 'Decoy Blooper #2',
      bgStart: '#2d3142',
      bgEnd: '#151722',
      accent: '#ced4da',
      iconType: 'star'
    }
  },
  {
    id: 'data/ayush',
    label: 'Ayush',
    caption: 'paneer kachcha h bhaiya..',
    cloudinaryPublicId: 'data/ayush',
    fallbackArt: {
      title: '90% Camera Thumb',
      subtitle: 'Decoy Blooper #2',
      bgStart: '#2d3142',
      bgEnd: '#151722',
      accent: '#ced4da',
      iconType: 'star'
    }
  }
];

// Upper Part: `w` (4) Cards with Title + Left Text + Right Photo Drop Box
export const LEVEL_2_UPPER_CARDS = [
  {
    id: 'match-upper-1',
    title: 'Corporate Relation',
    memoryText:
      'GrandFather',
    expectedPhotoId: 'data/faraz'
  },
  {
    id: 'match-upper-2',
    title: 'Corporate Relation',
    memoryText:
      'Father',
    expectedPhotoId: 'data/pranav'
  },
  {
    id: 'match-upper-3',
    title: 'Corporate Relation',
    memoryText:
      'Son',
    expectedPhotoId: 'data/rehan'
  },
  {
    id: 'match-upper-4',
    title: 'Corporate Relation',
    memoryText:
      'Daughter',
    expectedPhotoId: 'data/aditi'
  },
  {
    id: 'match-upper-5',
    title: 'Corporate Relation',
    memoryText:
      'Bua',
    expectedPhotoId: 'data/ayushi'
  }
];

export const LEVEL_2_MIDDLE_CARDS = [
  {
    id: 'data/tarun',
    title: 'Switched To',
    memoryText:
      'Infosys',
    expectedPhotoId: 'data/tarun'
  },
  {
    id: 'data/luv',
    title: 'Switched To',
    memoryText:
      'Accenture',
    expectedPhotoId: 'data/luv'
  }
]

// Bottom Part: 2 Cards (Left & Right) with Main Title ONLY and a Photo Drop Box (No text section)
export const LEVEL_2_BOTTOM_CARDS = [
  {
    id: 'match-bottom-left',
    title: 'Who Cried in middle of meating',
    expectedPhotoId: 'data/maithri'
  },
  {
    id: 'match-bottom-right',
    title: 'Who officially rage baited Pranav',
    expectedPhotoId: 'data/yathartha'
  }
];

// END Part: 1 Cards (Left & Right) with Main Title ONLY and a Photo Drop Box (No text section)
export const LEVEL_2_END_CARDS = [
  {
    id: 'match-end-left',
    title: 'Chalega Gang Members Senior',
    expectedPhotoId: 'data/rohini'
  },
  {
    id: 'match-end-right',
    title: 'Chalge Gang Members Junior',
    expectedPhotoId: 'data/arzoo'
  }
];

// LEVEL 3: "Delhi Trip" — Sequence Game (Fixed 1..6 numbers on left, draggable memory tiles on right)
export const LEVEL_3_DELHI_SEQUENCE = [
  {
    id: 'delhi-step-1',
    correctPosition: 1,
    timeTag: 'Sundar Nursery',
    title: 'Sundar Nursery, we called it zoo at first - must go place right?',
    hasPhoto: true,
    cloudinaryPublicId: 'data/sundar_nursery',
    directUrl: '',
    label: 'Sundar Nursery',
    caption: 'Best time spent with amazing scenery',
    fallbackArt: {
      title: 'Chandni Chowk',
      subtitle: 'Paranthe & Kulhad Lassi',
      bgStart: '#3b1d5e',
      bgEnd: '#1b1030',
      accent: '#f59f00',
      iconType: 'chai'
    }
  },
  {
    id: 'delhi-step-2',
    correctPosition: 2,
    timeTag: 'Bangla Sahib',
    title: 'Beautiful, Serene place. Peace in the mid of chaos',
    hasPhoto: true,
    cloudinaryPublicId: 'data/bangla_sahib',
    directUrl: '',
    label: 'Bangla Sahib',
    caption: 'Best time spent with amazing scenery',
    fallbackArt: {
      title: 'Chandni Chowk',
      subtitle: 'Paranthe & Kulhad Lassi',
      bgStart: '#3b1d5e',
      bgEnd: '#1b1030',
      accent: '#f59f00',
      iconType: 'chai'
    }
  },
  {
    id: 'delhi-step-3',
    correctPosition: 3,
    timeTag: 'Akshardham',
    title: 'Humongous and Beautiful Temple',
    hasPhoto: true,
    cloudinaryPublicId: 'data/akshardham',
    directUrl: '',
    label: 'Akshardham Temple',
    caption: 'Best time spent with amazing scenery',
    fallbackArt: {
      title: 'Chandni Chowk',
      subtitle: 'Paranthe & Kulhad Lassi',
      bgStart: '#3b1d5e',
      bgEnd: '#1b1030',
      accent: '#f59f00',
      iconType: 'chai'
    }
  },
  {
    id: 'delhi-step-4',
    correctPosition: 4,
    timeTag: 'Juggernaut',
    title: 'Yummy South Indian ',
    hasPhoto: true,
    cloudinaryPublicId: 'data/juggernaut',
    directUrl: '',
    label: 'mmmmm ummmmm nom! nom! nom!',
    caption: 'Best time spent with amazing scenery',
    fallbackArt: {
      title: 'Chandni Chowk',
      subtitle: 'Paranthe & Kulhad Lassi',
      bgStart: '#3b1d5e',
      bgEnd: '#1b1030',
      accent: '#f59f00',
      iconType: 'chai'
    }
  },
  {
    id: 'delhi-step-5',
    correctPosition: 5,
    timeTag: 'Sarojni',
    title: 'Sarojni Market: Kya loge madam yaha sb milta h..',
    hasPhoto: true,
    cloudinaryPublicId: 'data/sarojni',
    directUrl: '',
    label: 'sarojni market',
    caption: 'Shop Shop',
    fallbackArt: {
      title: 'Chandni Chowk',
      subtitle: 'Paranthe & Kulhad Lassi',
      bgStart: '#3b1d5e',
      bgEnd: '#1b1030',
      accent: '#f59f00',
      iconType: 'chai'
    }
  },
  {
    id: 'delhi-step-6',
    correctPosition: 6,
    timeTag: 'Chandni Chowk',
    title: 'Chandni Chowk: Lal kila Dekha and paranthe wali gali mein puriya khai :D',
    hasPhoto: true,
    cloudinaryPublicId: 'data/chandni_chowk',
    directUrl: '',
    label: 'Chandni Chowk',
    caption: 'Best time spent with amazing scenery',
    fallbackArt: {
      title: 'Chandni Chowk',
      subtitle: 'Paranthe & Kulhad Lassi',
      bgStart: '#3b1d5e',
      bgEnd: '#1b1030',
      accent: '#f59f00',
      iconType: 'chai'
    }
  },
  {
    id: 'delhi-step-7',
    correctPosition: 7,
    timeTag: 'India Gate',
    title: 'India Gate, Indian Army Jindabaad, arey mama ji aap? hihihihi',
    hasPhoto: true,
    cloudinaryPublicId: 'data/india_gate',
    directUrl: '',
    label: 'India Gate',
    caption: 'Best time spent with amazing scenery',
    fallbackArt: {
      title: 'Chandni Chowk',
      subtitle: 'Paranthe & Kulhad Lassi',
      bgStart: '#3b1d5e',
      bgEnd: '#1b1030',
      accent: '#f59f00',
      iconType: 'chai'
    }
  },
  {
    id: 'delhi-step-8',
    correctPosition: 8,
    timeTag: 'Connaught Place',
    title: 'Connaught Place, What a night out, no alcohol - no dancing, Amazing Night life in Delhi',
    hasPhoto: true,
    cloudinaryPublicId: 'data/connaught_place',
    directUrl: '',
    label: 'Connaught Place',
    caption: 'Best time spent with amazing scenery',
    fallbackArt: {
      title: 'Chandni Chowk',
      subtitle: 'Paranthe & Kulhad Lassi',
      bgStart: '#3b1d5e',
      bgEnd: '#1b1030',
      accent: '#f59f00',
      iconType: 'chai'
    }
  },
  {
    id: 'delhi-step-9',
    correctPosition: 9,
    timeTag: 'The accident',
    title: 'The accident, balli bhaiya teri b.. Flying Auto',
    hasPhoto: true,
    cloudinaryPublicId: 'data/accident',
    directUrl: '',
    label: 'The accident',
    caption: 'Delhi Trip ended with a banger',
    fallbackArt: {
      title: 'Chandni Chowk',
      subtitle: 'Paranthe & Kulhad Lassi',
      bgStart: '#3b1d5e',
      bgEnd: '#1b1030',
      accent: '#f59f00',
      iconType: 'chai'
    }
  }
];

// Deterministic initial scrambled order for Level 3 so it never starts already solved
export const INITIAL_SCRAMBLED_DELHI_IDS = [
  'delhi-step-9',
  'delhi-step-7',
  'delhi-step-1',
  'delhi-step-4',
  'delhi-step-8',
  'delhi-step-6',
  'delhi-step-2',
  'delhi-step-5',
  'delhi-step-3',

];