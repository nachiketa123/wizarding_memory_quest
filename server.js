import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// 1. Define which domains are allowed to talk to this server
const ALLOWED_ORIGINS = [
  'http://localhost:5173',          // Default Vite local port
  'http://localhost:4173',         // Vite preview port
  'https://your-app.vercel.app'     // Replace with your live domain later
];



// 2. Configure CORS protection (Blocks other websites)
app.use(cors({
  origin: function (origin, callback) {
    // Reject requests with no origin (blocks tools like Postman or curl)
    // and reject origins not in our allowed list
    if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
      return callback(new Error('Blocked by CORS: Unauthorized origin'));
    }
    return callback(null, true);
  },
  methods: ['POST'], // Only allow POST requests
}));

// Built-in middleware to parse JSON bodies sent from React
app.use(express.json());

// 3. The Secret Data (Hidden from React bundle)
const CLOUDINARY_CONFIG = {
    cloudName:'dzoue3vlz',
    qr_img: 'data/gift-qr'
}
const SECRET_QR_URL = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/w_400,h_400,c_fit/${CLOUDINARY_CONFIG.qr_img}.jpg`;
const WINNING_PASSCODE = 'all-levels-cleared-2026'; // Must match what React sends
console.log(SECRET_QR_URL);
// 4. The Protected POST Route
app.post('/api/get-reward', async (req, res) => {
  const { passcode } = req.body;
  
  // Verify the user actually completed the game
  if (passcode === WINNING_PASSCODE) {
    try{
        const result = await fetch(SECRET_QR_URL,{method:'GET'});
        console.log(result)
        if(result.status !== 200) 
            return res.status(404).json({
                success: false,
                message: 'Sorry, No QR found.. try again later'
            })
        
        return res.status(200).json({ 
        success: true, 
        qrUrl: SECRET_QR_URL 
        });
    }catch(err){
        return res.status(404).json({
            success: false,
            message: 'Sorry, No QR found.. try again later'
        })
    }
  }

  // If the passcode is wrong or missing
  return res.status(403).json({ 
    success: false, 
    message: 'Nice try! Complete the game first.' 
  });
});

// Clean error handler if CORS blocks a request
app.use((err, req, res, next) => {
  if (err.message.includes('Blocked by CORS')) {
    return res.status(403).json({ error: err.message });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`Reward server running at http://localhost:${PORT}`);
});