# QuizApp - Online Quiz Platform

A modern, responsive online quiz application built with HTML, CSS, JavaScript, and Firebase. Users can create, take, and share quizzes with a beautiful, intuitive interface.

## Features

### Authentication
- **Google Sign-In**: Quick login with Google account
- **Email/Password**: Traditional registration and login
- **Forgot Password**: Password reset functionality
- **User Management**: Profile display and logout

### Quiz Functionality
- **Take Quizzes**: Browse and take available quizzes
- **Create Quizzes**: Build custom quizzes with multiple choice questions
- **Real-time Scoring**: Instant results with percentage and feedback
- **Progress Tracking**: Visual progress indicators during quiz taking
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### User Experience
- **Modern UI**: Clean, gradient-based design with smooth animations
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Visual feedback during async operations
- **Mobile-First**: Responsive design that works on all devices

## Setup Instructions

### 1. Firebase Configuration
The Firebase configuration is already set up in the HTML file with the provided credentials:
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDcbdYXimOSVguNwY8wMjJg0g2ib_XisTM",
    authDomain: "quiz-gla-087.firebaseapp.com",
    projectId: "quiz-gla-087",
    storageBucket: "quiz-gla-087.firebasestorage.app",
    messagingSenderId: "171276610634",
    appId: "1:171276610634:web:ff128e3e11928197eccab3",
    measurementId: "G-VD8BQQZDJ8"
};
```

### 2. Firebase Console Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project "quiz-gla-087"
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google sign-in
4. Set up Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules (see below)

### 3. Firestore Security Rules
Add these rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read all quizzes
    match /quizzes/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Running the Application
1. Simply open `index.html` in a web browser
2. The application will work with the provided Firebase configuration
3. No additional setup or build process required

## File Structure

```
quizpp/
├── index.html          # Main HTML file with all sections and modals
├── styles.css          # Complete CSS styling with responsive design
├── script.js           # JavaScript functionality and Firebase integration
└── README.md           # This documentation file
```

## Usage Guide

### For Quiz Takers
1. **Register/Login**: Create an account or sign in with Google
2. **Browse Quizzes**: View available quizzes on the Quizzes page
3. **Take Quiz**: Click on any quiz to start taking it
4. **Navigate**: Use Previous/Next buttons or click Submit when done
5. **View Results**: See your score and performance feedback

### For Quiz Creators
1. **Login**: Sign in to your account
2. **Create Quiz**: Go to "Create Quiz" section
3. **Add Details**: Enter quiz title and description
4. **Add Questions**: Click "Add Question" to create multiple choice questions
5. **Set Correct Answers**: The first option is automatically set as correct
6. **Publish**: Click "Create Quiz" to save and publish

## Features in Detail

### Authentication System
- **Email/Password Registration**: Full form validation and error handling
- **Google OAuth**: One-click authentication with Google
- **Password Reset**: Secure password recovery via email
- **Session Management**: Automatic login state persistence

### Quiz Interface
- **Question Navigation**: Smooth transitions between questions
- **Answer Selection**: Click to select answers with visual feedback
- **Progress Tracking**: Current question indicator
- **Score Calculation**: Automatic scoring with percentage and feedback

### Data Management
- **Firestore Integration**: Real-time data synchronization
- **Quiz Storage**: Structured quiz data with metadata
- **User Association**: Quizzes linked to creator accounts

## Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Security Features
- Firebase Authentication for secure user management
- Firestore security rules for data protection
- Input validation and sanitization
- HTTPS enforcement for secure connections

## Customization
The application is built with modular CSS and JavaScript, making it easy to customize:
- **Colors**: Modify CSS variables for different color schemes
- **Layout**: Adjust grid layouts and spacing
- **Features**: Add new functionality by extending the JavaScript modules

## Troubleshooting

### Common Issues
1. **Firebase not loading**: Check internet connection and Firebase configuration
2. **Authentication errors**: Verify Firebase Auth is enabled in console
3. **Database errors**: Ensure Firestore rules allow read/write operations
4. **Google sign-in not working**: Check Google OAuth configuration in Firebase

### Error Messages
The application provides user-friendly error messages for common issues:
- Network connectivity problems
- Authentication failures
- Form validation errors
- Database operation failures

## Future Enhancements
- Quiz categories and tags
- User profiles and statistics
- Quiz sharing and collaboration
- Advanced question types
- Quiz analytics and reporting
- Social features and leaderboards

## Support
For technical support or questions about the application, please refer to the Firebase documentation or create an issue in the project repository.

---

**Built with ❤️ using HTML, CSS, JavaScript, and Firebase**
