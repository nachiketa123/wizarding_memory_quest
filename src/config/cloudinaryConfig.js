/**
 * ============================================================================
 * CLOUDINARY & PUZZLE DATA CONFIGURATION FILE (src/config/cloudinaryConfig.js)
 * ============================================================================
 *
 * HOW TO CONFIGURE CLOUDINARY FOR LEVEL 2 ("Match it") & FINAL REWARD QR CODE:
 * ----------------------------------------------------------------------------
 * 1. Log in to your Cloudinary Console: https://console.cloudinary.com/
 * 2. On the main Dashboard page, copy your "Cloud Name" (e.g., "dxyz12345").
 * 3. Paste your Cloud Name into `CLOUDINARY_CONFIG.cloudName` below.
 * 4. Go to "Media Library" in Cloudinary and upload the photographs for Level 2
 *    (plus any extra "decoy" photos you want to see flushed down the Western Toilet!).
 * 5. Copy the "Public ID" of each uploaded image (for example:
 *    "friend_memories/kulhad_chai_night" or "delhi_trip/india_gate.jpg").
 * 6. Paste each Public ID into `LEVEL_2_GALLERY_PHOTOS` below (`cloudinaryPublicId`),
 *    OR paste a full `https://res.cloudinary.com/...` link into `directUrl`.
 *
 * HOW THE LEVEL 2 ("Match it") MATCHING MECHANISM WORKS:
 * ----------------------------------------------------------------------------
 * - Each photo in `LEVEL_2_GALLERY_PHOTOS` has a unique `id` (e.g., 'photo-tapri-chai').
 * - Each card on the right side (`LEVEL_2_UPPER_CARDS` and `LEVEL_2_BOTTOM_CARDS`)
 *   specifies `expectedPhotoId`, which points to the exact `id` of the photo that
 *   belongs to that memory.
 * - State is tracked in `level2Placements` as a dictionary: `{ [cardId]: placedPhotoId | null }`.
 * - Whenever a photo is dragged from `VerticalPhotoGallery` and dropped into a card's drop box:
 *     a) `level2Placements[cardId]` is updated with `draggedPhotoId`.
 *     b) `VerticalPhotoGallery` filters out any photo whose `id` is currently present in
 *        `Object.values(level2Placements)`, so the photo visibly disappears from the left
 *        gallery and attaches inside the card's box on the right.
 * - When the user clicks the "Flush Leftover Photos & Check Matches" button:
 *     a) A Western Toilet Seat appears at the bottom-left of the screen.
 *     b) Any photos still remaining in `VerticalPhotoGallery` animate spiraling into the
 *        toilet bowl accompanied by a synthesized Web Audio API toilet flush sound effect.
 *     c) Once the 2.6-second flush animation finishes, every card's `level2Placements[cardId]`
 *        is compared against `card.expectedPhotoId`.
 *     d) If all cards match, the Harry Potter spell transition advances to Level 3 ("Delhi Trip").
 *     e) If any card is wrong, the user sees the "Wrong" state and a Reset button that
 *        brings all flushed pictures back up into `VerticalPhotoGallery` to re-attempt!
 */

import {createIllustratedMemorySvg} from '../utils/createIllustratedMemorySvg';

export const CLOUDINARY_CONFIG = {
  cloudName: 'dzoue3vlz', // <-- Replace with your Cloudinary Cloud Name
  uploadFolder: 'data',
  defaultTransformations: 'f_auto,q_auto,w_900,c_limit',
  thumbnailTransformations: 'f_auto,q_auto,w_400,h_300,c_fill',
  rewardQrPublicId: '' // <-- Optional: Public ID of your custom QR code image in Cloudinary
};

export function buildCloudinaryUrl(publicId, isThumbnail = false) {
  if (!publicId) return '';
  if (publicId.startsWith('http://') || publicId.startsWith('https://')) {
    return publicId;
  }
  const transform = isThumbnail
    ? CLOUDINARY_CONFIG.thumbnailTransformations
    : CLOUDINARY_CONFIG.defaultTransformations;
  const cleanId = publicId.replace(/^\/+/, '');
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transform}/${cleanId}`;
}

/**
 * Helper to resolve Cloudinary URLs or fall back to illustrated SVG memories.
 */
export function resolveCloudinaryPhotoUrl(photo, isThumbnail = false) {
  if (photo.directUrl && photo.directUrl.startsWith('http')) {
    return photo.directUrl;
  }
  const hasRealCloudName =
    CLOUDINARY_CONFIG.cloudName &&
    CLOUDINARY_CONFIG.cloudName.trim() !== '' &&
    CLOUDINARY_CONFIG.cloudName !== 'Your Cloudname';

  if (hasRealCloudName && photo.cloudinaryPublicId) {
    const transform = isThumbnail
      ? CLOUDINARY_CONFIG.thumbnailTransformations
      : CLOUDINARY_CONFIG.defaultTransformations;
    const cleanPublicId = photo.cloudinaryPublicId.replace(/^\/+/, '');
    return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transform}/${cleanPublicId}.jpg`;
  }
  return createIllustratedMemorySvg(photo.fallbackArt);
}
