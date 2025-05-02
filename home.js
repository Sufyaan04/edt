const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));


  const userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    phone: String,
    skillOffer: String,
    skillLevel: String,
    skillNeed: String,
    filePath: String,
    password: String,
    });
  
  
 
const User = mongoose.model('User', userSchema);

const skillSchema = new mongoose.Schema({
  offer: String,
  learn: String,
});
const Skill = mongoose.model('Skill', skillSchema);

const loginLogSchema = new mongoose.Schema({
  email: String,
  status: String, 
  reason: String,
  timestamp: { type: Date, default: Date.now },
  ip: String,
  userAgent: String,
});
const LoginLog = mongoose.model('LoginLog', loginLogSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/afterlogin', (req, res) => {
  res.sendFile(path.join(__dirname, 'afterlogin.html'));
});

// Register User
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.send('❌ User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fname: username, email, password: hashedPassword });

    // Log new user data for debugging
    console.log('New User Data:', newUser);

    await newUser.save();

    res.send('✅ Registration successful! You can now log in.');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Server error during registration');
  }
});

// User Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // For test: just log success
    console.log('✅ User found:', user.email);
    res.status(200).json({ message: 'Login success (user found)' });

  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// View Login Logs
app.get('/login-logs', async (req, res) => {
  try {
    const logs = await LoginLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).send('❌ Error fetching login logs');
  }
});

// Post Skill
app.post('/skills', async (req, res) => {
  const { offer, learn } = req.body;

  try {
    await Skill.create({ offer, learn });
    res.redirect('/skills.html');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Error saving skill');
  }
});

// Get All Skills
app.get('/skills', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Error fetching skills');
  }
});

// Get All Users (For Debugging)
app.get('/check-users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).send('❌ Error fetching users');
  }
});

// Skill Matching
app.get('/matches/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).send('❌ User not found');
    }

    const neededSkill = currentUser.skillNeed;
    const matches = await User.find({
      skillOffer: neededSkill,
      _id: { $ne: currentUser._id },
    });

    if (matches.length === 0) {
      return res.send('😞 No matches found for your skill need.');
    }

    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Server error while matching skills');
  }
});

// Seed Dummy Users
app.get('/seed-users', async (req, res) => {
  try {
    const dummyUsers = [
      {
        fname: 'Alice',
        lname: 'Walker',
        email: 'alice@example.com',
        phone: '1234567890',
        skillOffer: 'Graphic Design',
        skillLevel: 'Advanced',
        skillNeed: 'Web Development',
        password: await bcrypt.hash('alice123', 10),
      },
      {
        fname: 'Bob',
        lname: 'Smith',
        email: 'bob@example.com',
        phone: '9876543210',
        skillOffer: 'Web Development',
        skillLevel: 'Intermediate',
        skillNeed: 'Graphic Design',
        password: await bcrypt.hash('bob123', 10),
      },
    ];

    await User.insertMany(dummyUsers);
    res.send('✅ Dummy users seeded successfully.');
  } catch (err) {
    console.error('❌ Error seeding users:', err);
    res.status(500).send('❌ Failed to seed dummy users.');
  }
});

app.get('/all-users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
