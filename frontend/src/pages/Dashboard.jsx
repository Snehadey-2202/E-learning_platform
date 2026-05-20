import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App.jsx';
import { BookOpen, Award, CheckCircle, Flame, ArrowRight, PlayCircle } from 'lucide-react';

export default function Dashboard() {
  const { user, courses, completedLessons, quizAttempts } = useAuth();
  
  // Filter enrolled courses
  const enrolledCourses = courses.filter(c => c.enrolled);

  // Compute stats
  const enrolledCount = enrolledCourses.length;
  const completedCount = completedLessons.length;
  
  const attemptsArray = Object.values(quizAttempts);
  const avgQuizScore = attemptsArray.length > 0 
    ? Math.round(attemptsArray.reduce((acc, curr) => acc + curr.score, 0) / attemptsArray.length) 
    : 0;

  // Compute progress for each course
  const getCourseProgress = (course) => {
    if (!course.modules) return 0;
    let totalLessons = 0;
    let completedInCourse = 0;
    
    course.modules.forEach(m => {
      if (m.lessons) {
        m.lessons.forEach(l => {
          totalLessons++;
          if (completedLessons.includes(l.id)) {
            completedInCourse++;
          }
        });
      }
    });

    return totalLessons > 0 ? Math.round((completedInCourse / totalLessons) * 100) : 0;
  };

  return (
    <div className="container animate-fade-in" style={styles.dashboardPage}>
      {/* Header Banner */}
      <div style={styles.banner} className="glass-card">
        <div>
          <h1 style={styles.welcomeText}>Welcome back, {user?.full_name || user?.username}!</h1>
          <p style={styles.bannerSubtitle}>You're doing great! Keep building your developer skills today.</p>
        </div>
        <Link to="/catalog" className="btn btn-primary">
          Explore More Courses <ArrowRight size={18} />
        </Link>
      </div>

      {/* Stats Widgets */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard} className="glass-card">
          <BookOpen size={24} color="hsl(var(--primary-raw))" />
          <div>
            <h3 style={styles.statValue}>{enrolledCount}</h3>
            <p style={styles.statLabel}>Enrolled Courses</p>
          </div>
        </div>

        <div style={styles.statCard} className="glass-card">
          <CheckCircle size={24} color="hsl(var(--success))" />
          <div>
            <h3 style={styles.statValue}>{completedCount}</h3>
            <p style={styles.statLabel}>Completed Lessons</p>
          </div>
        </div>

        <div style={styles.statCard} className="glass-card">
          <Award size={24} color="hsl(var(--accent-raw))" />
          <div>
            <h3 style={styles.statValue}>{avgQuizScore}%</h3>
            <p style={styles.statLabel}>Avg. Quiz Score</p>
          </div>
        </div>

        <div style={styles.statCard} className="glass-card">
          <Flame size={24} color="#f59e0b" />
          <div>
            <h3 style={styles.statValue}>{enrolledCount > 0 ? 'Active' : 'Idle'}</h3>
            <p style={styles.statLabel}>Learning Status</p>
          </div>
        </div>
      </div>

      {/* Enrolled Courses */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Your Learning Paths</h2>
        
        {enrolledCount > 0 ? (
          <div style={styles.coursesGrid}>
            {enrolledCourses.map(course => {
              const progress = getCourseProgress(course);
              return (
                <div key={course.id} className="glass-card" style={styles.courseCard}>
                  <img src={course.thumbnail} alt={course.title} style={styles.thumbnail} />
                  <div style={styles.cardContent}>
                    <h3 style={styles.courseTitle}>{course.title}</h3>
                    <p style={styles.instructor}>Instructor: {course.instructor}</p>
                    
                    {/* Progress Bar */}
                    <div style={styles.progressSection}>
                      <div style={styles.progressText}>
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div style={styles.progressTrack}>
                        <div style={{ ...styles.progressBar, width: `${progress}%` }}></div>
                      </div>
                    </div>

                    <Link to={`/courses/${course.id}`} className="btn btn-primary" style={styles.resumeBtn}>
                      <PlayCircle size={18} /> Resume Path
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.emptyState} className="glass-card">
            <BookOpen size={48} color="hsl(var(--text-muted))" />
            <h3>No enrolled courses yet</h3>
            <p>Ready to level up? Browse our premium syllabus and enroll in your first course.</p>
            <Link to="/catalog" className="btn btn-primary" style={{ marginTop: '16px' }}>
              Find Your First Course
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  dashboardPage: {
    paddingTop: '40px',
    paddingBottom: '80px',
  },
  banner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '32px 40px',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    marginBottom: '40px',
    borderRadius: 'var(--radius-lg)',
  },
  welcomeText: {
    fontSize: '28px',
    fontWeight: 800,
    marginBottom: '6px',
  },
  bannerSubtitle: {
    color: 'hsl(var(--text-secondary))',
    fontSize: '15px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '24px',
    marginBottom: '48px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '24px',
    background: 'rgba(30, 41, 59, 0.45)',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 800,
    color: '#fff',
  },
  statLabel: {
    fontSize: '13px',
    color: 'hsl(var(--text-secondary))',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  sectionTitle: {
    fontSize: '24px',
  },
  coursesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '30px',
  },
  courseCard: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '170px',
    objectFit: 'cover',
  },
  cardContent: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
  },
  courseTitle: {
    fontSize: '18px',
    lineHeight: 1.35,
  },
  instructor: {
    fontSize: '13px',
    color: 'hsl(var(--text-muted))',
  },
  progressSection: {
    marginTop: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  progressText: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    fontWeight: 600,
    color: 'hsl(var(--text-secondary))',
  },
  progressTrack: {
    height: '6px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, hsl(var(--primary-raw)) 0%, hsl(var(--secondary-raw)) 100%)',
    borderRadius: 'var(--radius-full)',
    transition: 'width 0.4s ease',
  },
  resumeBtn: {
    marginTop: '16px',
    width: '100%',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
    gap: '12px',
    '& h3': {
      fontSize: '20px',
    },
    '& p': {
      color: 'hsl(var(--text-secondary))',
      maxWidth: '400px',
    }
  }
};

const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @media (max-width: 768px) {
    div[style*="banner"] {
      flex-direction: column !important;
      gap: 20px !important;
      text-align: center !important;
      align-items: center !important;
      padding: 24px !important;
    }
  }
`;
document.head.appendChild(styleSheet);
