alert("Welcome to Skill Exchange.com");
alert("Welcome to Skill Swap.com");
const questions = [
    {
        question: "What is the purpose of Node.js in web development?",
        options: ["Frontend development", "Backend development", "Database management", "Designing UI"],
        correct: 1
    },
    {
        question: "Which programming language is primarily used for Machine Learning?",
        options: ["JavaScript", "Python", "C++", "Java"],
        correct: 1
    },
    {
        question: "What is MongoDB?",
        options: ["A NoSQL database", "A frontend library", "A backend framework", "A cloud service"],
        correct: 0
    },
    {
        question: "Which CSS property removes the underline from an anchor tag?",
        options: ["text-decoration", "border", "background-color", "padding"],
        correct: 0
    },
    {
        question: "What is the primary focus of DSA (Data Structures and Algorithms)?",
        options: ["Designing User Interfaces", "Efficient data processing", "Creating websites", "Building 3D models"],
        correct: 1
    },
    {
        question: "In App Development, which framework is commonly used for cross-platform mobile app development?",
        options: ["React Native", "Angular", "Vue.js", "Django"],
        correct: 0
    },
    {
        question: "What is the primary language used for developing web pages?",
        options: ["JavaScript", "HTML", "Python", "C++"],
        correct: 1
    },
    {
        question: "Which of these is NOT a good strategy for Social Media Management?",
        options: ["Posting consistently", "Engaging with the audience", "Using clickbait headlines", "Analyzing audience metrics"],
        correct: 2
    },
    {
        question: "Which software is commonly used for video editing?",
        options: ["Adobe Photoshop", "Final Cut Pro", "Blender", "AutoCAD"],
        correct: 1
    },
    {
        question: "What is the role of SEO (Search Engine Optimization) in Digital Marketing?",
        options: ["Improving website visibility on search engines", "Creating content for social media", "Running paid ads", "Designing a website"],
        correct: 0
    },
    {
        question: "Which design software is widely used for vector graphics creation?",
        options: ["Adobe Photoshop", "CorelDRAW", "Adobe Illustrator", "Blender"],
        correct: 2
    },
    {
        question: "What is the purpose of a color palette in Graphic Design?",
        options: ["To create visual hierarchy", "To add texture", "To create consistency and mood", "To add random colors"],
        correct: 2
    },
    {
        question: "Which file format is commonly used for web graphics with transparency?",
        options: [".png", ".jpg", ".gif", ".svg"],
        correct: 0
    }
];

let currentQuestionIndex = 0;
let score = 0;

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById("question").textContent = question.question;
    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.classList.add("option-btn");
        button.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedIndex) {
    const correctIndex = questions[currentQuestionIndex].correct;
    if (selectedIndex === correctIndex) {
        score++;
    }
    document.getElementById("next-btn").disabled = false;
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
        document.getElementById("next-btn").disabled = true;
    } else {
        showResult();
    }
}

function showResult() {
    document.getElementById("quiz").style.display = "none";
    const scoreElement = document.getElementById("score");
    scoreElement.textContent = score;
    document.getElementById("result").style.display = "block";
}

if (score >= Math.ceil(questions.length * 0.75)) {
    alert("Congratulations, you're eligible for Skill Swap!");
    console.log("Congratulations, you're eligible to pass!");
}


function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById("quiz").style.display = "block";
    document.getElementById("result").style.display = "none";
    loadQuestion();
    document.getElementById("next-btn").disabled = true;
}



loadQuestion();
