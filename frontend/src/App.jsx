import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CoursePlayer from './pages/CoursePlayer.jsx';
import QuizTaker from './pages/QuizTaker.jsx';

// Auth and API Context
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// API URL (can be customized via env, default to local Django server)
const API_BASE_URL = 'http://localhost:8000/api';

// Offline Mock Database for testing when backend is not running
const MOCK_COURSES = [
  {
    id: 1,
    title: 'Python Masterclass: From Zero to Hero',
    description: 'Learn Python programming language from the absolute basics up to advanced algorithms, OOP, and script automation.',
    category: 'Development',
    difficulty: 'Beginner',
    instructor: 'Dr. Angela Yu',
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=60',
    duration: '24 hours',
    rating: 4.8,
    enrolled: false,
    modules: [
      {
        id: 101,
        title: 'Module 1: Getting Started with Python',
        lessons: [
          { id: 1001, title: '1.1 Installation & Setup', duration: '8 mins', completed: false, video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', content: 'In this lesson, you will install Python 3.12 and configure Visual Studio Code.' },
          { id: 1002, title: '1.2 Hello World & Variables', duration: '12 mins', completed: false, video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', content: 'Understand standard output and how variables store data in memory.' }
        ]
      },
      {
        id: 102,
        title: 'Module 2: Control Flow & Data Structures',
        lessons: [
          { id: 1003, title: '2.1 Conditional statements (if-else)', duration: '15 mins', completed: false, video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', content: 'Learn branching logic and boolean variables.' },
          { id: 1004, title: '2.2 For & While Loops', duration: '18 mins', completed: false, video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', content: 'Master iterations and list comprehensions in Python.' }
        ]
      }
    ],
    quiz: {
      id: 501,
      title: 'Python Programming Essentials Quiz',
      questions: [
        {
          id: 1,
          question_text: 'Which data type is mutable in Python?',
          choices: [
            { id: 11, choice_text: 'Tuple', is_correct: false },
            { id: 12, choice_text: 'List', is_correct: true },
            { id: 13, choice_text: 'String', is_correct: false },
            { id: 14, choice_text: 'Integer', is_correct: false }
          ]
        },
        {
          id: 2,
          question_text: 'How do you insert an element at the end of a list in Python?',
          choices: [
            { id: 21, choice_text: 'list.add(item)', is_correct: false },
            { id: 22, choice_text: 'list.append(item)', is_correct: true },
            { id: 23, choice_text: 'list.insert(item)', is_correct: false },
            { id: 24, choice_text: 'list.push(item)', is_correct: false }
          ]
        }
      ]
    }
  },
  {
    id: 2,
    title: 'Modern Front-End: React.js & Advanced CSS',
    description: 'Master React, hooks, contexts, routing, and beautiful styling with CSS custom properties and flexbox/grid layouts.',
    category: 'Design & Frontend',
    difficulty: 'Intermediate',
    instructor: 'Sarah Jenkins',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
    duration: '18 hours',
    rating: 4.9,
    enrolled: false,
    modules: [
      {
        id: 201,
        title: 'Module 1: Introduction to React & JSX',
        lessons: [
          { id: 2001, title: '1.1 Declarative vs Imperative UI', duration: '10 mins', completed: false, video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', content: 'Learn why React makes frontend development easier and declarative.' },
          { id: 2002, title: '1.2 Creating Custom Components', duration: '14 mins', completed: false, video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', content: 'Understand props, JSX, and building modular interfaces.' }
        ]
      }
    ],
    quiz: {
      id: 502,
      title: 'React Core concepts Quiz',
      questions: [
        {
          id: 3,
          question_text: 'Which hook would you use to fetch data when a component mounts?',
          choices: [
            { id: 31, choice_text: 'useState', is_correct: false },
            { id: 32, choice_text: 'useContext', is_correct: false },
            { id: 33, choice_text: 'useEffect', is_correct: true },
            { id: 34, choice_text: 'useReducer', is_correct: false }
          ]
        }
      ]
    }
  },
  {
    id: 3,
    title: 'Scalable APIs with Django & PostgreSQL',
    description: 'Learn Django REST Framework, database optimization, JWT authentication, and deploying servers to cloud virtual machines.',
    category: 'Back-End',
    difficulty: 'Advanced',
    instructor: 'David Miller',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60',
    duration: '32 hours',
    rating: 4.7,
    enrolled: false,
    modules: [
      {
        id: 301,
        title: 'Module 1: Django REST Framework Foundations',
        lessons: [
          { id: 3001, title: '1.1 Serializers & Class-Based Views', duration: '15 mins', completed: false, video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', content: 'Learn to convert database models into JSON response objects.' }
        ]
      }
    ]
  }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('mock_courses');
    return saved ? JSON.parse(saved) : MOCK_COURSES;
  });
  const [completedLessons, setCompletedLessons] = useState(() => {
    const saved = localStorage.getItem('completed_lessons');
    return saved ? JSON.parse(saved) : [];
  });
  const [quizAttempts, setQuizAttempts] = useState(() => {
    const saved = localStorage.getItem('quiz_attempts');
    return saved ? JSON.parse(saved) : {};
  });

  // Sync state to local storage for the mock DB fallback
  useEffect(() => {
    localStorage.setItem('mock_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('completed_lessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem('quiz_attempts', JSON.stringify(quizAttempts));
  }, [quizAttempts]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // Decode JWT token basic details or fetch profile
      // In Mock mode we set a dummy user profile
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        const dummyUser = { username: 'scholar_demo', email: 'scholar@edustream.com', full_name: 'Demo Student' };
        setUser(dummyUser);
        localStorage.setItem('user', JSON.stringify(dummyUser));
      }
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  }, [token]);

  // Combined real backend + fallback mock API helper
  const apiFetch = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Add JWT Token if exists
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'API request failed');
      }
      return await response.json();
    } catch (error) {
      console.warn(`Backend connection failed for ${endpoint}. Falling back to client-side database simulation:`, error.message);
      return simulateMockAPI(endpoint, options);
    }
  };

  // Mock Database Router Simulating REST Endpoints
  const simulateMockAPI = (endpoint, options = {}) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Auth - Login
        if (endpoint === '/auth/login/' && options.method === 'POST') {
          const body = JSON.parse(options.body);
          if (body.username && body.password) {
            const token = 'mock-jwt-token-xyz-123456';
            const user = { username: body.username, email: `${body.username}@edustream.com`, full_name: body.username.charAt(0).toUpperCase() + body.username.slice(1) };
            localStorage.setItem('user', JSON.stringify(user));
            resolve({ access: token, user });
          } else {
            reject(new Error('Username and password are required'));
          }
        }
        
        // Auth - Register
        else if (endpoint === '/auth/register/' && options.method === 'POST') {
          const body = JSON.parse(options.body);
          if (body.username && body.password && body.email) {
            const token = 'mock-jwt-token-xyz-123456';
            const user = { username: body.username, email: body.email, full_name: body.full_name || body.username };
            localStorage.setItem('user', JSON.stringify(user));
            resolve({ access: token, user });
          } else {
            reject(new Error('Missing required fields'));
          }
        }
        
        // Courses - List
        else if (endpoint === '/courses/' && (!options.method || options.method === 'GET')) {
          resolve(courses);
        }
        
        // Course Detail
        else if (endpoint.startsWith('/courses/') && endpoint.endsWith('/') && (!options.method || options.method === 'GET')) {
          const parts = endpoint.split('/');
          const id = parseInt(parts[2]);
          const course = courses.find(c => c.id === id);
          if (course) resolve(course);
          else reject(new Error('Course not found'));
        }
        
        // Enroll
        else if (endpoint.endsWith('/enroll/') && options.method === 'POST') {
          const parts = endpoint.split('/');
          const id = parseInt(parts[2]);
          setCourses(prev => prev.map(c => c.id === id ? { ...c, enrolled: true } : c));
          resolve({ status: 'enrolled', course_id: id });
        }
        
        // Lesson Completion
        else if (endpoint.includes('/lessons/') && endpoint.endsWith('/complete/') && options.method === 'POST') {
          const parts = endpoint.split('/');
          const lessonId = parseInt(parts[4]);
          if (!completedLessons.includes(lessonId)) {
            setCompletedLessons(prev => [...prev, lessonId]);
          }
          resolve({ status: 'success', completed: true, lesson_id: lessonId });
        }
        
        // Quiz Submission
        else if (endpoint.includes('/quiz/') && endpoint.endsWith('/submit/') && options.method === 'POST') {
          const parts = endpoint.split('/');
          const quizId = parseInt(parts[4]);
          const body = JSON.parse(options.body);
          const submittedAnswers = body.answers; // {questionId: choiceId}
          
          // Compute score
          let correctCount = 0;
          let totalCount = 0;
          
          // Find quiz questions in local DB
          let foundQuiz = null;
          for (const c of courses) {
            if (c.quiz && c.quiz.id === quizId) {
              foundQuiz = c.quiz;
              break;
            }
          }
          
          if (!foundQuiz) {
            reject(new Error('Quiz not found'));
            return;
          }
          
          foundQuiz.questions.forEach(q => {
            totalCount++;
            const selectedChoiceId = submittedAnswers[q.id];
            const correctChoice = q.choices.find(ch => ch.is_correct);
            if (correctChoice && selectedChoiceId === correctChoice.id) {
              correctCount++;
            }
          });
          
          const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
          const attemptData = { score: percentage, correct: correctCount, total: totalCount, submitted_at: new Date().toISOString() };
          
          setQuizAttempts(prev => ({
            ...prev,
            [quizId]: attemptData
          }));
          
          resolve({ quiz_id: quizId, ...attemptData });
        }
        
        // Fallback catch
        else {
          reject(new Error('Mock endpoint handler not found'));
        }
      }, 300);
    });
  };

  const login = (accessToken, userData) => {
    setToken(accessToken);
    setUser(userData);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Protected Route Wrapper
  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <AuthContext.Provider value={{ user, token, courses, completedLessons, quizAttempts, login, logout, apiFetch }}>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/courses/:courseId" 
                element={
                  <ProtectedRoute>
                    <CoursePlayer />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/courses/:courseId/quiz/:quizId" 
                element={
                  <ProtectedRoute>
                    <QuizTaker />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}
