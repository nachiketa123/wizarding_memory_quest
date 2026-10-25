
/* ============================================================================
 * 6. REUSABLE COMPONENT: MatchCard (Level 2 Right Side Cards)
 * ============================================================================
 * Supports two modes controlled by `variant`:
 * - `variant="split"` (Upper part cards): Title + Left section (text) + Right section (drop box)
 * - `variant="box-only"` (Bottom part 2 cards): Main Title + Drop box only (no text section)
 * ============================================================================ */

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Maximize2,
  X
} from 'lucide-react';
import { resolveCloudinaryPhotoUrl } from '../../config/cloudinaryConfig';

function MatchCard({
  card,
  placedPhoto,
  onDropPhotoIntoCard,
  onRemovePhotoFromCard,
  onOpenLightbox,
  selectedGalleryPhotoId,
  validationStatus,
  variant = 'split'
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const draggedPhotoId = e.dataTransfer.getData('text/plain');
    if (draggedPhotoId) {
      onDropPhotoIntoCard(card.id, draggedPhotoId);
    }
  };

  const handleBoxClick = () => {
    if (selectedGalleryPhotoId) {
      onDropPhotoIntoCard(card.id, selectedGalleryPhotoId);
    }
  };

  const statusClass =
    validationStatus === 'correct'
      ? 'hp-card-correct'
      : validationStatus === 'wrong'
      ? 'hp-card-wrong'
      : '';

  return (
    <div className={`card hp-parchment-card h-100 ${statusClass}`}>
      <div className="card-body p-3">
        {/* Card Title */}
        <div className="d-flex justify-content-between align-items-center mb-2 pb-1 border-bottom border-warning border-opacity-25">
          <h6 className="hp-card-title mb-0">{card.title}</h6>
          {validationStatus === 'correct' && (
            <span className="badge bg-success d-inline-flex align-items-center gap-1">
              <CheckCircle2 size={12} /> Matched
            </span>
          )}
          {validationStatus === 'wrong' && (
            <span className="badge bg-danger d-inline-flex align-items-center gap-1">
              <XCircle size={12} /> Wrong Photo
            </span>
          )}
        </div>

        {/* Card Content: Either Split (Left Text + Right Drop Box) or Box-Only (Bottom 2 cards) */}
        <div className="row g-2 align-items-stretch">
          {variant === 'split' && (
            <div className="col-12 col-sm-6 d-flex align-items-center">
              <div className="hp-match-clue-box p-2 rounded w-100 h-100 d-flex align-items-center">
                <p className="mb-0 small text-light text-opacity-90">
                  “{card.memoryText}”
                </p>
              </div>
            </div>
          )}

          <div className={variant === 'split' ? 'col-12 col-sm-6' : 'col-12'}>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleBoxClick}
              className={`hp-drop-zone rounded d-flex flex-column justify-content-center align-items-center p-2 position-relative ${
                isDragOver ? 'hp-drop-zone-active' : ''
              } ${
                selectedGalleryPhotoId && !placedPhoto
                  ? 'hp-drop-zone-ready-tap'
                  : ''
              }`}
            >
              {placedPhoto ? (
                <div className="w-100 text-center position-relative">
                  <img
                    src={resolveCloudinaryPhotoUrl(placedPhoto, true)}
                    alt={placedPhoto.label}
                    className="img-fluid rounded hp-placed-photo-img"
                  />
                  <div className="d-flex justify-content-between align-items-center mt-1 px-1">
                    <span className="small text-warning fw-semibold text-truncate">
                      {placedPhoto.label}
                    </span>
                    <div className="d-flex gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenLightbox(placedPhoto);
                        }}
                        className="btn btn-sm btn-outline-light py-0 px-1"
                        title="View Fullscreen"
                      >
                        <Maximize2 size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemovePhotoFromCard(card.id);
                        }}
                        className="btn btn-sm btn-outline-warning py-0 px-1"
                        title="Return photo to VerticalPhotoGallery"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-3 px-2">
                  <div className="hp-drop-placeholder-icon mb-1">✦</div>
                  <div className="small text-light text-opacity-75">
                    {selectedGalleryPhotoId
                      ? 'Tap here to attach selected photo!'
                      : 'Drag & Drop Photo Here'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchCard;