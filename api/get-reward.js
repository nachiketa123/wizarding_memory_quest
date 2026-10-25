// api/get-reward.js

// 1. The Secret Data
const CLOUDINARY_CONFIG = {
  cloudName: 'dzoue3vlz',
  qr_img: 'data/gift-qr'
};

const SECRET_QR_URL = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/w_400,h_400,c_fit/${CLOUDINARY_CONFIG.qr_img}.jpg`;
const WINNING_PASSCODE = 'all-levels-cleared-2026';

// 2. The Vercel Serverless Handler
export default async function handler(req, res) {
  // Mimic app.post() by rejecting other request types
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { passcode } = req.body;
  
  // Verify the user actually completed the game
  if (passcode === WINNING_PASSCODE) {
    try {
      // Ping Cloudinary to ensure the image exists and loads properly
      const result = await fetch(SECRET_QR_URL, { method: 'GET' });
      
      if (result.status !== 200) {
        return res.status(404).json({
          success: false,
          message: 'Sorry, No QR found.. try again later'
        });
      }
      
      // Success: Return the URL to React
      return res.status(200).json({ 
        success: true, 
        qrUrl: SECRET_QR_URL 
      });

    } catch (err) {
      return res.status(404).json({
        success: false,
        message: 'Sorry, No QR found.. try again later'
      });
    }
  }

  // If the passcode is wrong or missing
  return res.status(403).json({ 
    success: false, 
    message: 'Nice try! Complete the game first.' 
  });
}