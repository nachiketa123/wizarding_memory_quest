/* ============================================================================
 * 7. REUSABLE COMPONENT: WesternToiletFlushWidget (Level 2 Bottom-Left Toilet)
 * ============================================================================
 * Renders a detailed Western Toilet Seat at the bottom-left of Level 2 when
 * the user clicks "Check Answers", animating the remaining VerticalPhotoGallery
 * pictures getting swirled and flushed down with a sound effect!
 * ============================================================================ */

import React from 'react';
import { resolveCloudinaryPhotoUrl } from '../../config/cloudinaryConfig';

function WesternToiletFlushWidget({ isVisible, flushingPhotos }) {
  if (!isVisible) return null;

  return (
    <div className="hp-toilet-overlay-box p-3 rounded-4 shadow-lg">
      <div className="d-flex align-items-center gap-3">
        {/* Detailed SVG Western Toilet Seat with Swirling Water Vortex */}
        <div className="hp-toilet-svg-wrapper position-relative flex-shrink-0">
          <svg
            viewBox="0 0 180 210"
            width="115"
            height="135"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Cistern / Water Tank */}
            <rect
              x="35"
              y="12"
              width="110"
              height="55"
              rx="8"
              fill="#f1f3f5"
              stroke="#adb5bd"
              strokeWidth="4"
            />
            {/* Tank Lid */}
            <rect
              x="30"
              y="6"
              width="120"
              height="12"
              rx="5"
              fill="#fff"
              stroke="#adb5bd"
              strokeWidth="3"
            />
            {/* Animated Flush Handle */}
            <g className="hp-toilet-handle-anim">
              <rect
                x="42"
                y="26"
                width="24"
                height="7"
                rx="3"
                fill="#d4af37"
                stroke="#8c6d1f"
                strokeWidth="2"
              />
              <circle cx="42" cy="29.5" r="5" fill="#ffd43b" />
            </g>
            {/* Raised Western Toilet Lid */}
            <ellipse
              cx="90"
              cy="75"
              rx="48"
              ry="34"
              fill="#e9ecef"
              stroke="#adb5bd"
              strokeWidth="4"
            />
            {/* Pedestal Base */}
            <path
              d="M58 145 L68 198 H112 L122 145 Z"
              fill="#dee2e6"
              stroke="#adb5bd"
              strokeWidth="4"
            />
            {/* Western Toilet Bowl Rim */}
            <ellipse
              cx="90"
              cy="125"
              rx="62"
              ry="34"
              fill="#ffffff"
              stroke="#868e96"
              strokeWidth="5"
            />
            {/* Inner Bowl & Swirling Water Vortex */}
            <ellipse
              cx="90"
              cy="125"
              rx="46"
              ry="24"
              fill="#3bc9db"
              stroke="#1098ad"
              strokeWidth="3"
            />
            <g className="hp-water-swirl-group">
              <path
                d="M65 125 C75 112, 105 112, 115 125 C105 138, 75 138, 65 125 Z"
                fill="none"
                stroke="#e3fafc"
                strokeWidth="3"
                strokeDasharray="8 6"
              />
              <circle cx="90" cy="125" r="10" fill="#0c8599" />
            </g>
          </svg>

          {/* Mini thumbnails spiraling into the bowl */}
          {flushingPhotos.map((p, idx) => (
            <img
              key={p.id}
              src={resolveCloudinaryPhotoUrl(p, true)}
              alt={p.label}
              style={{ animationDelay: `${idx * 0.18}s` }}
              className="hp-mini-flushing-photo"
            />
          ))}
        </div>

        <div>
          <span className="badge bg-info text-dark mb-1">
            Ministry of Magic Plumbing Dept.
          </span>
          <h6 className="hp-gold-text fw-bold mb-1">
            Flushing Remaining Gallery Photos!
          </h6>
          <p className="small text-light text-opacity-85 mb-0">
            {flushingPhotos.length > 0
              ? `Swirling ${flushingPhotos.length} leftover photo(s) from VerticalPhotoGallery down the Western Toilet pipe...`
              : 'Flushing the gallery pipes and verifying your memory matches...'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default WesternToiletFlushWidget;