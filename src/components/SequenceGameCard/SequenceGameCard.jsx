/* ============================================================================
 * 8. REUSABLE COMPONENT: SequenceGameCard (Level 3 "Delhi Trip" Card)
 * ============================================================================
 * Single reusable card containing:
 * - Left column: Fixed sequence numbers 1, 2, 3, ...
 * - Right column: Rectangular tiles that can be dragged and dropped vertically
 *   with smooth animated swapping as the user moves up or down!
 * - Optional Picture Support (Cloudinary): If a sequence item has a picture
 *   (`hasPhoto !== false` and `cloudinaryPublicId`, `directUrl`, or `fallbackArt`),
 *   it is displayed cleanly on the right side of the tile (with click-to-zoom
 *   lightbox preview) to visually tell the story of that memory!
 * ============================================================================ */

import React, { useState} from 'react';
import {
  GripVertical,
  ArrowUp,
  ArrowDown,
  Maximize2
} from 'lucide-react';

//  import sounds
import soundEngine from '../../config/soundConfig/WizardingSoundEngine'; 

import { resolveCloudinaryPhotoUrl } from '../../config/cloudinaryConfig';

function hasSequenceItemPhoto(item) {
  if (!item || item.hasPhoto === false) return false;
  return Boolean(
    (item.directUrl && item.directUrl.trim() !== '') ||
      (item.cloudinaryPublicId && item.cloudinaryPublicId.trim() !== '') ||
      item.fallbackArt
  );
}

function SequenceGameCard({
  title,
  subtitle,
  items,
  onReorderItems,
  validationState,
  onOpenLightbox
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  // Live swap when dragging over another tile so tiles smoothly animate up/down
  const handleDragStart = (idx) => {
    setDraggedIndex(idx);
  };

  const handleDragEnter = (targetIdx) => {
    if (draggedIndex === null || draggedIndex === targetIdx) return;
    const updated = [...items];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIdx, 0, movedItem);
    setDraggedIndex(targetIdx);
    setHoverIndex(targetIdx);
    onReorderItems(updated);
    soundEngine.playChime('sparkle');
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setHoverIndex(null);
  };

  // Manual Up/Down buttons for smooth touch accessibility on phones/tablets
  const moveTileByOffset = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const updated = [...items];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    onReorderItems(updated);
    soundEngine.playChime('sparkle');
  };

  return (
    <div
      className={`card hp-parchment-card ${
        validationState === 'correct'
          ? 'hp-card-correct'
          : validationState === 'wrong'
          ? 'hp-card-wrong'
          : ''
      }`}
    >
      <div className="card-body p-3 p-md-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 pb-2 border-bottom border-warning border-opacity-25">
          <div>
            <h4 className="hp-card-title mb-1">{title}</h4>
            <p className="hp-card-subtitle mb-0">{subtitle}</p>
          </div>
          <span className="badge hp-spell-badge px-3 py-2">
            Drag Tiles Up/Down • Click Any Tile Photo to Enlarge
          </span>
        </div>

        {/* Sequence Rows: Fixed Numbering on Left, Draggable Rectangular Tile on Right */}
        <div className="d-flex flex-column gap-3">
          {items.map((item, idx) => {
            const fixedNumber = idx + 1;
            const isBeingDragged = draggedIndex === idx;
            const isPositionRight =
              validationState !== 'idle' &&
              item.correctPosition === fixedNumber;
            const showTilePhoto = hasSequenceItemPhoto(item);
            const tilePhotoUrl = showTilePhoto
              ? resolveCloudinaryPhotoUrl(item, true)
              : null;

            return (
              <div
                key={item.id}
                className="d-flex align-items-stretch gap-2 gap-md-3 hp-sequence-row"
              >
                {/* Fixed Sequence Number Box (Left) */}
                <div className="hp-fixed-number-box d-flex flex-column justify-content-center align-items-center flex-shrink-0 rounded-3">
                  <span className="small text-warning text-opacity-75">STEP</span>
                  <span className="fs-4 fw-bold hp-gold-text">{fixedNumber}</span>
                </div>

                {/* Draggable Rectangular Tile (Right) */}
                <div
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragEnter={() => handleDragEnter(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnd={handleDragEnd}
                  className={`hp-sequence-tile flex-grow-1 rounded-3 p-3 d-flex justify-content-between align-items-center gap-2 gap-md-3 ${
                    isBeingDragged ? 'hp-sequence-tile-dragging' : ''
                  } ${
                    hoverIndex === idx ? 'hp-sequence-tile-hover' : ''
                  } ${
                    validationState === 'correct'
                      ? 'hp-tile-correct'
                      : validationState === 'wrong' && !isPositionRight
                      ? 'hp-tile-wrong'
                      : ''
                  }`}
                >
                  {/* Left & Center of Tile: Drag Handle + Time Tag + Memory Story Text */}
                  <div className="d-flex align-items-center gap-2 gap-md-3 flex-grow-1 min-w-0">
                    <div className="hp-drag-handle text-warning d-flex align-items-center flex-shrink-0">
                      <GripVertical size={20} />
                    </div>
                    <div className="flex-grow-1">
                      <div className="small text-warning fw-semibold mb-1">
                        {item.timeTag}
                      </div>
                      <div className="text-light fw-medium">{item.title}</div>
                    </div>
                  </div>

                  {/* Right Side of Tile: Optional Cloudinary Memory Picture + Up/Down Swap Controls */}
                  <div className="d-flex align-items-center gap-2 gap-md-3 flex-shrink-0">
                    {showTilePhoto && tilePhotoUrl && (
                      <div
                        className="hp-seq-photo-thumb-wrap position-relative rounded-2 overflow-hidden flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenLightbox?.({
                            ...item,
                            label: item.label || item.timeTag,
                            caption: item.caption || item.title
                          });
                        }}
                        title="Click to view memory photograph in full screen"
                      >
                        <img
                          src={tilePhotoUrl}
                          alt={item.label || item.timeTag}
                          className="hp-seq-photo-thumb d-block"
                        />
                        <span className="hp-seq-photo-zoom-badge">
                          <Maximize2 size={11} />
                        </span>
                      </div>
                    )}

                    {/* Smooth Up / Down Swap Controls for Mobile & Tablet */}
                    <div className="d-flex flex-column gap-1 flex-shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveTileByOffset(idx, -1)}
                        className="btn btn-sm hp-seq-arrow-btn p-1"
                        title="Swap tile up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === items.length - 1}
                        onClick={() => moveTileByOffset(idx, 1)}
                        className="btn btn-sm hp-seq-arrow-btn p-1"
                        title="Swap tile down"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SequenceGameCard;