// Global variables
let currentUser = null;
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let quizData = [];

// DOM elements
const navAuth = document.getElementById('nav-auth');
const navUser = document.getElementById('nav-user');
const userName = document.getElementById('user-name');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');

// Modals
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const forgotPasswordModal = document.getElementById('forgot-password-modal');

// Forms
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const forgotPasswordForm = document.getElementById('forgot-password-form');

// Sections
const sections = document.querySelectorAll('.section');
const homeSection = document.getElementById('home');
const quizzesSection = document.getElementById('quizzes');
const createSection = document.getElementById('create');
const quizTakingSection = document.getElementById('quiz-taking');
const resultsSection = document.getElementById('quiz-results');

// Quiz elements
const quizGrid = document.getElementById('quiz-grid');
const createQuizForm = document.getElementById('create-quiz-form');
const questionsContainer = document.getElementById('questions-container');
const addQuestionBtn = document.getElementById('add-question');

// Quiz taking elements
const quizTakingTitle = document.getElementById('quiz-taking-title');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const prevQuestionBtn = document.getElementById('prev-question');
const nextQuestionBtn = document.getElementById('next-question');
const submitQuizBtn = document.getElementById('submit-quiz');

// Results elements
const finalScore = document.getElementById('final-score');
const scoreMessage = document.getElementById('score-message');
const correctAnswers = document.getElementById('correct-answers');
const totalQuestionsResult = document.getElementById('total-questions-result');
const percentage = document.getElementById('percentage');
const retakeQuizBtn = document.getElementById('retake-quiz');
const backToQuizzesBtn = document.getElementById('back-to-quizzes');

// Loading and toast
const loading = document.getElementById('loading');
const toastContainer = document.getElementById('toast-container');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadQuizzes();
});