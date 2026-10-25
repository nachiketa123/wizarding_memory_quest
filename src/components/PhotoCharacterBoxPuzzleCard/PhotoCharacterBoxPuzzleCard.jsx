
/* ============================================================================
 * 4B. REUSABLE COMPONENT: PhotoCharacterBoxPuzzleCard (4th Card in Level 1)
 * ============================================================================
 * Everything similar to CharacterBoxPuzzleCard (title, subtitle, hint icon &
 * collapsible hint message, 1-character OTP/PIN input boxes with a-z, A-Z, 0-9
 * validation and locked/disabled prefilled character boxes), PLUS an embedded
 * Cloudinary Picture showcase on the basis of which the player judges and
 * writes the name in the boxes below!
 * ============================================================================ */

import React, { useState, useRef } from 'react';
import { Lock } from 'lucide-react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Maximize2

} from 'lucide-react';
import { resolveCloudinaryPhotoUrl } from '../../config/cloudinaryConfig';

//  import sounds
import soundEngine from '../../config/soundConfig/WizardingSoundEngine'; 

function PhotoCharacterBoxPuzzleCard({
  card,
  values,
  onChange,
  validationState,
  onTriggerHintSound,
  onOpenLightbox
}) {
  const [showHint, setShowHint] = useState(false);
  const inputRefs = useRef([]);
  const length = card.answer.length;
  const photoUrl = resolveCloudinaryPhotoUrl(card, false);

  const focusNextEditable = (startIndex) => {
    for (let i = startIndex + 1; i < length; i++) {
      if (!card.prefilledIndices?.[i]) {
        inputRefs.current[i]?.focus();
        return;
      }
    }
  };

  const focusPrevEditable = (startIndex) => {
    for (let i = startIndex - 1; i >= 0; i--) {
      if (!card.prefilledIndices?.[i]) {
        inputRefs.current[i]?.focus();
        return;
      }
    }
  };

  const handleBoxChange = (idx, rawValue) => {
    if (card.prefilledIndices?.[idx]) return;

    const lastChar = rawValue.slice(-1);
    if (lastChar === '') {
      const updated = [...values];
      updated[idx] = '';
      onChange(updated);
      return;
    }

    // Strictly allow only a-z, A-Z, 0-9
    if (!/^[a-zA-Z0-9]$/.test(lastChar)) {
      return;
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
          {/* 1. Card Header: Title, Subtitle & Hint Icon Button */}
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
              title="Reveal a magical hint for this picture puzzle"
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

          {/* 2. Cloudinary Picture Frame (Judge from this photo & write the name below) */}
          <div className="hp-card4-photo-frame my-2 p-2 rounded-3 bg-dark bg-opacity-75 border border-warning border-opacity-50 text-center position-relative">
            <div className="position-relative d-inline-block w-100 overflow-hidden rounded-2">
              <img
                src={photoUrl}
                alt={card.title}
                onClick={() => onOpenLightbox?.(card)}
                className="img-fluid rounded-2 hp-card4-clue-img"
                style={{
                  maxHeight: '165px',
                  width: '100%',
                  objectFit: 'cover',
                  cursor: 'pointer'
                }}
              />
              {onOpenLightbox && (
                <button
                  type="button"
                  onClick={() => onOpenLightbox(card)}
                  className="btn btn-sm hp-Zoom-btn position-absolute top-0 end-0 m-2 d-inline-flex align-items-center gap-1"
                  title="View full-screen picture"
                >
                  <Maximize2 size={13} />
                  <span className="small">Zoom</span>
                </button>
              )}
            </div>
            {card.caption && (
              <div className="small text-warning text-opacity-90 mt-1">
                {card.caption}
              </div>
            )}
          </div>
        </div>

        {/* 3. OTP / PIN Character Boxes to Write the Name Based on the Picture */}
        <div className="mt-2">
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
              Judge picture & type name: <code>A–Z, 0–9</code> ({length} chars)
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

export default PhotoCharacterBoxPuzzleCard;