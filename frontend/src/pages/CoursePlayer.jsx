import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App.jsx';
import { 
  Play, CheckCircle, Circle, ChevronRight, ChevronDown, 
  BookOpen, Video, FileText, MessageSquare, ClipboardList, 
  Lock, Bookmark, CheckSquare, Sparkles 
} from 'lucide-react';

export default function CoursePlayer() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { apiFetch, completedLessons } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notes, setNotes] = useState('');
  const [qnaInput, setQnaInput] = useState('');
  const [questions, setQuestions] = useState([
    { id: 1, user: 'JohnDoe', text: 'Is the source code of python installer available on windows standard directories?', time: '2 hours ago', replies: 1 },
    { id: 2, user: 'DevWizard', text: 'When should we use tuples over lists?', time: '1 day ago', replies: 3 }
  ]);

  const videoRef = useRef(null);

  // Fetch course details on mount / ID change
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await apiFetch(`/courses/${courseId}/`);
        setCourse(data);
        
        // Select first lesson by default if enrolled and lessons exist
        if (data.enrolled && data.modules?.length > 0) {
          const firstModule = data.modules[0];
          if (firstModule.lessons?.length > 0) {
            setSelectedLesson(firstModule.lessons[0]);
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [courseId]);

  // Load notes from localStorage for this lesson
  useEffect(() => {
    if (selectedLesson) {
      const savedNotes = localStorage.getItem(`notes_lesson_${selectedLesson.id}`);
      setNotes(savedNotes || '');
    }
  }, [selectedLesson]);

  // Save notes handler
  const handleSaveNotes = () => {
    if (selectedLesson) {
      localStorage.setItem(`notes_lesson_${selectedLesson.id}`, notes);
      alert('Notes saved successfully!');
    }
  };

  // Add question handler
  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!qnaInput.trim()) return;
    
    const newQuestion = {
      id: Date.now(),
      user: 'You (Student)',
      text: qnaInput,
      time: 'Just now',
      replies: 0
    };
    
    setQuestions([newQuestion, ...questions]);
    setQnaInput('');
  };

  // Enroll handler
  const handleEnroll = async () => {
    try {
      await apiFetch(`/courses/${courseId}/enroll/`, { method: 'POST' });
      // Reload course details
      const data = await apiFetch(`/courses/${courseId}/`);
      setCourse(data);
      if (data.modules?.length > 0 && data.modules[0].lessons?.length > 0) {
        setSelectedLesson(data.modules[0].lessons[0]);
      }
    } catch (err) {
      alert(err.message || 'Enrollment failed');
    }
  };

  // Complete lesson handler
  const handleToggleComplete = async (lesson) => {
    try {
      await apiFetch(`/courses/${courseId}/lessons/${lesson.id}/complete/`, { method: 'POST' });
      // Trigger context re-fetch or manual updates
      // In mockup mode we can just navigate or update, since App.jsx manages state
      // Force refreshing page layout
      const data = await apiFetch(`/courses/${courseId}/`);
      setCourse(data);
    } catch (err) {
      console.error('Failed to complete lesson', err);
    }
  };

  // Auto-complete lesson when video finishes
  const handleVideoEnded = () => {
    if (selectedLesson) {
      handleToggleComplete(selectedLesson);
    }
  };

  if (loading) {
    return (
      <div className="container" style={styles.loaderContainer}>
        <div className="shimmer-bg" style={styles.shimmerTitle}></div>
        <div style={styles.shimmerLayout}>
          <div className="shimmer-bg" style={styles.shimmerPlayer}></div>
          <div className="shimmer-bg" style={styles.shimmerSidebar}></div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container" style={styles.errorContainer}>
        <h2 className="text-gradient">Something went wrong</h2>
        <p>{error || 'Course not found'}</p>
        <Link to="/catalog" className="btn btn-secondary" style={{ marginTop: '20px' }}>
          Back to Catalog
        </Link>
      </div>
    );
  }

  const isCompleted = (lessonId) => completedLessons.includes(lessonId);

  // ENROLLMENT WALL
  if (!course.enrolled) {
    return (
      <div className="container animate-fade-in" style={styles.wallContainer}>
        <div style={styles.wallLayout}>
          {/* Left: Syllabus Outline */}
          <div style={styles.wallDetails}>
            <span className="badge badge-primary">{course.category}</span>
            <h1 style={styles.courseTitle}>{course.title}</h1>
            <p style={styles.courseDescription}>{course.description}</p>
            
            <div style={styles.syllabusPreview}>
              <h3 style={styles.previewTitle}>Syllabus Preview</h3>
              <div style={styles.modulesList}>
                {course.modules?.map((mod, idx) => (
                  <div key={mod.id} style={styles.previewModule} className="glass-card">
                    <div style={styles.moduleHeader}>
                      <ChevronRight size={18} />
                      <span>{mod.title}</span>
                    </div>
                    <div style={styles.previewLessons}>
                      {mod.lessons?.map(les => (
                        <div key={les.id} style={styles.previewLesson}>
                          <Lock size={14} color="hsl(var(--text-muted))" />
                          <span>{les.title} ({les.duration})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Pricing/Enroll Card */}
          <div style={styles.wallCtaCard} className="glass-card animate-float">
            <span style={styles.ctaBadge}><Sparkles size={16} /> Full Access</span>
            <h3>Start Learning Today</h3>
            <p>Enroll now to unlock premium video lessons, coding materials, and graded certifications.</p>
            <div style={styles.ctaPrice}>
              <span style={styles.priceSymbol}>$</span>0.00 <span style={styles.pricePeriod}>/ Free Trial</span>
            </div>
            <button onClick={handleEnroll} className="btn btn-primary" style={{ width: '100%', padding: '14px 0' }}>
              Enroll in Course
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE PLAYER INTERFACE
  return (
    <div style={styles.playerContainer} className="animate-fade-in">
      {/* Sidebar Open/Close Button */}
      <button 
        style={{ ...styles.sidebarToggleBtn, right: sidebarOpen ? '320px' : '0px' }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        title={sidebarOpen ? 'Hide Syllabus' : 'Show Syllabus'}
      >
        <ChevronRight size={18} style={{ transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)' }} />
      </button>

      {/* Main Stream Frame */}
      <div style={{ ...styles.mainContent, marginRight: sidebarOpen ? '320px' : '0' }}>
        {/* Video Player */}
        <div style={styles.videoPlayerFrame}>
          {selectedLesson ? (
            <video 
              ref={videoRef}
              src={selectedLesson.video_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'} 
              controls 
              autoPlay
              onEnded={handleVideoEnded}
              style={styles.videoTag}
            />
          ) : (
            <div style={styles.noLessonSelected}>
              <BookOpen size={48} />
              <h3>Select a lesson to begin</h3>
            </div>
          )}
        </div>

        {/* Video Header & Tabs */}
        <div style={styles.videoDetailsSection}>
          <div style={styles.lessonHeaderRow}>
            <div>
              <h2 style={styles.lessonTitle}>{selectedLesson?.title || 'Welcome to the Course'}</h2>
              <p style={styles.courseSubtitle}>{course.title} • {selectedLesson?.duration}</p>
            </div>
            
            {selectedLesson && (
              <button 
                onClick={() => handleToggleComplete(selectedLesson)} 
                className="btn btn-secondary" 
                style={isCompleted(selectedLesson.id) ? styles.completedStatusBtn : styles.completeStatusBtn}
              >
                <CheckCircle size={16} /> 
                {isCompleted(selectedLesson.id) ? 'Completed' : 'Mark as Complete'}
              </button>
            )}
          </div>

          {/* Navigation Tabs */}
          <div style={styles.tabsRow}>
            <button 
              onClick={() => setActiveTab('description')} 
              style={{ ...styles.tabBtn, ...(activeTab === 'description' ? styles.activeTabBtn : {}) }}
            >
              <FileText size={16} /> Description
            </button>
            <button 
              onClick={() => setActiveTab('qna')} 
              style={{ ...styles.tabBtn, ...(activeTab === 'qna' ? styles.activeTabBtn : {}) }}
            >
              <MessageSquare size={16} /> Discussion (Q&A)
            </button>
            <button 
              onClick={() => setActiveTab('notes')} 
              style={{ ...styles.tabBtn, ...(activeTab === 'notes' ? styles.activeTabBtn : {}) }}
            >
              <Bookmark size={16} /> My Notes
            </button>
          </div>

          {/* Tab Contents */}
          <div style={styles.tabContentPanel} className="glass-card">
            {activeTab === 'description' && (
              <div className="animate-fade-in" style={styles.descTab}>
                <p style={styles.descPara}>{selectedLesson?.description || 'No description provided for this lesson.'}</p>
                {selectedLesson?.content && (
                  <div style={styles.mdContent}>
                    <h4>Lesson Study Material</h4>
                    <pre style={styles.preContent}>{selectedLesson.content}</pre>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'qna' && (
              <div className="animate-fade-in" style={styles.qnaTab}>
                <form onSubmit={handleAddQuestion} style={styles.qnaForm}>
                  <textarea 
                    placeholder="Ask a question about this lesson..." 
                    value={qnaInput}
                    onChange={(e) => setQnaInput(e.target.value)}
                    style={styles.qnaTextarea}
                    rows="3"
                  />
                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>
                    Post Question
                  </button>
                </form>

                <div style={styles.questionsList}>
                  {questions.map(q => (
                    <div key={q.id} style={styles.questionItem}>
                      <div style={styles.qHeader}>
                        <span style={styles.qUser}>{q.user}</span>
                        <span style={styles.qTime}>{q.time}</span>
                      </div>
                      <p style={styles.qText}>{q.text}</p>
                      <div style={styles.qFooter}>
                        <span>{q.replies} replies</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="animate-fade-in" style={styles.notesTab}>
                <p style={{ fontSize: '13px', color: 'hsl(var(--text-muted))', marginBottom: '12px' }}>
                  Write down custom annotations. These notes are saved locally to your browser container.
                </p>
                <textarea 
                  placeholder="Take notes for this lesson..." 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={styles.notesTextarea}
                  rows="6"
                />
                <button onClick={handleSaveNotes} className="btn btn-primary" style={{ marginTop: '12px' }}>
                  Save Notes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Syllabus List */}
      {sidebarOpen && (
        <aside style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <h3>Course Syllabus</h3>
            {course.quiz && (
              <Link to={`/courses/${course.id}/quiz/${course.quiz.id}`} className="btn btn-primary" style={styles.quizBtn}>
                <ClipboardList size={16} /> Take Quiz
              </Link>
            )}
          </div>
          
          <div style={styles.sidebarModules}>
            {course.modules?.map((mod, modIdx) => (
              <div key={mod.id} style={styles.sidebarModule}>
                <div style={styles.sidebarModuleTitle}>
                  <span>{mod.title}</span>
                </div>
                <div style={styles.sidebarLessons}>
                  {mod.lessons?.map(les => {
                    const isSelected = selectedLesson?.id === les.id;
                    const completed = isCompleted(les.id);
                    return (
                      <div 
                        key={les.id} 
                        onClick={() => setSelectedLesson(les)}
                        style={{ 
                          ...styles.sidebarLessonItem, 
                          ...(isSelected ? styles.selectedLessonItem : {}) 
                        }}
                      >
                        <div 
                          onClick={(e) => { e.stopPropagation(); handleToggleComplete(les); }} 
                          style={styles.checkIconWrapper}
                        >
                          {completed ? (
                            <CheckCircle size={18} color="hsl(var(--success))" />
                          ) : (
                            <Circle size={18} color="hsl(var(--text-muted))" />
                          )}
                        </div>
                        <div style={styles.lessonMetaText}>
                          <span style={{ ...styles.lessonTitleText, ...(isSelected ? { fontWeight: 700, color: '#fff' } : {}) }}>
                            {les.title}
                          </span>
                          <span style={styles.lessonDurationText}>{les.duration}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}

const styles = {
  loaderContainer: {
    padding: '80px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  shimmerTitle: {
    height: '40px',
    width: '60%',
    borderRadius: 'var(--radius-sm)',
  },
  shimmerLayout: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '30px',
  },
  shimmerPlayer: {
    height: '400px',
    borderRadius: 'var(--radius-md)',
  },
  shimmerSidebar: {
    height: '400px',
    borderRadius: 'var(--radius-md)',
  },
  errorContainer: {
    padding: '100px 0',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  // Wall CSS
  wallContainer: {
    paddingTop: '60px',
    paddingBottom: '80px',
  },
  wallLayout: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '60px',
    alignItems: 'start',
  },
  wallDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  courseTitle: {
    fontSize: '36px',
    fontWeight: 800,
  },
  courseDescription: {
    fontSize: '16px',
    color: 'hsl(var(--text-secondary))',
    lineHeight: 1.6,
  },
  syllabusPreview: {
    marginTop: '32px',
  },
  previewTitle: {
    fontSize: '20px',
    marginBottom: '16px',
  },
  modulesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  previewModule: {
    padding: '16px 20px',
    background: 'rgba(30, 41, 59, 0.3)',
  },
  moduleHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 600,
    fontSize: '15px',
    marginBottom: '10px',
  },
  previewLessons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    paddingLeft: '26px',
  },
  previewLesson: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: 'hsl(var(--text-secondary))',
  },
  wallCtaCard: {
    padding: '40px',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
    border: '1px solid rgba(99, 102, 241, 0.25)',
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    textAlign: 'center',
    alignItems: 'center',
  },
  ctaBadge: {
    padding: '6px 14px',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 'var(--radius-full)',
    fontSize: '12px',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  ctaPrice: {
    fontSize: '44px',
    fontWeight: 800,
    color: '#fff',
    margin: '10px 0',
  },
  priceSymbol: {
    fontSize: '24px',
    verticalAlign: 'super',
  },
  pricePeriod: {
    fontSize: '16px',
    fontWeight: 500,
    color: 'hsl(var(--text-secondary))',
  },
  // Player CSS
  playerContainer: {
    position: 'relative',
    display: 'flex',
    flex: 1,
    minHeight: 'calc(100vh - 70px)',
  },
  sidebarToggleBtn: {
    position: 'absolute',
    top: '20px',
    zIndex: 99,
    width: '32px',
    height: '32px',
    background: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid var(--glass-border)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)',
    transition: 'right var(--transition-normal)',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    transition: 'margin-right var(--transition-normal)',
    background: 'hsl(var(--bg-raw-dark))',
  },
  videoPlayerFrame: {
    width: '100%',
    aspectRatio: '16/9',
    maxHeight: '70vh',
    background: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoTag: {
    width: '100%',
    height: '100%',
    outline: 'none',
  },
  noLessonSelected: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    color: 'hsl(var(--text-muted))',
  },
  videoDetailsSection: {
    padding: '30px 40px 60px',
    maxWidth: '1000px',
  },
  lessonHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    gap: '20px',
    marginBottom: '28px',
  },
  lessonTitle: {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '4px',
  },
  courseSubtitle: {
    fontSize: '14px',
    color: 'hsl(var(--text-secondary))',
  },
  completeStatusBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    fontSize: '14px',
  },
  completedStatusBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    fontSize: '14px',
    background: 'rgba(34, 197, 94, 0.15)',
    border: '1px solid rgba(34, 197, 94, 0.25)',
    color: 'hsl(var(--success))',
  },
  tabsRow: {
    display: 'flex',
    gap: '8px',
    borderBottom: '1px solid hsl(var(--border-raw))',
    marginBottom: '24px',
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    padding: '10px 16px',
    color: 'hsl(var(--text-secondary))',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'var(--transition-fast)',
  },
  activeTabBtn: {
    color: 'hsl(var(--primary-raw))',
    borderBottomColor: 'hsl(var(--primary-raw))',
  },
  tabContentPanel: {
    padding: '24px',
    background: 'rgba(30, 41, 59, 0.25)',
  },
  descTab: {
    fontSize: '15px',
    lineHeight: 1.6,
  },
  descPara: {
    color: 'hsl(var(--text-secondary))',
    marginBottom: '24px',
  },
  mdContent: {
    borderTop: '1px solid hsl(var(--border-raw))',
    paddingTop: '20px',
    '& h4': {
      marginBottom: '10px',
    }
  },
  preContent: {
    fontFamily: 'monospace',
    background: 'rgba(15, 23, 42, 0.6)',
    padding: '16px',
    borderRadius: 'var(--radius-sm)',
    whiteSpace: 'pre-wrap',
    color: 'hsl(var(--text-primary))',
    fontSize: '14px',
    border: '1px solid hsl(var(--border-raw))',
  },
  qnaTab: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  qnaForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  qnaTextarea: {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(15, 23, 42, 0.5)',
    border: '1px solid hsl(var(--border-raw))',
    borderRadius: 'var(--radius-sm)',
    color: '#fff',
    outline: 'none',
    resize: 'none',
    fontSize: '14px',
  },
  questionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  questionItem: {
    padding: '16px',
    borderBottom: '1px solid hsl(var(--border-raw))',
  },
  qHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    marginBottom: '6px',
  },
  qUser: {
    fontWeight: 600,
    color: 'hsl(var(--primary-raw))',
  },
  qTime: {
    color: 'hsl(var(--text-muted))',
  },
  qText: {
    fontSize: '14px',
    color: 'hsl(var(--text-primary))',
  },
  qFooter: {
    marginTop: '8px',
    fontSize: '12px',
    color: 'hsl(var(--text-muted))',
  },
  notesTab: {
    display: 'flex',
    flexDirection: 'column',
  },
  notesTextarea: {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(15, 23, 42, 0.5)',
    border: '1px solid hsl(var(--border-raw))',
    borderRadius: 'var(--radius-sm)',
    color: '#fff',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    fontSize: '14px',
  },
  // Sidebar
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '320px',
    height: '100%',
    background: 'rgba(15, 23, 42, 0.95)',
    borderLeft: '1px solid var(--glass-border)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 98,
  },
  sidebarHeader: {
    padding: '20px',
    borderBottom: '1px solid hsl(var(--border-raw))',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    '& h3': {
      fontSize: '16px',
    }
  },
  quizBtn: {
    width: '100%',
    padding: '8px 0',
    fontSize: '13px',
  },
  sidebarModules: {
    flex: 1,
    overflowY: 'auto',
  },
  sidebarModule: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
  },
  sidebarModuleTitle: {
    padding: '12px 20px',
    background: 'rgba(255, 255, 255, 0.02)',
    fontSize: '13px',
    fontWeight: 600,
    color: 'hsl(var(--text-secondary))',
    borderBottom: '1px solid rgba(255, 255, 255, 0.01)',
  },
  sidebarLessons: {
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarLessonItem: {
    display: 'flex',
    alignItems: 'start',
    gap: '12px',
    padding: '14px 20px',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.02)',
    }
  },
  selectedLessonItem: {
    background: 'rgba(99, 102, 241, 0.1)',
    borderLeft: '3px solid hsl(var(--primary-raw))',
    paddingLeft: '17px',
  },
  checkIconWrapper: {
    paddingTop: '2px',
  },
  lessonMetaText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
  },
  lessonTitleText: {
    fontSize: '13px',
    color: 'hsl(var(--text-secondary))',
    lineHeight: 1.3,
  },
  lessonDurationText: {
    fontSize: '11px',
    color: 'hsl(var(--text-muted))',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  }
};

const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @media (max-width: 992px) {
    div[style*="wallLayout"] {
      grid-template-columns: 1fr !important;
      gap: 40px !important;
    }
    aside[style*="sidebar"] {
      position: fixed !important;
      top: 70px !important;
      height: calc(100vh - 70px) !important;
      box-shadow: -10px 0 30px rgba(0,0,0,0.5) !important;
    }
  }
`;
document.head.appendChild(styleSheet);
