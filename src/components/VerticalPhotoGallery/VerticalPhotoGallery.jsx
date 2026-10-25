/* ============================================================================
 * 5. REUSABLE COMPONENT: VerticalPhotoGallery (Level 2 Left Scrollable Column)
 * ============================================================================
 * Displays unplaced photographs in a scrollable vertical strip.
 * - Supports HTML5 Drag start (`onDragStart`)
 * - Supports Mobile/Tablet Tap-to-Select (`selectedPhotoId` / `onSelectPhoto`)
 * - Supports Fullscreen Lightbox Popup (`onOpenLightbox`)
 * - Animates remaining photos flying into the Western Toilet Seat when `isFlushing` is true!
 * ============================================================================ */
import React from 'react';
import {
  Sparkles,
  Maximize2,
} from 'lucide-react';

import { resolveCloudinaryPhotoUrl } from '../../config/cloudinaryConfig';


function VerticalPhotoGallery({
  photos,
  selectedPhotoId,
  onSelectPhoto,
  onDragStartPhoto,
  onOpenLightbox,
  isFlushing
}) {
  return (
    <div className="hp-gallery-container d-flex flex-column h-100">
      <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-warning border-opacity-25">
        <div>
          <h6 className="mb-0 hp-gold-text fw-bold d-flex align-items-center gap-2">
            <Sparkles size={16} />
            VerticalPhotoGallery ({photos.length})
          </h6>
          <small className="text-light text-opacity-75 d-block">
            Drag to a card (or tap photo, then tap box). Click zoom icon for full screen.
          </small>
        </div>
      </div>

      {/* Scrollable Vertical Strip */}
      <div className="hp-vertical-gallery-scroll flex-grow-1 pe-1">
        {photos.length === 0 ? (
          <div className="text-center py-5 text-light text-opacity-50 small">
            All photographs have been placed or flushed!
          </div>
        ) : (
          photos.map((photo, index) => {
            const isSelected = selectedPhotoId === photo.id;
            const imgUrl = resolveCloudinaryPhotoUrl(photo, true);

            return (
              <div
                key={photo.id}
                draggable={!isFlushing}
                onDragStart={(e) => {
                  if (isFlushing) return;
                  e.dataTransfer.setData('text/plain', photo.id);
                  onDragStartPhoto(photo.id);
                }}
                onClick={() => {
                  if (!isFlushing) {
                    onSelectPhoto(isSelected ? null : photo.id);
                  }
                }}
                style={{
                  animationDelay: isFlushing ? `${index * 0.14}s` : '0s'
                }}
                className={`hp-gallery-photo-item mb-3 p-2 rounded position-relative ${
                  isSelected ? 'hp-gallery-photo-selected' : ''
                } ${isFlushing ? 'hp-photo-flushing-into-toilet' : ''}`}
              >
                <div className="position-relative overflow-hidden rounded">
                  <img
                    src={imgUrl}
                    alt={photo.label}
                    className="img-fluid w-100 hp-gallery-thumb"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenLightbox(photo);
                    }}
                    className="btn btn-sm hp-Zoom-btn position-absolute top-0 end-0 m-1"
                    title="View full screen photograph"
                  >
                    <Maximize2 size={14} />
                  </button>
                </div>
                <div className="mt-2 d-flex justify-content-between align-items-center">
                  <span className="small fw-semibold text-light text-truncate">
                    {photo.label}
                  </span>
                  <span className="badge bg-warning text-dark small">
                    {isSelected ? 'Selected' : 'Drag / Tap'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default VerticalPhotoGallery;