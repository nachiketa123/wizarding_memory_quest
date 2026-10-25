import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Wand2,
  Unlock,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  X,
  Volume2,
  VolumeX,
  KeyRound,
  Gift,
  QrCode,
  Info,
  Compass
} from 'lucide-react';
import { AUTH_CREDENTIALS } from '../../src/App';

// import CSS file(s)
import './App2.css'

// import Component(s)
import CharacterBoxPuzzleCard from './components/CharacterBoxPuzzleCard/CharacterBoxPuzzleCard';
import PhotoCharacterBoxPuzzleCard from './components/PhotoCharacterBoxPuzzleCard/PhotoCharacterBoxPuzzleCard';
import MagicalRewardQrCode from './components/MagicalRewardQrCode/MagicalRewardQrCode';
import MatchCard from './components/MatchCard/MatchCard';
import SequenceGameCard from './components/SequenceGameCard/SequenceGameCard';
import VerticalPhotoGallery from './components/VerticalPhotoGallery/VerticalPhotoGallery';
import WesternToiletFlushWidget from './components/WesternToiletFlushWidget/WesternToiletFlushWidget';

// enable demo_auto_fill_button
const isDemoEnabled = import.meta.env.VITE_ENABLE_DEMO === 'true';

// import data
import { 
  LEVEL_1_CARDS_CONFIG, 
  LEVEL_2_BOTTOM_CARDS, 
  LEVEL_2_UPPER_CARDS, 
  LEVEL_2_MIDDLE_CARDS,
  LEVEL_2_END_CARDS,
  LEVEL_2_GALLERY_PHOTOS,
  LEVEL_3_DELHI_SEQUENCE,
  INITIAL_SCRAMBLED_DELHI_IDS
 } from './config/constants/data';

//  import sounds
import soundEngine from './config/soundConfig/WizardingSoundEngine'; 

//import utilities
import {resolveCloudinaryPhotoUrl} from './config/cloudinaryConfig';

/* ============================================================================
 * 10. MAIN APPLICATION COMPONENT
 * ============================================================================ */
function App() {
  // Views: 0 = Login, 1 = Welcome, 2 = Level 1 ("Blast from the Past"),
  //        3 = Level 2 ("Match it"), 4 = Level 3 ("Delhi Trip"), 5 = Final Reward
  const [currentView, setCurrentView] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showConfigGuide, setShowConfigGuide] = useState(false);

  // Magical Spell Transition Overlay State
  const [spellOverlay, setSpellOverlay] = useState({
    active: false,
    type: 'portal', // 'portal' | 'correct' | 'wrong'
    spellTitle: '',
    message: ''
  });

  // View 0: Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // View 1: Welcome Screen Magic Keyword State
  const [magicKeywordInput, setMagicKeywordInput] = useState('MISCHIEF MANAGED');

  // View 2 (Level 1 - "Blast from the Past"): State for 4 CharacterBoxPuzzleCards
  const createInitialLevel1State = useCallback(() => {
    const initialValues = {};
    const initialStatuses = {};
    LEVEL_1_CARDS_CONFIG.forEach((card) => {
      initialValues[card.id] = Array.from({ length: card.answer.length }).map(
        (_, i) => card.prefilledIndices?.[i] || ''
      );
      initialStatuses[card.id] = 'idle';
    });
    return { values: initialValues, statuses: initialStatuses };
  }, []);

  const [level1Values, setLevel1Values] = useState(
    () => createInitialLevel1State().values
  );
  const [level1Statuses, setLevel1Statuses] = useState(
    () => createInitialLevel1State().statuses
  );

  // View 3 (Level 2 - "Match it"): State for VerticalPhotoGallery & Card Placements
  const allMatchCards = [...LEVEL_2_UPPER_CARDS, ...LEVEL_2_MIDDLE_CARDS ,...LEVEL_2_BOTTOM_CARDS, ...LEVEL_2_END_CARDS];
  const createInitialLevel2Placements = useCallback(() => {
    const map = {};
    allMatchCards.forEach((c) => {
      map[c.id] = null;
    });
    return map;
  }, []);

  const [level2Placements, setLevel2Placements] = useState(() =>
    createInitialLevel2Placements()
  );
  const [level2Validation, setLevel2Validation] = useState({});
  const [selectedGalleryPhotoId, setSelectedGalleryPhotoId] = useState(null);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [isToiletFlushing, setIsToiletFlushing] = useState(false);
  const [flushedGallerySnapshot, setFlushedGallerySnapshot] = useState([]);
  const [hasFlushedCurrentAttempt, setHasFlushedCurrentAttempt] = useState(false);
  const [level2AttemptResult, setLevel2AttemptResult] = useState(null); // null | 'correct' | 'wrong'

  // View 4 (Level 3 - "Delhi Trip"): State for Sequence Tiles
  const createInitialLevel3Items = useCallback(() => {
    return INITIAL_SCRAMBLED_DELHI_IDS.map((id) =>
      LEVEL_3_DELHI_SEQUENCE.find((item) => item.id === id)
    );
  }, []);

  const [level3Items, setLevel3Items] = useState(() =>
    createInitialLevel3Items()
  );
  const [level3Status, setLevel3Status] = useState('idle'); // 'idle' | 'correct' | 'wrong'
  const [qrPageError, setQrPageError] = useState('');

  // Inject Bootstrap 5 CSS + Google Fonts for Harry Potter Vibe
  useEffect(() => {
    const id = 'hp-bootstrap-fonts-link';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href =
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
      document.head.prepend(link);
    }
  }, []);

  // Trigger Harry Potter Magical Transition Overlay
  const triggerMagicalTransition = (
    type,
    spellTitle,
    message,
    nextView = null,
    duration = 1650
  ) => {
    if (type === 'correct' || type === 'portal') {
      soundEngine.playChime('success');
    } else {
      soundEngine.playChime('error');
    }

    setSpellOverlay({
      active: true,
      type,
      spellTitle,
      message
    });

    setTimeout(() => {
      if (nextView !== null) {
        setCurrentView(nextView);
      }
      setSpellOverlay((prev) => ({ ...prev, active: false }));
    }, duration);
  };

  /* --------------------------------------------------------------------------
   * RESET & BACK NAVIGATION HANDLERS (Required on All Screens)
   * -------------------------------------------------------------------------- */
  const resetLevel1 = useCallback(() => {
    const fresh = createInitialLevel1State();
    setLevel1Values(fresh.values);
    setLevel1Statuses(fresh.statuses);
    soundEngine.playChime('sparkle');
  }, [createInitialLevel1State]);

  const resetLevel2 = useCallback(() => {
    setLevel2Placements(createInitialLevel2Placements());
    setLevel2Validation({});
    setSelectedGalleryPhotoId(null);
    setIsToiletFlushing(false);
    setFlushedGallerySnapshot([]);
    setHasFlushedCurrentAttempt(false);
    setLevel2AttemptResult(null);
    soundEngine.playChime('sparkle');
  }, [createInitialLevel2Placements]);

  const resetLevel3 = useCallback(() => {
    setLevel3Items(createInitialLevel3Items());
    setLevel3Status('idle');
    soundEngine.playChime('sparkle');
  }, [createInitialLevel3Items]);

  const resetLevelQR = useCallback(() =>{
    setQrPageError('')
  },[])

  const handleResetCurrentScreen = () => {
    if (currentView === 0) {
      setUsername('');
      setPassword('');
      setLoginError('');
    } else if (currentView === 1) {
      setMagicKeywordInput('MISCHIEF MANAGED');
    } else if (currentView === 2) {
      resetLevel1();
    } else if (currentView === 3) {
      resetLevel2();
    } else if (currentView === 4) {
      resetLevel3();
    } else if (currentView === 5) {
      resetLevelQR();
    }
  };

  // Back button resets current screen and goes to previous level (and resets that level so it's fresh when visited)
  const handleBackNavigation = () => {
    if (currentView <= 0) return;
    const targetView = currentView - 1;
    if (currentView === 2 || targetView === 2) resetLevel1();
    if (currentView === 3 || targetView === 3) resetLevel2();
    if (currentView === 4 || targetView === 4) resetLevel3();

    triggerMagicalTransition(
      'portal',
      'Time-Turner Reversal!',
      'Returning to the previous enchanted chamber...',
      targetView,
      950
    );
  };

  /* --------------------------------------------------------------------------
   * VIEW 0: LOGIN HANDLER
   * -------------------------------------------------------------------------- */
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (
      cleanUser === AUTH_CREDENTIALS.username.toLowerCase() &&
      cleanPass === AUTH_CREDENTIALS.password
    ) {
      setLoginError('');
      triggerMagicalTransition(
        'correct',
        'Alohomora! Portrait Hole Unlocked',
        'Welcome inside the Chamber of Shared Memories...',
        1,
        1500
      );
    } else {
      setLoginError(
        'The Fat Lady shakes her head! Invalid wizard credentials. (Try username: potterhead / password: alohomora2026)'
      );
      triggerMagicalTransition(
        'wrong',
        'Colloportus! Access Denied',
        'Password rejected by the Portrait Guardian!',
        null,
        1300
      );
    }
  };

  /* --------------------------------------------------------------------------
   * VIEW 2 (LEVEL 1): "Blast from the Past" COMBINED ANSWER CHECKER
   * -------------------------------------------------------------------------- */
  // Validates a single card and returns boolean
  const checkSingleLevel1Card = (card) => {
    const charArray = level1Values[card.id] || [];
    const combinedWord = charArray.join('').toUpperCase();
    return combinedWord === card.answer.toUpperCase();
  };

  // Combines results across all 4 cards; advances only if all 4 are right
  const handleCheckLevel1Answers = () => {
    const updatedStatuses = {};
    let allCorrect = true;

    LEVEL_1_CARDS_CONFIG.forEach((card) => {
      const isCardRight = checkSingleLevel1Card(card);
      updatedStatuses[card.id] = isCardRight ? 'correct' : 'wrong';
      if (!isCardRight) {
        allCorrect = false;
      }
    });

    setLevel1Statuses(updatedStatuses);

    if (allCorrect) {
      triggerMagicalTransition(
        'correct',
        'Lumos Maxima! All 4 Memory Runes Unlocked!',
        'Every inside joke from "Blast from the Past" is spot on! Advancing to Level 2: Match it...',
        3,
        1800
      );
    } else {
      triggerMagicalTransition(
        'wrong',
        'Finite Incantatem! Some Runes Are Incorrect',
        'Check the crimson-highlighted cards or click the Hint icon on any card!',
        null,
        1500
      );
    }
  };

  // Demo helper to auto-fill Level 1 answers for instant testing
  const autoFillLevel1Correct = () => {
    const filled = {};
    LEVEL_1_CARDS_CONFIG.forEach((card) => {
      filled[card.id] = card.answer.split('');
    });
    setLevel1Values(filled);
    soundEngine.playChime('sparkle');
  };

  /* --------------------------------------------------------------------------
   * VIEW 3 (LEVEL 2): "Match it" DRAG-AND-DROP & WESTERN TOILET FLUSH CHECKER
   * -------------------------------------------------------------------------- */
  // Compute which photos are currently still in VerticalPhotoGallery
  const placedPhotoIds = Object.values(level2Placements).filter(Boolean);
  const availableGalleryPhotos = hasFlushedCurrentAttempt
    ? []
    : LEVEL_2_GALLERY_PHOTOS.filter((p) => !placedPhotoIds.includes(p.id));

  const handleDropPhotoIntoCard = (cardId, photoId) => {
    if (isToiletFlushing) return;
    setLevel2Placements((prev) => {
      const next = { ...prev };
      // If this photo was already placed in another card, remove it from there first
      Object.keys(next).forEach((k) => {
        if (next[k] === photoId) next[k] = null;
      });
      next[cardId] = photoId;
      return next;
    });
    setLevel2Validation((prev) => ({ ...prev, [cardId]: undefined }));
    setSelectedGalleryPhotoId(null);
    soundEngine.playChime('sparkle');
  };

  const handleRemovePhotoFromCard = (cardId) => {
    if (isToiletFlushing) return;
    setLevel2Placements((prev) => ({
      ...prev,
      [cardId]: null
    }));
    setLevel2Validation((prev) => ({ ...prev, [cardId]: undefined }));
    setHasFlushedCurrentAttempt(false);
    setLevel2AttemptResult(null);
  };

  const handleCheckLevel2WithToiletFlush = () => {
    if (isToiletFlushing) return;

    // 1. Capture remaining photos in VerticalPhotoGallery to animate them flushing down the Western Toilet
    const remainingToFlush = LEVEL_2_GALLERY_PHOTOS.filter(
      (p) => !placedPhotoIds.includes(p.id)
    );
    setFlushedGallerySnapshot(remainingToFlush);
    setIsToiletFlushing(true);
    setLevel2AttemptResult(null);

    // 2. Play synthesized Western Toilet Flush sound effect
    soundEngine.playToiletFlush();

    // 3. After flush animation completes (2.6s), evaluate all cards & show Right or Wrong result
    setTimeout(() => {
      setIsToiletFlushing(false);
      setHasFlushedCurrentAttempt(true);

      const newValidation = {};
      let allMatchedCorrectly = true;

      allMatchCards.forEach((card) => {
        const placedId = level2Placements[card.id];
        const isMatch = placedId === card.expectedPhotoId;
        newValidation[card.id] = isMatch ? 'correct' : 'wrong';
        if (!isMatch) {
          allMatchedCorrectly = false;
        }
      });

      setLevel2Validation(newValidation);

      if (allMatchedCorrectly) {
        setLevel2AttemptResult('correct');
        triggerMagicalTransition(
          'correct',
          'Wingardium Leviosa! Every Memory Matched!',
          'The decoy bloopers have been flushed to the Ministry sewers! Moving to Level 3: Delhi Trip...',
          4,
          2100
        );
      } else {
        setLevel2AttemptResult('wrong');
        triggerMagicalTransition(
          'wrong',
          'Confundo! Some Photo Matches Are Wrong!',
          'Click "Reset & Refill Gallery" below to bring the flushed pictures back up and try again!',
          null,
          1650
        );
      }
    }, 2600);
  };

  const autoFillLevel2Correct = () => {
    const correctMap = {};
    allMatchCards.forEach((card) => {
      correctMap[card.id] = card.expectedPhotoId;
    });
    setLevel2Placements(correctMap);
    setHasFlushedCurrentAttempt(false);
    setLevel2AttemptResult(null);
    setLevel2Validation({});
    soundEngine.playChime('sparkle');
  };

  /* --------------------------------------------------------------------------
   * VIEW 4 (LEVEL 3): "Delhi Trip" SEQUENCE CHECKER
   * -------------------------------------------------------------------------- */
  const handleCheckLevel3Sequence = () => {
    const isSequenceRight = level3Items.every(
      (item, idx) => item.correctPosition === idx + 1
    );

    if (isSequenceRight) {
      setLevel3Status('correct');
      triggerMagicalTransition(
        'correct',
        'Expecto Patronum! Delhi Trip Timeline Restored!',
        'You remembered every chaotic stop of our Delhi adventure! Unlocking your Grand Reward...',
        5,
        2000
      );
    } else {
      setLevel3Status('wrong');
      triggerMagicalTransition(
        'wrong',
        'Reparo Needed! The Timeline Is Scrambled',
        'Some stops on the Delhi Trip are out of chronological order. Drag the crimson tiles to swap them!',
        null,
        1600
      );
    }
  };

  const autoSortLevel3Correct = () => {
    const sorted = [...LEVEL_3_DELHI_SEQUENCE].sort(
      (a, b) => a.correctPosition - b.correctPosition
    );
    setLevel3Items(sorted);
    setLevel3Status('idle');
    soundEngine.playChime('sparkle');
  };

  return (
    <div className="hp-app-shell min-vh-100 d-flex flex-column position-relative">
      {/* /}

      {/* Enchanted Starry Particle Layer */}
      <div className="hp-starlight-bg" />

      {/* ====================================================================
       * TOP WIZARDING NAVIGATION & LEVEL PROGRESS BAR
       * ==================================================================== */}
      <header className="hp-navbar sticky-top py-2 px-3">
        <div className="container-fluid d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center gap-2">
            <Wand2 size={22} className="text-warning" />
            <span className="hp-cinzel fw-bold hp-gold-text fs-6">
              Hogwarts Chronicles of Friendship
            </span>
          </div>

          {/* Step Indicator Pills */}
          <div className="d-none d-lg-flex align-items-center gap-2 small">
            {[
              { id: 0, label: '0. Login' },
              { id: 1, label: '1. Welcome' },
              { id: 2, label: '2. Blast from the Past' },
              { id: 3, label: '3. Match it' },
              { id: 4, label: '4. Delhi Trip' },
              { id: 5, label: '5. Reward' }
            ].map((step) => (
              <span
                key={step.id}
                className={`badge rounded-pill px-2 py-1 ${
                  currentView === step.id
                    ? 'bg-warning text-dark fw-bold'
                    : currentView > step.id
                    ? 'bg-success bg-opacity-75 text-light'
                    : 'bg-secondary bg-opacity-25 text-light text-opacity-50'
                }`}
              >
                {step.label}
              </span>
            ))}
          </div>

          {/* Global Controls: Back, Reset, Cloudinary Info, Sound Toggle */}
          <div className="d-flex align-items-center gap-2">
            {currentView > 0 && (
              <button
                type="button"
                onClick={handleBackNavigation}
                className="btn btn-sm hp-outline-btn d-inline-flex align-items-center gap-1"
                title="Go back to previous level (resets level state)"
              >
                <ArrowLeft size={15} />
                <span>Back</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleResetCurrentScreen}
              className="btn btn-sm hp-outline-btn d-inline-flex align-items-center gap-1"
              title="Reset all cards on this screen to initial state"
            >
              <RotateCcw size={15} />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={() => setShowConfigGuide(true)}
              className="btn btn-sm hp-hint-btn d-inline-flex align-items-center gap-1"
              title="How to plug in your Cloudinary photos & custom answers"
            >
              <Info size={15} />
              <span className="d-none d-sm-inline">Cloudinary & Answers</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const nextMuted = !isMuted;
                setIsMuted(nextMuted);
                soundEngine.muted = nextMuted;
              }}
              className="btn btn-sm hp-outline-btn"
              title={isMuted ? 'Unmute Magical Audio' : 'Mute Magical Audio'}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* ====================================================================
       * MAIN CONTENT VIEWPORT
       * ==================================================================== */}
      <main className="container py-4 flex-grow-1 position-relative" style={{ zIndex: 2 }}>
        {/* ------------------------------------------------------------------
         * VIEW 0: LOGIN SCREEN
         * ------------------------------------------------------------------ */}
        {currentView === 0 && (
          <div className="row justify-content-center align-items-center min-vh-75 py-4">
            <div className="col-12 col-sm-10 col-md-7 col-lg-5">
              <div className="card hp-parchment-card p-3 p-md-4 shadow-lg">
                <div className="text-center mb-4">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-3 border border-warning bg-dark">
                    <KeyRound size={32} className="text-warning" />
                  </div>
                  <h2 className="hp-cinzel hp-gold-text fw-bold mb-1">
                    The Portrait Entrance
                  </h2>
                  <p className="hp-serif fs-5 text-light text-opacity-85 mb-0">
                    “Speak the secret credentials to enter ourPensieve of Memories”
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit}>
                  <div className="mb-3">
                    <label className="form-label small text-warning fw-semibold">
                      Wizard Username
                    </label>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Enter username (e.g. potterhead)"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small text-warning fw-semibold">
                      Secret Incantation (Password)
                    </label>
                    <input
                      type="password"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Enter password (e.g. alohomora2026)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {loginError && (
                    <div className="alert alert-danger py-2 small mb-3">
                      {loginError}
                    </div>
                  )}

                  <div className="d-grid gap-2 mt-4">
                    <button
                      type="submit"
                      className="btn hp-magic-btn py-2 fs-6 d-flex justify-content-center align-items-center gap-2"
                    >
                      <Unlock size={18} />
                      <span>Login to the Magical Quest</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUsername(AUTH_CREDENTIALS.username);
                        setPassword(AUTH_CREDENTIALS.password);
                        setLoginError('');
                        soundEngine.playChime('sparkle');
                      }}
                      className="btn btn-sm hp-outline-btn mt-1"
                    >
                      ✨ Quick-Fill Demo Credentials ({AUTH_CREDENTIALS.username} /{' '}
                      {AUTH_CREDENTIALS.password})
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
         * VIEW 1: WELCOME SCREEN
         * ------------------------------------------------------------------ */}
        {currentView === 1 && (
          <div className="row justify-content-center py-3">
            <div className="col-12 col-lg-9">
              <div className="card hp-parchment-card p-4 p-md-5 text-center shadow-lg">
                <div className="mb-3">
                  <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold">
                    ★ Voldemort's Custom Edition ★
                  </span>
                </div>

                <h1 className="hp-cinzel hp-gold-text fw-bold mb-3">
                  Welcome to Our Pensieve of Inside Jokes!
                </h1>

                <div className="hp-serif fs-4 text-light text-opacity-90 mx-auto mb-4" style={{ maxWidth: '720px' }}>
                  <p className="mb-3">
                    “From an awkward hi to chai gumtis from cafe hopping to teaing, from laughing our hearts out to crying on each others shoulders — every level ahead is locked with a piece of our friendship.”
                  </p>
                  <p className="mb-0 text-warning">
                    Solve all three enchanted memory trials to unlock the final vault waiting for you at the end! you have put your name in the Goblet of fire now, let your destiny decide your path..
                  </p>
                </div>

                {/* Basic Instruction Info Cards */}
                <div className="row g-3 text-start mb-4">
                  <div className="col-12 col-md-4">
                    <div className="p-3 rounded-3 bg-dark bg-opacity-75 border border-warning border-opacity-25 h-100">
                      <div className="text-warning fw-bold small mb-1">
                        LEVEL 1 • BLAST FROM THE PAST - Fight the dragon
                      </div>
                      <p className="small text-light text-opacity-85 mb-0">
                        Memory cards with prefilled locked letters and clickable Hint whispers.
                      </p>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="p-3 rounded-3 bg-dark bg-opacity-75 border border-warning border-opacity-25 h-100">
                      <div className="text-warning fw-bold small mb-1">
                        LEVEL 2 • MATCH IT - Swim deep into the black lake
                      </div>
                      <p className="small text-light text-opacity-85 mb-0">
                        Drag photos from the PhotoGallery into memory cards — then flush the leftover bloopers down the Western Toilet!
                      </p>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="p-3 rounded-3 bg-dark bg-opacity-75 border border-warning border-opacity-25 h-100">
                      <div className="text-warning fw-bold small mb-1">
                        LEVEL 3 • DELHI TRIP - Triwizard Cup Awaits You
                      </div>
                      <p className="small text-light text-opacity-85 mb-0">
                        Drag and swap the rectangular timeline tiles vertically next to fixed numbers to unlock your reward.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Magic Keyword Input & Begin Button */}
                <div className="mx-auto mb-3" style={{ maxWidth: '460px' }}>
                  <label className="form-label small text-warning fw-semibold">
                    Chant the Magic Keyword to Begin:
                  </label>
                  <input
                    type="text"
                    value={magicKeywordInput}
                    onChange={(e) => setMagicKeywordInput(e.target.value)}
                    className="form-control text-center fw-bold hp-cinzel bg-dark text-warning border-warning"
                  />
                </div>

                <div className="d-flex flex-wrap justify-content-center gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() =>
                      triggerMagicalTransition(
                        'portal',
                        `“${magicKeywordInput || 'Alohomora'}!”`,
                        'The Marauder’s Parchment unfolds to Level 1: Blast from the Past...',
                        2,
                        1500
                      )
                    }
                    className="btn hp-magic-btn px-4 py-3 fs-5 d-inline-flex align-items-center gap-2"
                  >
                    <Sparkles size={20} />
                    <span>
                      Begin Quest ({magicKeywordInput || 'Alohomora'})
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
         * VIEW 2: LEVEL 1 — "Blast from the Past" (4 Reusable OTP Cards)
         * ------------------------------------------------------------------ */}
        {currentView === 2 && (
          <div>
            {/* Level Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
              <div>
                <span className="badge bg-warning text-dark fw-bold mb-1">
                  LEVEL 1 OF 3 • OTP MEMORY RUNES
                </span>
                <h2 className="hp-cinzel hp-gold-text fw-bold mb-0">
                  Blast from the Past
                </h2>
                <p className="small text-light text-opacity-75 mb-0">
                  Fill in the missing alphanumeric characters (A–Z, 0–9) in all 4 cards. Locked gold runes are prefilled!
                </p>
              </div>

              <div className="d-flex flex-wrap gap-2">
                {isDemoEnabled && <button
                  type="button"
                  onClick={autoFillLevel1Correct}
                  className="btn btn-sm hp-outline-btn"
                  title="Demo helper: Fill all 4 cards with the right answers"
                >
                  ✨ Demo: Auto-Fill Answers
                </button>
                }
                <button
                  type="button"
                  onClick={resetLevel1}
                  className="btn btn-sm hp-outline-btn d-inline-flex align-items-center gap-1"
                >
                  <RotateCcw size={14} /> Reset Cards
                </button>
              </div>
            </div>

            {/* 4 Reusable CharacterBoxPuzzleCard Components in a Responsive Grid */}
            <div className="row g-4 mb-4">
              {LEVEL_1_CARDS_CONFIG.map((card, index) => {
                const isPhotoCard = Boolean(card.hasPhoto);
                const CardComponent = isPhotoCard
                  ? PhotoCharacterBoxPuzzleCard
                  : CharacterBoxPuzzleCard;

                return (
                  <div key={card.id} className="col-12 col-md-6">
                    <CardComponent
                      card={card}
                      values={level1Values[card.id] || []}
                      onChange={(newVals) => {
                        setLevel1Values((prev) => ({
                          ...prev,
                          [card.id]: newVals
                        }));
                        setLevel1Statuses((prev) => ({
                          ...prev,
                          [card.id]: 'idle'
                        }));
                      }}
                      validationState={level1Statuses[card.id] || 'idle'}
                      onTriggerHintSound={() => soundEngine.playChime('sparkle')}
                      onOpenLightbox={(photoCard) => setLightboxPhoto(photoCard)}
                    />
                  </div>
                );
              })}
            </div>

            {/* Bottom Action Bar */}
            <div className="text-center py-3">
              <button
                type="button"
                onClick={handleCheckLevel1Answers}
                className="btn hp-magic-btn px-5 py-3 fs-5 d-inline-flex align-items-center gap-2"
              >
                <Wand2 size={20} />
                <span>Check All 4 Answers & Cast Spell</span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
         * VIEW 3: LEVEL 2 — "Match it" (VerticalPhotoGallery + Cards + Toilet Flush)
         * ------------------------------------------------------------------ */}
        {currentView === 3 && (
          <div>
            {/* Level Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
              <div>
                <span className="badge bg-warning text-dark fw-bold mb-1">
                  LEVEL 2 OF 3 • PHOTOGRAPH MATCHING & TOILET FLUSH
                </span>
                <h2 className="hp-cinzel hp-gold-text fw-bold mb-0">
                  Match it
                </h2>
                <p className="small text-light text-opacity-75 mb-0">
                  Drag pictures from the left PhotoGallery into the matching cards on the right. When you check answers, leftover gallery photos get flushed down the Western Toilet!
                </p>
              </div>

              <div className="d-flex flex-wrap gap-2">
                {isDemoEnabled &&<button
                  type="button"
                  onClick={autoFillLevel2Correct}
                  className="btn btn-sm hp-outline-btn"
                >
                  ✨ Demo: Auto-Match All 6 Cards
                </button>}
                <button
                  type="button"
                  onClick={resetLevel2}
                  className="btn btn-sm hp-outline-btn d-inline-flex align-items-center gap-1"
                >
                  <RotateCcw size={14} /> Reset & Refill Gallery
                </button>
              </div>
            </div>

            {/* Wrong Answer Banner with Reset & Re-attempt Button after Toilet Flush */}
            {level2AttemptResult === 'wrong' && (
              <div className="alert alert-danger d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 border-danger">
                <div>
                  <strong>Mischief Not Yet Managed!</strong> Some cards have the wrong photograph (or are still empty), and the remaining gallery photos were flushed!
                </div>
                <button
                  type="button"
                  onClick={resetLevel2}
                  className="btn btn-sm btn-warning fw-bold d-inline-flex align-items-center gap-1"
                >
                  <RotateCcw size={15} />
                  <span>Reset & Bring Photos Back Up to Gallery</span>
                </button>
              </div>
            )}

            {/* Main Split Layout: Left = VerticalPhotoGallery, Right = Upper `w` Cards + Bottom 2 Cards */}
            <div className="row g-3 align-items-stretch">
              {/* Left Column: VerticalPhotoGallery */}
              <div className="col-12 col-md-4 col-lg-3">
                <VerticalPhotoGallery
                  photos={availableGalleryPhotos}
                  selectedPhotoId={selectedGalleryPhotoId}
                  onSelectPhoto={setSelectedGalleryPhotoId}
                  onDragStartPhoto={(id) => setSelectedGalleryPhotoId(id)}
                  onOpenLightbox={(photo) => setLightboxPhoto(photo)}
                  isFlushing={isToiletFlushing}
                />
              </div>

              {/* Right Column: Upper Part (4 Text+Drop Cards) + Bottom Part (2 Title+Drop-Only Cards) */}
              <div className="col-12 col-md-8 col-lg-9 d-flex flex-column justify-content-between">
                <div>
                  {/* Upper Section: `w` (4) Cards with Left Text + Right Photo Box */}
                  <div className="mb-2 d-flex justify-content-between align-items-center">
                    <span className="small text-warning fw-bold text-uppercase">
                      Upper Section • Match the Story Clue with its Photograph ({LEVEL_2_UPPER_CARDS.length} Cards)
                    </span>
                  </div>
                  <div className="row g-3 mb-4">
                    {LEVEL_2_UPPER_CARDS.map((card) => {
                      const placedId = level2Placements[card.id];
                      const placedObj = LEVEL_2_GALLERY_PHOTOS.find(
                        (p) => p.id === placedId
                      );
                      return (
                        <div key={card.id} className="col-12 col-xl-6">
                          <MatchCard
                            card={card}
                            variant="split"
                            placedPhoto={placedObj}
                            onDropPhotoIntoCard={handleDropPhotoIntoCard}
                            onRemovePhotoFromCard={handleRemovePhotoFromCard}
                            onOpenLightbox={setLightboxPhoto}
                            selectedGalleryPhotoId={selectedGalleryPhotoId}
                            validationStatus={level2Validation[card.id]}
                          />
                        </div>
                      );
                    })}
                  </div>
                  {/* Middle Section: `w` (4) Cards with Left Text + Right Photo Box */}
                  <div className="mb-2 d-flex justify-content-between align-items-center">
                    <span className="small text-warning fw-bold text-uppercase">
                      Middle Section • Match the Story Clue with its Photograph ({LEVEL_2_MIDDLE_CARDS.length} Cards)
                    </span>
                  </div>
                  <div className="row g-3 mb-4">
                    {LEVEL_2_MIDDLE_CARDS.map((card) => {
                      const placedId = level2Placements[card.id];
                      const placedObj = LEVEL_2_GALLERY_PHOTOS.find(
                        (p) => p.id === placedId
                      );
                      return (
                        <div key={card.id} className="col-12 col-xl-6">
                          <MatchCard
                            card={card}
                            variant="split"
                            placedPhoto={placedObj}
                            onDropPhotoIntoCard={handleDropPhotoIntoCard}
                            onRemovePhotoFromCard={handleRemovePhotoFromCard}
                            onOpenLightbox={setLightboxPhoto}
                            selectedGalleryPhotoId={selectedGalleryPhotoId}
                            validationStatus={level2Validation[card.id]}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Section: 2 Side-by-Side Cards with Main Title ONLY and Drop Box */}
                  <div className="mb-2">
                    <span className="small text-warning fw-bold text-uppercase">
                      Bottom Section • Special Title-Only Photo Drop Cards (Left & Right)
                    </span>
                  </div>
                  <div className="row g-3 mb-4">
                    {LEVEL_2_BOTTOM_CARDS.map((card) => {
                      const placedId = level2Placements[card.id];
                      const placedObj = LEVEL_2_GALLERY_PHOTOS.find(
                        (p) => p.id === placedId
                      );
                      return (
                        <div key={card.id} className="col-12 col-md-6">
                          <MatchCard
                            card={card}
                            variant="box-only"
                            placedPhoto={placedObj}
                            onDropPhotoIntoCard={handleDropPhotoIntoCard}
                            onRemovePhotoFromCard={handleRemovePhotoFromCard}
                            onOpenLightbox={setLightboxPhoto}
                            selectedGalleryPhotoId={selectedGalleryPhotoId}
                            validationStatus={level2Validation[card.id]}
                          />
                        </div>
                      );
                    })}
                  </div>
                  {/* END Section: 2 Side-by-Side Cards with Main Title ONLY and Drop Box */}
                  <div className="mb-2">
                    <span className="small text-warning fw-bold text-uppercase">
                      Last Section • Special Title-Only Photo Drop Cards (Left & Right)
                    </span>
                  </div>
                  <div className="row g-3 mb-4">
                    {LEVEL_2_END_CARDS.map((card) => {
                      const placedId = level2Placements[card.id];
                      const placedObj = LEVEL_2_GALLERY_PHOTOS.find(
                        (p) => p.id === placedId
                      );
                      return (
                        <div key={card.id} className="col-12 col-md-6">
                          <MatchCard
                            card={card}
                            variant="box-only"
                            placedPhoto={placedObj}
                            onDropPhotoIntoCard={handleDropPhotoIntoCard}
                            onRemovePhotoFromCard={handleRemovePhotoFromCard}
                            onOpenLightbox={setLightboxPhoto}
                            selectedGalleryPhotoId={selectedGalleryPhotoId}
                            validationStatus={level2Validation[card.id]}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Outside Cards Check Button (Triggers Western Toilet Seat Flush + Sound) */}
                <div className="text-center py-2">
                  <button
                    type="button"
                    disabled={isToiletFlushing}
                    onClick={handleCheckLevel2WithToiletFlush}
                    className="btn hp-magic-btn px-4 py-3 fs-6 d-inline-flex align-items-center gap-2"
                  >
                    <Wand2 size={19} />
                    <span>
                      {isToiletFlushing
                        ? 'Flushing Remaining Gallery Photos...'
                        : 'Flush Leftover Photos & Check Matches'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Western Toilet Seat Animation at Bottom-Left */}
            <WesternToiletFlushWidget
              isVisible={isToiletFlushing}
              flushingPhotos={flushedGallerySnapshot}
            />
          </div>
        )}

        {/* ------------------------------------------------------------------
         * VIEW 4: LEVEL 3 — "Delhi Trip" (Single Card Sequence Game)
         * ------------------------------------------------------------------ */}
        {currentView === 4 && (
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <div>
                  <span className="badge bg-warning text-dark fw-bold mb-1">
                    LEVEL 3 OF 3 • FINAL CHRONOLOGICAL TRIAL
                  </span>
                  <h2 className="hp-cinzel hp-gold-text fw-bold mb-0">
                    Delhi Trip
                  </h2>
                  <p className="small text-light text-opacity-75 mb-0">
                    Arrange our Delhi Trip memories in the exact chronological sequence from 1 to 9!
                  </p>
                </div>

                <div className="d-flex flex-wrap gap-2">
                  {isDemoEnabled &&<button
                    type="button"
                    onClick={autoSortLevel3Correct}
                    className="btn btn-sm hp-outline-btn"
                  >
                    ✨ Demo: Auto-Order Sequence
                  </button>}
                  <button
                    type="button"
                    onClick={resetLevel3}
                    className="btn btn-sm hp-outline-btn d-inline-flex align-items-center gap-1"
                  >
                    <RotateCcw size={14} /> Reset Sequence
                  </button>
                </div>
              </div>

              {/* Single Reusable SequenceGameCard */}
              <SequenceGameCard
                title="The Great Delhi Trip Timeline"
                subtitle="Numbers 1 to 6 on the left are fixed. Drag the rectangular memory tiles vertically (or tap the Up/Down arrows) to swap them into the true sequence!"
                items={level3Items}
                onReorderItems={(newOrder) => {
                  setLevel3Items(newOrder);
                  setLevel3Status('idle');
                }}
                validationState={level3Status}
                onOpenLightbox={(photoItem) => setLightboxPhoto(photoItem)}
              />

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={handleCheckLevel3Sequence}
                  className="btn hp-magic-btn px-5 py-3 fs-5 d-inline-flex align-items-center gap-2"
                >
                  <Compass size={20} />
                  <span>Submit Delhi Trip Sequence</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
         * VIEW 5: FINAL (END) SCREEN — Reward with QR Code & Message
         * ------------------------------------------------------------------ */}
        {currentView === 5 && (
          <div className="row justify-content-center py-3">
            <div className="col-12 col-lg-8">
              <div className={`card hp-parchment-card p-4 p-md-5 text-center shadow-lg position-relative overflow-hidden  ${qrPageError===''?'':'hp-card-wrong'}`}>
                <div className="mb-2">
                  <span className="badge bg-success px-3 py-2 rounded-pill fw-bold">
                    ★ ALL 3 MEMORY TRIALS COMPLETED ★
                  </span>
                </div>

                <h1 className="hp-cinzel hp-gold-text fw-bold mb-2">
                  You Have Done it! Goblet of fire has chosen you, it never lies
                </h1>
                <p className="hp-serif fs-4 text-light text-opacity-90 mb-4">
                  “Congratulations! potter head, I hope you are ready for your reward after this long quest. Here is your enchanted reward!”
                </p>

                {/* QR Code Showcase */}
                <div className="my-3 d-flex flex-column align-items-center">
                  <MagicalRewardQrCode error={qrPageError} setError={(err)=>setQrPageError(err)} rewardText="https://gift.example.com/best-friend-forever-2026" />
                  <div className="mt-3 d-inline-flex align-items-center gap-2 text-warning small fw-semibold">
                    <QrCode size={16} />
                    {qrPageError==='' && <span>Scan Your Birthday Gift Voucher</span>}
                    {qrPageError!=='' && <span className='text-danger'>{qrPageError}</span>}
                  </div>
                </div>

                {/* Heartfelt Letter Card */}
                <div className="p-3 p-md-4 rounded-3 bg-dark bg-opacity-75 border border-warning border-opacity-50 text-start mx-auto my-3" style={{ maxWidth: '620px' }}>
                  <h6 className="hp-cinzel hp-gold-text mb-2 d-flex align-items-center gap-2">
                    <Gift size={18} /> An Special Note for an Special lady:
                  </h6>
                  <p className="hp-serif fs-5 mb-2 text-light">
                    No matter how many cities we move to or how busy life gets, you will always be the person I’d fallen with from a fu**ing Riksha :P, anyhow I really wish you all the happiness and health in your life. Be happy, Be yourself, DO NOT CHANGE specially AFTER MARRIAGE...
                  </p>
                  <p className="hp-serif fs-5 mb-0 text-warning">
                    Scan the QR code above for your surprise gift — and pack your bags for our next trip, hopefully!
                  </p>
                </div>

                <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      resetLevel1();
                      resetLevel2();
                      resetLevel3();
                      triggerMagicalTransition(
                        'portal',
                        'Obliviate & Replay!',
                        'Resetting all puzzles back to the Welcome Hall...',
                        1,
                        1200
                      );
                    }}
                    className="btn hp-magic-btn px-4 py-2 d-inline-flex align-items-center gap-2"
                  >
                    <RotateCcw size={16} />
                    <span>Replay Entire Quest</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ====================================================================
       * FULLSCREEN LIGHTBOX POPUP FOR LEVEL 2 PHOTOGRAPHS
       * Closes on clicking the Cross (X) button OR clicking outside the card
       * ==================================================================== */}
      {lightboxPhoto && (
        <div
          className="hp-lightbox-backdrop"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="card hp-parchment-card p-3 p-md-4 position-relative shadow-lg"
            style={{ maxWidth: '680px', width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxPhoto(null)}
              className="btn btn-sm btn-warning position-absolute top-0 end-0 m-3 rounded-circle p-2"
              aria-label="Close fullscreen popup"
            >
              <X size={18} />
            </button>

            <h5 className="hp-cinzel hp-gold-text mb-3 pe-5">
              {lightboxPhoto.label}
            </h5>

            <div className="text-center bg-dark rounded-3 p-2 mb-3">
              <img
                src={resolveCloudinaryPhotoUrl(lightboxPhoto, false)}
                alt={lightboxPhoto.label}
                className="img-fluid rounded"
                style={{ maxHeight: '65vh', objectFit: 'contain' }}
              />
            </div>

            <div className="d-flex flex-column justify-content-between align-items-center small text-light text-opacity-85">
              <span>{lightboxPhoto.caption}</span>
              <span className="text-warning">Click outside or press ✕ to close</span>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
       * CLOUDINARY & CUSTOMIZATION GUIDE MODAL
       * ==================================================================== */}
      {showConfigGuide && (
        <div
          className="hp-lightbox-backdrop"
          onClick={() => setShowConfigGuide(false)}
        >
          <div
            className="card hp-parchment-card p-3 p-md-4 position-relative shadow-lg"
            style={{ maxWidth: '720px', width: '100%', maxHeight: '85vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-warning border-opacity-25">
              <h5 className="hp-cinzel hp-gold-text mb-0">
                Cloudinary Setup & Demo Answers Guide
              </h5>
              <button
                type="button"
                onClick={() => setShowConfigGuide(false)}
                className="btn btn-sm btn-outline-warning"
              >
                <X size={16} />
              </button>
            </div>

            <div className="small text-light">
              <h6 className="text-warning fw-bold">1. How to Connect Your Cloudinary Pictures:</h6>
              <p className="mb-2">
                At the top of the code (and in <code>src/config/cloudinaryConfig.js</code> in the downloadable project zip), update <code>CLOUDINARY_CONFIG</code>:
              </p>
              <pre className="bg-dark p-2 rounded border border-secondary text-warning small mb-3">
{`export const CLOUDINARY_CONFIG = {
  cloudName: 'your_actual_cloud_name', // From Cloudinary Dashboard
  defaultTransformations: 'f_auto,q_auto,w_900,c_limit',
  rewardQrPublicId: 'my_folder/reward_qr_code'
};`}
              </pre>
              <p className="mb-3">
                Then put each uploaded photo’s <code>cloudinaryPublicId</code> in <code>LEVEL_2_GALLERY_PHOTOS</code>. The helper builds <code>https://res.cloudinary.com/&lt;cloudName&gt;/image/upload/...</code> automatically!
              </p>

              <h6 className="text-warning fw-bold">2. Current Demo Answers (for testing):</h6>
              <ul className="mb-0">
                <li>
                  <strong>Login:</strong> Username <code>potterhead</code> | Password <code>alohomora2026</code>
                </li>
                <li>
                  <strong>Level 1 ("Blast from the Past"):</strong> Card 1: <code>TAPRI</code> | Card 2: <code>CHOMU</code> | Card 3: <code>DL4S</code> | Card 4: <code>MANGO</code>
                </li>
                <li>
                  <strong>Level 2 ("Match it"):</strong> Upper 1 → <em>2 AM Kulhad Chai</em> | Upper 2 → <em>The Great Scooty Push</em> | Upper 3 → <em>Drenched Monsoon Trek</em> | Upper 4 → <em>Off-Key Rooftop Jam</em> | Bottom Left → <em>Campus VIP Sheru</em> | Bottom Right → <em>Unreserved Coach Adventure</em> (Leave the 2 Decoy Blooper photos in the gallery to watch them get flushed down the Western Toilet!).
                </li>
                <li>
                  <strong>Level 3 ("Delhi Trip"):</strong> Order from 06:15 AM Railway Station → 09:30 AM Chandni Chowk → 01:15 PM Rajiv Chowk → 04:00 PM Sarojini Nagar → 07:45 PM Hauz Khas → 11:30 PM India Gate.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
       * HARRY POTTER MAGICAL SPELL TRANSITION OVERLAY
       * ==================================================================== */}
      {spellOverlay.active && (
        <div
          className={`hp-spell-overlay ${
            spellOverlay.type === 'correct'
              ? 'hp-spell-overlay-correct'
              : spellOverlay.type === 'wrong'
              ? 'hp-spell-overlay-wrong'
              : 'hp-spell-overlay-portal'
          }`}
        >
          <div className="card hp-parchment-card p-4 text-center shadow-lg" style={{ maxWidth: '480px' }}>
            <div className="mb-2">
              {spellOverlay.type === 'correct' ? (
                <CheckCircle2 size={48} className="text-success" />
              ) : spellOverlay.type === 'wrong' ? (
                <XCircle size={48} className="text-danger" />
              ) : (
                <Sparkles size={48} className="text-warning" />
              )}
            </div>
            <h4 className="hp-cinzel hp-gold-text fw-bold mb-2">
              {spellOverlay.spellTitle}
            </h4>
            <p className="mb-0 text-light">{spellOverlay.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
