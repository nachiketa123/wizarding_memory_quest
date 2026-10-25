/* ============================================================================
 * 4. REUSABLE COMPONENT: CharacterBoxPuzzleCard (Level 1 OTP/PIN Style Card)
 * ============================================================================
 * Can be placed on any screen! Accepts:
 * - title, subtitle, answer, prefilledIndices ({ index: char }), hint
 * - values (array of chars), onChange(newValues), validationState ('idle' | 'correct' | 'wrong')
 * - Only allows a-z, A-Z, 0-9. Prefilled boxes are locked/disabled and cannot be deleted.
 * ============================================================================ */

import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Lock,
  HelpCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

//  import sounds
import soundEngine from '../../config/soundConfig/WizardingSoundEngine'; 


function CharacterBoxPuzzleCard({
  card,
  values,
  onChange,
  validationState,
  onTriggerHintSound
}) {
  const [showHint, setShowHint] = useState(false);
  const inputRefs = useRef([]);
  const length = card.answer.length;

  // Find next editable box index
  const focusNextEditable = (startIndex) => {
    for (let i = startIndex + 1; i < length; i++) {
      if (!card.prefilledIndices?.[i]) {
        inputRefs.current[i]?.focus();
        return;
      }
    }
  };

  // Find previous editable box index
  const focusPrevEditable = (startIndex) => {
    for (let i = startIndex - 1; i >= 0; i--) {
      if (!card.prefilledIndices?.[i]) {
        inputRefs.current[i]?.focus();
        return;
      }
    }
  };

  const handleBoxChange = (idx, rawValue) => {
    if (card.prefilledIndices?.[idx]) return; // Never overwrite locked prefilled char

    // Take the last typed character and validate alphanumeric a-z, A-Z, 0-9
    const lastChar = rawValue.slice(-1);
    if (lastChar === '') {
      const updated = [...values];
      updated[idx] = '';
      onChange(updated);
      return;
    }

    if (!/^[a-zA-Z0-9]$/.test(lastChar)) {
      return; // Strictly block symbols, spaces, or non-alphanumeric input
    }

    const updated = [...values];
    updated[idx] = lastChar.toUpperCase();
    onChange(updated);
    soundEngine.playChime('sparkle');
    focusNextEditable(idx);
  };

  const handleKeyDown = (idx, e) => {
    if (card.prefilledIndices?.[idx]) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      if (values[idx]) {
        const updated = [...values];
        updated[idx] = '';
        onChange(updated);
      } else {
        // Move to previous editable box and clear it
        for (let i = idx - 1; i >= 0; i--) {
          if (!card.prefilledIndices?.[i]) {
            const updated = [...values];
            updated[i] = '';
            onChange(updated);
            inputRefs.current[i]?.focus();
            break;
          }
        }
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusPrevEditable(idx);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusNextEditable(idx);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData.getData('text') || '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase();
    if (!pasted) return;

    const updated = [...values];
    let pasteCursor = 0;
    for (let i = 0; i < length && pasteCursor < pasted.length; i++) {
      if (!card.prefilledIndices?.[i]) {
        updated[i] = pasted[pasteCursor++];
      }
    }
    onChange(updated);
  };

  const borderStatusClass =
    validationState === 'correct'
      ? 'hp-card-correct'
      : validationState === 'wrong'
      ? 'hp-card-wrong'
      : '';

  return (
    <div className={`card hp-parchment-card h-100 ${borderStatusClass}`}>
      <div className="card-body d-flex flex-column justify-content-between p-3 p-md-4">
        <div>
          {/* Card Header with Title & Hint Button */}
          <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
            <div>
              <h5 className="hp-card-title mb-1">{card.title}</h5>
              {card.subtitle && (
                <p className="hp-card-subtitle mb-0">{card.subtitle}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setShowHint((prev) => !prev);
                onTriggerHintSound?.();
              }}
              className="btn btn-sm hp-hint-btn d-inline-flex align-items-center gap-1 flex-shrink-0"
              title="Reveal a magical hint for this memory"
            >
              <HelpCircle size={15} />
              <span>Hint</span>
            </button>
          </div>

          {/* Collapsible Hint Message */}
          {showHint && (
            <div className="hp-hint-box mt-2 mb-3 p-2 rounded">
              <div className="d-flex align-items-start gap-2">
                <Sparkles size={16} className="text-warning flex-shrink-0 mt-1" />
                <div className="small">
                  <strong className="text-warning">Whispering Parchment Hint:</strong>{' '}
                  <span>{card.hint}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* OTP / PIN Character Boxes */}
        <div className="mt-3">
          <div
            className="hp-otp-row d-flex justify-content-center align-items-center flex-wrap gap-2"
            onPaste={handlePaste}
          >
            {Array.from({ length }).map((_, idx) => {
              const isPrefilled = Boolean(card.prefilledIndices?.[idx]);
              const charVal = isPrefilled
                ? card.prefilledIndices[idx]
                : values[idx] || '';

              return (
                <div key={idx} className="position-relative">
                  <input
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="text"
                    maxLength={2}
                    disabled={isPrefilled}
                    value={charVal}
                    onChange={(e) => handleBoxChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    aria-label={`${card.title} character ${idx + 1}`}
                    className={`hp-otp-input text-center fw-bold ${
                      isPrefilled ? 'hp-otp-prefilled' : ''
                    } ${
                      validationState === 'correct'
                        ? 'hp-otp-correct'
                        : validationState === 'wrong' && !isPrefilled
                        ? 'hp-otp-wrong'
                        : ''
                    }`}
                  />
                  {isPrefilled && (
                    <span
                      className="hp-otp-lock-badge"
                      title="Prefilled memory rune (locked)"
                    >
                      <Lock size={10} />
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Status Footer */}
          <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary border-opacity-25 small">
            <span className="text-light text-opacity-75">
              Allowed: <code>A–Z, 0–9</code> ({length} letters)
            </span>
            {validationState === 'correct' && (
              <span className="text-success fw-semibold d-inline-flex align-items-center gap-1">
                <CheckCircle2 size={14} /> Spell Verified!
              </span>
            )}
            {validationState === 'wrong' && (
              <span className="text-danger fw-semibold d-inline-flex align-items-center gap-1">
                <XCircle size={14} /> Misaligned Rune
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CharacterBoxPuzzleCard;