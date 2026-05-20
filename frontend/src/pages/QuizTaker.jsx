import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App.jsx';
import { Award, ChevronRight, CheckCircle2, XCircle, ArrowLeft, RefreshCw, Clipboard } from 'lucide-react';

export default function QuizTaker() {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const { apiFetch, quizAttempts } = useAuth();

  const [course, setCourse] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionId: choiceId }
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      setLoading(true);
      setError('');
      try {
        const courseData = await apiFetch(`/courses/${courseId}/`);
        setCourse(courseData);
        if (courseData.quiz && courseData.quiz.id === parseInt(quizId)) {
          setQuiz(courseData.quiz);
          
          // Check if user already has a saved attempt in global/local state
          if (quizAttempts[quizId]) {
            setResult(quizAttempts[quizId]);
          }
        } else {
          throw new Error('Quiz not found in this course.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load quiz data');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [courseId, quizId, quizAttempts]);

  const handleSelectChoice = (questionId, choiceId) => {
    if (result) return; // Read-only if already submitted
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: choiceId
    }));
  };

  const handleSubmitQuiz = async () => {
    const totalQuestions = quiz.questions.length;
    const answeredCount = Object.keys(selectedAnswers).length;
    
    if (answeredCount < totalQuestions) {
      if (!confirm(`You have only answered ${answeredCount} out of ${totalQuestions} questions. Are you sure you want to submit?`)) {
        return;
      }
    }

    setSubmitting(true);
    setError('');

    try {
      const data = await apiFetch(`/courses/${courseId}/quiz/${quizId}/submit/`, {
        method: 'POST',
        body: JSON.stringify({ answers: selectedAnswers })
      });
      
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to grade quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setResult(null);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
  };

  if (loading) {
    return (
      <div className="container" style={styles.loaderContainer}>
        <div className="shimmer-bg" style={{ height: '40px', width: '40%', marginBottom: '20px' }}></div>
        <div className="shimmer-bg" style={{ height: '250px', borderRadius: 'var(--radius-md)' }}></div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="container" style={styles.errorContainer}>
        <h2 className="text-gradient">Quiz Error</h2>
        <p>{error || 'Unable to load quiz details'}</p>
        <Link to={`/courses/${courseId}`} className="btn btn-secondary" style={{ marginTop: '20px' }}>
          Back to Course
        </Link>
      </div>
    );
  }

  const questions = quiz.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const hasSelected = selectedAnswers[currentQuestion.id] !== undefined;

  // RESULT SCREEN
  if (result) {
    const isPassing = result.score >= 70;
    return (
      <div className="container animate-fade-in" style={styles.quizPage}>
        <Link to={`/courses/${courseId}`} style={styles.backLink}>
          <ArrowLeft size={16} /> Back to Syllabus
        </Link>

        <div style={styles.resultCard} className="glass-card">
          <div style={styles.scoreCircle}>
            <Award size={48} color={isPassing ? 'hsl(var(--success))' : 'hsl(var(--error))'} />
            <h2 style={{ fontSize: '36px', marginTop: '10px' }}>{result.score}%</h2>
            <p style={{ fontSize: '13px', color: 'hsl(var(--text-secondary))' }}>
              {isPassing ? 'Passed' : 'Keep Practicing'}
            </p>
          </div>

          <div style={styles.resultText}>
            <h1>Quiz Evaluation</h1>
            <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '20px' }}>
              You answered <strong>{result.correct}</strong> out of <strong>{result.total}</strong> questions correctly.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link to={`/courses/${courseId}`} className="btn btn-primary">
                Return to Course
              </Link>
              <button onClick={handleRetake} className="btn btn-secondary">
                <RefreshCw size={16} /> Retake Quiz
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Question Review if available */}
        <div style={styles.reviewSection}>
          <h2 style={{ marginBottom: '20px' }}>Question Review</h2>
          <div style={styles.questionsReviewList}>
            {questions.map((q, idx) => {
              const selectedChoiceId = selectedAnswers[q.id] || result.answers?.[q.id]; // fallback
              return (
                <div key={q.id} className="glass-card" style={styles.reviewQuestionItem}>
                  <div style={styles.qReviewHeader}>
                    <h4>Question {idx + 1}</h4>
                  </div>
                  <p style={styles.questionText}>{q.question_text}</p>
                  <div style={styles.reviewChoices}>
                    {q.choices.map(choice => {
                      const isSelected = selectedChoiceId === choice.id;
                      // In local mockup mode, we have choice.is_correct directly inside quiz.questions in context!
                      // (Wait, the backend serializer hides is_correct, but for rendering reviews locally we check choice.is_correct)
                      const isCorrect = choice.is_correct;
                      
                      let choiceStyle = styles.reviewChoice;
                      let icon = null;
                      
                      if (isSelected) {
                        if (isCorrect) {
                          choiceStyle = { ...styles.reviewChoice, ...styles.correctSelected };
                          icon = <CheckCircle2 size={16} color="hsl(var(--success))" />;
                        } else {
                          choiceStyle = { ...styles.reviewChoice, ...styles.wrongSelected };
                          icon = <XCircle size={16} color="hsl(var(--error))" />;
                        }
                      } else if (isCorrect) {
                        choiceStyle = { ...styles.reviewChoice, ...styles.correctUnselected };
                      }

                      return (
                        <div key={choice.id} style={choiceStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>{choice.choice_text}</span>
                          </div>
                          {icon}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE QUIZ INTERFACE
  return (
    <div className="container animate-fade-in" style={styles.quizPage}>
      {/* Back link */}
      <Link to={`/courses/${courseId}`} style={styles.backLink}>
        <ArrowLeft size={16} /> Back to Course
      </Link>

      <div style={styles.quizHeader}>
        <div>
          <span className="badge badge-primary" style={{ gap: '6px', marginBottom: '8px' }}>
            <Clipboard size={14} /> Evaluation
          </span>
          <h1 style={styles.quizTitle}>{quiz.title}</h1>
          <p style={styles.quizSubtitle}>{course.title}</p>
        </div>
        <div style={styles.progressCounter}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressBarTrack}>
        <div style={{ ...styles.progressBarFill, width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
      </div>

      {/* Question Card */}
      <div className="glass-card" style={styles.questionCard}>
        <h3 style={styles.activeQuestionText}>{currentQuestion.question_text}</h3>
        
        <div style={styles.choicesGrid}>
          {currentQuestion.choices.map(choice => {
            const isSelected = selectedAnswers[currentQuestion.id] === choice.id;
            return (
              <button 
                key={choice.id} 
                onClick={() => handleSelectChoice(currentQuestion.id, choice.id)}
                style={{ 
                  ...styles.choiceBtn, 
                  ...(isSelected ? styles.selectedChoiceBtn : {}) 
                }}
              >
                <div style={{ ...styles.choiceDot, ...(isSelected ? styles.selectedChoiceDot : {}) }}></div>
                <span>{choice.choice_text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation */}
      <div style={styles.quizNav}>
        <button 
          className="btn btn-secondary" 
          onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>

        {currentQuestionIndex < questions.length - 1 ? (
          <button 
            className="btn btn-primary" 
            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
            disabled={!hasSelected}
          >
            Next Question <ChevronRight size={18} />
          </button>
        ) : (
          <button 
            className="btn btn-primary" 
            onClick={handleSubmitQuiz}
            disabled={!hasSelected || submitting}
            style={{ background: 'linear-gradient(135deg, hsl(var(--success)) 0%, #16a34a 100%)', boxShadow: 'none' }}
          >
            {submitting ? 'Submitting...' : 'Submit Answers'}
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  loaderContainer: {
    padding: '80px 0',
  },
  errorContainer: {
    padding: '100px 0',
    textAlign: 'center',
  },
  quizPage: {
    paddingTop: '40px',
    paddingBottom: '80px',
    maxWidth: '800px',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    color: 'hsl(var(--text-secondary))',
    marginBottom: '28px',
    '&:hover': {
      color: '#fff',
    }
  },
  quizHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',
    marginBottom: '16px',
  },
  quizTitle: {
    fontSize: '28px',
    fontWeight: 800,
  },
  quizSubtitle: {
    color: 'hsl(var(--text-secondary))',
    fontSize: '14px',
  },
  progressCounter: {
    fontSize: '14px',
    color: 'hsl(var(--text-secondary))',
    fontWeight: 600,
  },
  progressBarTrack: {
    height: '6px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
    marginBottom: '32px',
  },
  progressBarFill: {
    height: '100%',
    background: 'hsl(var(--primary-raw))',
    transition: 'width 0.3s ease',
  },
  questionCard: {
    padding: '40px',
    background: 'rgba(30, 41, 59, 0.4)',
    marginBottom: '32px',
  },
  activeQuestionText: {
    fontSize: '20px',
    lineHeight: 1.4,
    marginBottom: '32px',
  },
  choicesGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  choiceBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 24px',
    background: 'rgba(15, 23, 42, 0.5)',
    border: '1px solid hsl(var(--border-raw))',
    borderRadius: 'var(--radius-md)',
    color: 'hsl(var(--text-secondary))',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'var(--transition-fast)',
    outline: 'none',
    '&:hover': {
      borderColor: 'rgba(99, 102, 241, 0.3)',
      background: 'rgba(15, 23, 42, 0.75)',
      color: '#fff',
    }
  },
  selectedChoiceBtn: {
    borderColor: 'hsl(var(--primary-raw))',
    background: 'rgba(99, 102, 241, 0.1)',
    color: '#fff',
    boxShadow: '0 0 15px rgba(99, 102, 241, 0.15)',
  },
  choiceDot: {
    width: '16px',
    height: '16px',
    borderRadius: 'var(--radius-full)',
    border: '2px solid hsl(var(--text-muted))',
    transition: 'var(--transition-fast)',
  },
  selectedChoiceDot: {
    borderColor: 'hsl(var(--primary-raw))',
    background: 'hsl(var(--primary-raw))',
  },
  quizNav: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  // Result styling
  resultCard: {
    padding: '40px',
    display: 'grid',
    gridTemplateColumns: '0.4fr 0.6fr',
    gap: '40px',
    alignItems: 'center',
    background: 'linear-gradient(135deg, rgba(30,41,59,0.5) 0%, rgba(15,23,42,0.5) 100%)',
    marginBottom: '40px',
  },
  scoreCircle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '30px 20px',
    border: '2px dashed hsl(var(--border-raw))',
    borderRadius: 'var(--radius-lg)',
  },
  resultText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    '& h1': {
      fontSize: '28px',
      marginBottom: '10px',
    }
  },
  reviewSection: {
    marginTop: '40px',
  },
  questionsReviewList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  reviewQuestionItem: {
    padding: '30px',
    background: 'rgba(30, 41, 59, 0.25)',
  },
  qReviewHeader: {
    marginBottom: '12px',
    fontSize: '14px',
    color: 'hsl(var(--text-muted))',
  },
  questionText: {
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '20px',
  },
  reviewChoices: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  reviewChoice: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 18px',
    borderRadius: 'var(--radius-sm)',
    background: 'rgba(15, 23, 42, 0.4)',
    border: '1px solid hsl(var(--border-raw))',
    fontSize: '14px',
    color: 'hsl(var(--text-secondary))',
  },
  correctSelected: {
    background: 'rgba(34, 197, 94, 0.12)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
    color: 'hsl(var(--success))',
  },
  wrongSelected: {
    background: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    color: 'hsl(var(--error))',
  },
  correctUnselected: {
    background: 'rgba(34, 197, 94, 0.04)',
    borderColor: 'rgba(34, 197, 94, 0.15)',
    color: 'hsl(var(--success))',
  }
};

const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @media (max-width: 576px) {
    div[style*="resultCard"] {
      grid-template-columns: 1fr !important;
      gap: 30px !important;
      text-align: center !important;
    }
    div[style*="resultText"] {
      align-items: center !important;
    }
  }
`;
document.head.appendChild(styleSheet);
