const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// const verifyToken = require('./middleware/verifyToken.js');
const connectDB = require('./config/db.js')
dotenv.config();

const app = express();

connectDB()

app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true,
}));

app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes); 


app.get('/', (req, res) => res.send('API running...'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// backend routes : 
// http://localhost:3000/api/auth/login

