// alert("Welcome to Skill Swap.com");
// const questions = [
//     {
//         question: "What is the purpose of Node.js in web development?",
//         options: ["Frontend development", "Backend development", "Database management", "Designing UI"],
//         correct: 1
//     },
//     {
//         question: "Which programming language is primarily used for Machine Learning?",
//         options: ["JavaScript", "Python", "C++", "Java"],
//         correct: 1
//     },
//     {
//         question: "What is MongoDB?",
//         options: ["A NoSQL database", "A frontend library", "A backend framework", "A cloud service"],
//         correct: 0
//     },
//     {
//         question: "Which CSS property removes the underline from an anchor tag?",
//         options: ["text-decoration", "border", "background-color", "padding"],
//         correct: 0
//     },
//     {
//         question: "What is the primary focus of DSA (Data Structures and Algorithms)?",
//         options: ["Designing User Interfaces", "Efficient data processing", "Creating websites", "Building 3D models"],
//         correct: 1
//     },
//     {
//         question: "In App Development, which framework is commonly used for cross-platform mobile app development?",
//         options: ["React Native", "Angular", "Vue.js", "Django"],
//         correct: 0
//     },
//     {
//         question: "What is the primary language used for developing web pages?",
//         options: ["JavaScript", "HTML", "Python", "C++"],
//         correct: 1
//     },
//     {
//         question: "Which of these is NOT a good strategy for Social Media Management?",
//         options: ["Posting consistently", "Engaging with the audience", "Using clickbait headlines", "Analyzing audience metrics"],
//         correct: 2
//     },
//     {
//         question: "Which software is commonly used for video editing?",
//         options: ["Adobe Photoshop", "Final Cut Pro", "Blender", "AutoCAD"],
//         correct: 1
//     },
//     {
//         question: "What is the role of SEO (Search Engine Optimization) in Digital Marketing?",
//         options: ["Improving website visibility on search engines", "Creating content for social media", "Running paid ads", "Designing a website"],
//         correct: 0
//     },
//     {
//         question: "Which design software is widely used for vector graphics creation?",
//         options: ["Adobe Photoshop", "CorelDRAW", "Adobe Illustrator", "Blender"],
//         correct: 2
//     },
//     {
//         question: "What is the purpose of a color palette in Graphic Design?",
//         options: ["To create visual hierarchy", "To add texture", "To create consistency and mood", "To add random colors"],
//         correct: 2
//     },
//     {
//         question: "Which file format is commonly used for web graphics with transparency?",
//         options: [".png", ".jpg", ".gif", ".svg"],
//         correct: 0
//     }
// ];

// let currentQuestionIndex = 0;
// let score = 0;

// function loadQuestion() {
//     const question = questions[currentQuestionIndex];
//     document.getElementById("question").textContent = question.question;
//     const optionsContainer = document.getElementById("options");
//     optionsContainer.innerHTML = '';
    
//     question.options.forEach((option, index) => {
//         const button = document.createElement("button");
//         button.textContent = option;
//         button.classList.add("option-btn");
//         button.onclick = () => checkAnswer(index);
//         optionsContainer.appendChild(button);
//     });
// }

// function checkAnswer(selectedIndex) {
//     const correctIndex = questions[currentQuestionIndex].correct;
//     if (selectedIndex === correctIndex) {
//         score++;
//     }
//     document.getElementById("next-btn").disabled = false;
// }

// function nextQuestion() {
//     if (currentQuestionIndex < questions.length - 1) {
//         currentQuestionIndex++;
//         loadQuestion();
//         document.getElementById("next-btn").disabled = true;
//     } else {
//         showResult();
//     }
// }

// function showResult() {
//     document.getElementById("quiz").style.display = "none";
//     const scoreElement = document.getElementById("score");
//     scoreElement.textContent = score;
//     document.getElementById("result").style.display = "block";
// }

// if (score >= Math.ceil(questions.length * 0.75)) {
//     alert("Congratulations, you're eligible for Skill Swap!");
//     console.log("Congratulations, you're eligible to pass!");
// }


// function restartQuiz() {
//     currentQuestionIndex = 0;
//     score = 0;
//     document.getElementById("quiz").style.display = "block";
//     document.getElementById("result").style.display = "none";
//     loadQuestion();
//     document.getElementById("next-btn").disabled = true;
// }



// loadQuestion();


document.addEventListener('DOMContentLoaded', function() {
    const skillButtons = document.querySelectorAll('.skill-button');
    
    skillButtons.forEach(button => {
      button.addEventListener('click', function() {
        const skillName = this.dataset.skill;
        redirectToQuiz(skillName);
      });
    });
    
    function redirectToQuiz(skillName) {
      // Store the selected skill in session storage
      sessionStorage.setItem('selectedSkill', skillName);
      // Redirect to the quiz page
      window.location.href = 'quiz.html';
    }
  });
  
  // Quiz page functionality
  document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('quiz.html')) {
      const selectedSkill = sessionStorage.getItem('selectedSkill');
      const quizContainer = document.getElementById('quiz-container');
      const resultContainer = document.getElementById('result-container');
      let currentQuestionIndex = 0;
      let score = 0;
      
      // Load questions based on selected skill
      loadQuestions(selectedSkill).then(questions => {
        displayQuestion(questions[currentQuestionIndex]);
        
        // Handle next question button
        document.getElementById('next-button').addEventListener('click', function() {
          // Check the answer before moving to next question
          const selectedOption = document.querySelector('input[name="answer"]:checked');
          if (!selectedOption) {
            alert('Please select an answer');
            return;
          }
          
          // Check if answer is correct
          if (selectedOption.value === questions[currentQuestionIndex].correct) {
            score++;
          }
          
          currentQuestionIndex++;
          
          // If all questions answered, show result
          if (currentQuestionIndex >= questions.length) {
            showResult(score, questions.length);
          } else {
            displayQuestion(questions[currentQuestionIndex]);
          }
        });
      });
      
      function displayQuestion(question) {
        quizContainer.innerHTML = `
          <h2>Question ${currentQuestionIndex + 1}</h2>
          <p>${question.question}</p>
          <div class="options">
            ${question.options.map((option, index) => `
              <div>
                <input type="radio" name="answer" id="option${index}" value="${index}">
                <label for="option${index}">${option}</label>
              </div>
            `).join('')}
          </div>
          <button id="next-button">Next Question</button>
        `;
      }
      
      function showResult(score, total) {
        quizContainer.style.display = 'none';
        resultContainer.style.display = 'block';
        resultContainer.innerHTML = `
          <h2>Quiz Results</h2>
          <p>Your score: ${score}/${total}</p>
          ${score >= 7 ? 
            `<p class="success">Congratulations! You're eligible for skill swap in ${selectedSkill}.</p>
             <button id="find-partners">Find Skill Swap Partners</button>` 
            : 
            `<p class="failure">You need at least 7 correct answers to be eligible for skill swap.</p>
             <button id="retry-quiz">Retry Quiz</button>`
          }
        `;
        
        // Handle result buttons
        if (score >= 7) {
          document.getElementById('find-partners').addEventListener('click', function() {
            window.location.href = 'partners.html?skill=' + encodeURIComponent(selectedSkill);
          });
        } else {
          document.getElementById('retry-quiz').addEventListener('click', function() {
            window.location.reload();
          });
        }
      }
    }
  });
  
  // Function to load questions based on selected skill
  async function loadQuestions(skillName) {
    // In a real application, this would fetch from your server
    // This is a mock implementation for demonstration
    const questionSets = {
      'webdev': [
        {
          question: "What does HTML stand for?",
          options: ["Hyper Text Markup Language", "High Tech Multi Language", "Hyper Transfer Markup Language", "Hybrid Text Memory Language"],
          correct: "0"
        },
        // Add 9 more questions for web development
      ],
      'appdev': [
        {
          question: "Which of these is NOT a mobile platform?",
          options: ["iOS", "Android", "Windows Mobile", "LinuxOS"],
          correct: "3"
        },
        // Add 9 more questions for app development
      ],
      'videditing': [
        {
          question: "Which of these is a common video format?",
          options: ["JPG", "MP4", "DOC", "XLS"],
          correct: "1"
        },
        // Add 9 more questions for video editing
      ]
      // Add more skills as needed
    };
    
    return questionSets[skillName.toLowerCase()] || [];
  }
  
  // Partners page functionality
  document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('partners.html')) {
      const urlParams = new URLSearchParams(window.location.search);
      const skillName = urlParams.get('skill');
      
      if (skillName) {
        document.getElementById('skill-title').textContent = `Skill Swap Partners for ${skillName}`;
        loadPartners(skillName);
      }
    }
  });
  
  // Function to load partners based on selected skill
  async function loadPartners(skillName) {
    // In a real application, this would fetch from your server
    // This is a mock implementation for demonstration
    const partnersContainer = document.getElementById('partners-container');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    const partners = [
      { name: "Alex Johnson", expertise: "Web Development", contact: "alex@example.com" },
      { name: "Sam Wilson", expertise: "App Development", contact: "sam@example.com" },
      { name: "Jamie Lee", expertise: "Video Editing", contact: "jamie@example.com" },
      { name: "Taylor Smith", expertise: "Graphic Design", contact: "taylor@example.com" }
    ];
    
    // Filter partners by skill (in a real app, this would be done server-side)
    const filteredPartners = partners.filter(partner => 
      partner.expertise.toLowerCase().includes(skillName.toLowerCase())
    );
    
    if (filteredPartners.length > 0) {
      partnersContainer.innerHTML = filteredPartners.map(partner => `
        <div class="partner-card">
          <h3>${partner.name}</h3>
          <p>Expertise: ${partner.expertise}</p>
          <button class="contact-button" data-email="${partner.contact}">Contact for Skill Swap</button>
        </div>
      `).join('');
      
      // Add event listeners to contact buttons
      document.querySelectorAll('.contact-button').forEach(button => {
        button.addEventListener('click', function() {
          const email = this.dataset.email;
          // In a real app, this might open a chat or contact form
          alert(`Contact information: ${email}`);
        });
      });
    } else {
      partnersContainer.innerHTML = `<p>No partners found for ${skillName}. Please try another skill.</p>`;
    }
  }

  document.getElementById("skillswap-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const firstName = document.getElementById("fname").value;
    const lastName = document.getElementById("lname").value;
    const email = document.getElementById("mail").value;
    const phone = document.getElementById("num").value;
    const skill = document.getElementById("skill").value;
    const skillLevel = document.getElementById("skillLevel").value;
    const lookingFor = document.getElementById("skill-needed").value;
    const password = "123456"; // Temporary fixed password (until login form is made)
  
    const fullName = `${firstName} ${lastName}`;
  
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password
        })
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert("🎉 Registered successfully!");
        console.log("User:", data.user);
      } else {
        alert("⚠️ " + data.msg);
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong.");
    }
  });
  