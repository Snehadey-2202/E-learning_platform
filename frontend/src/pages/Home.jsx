import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App.jsx';
import { Play, Sparkles, BookOpen, Users, Award, ShieldCheck } from 'lucide-react';

export default function Home() {
  const { courses } = useAuth();
  
  // Showcase the first 3 courses as featured
  const featuredCourses = courses.slice(0, 3);

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <div style={styles.badgeWrapper} className="animate-float">
            <span className="badge badge-primary" style={styles.heroBadge}>
              <Sparkles size={14} /> Reimagining Online Learning
            </span>
          </div>
          
          <h1 style={styles.heroTitle}>
            Master Skills That <br />
            <span className="text-gradient text-glow">Shape The Future</span>
          </h1>
          
          <p style={styles.heroSubtitle}>
            Unlock a premium, streaming-first educational platform. Build professional-grade software, design system interfaces, and backend architectures with guides, projects, and automated grading.
          </p>

          <div style={styles.ctaGroup}>
            <Link to="/catalog" className="btn btn-primary" style={styles.ctaPrimary}>
              <BookOpen size={20} /> Browse Courses
            </Link>
            <a href="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={styles.ctaSecondary}>
              <Play size={18} /> Watch Teaser
            </a>
          </div>
        </div>

        {/* Floating Stat Widgets */}
        <div style={styles.heroVisual}>
          <div style={styles.visualMainCard} className="glass-card">
            <img 
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60" 
              alt="Workspace" 
              style={styles.visualImage} 
            />
            <div style={styles.visualOverlay}></div>
          </div>
          
          {/* Stats Overlay 1 */}
          <div style={{ ...styles.statCard, top: '10%', left: '-15%' }} className="glass-card">
            <Users size={22} color="hsl(var(--primary-raw))" />
            <div>
              <h4 style={styles.statVal}>12,450+</h4>
              <p style={styles.statLabel}>Active Scholars</p>
            </div>
          </div>

          {/* Stats Overlay 2 */}
          <div style={{ ...styles.statCard, bottom: '15%', right: '-10%' }} className="glass-card">
            <Award size={22} color="hsl(var(--accent-raw))" />
            <div>
              <h4 style={styles.statVal}>4.9 / 5.0</h4>
              <p style={styles.statLabel}>Course Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section style={styles.ribbon}>
        <div className="container" style={styles.ribbonContainer}>
          <div style={styles.ribbonItem}>
            <h3>150+</h3>
            <p>Curated Video Lessons</p>
          </div>
          <div style={styles.ribbonDivider}></div>
          <div style={styles.ribbonItem}>
            <h3>98%</h3>
            <p>Completion Success Rate</p>
          </div>
          <div style={styles.ribbonDivider}></div>
          <div style={styles.ribbonItem}>
            <h3>Lifetime</h3>
            <p>Syllabus & Video Access</p>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section style={styles.featuredSection} className="container">
        <div style={styles.sectionHeader}>
          <h2>Explore Featured Courses</h2>
          <p>Start learning in-demand skills from industry professionals</p>
        </div>
        
        <div style={styles.courseGrid}>
          {featuredCourses.map(course => (
            <div key={course.id} className="glass-card" style={styles.courseCard}>
              <div style={styles.cardHeader}>
                <img src={course.thumbnail} alt={course.title} style={styles.courseThumbnail} />
                <span className="badge badge-primary" style={styles.courseDifficulty}>
                  {course.difficulty}
                </span>
              </div>
              <div style={styles.cardBody}>
                <span style={styles.courseCategory}>{course.category}</span>
                <h3 style={styles.courseTitle}>{course.title}</h3>
                <p style={styles.courseDescription}>{course.description}</p>
                <div style={styles.courseMeta}>
                  <span>By {course.instructor}</span>
                  <span>•</span>
                  <span>{course.duration}</span>
                </div>
                <Link to={`/courses/${course.id}`} className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>
                  {course.enrolled ? 'Resume Course' : 'View Course details'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2>Designed for Seamless Learning</h2>
            <p>Everything you need to master new concepts quickly</p>
          </div>
          
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard} className="glass-card">
              <div style={styles.featureIcon}>
                <Play size={24} color="#fff" />
              </div>
              <h3>HD Video Streaming</h3>
              <p>Crystal-clear adaptive video streaming that remembers your last position and scales to your network.</p>
            </div>
            
            <div style={styles.featureCard} className="glass-card">
              <div style={styles.featureIcon}>
                <Award size={24} color="#fff" />
              </div>
              <h3>Interactive Quizzes</h3>
              <p>Test your understanding at the end of modules with automatically graded questions and explanations.</p>
            </div>
            
            <div style={styles.featureCard} className="glass-card">
              <div style={styles.featureIcon}>
                <ShieldCheck size={24} color="#fff" />
              </div>
              <h3>Cloud Deployment</h3>
              <p>Full-stack project outlines. Deploy with Postgres, AWS S3 buckets, Docker containers, and Nginx configs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2026 EduStream Platform. Crafted with Vanilla CSS & React.</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overflowX: 'hidden',
  },
  heroSection: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    alignItems: 'center',
    gap: '60px',
    maxWidth: '1200px',
    margin: '60px auto 40px',
    padding: '0 24px',
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  badgeWrapper: {
    marginBottom: '20px',
  },
  heroBadge: {
    gap: '6px',
    padding: '6px 14px',
    fontSize: '13px',
    borderRadius: 'var(--radius-full)',
  },
  heroTitle: {
    fontSize: '52px',
    fontWeight: 800,
    lineHeight: 1.15,
    marginBottom: '24px',
  },
  heroSubtitle: {
    fontSize: '18px',
    color: 'hsl(var(--text-secondary))',
    lineHeight: 1.6,
    marginBottom: '36px',
    maxWidth: '540px',
  },
  ctaGroup: {
    display: 'flex',
    gap: '16px',
  },
  ctaPrimary: {
    padding: '14px 28px',
    borderRadius: 'var(--radius-sm)',
    boxShadow: 'var(--shadow-primary)',
  },
  ctaSecondary: {
    padding: '14px 28px',
    borderRadius: 'var(--radius-sm)',
  },
  heroVisual: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  visualMainCard: {
    width: '100%',
    height: '350px',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    position: 'relative',
  },
  visualImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  visualOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, transparent, rgba(15, 23, 42, 0.4))',
  },
  statCard: {
    position: 'absolute',
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(30, 41, 59, 0.75)',
    borderRadius: 'var(--radius-md)',
  },
  statVal: {
    fontSize: '18px',
    fontWeight: 800,
    color: '#fff',
  },
  statLabel: {
    fontSize: '12px',
    color: 'hsl(var(--text-secondary))',
  },
  ribbon: {
    background: 'rgba(30, 41, 59, 0.3)',
    borderTop: '1px solid hsl(var(--border-raw))',
    borderBottom: '1px solid hsl(var(--border-raw))',
    padding: '30px 0',
    margin: '40px 0',
  },
  ribbonContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  ribbonItem: {
    textAlign: 'center',
    '& h3': {
      fontSize: '28px',
      color: '#fff',
      marginBottom: '4px',
    },
    '& p': {
      fontSize: '14px',
      color: 'hsl(var(--text-secondary))',
    }
  },
  ribbonDivider: {
    width: '1px',
    height: '40px',
    background: 'hsl(var(--border-raw))',
  },
  featuredSection: {
    margin: '40px auto 60px',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '40px',
    '& h2': {
      fontSize: '36px',
      marginBottom: '10px',
    },
    '& p': {
      color: 'hsl(var(--text-secondary))',
      fontSize: '16px',
    }
  },
  courseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '30px',
  },
  courseCard: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  cardHeader: {
    position: 'relative',
    height: '200px',
    overflow: 'hidden',
  },
  courseThumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
  },
  courseDifficulty: {
    position: 'absolute',
    top: '12px',
    right: '12px',
  },
  cardBody: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  courseCategory: {
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    color: 'hsl(var(--primary-raw))',
    marginBottom: '8px',
  },
  courseTitle: {
    fontSize: '20px',
    marginBottom: '12px',
    lineHeight: 1.3,
  },
  courseDescription: {
    fontSize: '14px',
    color: 'hsl(var(--text-secondary))',
    marginBottom: '20px',
    lineHeight: 1.5,
    flex: 1,
  },
  courseMeta: {
    display: 'flex',
    gap: '10px',
    fontSize: '13px',
    color: 'hsl(var(--text-muted))',
  },
  featuresSection: {
    background: 'linear-gradient(180deg, transparent 0%, rgba(30, 41, 59, 0.2) 100%)',
    padding: '80px 0 100px',
    borderTop: '1px solid hsl(var(--border-raw))',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '30px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  featureCard: {
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '16px',
    '& h3': {
      fontSize: '20px',
    },
    '& p': {
      fontSize: '14px',
      color: 'hsl(var(--text-secondary))',
      lineHeight: 1.5,
    }
  },
  featureIcon: {
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-sm)',
    background: 'linear-gradient(135deg, hsl(var(--primary-raw)) 0%, hsl(var(--secondary-raw)) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(99, 102, 241, 0.25)',
  },
  footer: {
    textAlign: 'center',
    padding: '40px 0',
    borderTop: '1px solid hsl(var(--border-raw))',
    color: 'hsl(var(--text-muted))',
    fontSize: '14px',
  }
};

const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @media (max-width: 992px) {
    div[style*="heroSection"] {
      grid-template-columns: 1fr !important;
      gap: 40px !important;
      text-align: center !important;
    }
    div[style*="heroContent"] {
      align-items: center !important;
    }
    div[style*="heroVisual"] {
      max-width: 500px !important;
      margin: 0 auto !important;
    }
    div[style*="ribbonContainer"] {
      flex-direction: column !important;
      gap: 20px !important;
    }
    div[style*="ribbonDivider"] {
      display: none !important;
    }
  }
`;
document.head.appendChild(styleSheet);
