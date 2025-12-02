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

// Initialize Firebase and check auth state
function initializeApp() {
    // Check if Firebase is loaded
    if (typeof window.firebase === 'undefined') {
        showToast('Firebase is not loaded. Please check your internet connection.', 'error');
        return;
    }

    // Listen for auth state changes
    window.firebase.onAuthStateChanged(window.firebase.auth, (user) => {
        currentUser = user;
        updateUI();
    });
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    loginBtn.addEventListener('click', () => showModal('login'));
    registerBtn.addEventListener('click', () => showModal('register'));
    logoutBtn.addEventListener('click', logout);
    
    // Modal controls
    document.getElementById('close-login').addEventListener('click', () => hideModal('login'));
    document.getElementById('close-register').addEventListener('click', () => hideModal('register'));
    document.getElementById('close-forgot').addEventListener('click', () => hideModal('forgot'));
    
    // Auth links
    document.getElementById('show-register').addEventListener('click', () => {
        hideModal('login');
        showModal('register');
    });
    document.getElementById('show-login').addEventListener('click', () => {
        hideModal('register');
        showModal('login');
    });
    document.getElementById('forgot-password-link').addEventListener('click', () => {
        hideModal('login');
        showModal('forgot');
    });
    document.getElementById('back-to-login').addEventListener('click', () => {
        hideModal('forgot');
        showModal('login');
    });
    
    // Forms
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('click', handleRegister);
    forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    
    // Google auth
    document.getElementById('google-login').addEventListener('click', () => handleGoogleAuth('login'));
    document.getElementById('google-register').addEventListener('click', () => handleGoogleAuth('register'));
    
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.target.getAttribute('href').substring(1);
            showSection(target);
        });
    });
    
    // Hero buttons
    document.getElementById('start-quiz-btn').addEventListener('click', () => showSection('quizzes'));
    document.getElementById('create-quiz-btn').addEventListener('click', () => showSection('create'));
    
    // Quiz creation
    addQuestionBtn.addEventListener('click', addQuestion);
    createQuizForm.addEventListener('submit', handleCreateQuiz);
    
    // Quiz taking
    prevQuestionBtn.addEventListener('click', previousQuestion);
    nextQuestionBtn.addEventListener('click', nextQuestion);
    submitQuizBtn.addEventListener('click', submitQuiz);
    
    // Results
    retakeQuizBtn.addEventListener('click', retakeQuiz);
    backToQuizzesBtn.addEventListener('click', () => showSection('quizzes'));
    
    // Mobile menu
    document.getElementById('hamburger').addEventListener('click', toggleMobileMenu);
}

// Authentication functions
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        showLoading(true);
        await window.firebase.signInWithEmailAndPassword(window.firebase.auth, email, password);
        showToast('Login successful!', 'success');
        hideModal('login');
        loginForm.reset();
    } catch (error) {
        showToast(getErrorMessage(error), 'error');
    } finally {
        showLoading(false);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    try {
        showLoading(true);
        const userCredential = await window.firebase.createUserWithEmailAndPassword(window.firebase.auth, email, password);
        await userCredential.user.updateProfile({ displayName: name });
        showToast('Registration successful!', 'success');
        hideModal('register');
        registerForm.reset();
    } catch (error) {
        showToast(getErrorMessage(error), 'error');
    } finally {
        showLoading(false);
    }
}

async function handleForgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value;
    
    try {
        showLoading(true);
        await window.firebase.sendPasswordResetEmail(window.firebase.auth, email);
        showToast('Password reset email sent!', 'success');
        hideModal('forgot');
        forgotPasswordForm.reset();
    } catch (error) {
        showToast(getErrorMessage(error), 'error');
    } finally {
        showLoading(false);
    }
}

async function handleGoogleAuth(type) {
    try {
        showLoading(true);
        const result = await window.firebase.signInWithPopup(window.firebase.auth, window.firebase.provider);
        showToast(`${type === 'login' ? 'Login' : 'Registration'} successful!`, 'success');
        hideModal(type);
    } catch (error) {
        showToast(getErrorMessage(error), 'error');
    } finally {
        showLoading(false);
    }
}

async function logout() {
    try {
        await window.firebase.signOut(window.firebase.auth);
        showToast('Logged out successfully', 'success');
        showSection('home');
    } catch (error) {
        showToast('Error logging out', 'error');
    }
}

// UI functions
function updateUI() {
    if (currentUser) {
        navAuth.style.display = 'none';
        navUser.style.display = 'flex';
        userName.textContent = currentUser.displayName || currentUser.email;
    } else {
        navAuth.style.display = 'flex';
        navUser.style.display = 'none';
    }
}

function showModal(modalName) {
    const modal = document.getElementById(`${modalName}-modal`);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideModal(modalName) {
    const modal = document.getElementById(`${modalName}-modal`);
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showSection(sectionName) {
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionName).classList.add('active');
    
    // Close mobile menu if open
    document.getElementById('nav-menu').classList.remove('active');
}

function toggleMobileMenu() {
    document.getElementById('nav-menu').classList.toggle('active');
}

function showLoading(show) {
    if (show) {
        loading.classList.add('active');
    } else {
        loading.classList.remove('active');
    }
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

function getErrorMessage(error) {
    switch (error.code) {
        case 'auth/user-not-found':
            return 'No user found with this email address.';
        case 'auth/wrong-password':
            return 'Incorrect password.';
        case 'auth/email-already-in-use':
            return 'An account with this email already exists.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/invalid-email':
            return 'Invalid email address.';
        case 'auth/user-disabled':
            return 'This account has been disabled.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        default:
            return error.message || 'An error occurred. Please try again.';
    }
}

// Quiz functions
async function loadQuizzes() {
    try {
        showLoading(true);
        const querySnapshot = await window.firebase.getDocs(window.firebase.collection(window.firebase.db, 'quizzes'));
        quizData = [];
        querySnapshot.forEach((doc) => {
            quizData.push({ id: doc.id, ...doc.data() });
        });
        displayQuizzes();
    } catch (error) {
        showToast('Error loading quizzes', 'error');
    } finally {
        showLoading(false);
    }
}

function displayQuizzes() {
    quizGrid.innerHTML = '';
    
    if (quizData.length === 0) {
        quizGrid.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1 / -1;">No quizzes available. Create one to get started!</p>';
        return;
    }
    
    quizData.forEach(quiz => {
        const quizCard = document.createElement('div');
        quizCard.className = 'quiz-card';
        quizCard.innerHTML = `
            <h3>${quiz.title}</h3>
            <p>${quiz.description || 'No description available'}</p>
            <div class="quiz-meta">
                <span><i class="fas fa-question-circle"></i> ${quiz.questions.length} questions</span>
                <span><i class="fas fa-user"></i> ${quiz.createdBy}</span>
            </div>
        `;
        quizCard.addEventListener('click', () => startQuiz(quiz));
        quizGrid.appendChild(quizCard);
    });
}

function startQuiz(quiz) {
    if (!currentUser) {
        showToast('Please login to take quizzes', 'error');
        showModal('login');
        return;
    }
    
    currentQuiz = quiz;
    currentQuestionIndex = 0;
    userAnswers = [];
    
    quizTakingTitle.textContent = quiz.title;
    totalQuestionsSpan.textContent = quiz.questions.length;
    
    showSection('quiz-taking');
    displayQuestion();
}

function displayQuestion() {
    const question = currentQuiz.questions[currentQuestionIndex];
    
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    questionText.textContent = question.question;
    
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => selectOption(index));
        
        // Check if this option was previously selected
        if (userAnswers[currentQuestionIndex] === index) {
            optionElement.classList.add('selected');
        }
        
        optionsContainer.appendChild(optionElement);
    });
    
    // Update navigation buttons
    prevQuestionBtn.disabled = currentQuestionIndex === 0;
    
    if (currentQuestionIndex === currentQuiz.questions.length - 1) {
        nextQuestionBtn.style.display = 'none';
        submitQuizBtn.style.display = 'inline-block';
    } else {
        nextQuestionBtn.style.display = 'inline-block';
        submitQuizBtn.style.display = 'none';
    }
}

function selectOption(optionIndex) {
    // Remove previous selection
    optionsContainer.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection to clicked option
    optionsContainer.children[optionIndex].classList.add('selected');
    
    // Store answer
    userAnswers[currentQuestionIndex] = optionIndex;
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

function nextQuestion() {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
}

function submitQuiz() {
    // Calculate score
    let correctCount = 0;
    currentQuiz.questions.forEach((question, index) => {
        if (userAnswers[index] === question.correctAnswer) {
            correctCount++;
        }
    });
    
    const percentage = Math.round((correctCount / currentQuiz.questions.length) * 100);
    
    // Display results
    finalScore.textContent = percentage;
    correctAnswers.textContent = correctCount;
    totalQuestionsResult.textContent = currentQuiz.questions.length;
    document.getElementById('percentage').textContent = percentage + '%';
    
    // Set score message
    if (percentage >= 90) {
        scoreMessage.textContent = 'Excellent! Outstanding performance!';
    } else if (percentage >= 80) {
        scoreMessage.textContent = 'Great job! Well done!';
    } else if (percentage >= 70) {
        scoreMessage.textContent = 'Good work! Keep it up!';
    } else if (percentage >= 60) {
        scoreMessage.textContent = 'Not bad! Room for improvement.';
    } else {
        scoreMessage.textContent = 'Keep studying! You can do better!';
    }
    
    showSection('quiz-results');
}

function retakeQuiz() {
    startQuiz(currentQuiz);
}

// Quiz creation functions
function addQuestion() {
    const questionNumber = questionsContainer.children.length + 1;
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-form';
    questionDiv.innerHTML = `
        <div class="form-group">
            <label>Question ${questionNumber}</label>
            <input type="text" class="question-input" placeholder="Enter your question" required>
        </div>
        <div class="options-form">
            <div class="form-group">
                <label>Option 1 (Correct Answer)</label>
                <input type="text" class="option-input" placeholder="Enter correct answer" required>
            </div>
            <div class="form-group">
                <label>Option 2</label>
                <input type="text" class="option-input" placeholder="Enter option 2" required>
            </div>
            <div class="form-group">
                <label>Option 3</label>
                <input type="text" class="option-input" placeholder="Enter option 3" required>
            </div>
            <div class="form-group">
                <label>Option 4</label>
                <input type="text" class="option-input" placeholder="Enter option 4" required>
            </div>
        </div>
        <button type="button" class="btn btn-outline remove-question">Remove Question</button>
    `;
    
    questionsContainer.appendChild(questionDiv);
    
    // Add remove functionality
    questionDiv.querySelector('.remove-question').addEventListener('click', () => {
        questionDiv.remove();
        updateQuestionNumbers();
    });
}

function updateQuestionNumbers() {
    const questions = questionsContainer.querySelectorAll('.question-form');
    questions.forEach((question, index) => {
        question.querySelector('label').textContent = `Question ${index + 1}`;
    });
}

async function handleCreateQuiz(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showToast('Please login to create quizzes', 'error');
        showModal('login');
        return;
    }
    
    const title = document.getElementById('quiz-title').value;
    const description = document.getElementById('quiz-description').value;
    const questions = [];
    
    // Collect questions
    const questionForms = questionsContainer.querySelectorAll('.question-form');
    if (questionForms.length === 0) {
        showToast('Please add at least one question', 'error');
        return;
    }
    
    questionForms.forEach(questionForm => {
        const questionInput = questionForm.querySelector('.question-input');
        const optionInputs = questionForm.querySelectorAll('.option-input');
        
        if (questionInput.value.trim() && optionInputs[0].value.trim()) {
            const options = Array.from(optionInputs).map(input => input.value.trim());
            questions.push({
                question: questionInput.value.trim(),
                options: options,
                correctAnswer: 0 // First option is always correct
            });
        }
    });
    
    if (questions.length === 0) {
        showToast('Please add valid questions', 'error');
        return;
    }
    
    try {
        showLoading(true);
        const quizData = {
            title: title,
            description: description,
            questions: questions,
            createdBy: currentUser.displayName || currentUser.email,
            createdAt: new Date(),
            createdByUid: currentUser.uid
        };
        
        await window.firebase.addDoc(window.firebase.collection(window.firebase.db, 'quizzes'), quizData);
        showToast('Quiz created successfully!', 'success');
        createQuizForm.reset();
        questionsContainer.innerHTML = '';
        showSection('quizzes');
        loadQuizzes();
    } catch (error) {
        showToast('Error creating quiz', 'error');
    } finally {
        showLoading(false);
    }
}

// Close modals when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});
