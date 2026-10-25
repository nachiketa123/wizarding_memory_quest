/* ============================================================================
 * 9. CUSTOM SVG QR CODE GENERATOR FOR THE FINAL REWARD SCREEN
 * ============================================================================ */

import React, { useState, useEffect } from 'react';

function MagicalRewardQrCode({ rewardText, error, setError }) {

  const [qrUrl, setQrUrl] = useState(null);


  useEffect(() => {
    const fetchReward = async () => {
      try {
        const response = await fetch('/api/get-reward', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // Send the proof that the game is finished
          body: JSON.stringify({ passcode: 'all-levels-cleared-2026' }),
        });

        const data = await response.json();

        if (response.ok && data.qrUrl) {
          setQrUrl(data.qrUrl);
          setError('')
        } else {
          setError(data.message || 'Could not load reward.');
        }
      } catch (err) {
        setError('Server connection failed.');
      }
    };

    fetchReward();
  }, []);


  // Generates a crisp, scannable-style deterministic 21x21 QR matrix SVG
  // or renders the user's Cloudinary QR code if `CLOUDINARY_CONFIG.rewardQrPublicId` is set
  // const hasCustomQr =
  //   CLOUDINARY_CONFIG.cloudName !== 'YOUR_CLOUD_NAME' &&
  //   qrUrl !== null

  const borderStatusClass =
    error === ''
      ? ''
      : 'hp-card-wrong';

  if (qrUrl != null) {
    // const url = ${CLOUDINARY_CONFIG.rewardQrPublicId}`;
    return (
      <img
        src={qrUrl}
        alt="Reward QR Code"
        className="img-fluid rounded-3 border border-3 border-warning shadow"
        style={{ maxWidth: '220px' }}
      />
    );
  }

  const size = 21;
  const isFinderPattern = (r, c) => {
    const inTopLeft = r < 7 && c < 7;
    const inTopRight = r < 7 && c >= size - 7;
    const inBottomLeft = r >= size - 7 && c < 7;
    if (!inTopLeft && !inTopRight && !inBottomLeft) return null;

    const lr = inBottomLeft ? r - (size - 7) : r;
    const lc = inTopRight ? c - (size - 7) : c;
    if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return true;
    if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) return true;
    return false;
  };

  const cells = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const finder = isFinderPattern(r, c);
      let filled = false;
      if (finder !== null) {
        filled = finder;
      } else {
        const seed = (r * 31 + c * 17 + rewardText.charCodeAt((r + c) % rewardText.length)) % 7;
        filled = seed < 3;
      }
      if (filled) {
        cells.push(
          <rect
            key={`${r}-${c}`}
            x={c * 10 + 10}
            y={r * 10 + 10}
            width="9.2"
            height="9.2"
            rx="1.5"
            fill="#1a1128"
          />
        );
      }
    }
  }

  return (
  (error !=='') && <div className={`hp-qr-frame p-3 rounded-4 d-inline-block shadow-lg ${borderStatusClass}`}>
      <svg
        viewBox="0 0 230 230"
        width="200"
        height="200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="230" height="230" rx="14" fill="#fff9db" />
        {cells}
      </svg>
    </div>
  );
}

export default MagicalRewardQrCode;