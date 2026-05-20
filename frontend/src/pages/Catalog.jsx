import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App.jsx';
import { Search, SlidersHorizontal, BookOpen, Clock, Star } from 'lucide-react';

export default function Catalog() {
  const { courses } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  // Extract categories
  const categories = ['All', ...new Set(courses.map(c => c.category))];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Filtering Logic
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="container animate-fade-in" style={styles.catalogPage}>
      {/* Catalog Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>All Courses</h1>
        <p style={styles.subtitle}>Choose your path and master full-stack software development</p>
      </div>

      {/* Search and Filters Bar */}
      <div style={styles.filterBar} className="glass-card">
        {/* Search */}
        <div style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search courses, instructors, keywords..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            style={styles.searchInput}
          />
        </div>

        {/* Filters */}
        <div style={styles.filtersSelects}>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Difficulty:</span>
            <select 
              value={selectedDifficulty} 
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              style={styles.selectInput}
            >
              {difficulties.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div style={styles.categoryPills}>
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setSelectedCategory(cat)}
            style={{ 
              ...styles.pillBtn, 
              ...(selectedCategory === cat ? styles.activePillBtn : {}) 
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div style={styles.grid}>
          {filteredCourses.map(course => (
            <div key={course.id} className="glass-card" style={styles.courseCard}>
              <div style={styles.cardHeader}>
                <img src={course.thumbnail} alt={course.title} style={styles.courseThumbnail} />
                <span className="badge badge-primary" style={styles.difficultyBadge}>{course.difficulty}</span>
              </div>
              <div style={styles.cardBody}>
                <span style={styles.categoryText}>{course.category}</span>
                <h3 style={styles.courseTitle}>{course.title}</h3>
                <p style={styles.courseDesc}>{course.description}</p>
                
                <div style={styles.metaRow}>
                  <div style={styles.metaItem}>
                    <Star size={16} color="#f59e0b" fill="#f59e0b" />
                    <span>{course.rating}</span>
                  </div>
                  <div style={styles.metaItem}>
                    <Clock size={16} />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <div style={styles.cardFooter}>
                  <span style={styles.instructor}>By {course.instructor}</span>
                  <Link to={`/courses/${course.id}`} className="btn btn-primary" style={styles.cardBtn}>
                    {course.enrolled ? 'Resume' : 'View Course'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState} className="glass-card">
          <BookOpen size={48} color="hsl(var(--text-muted))" />
          <h3>No Courses Found</h3>
          <p>We couldn't find any courses matching your search criteria. Try modifying your filters.</p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedDifficulty('All'); }} 
            className="btn btn-secondary"
            style={{ marginTop: '16px' }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  catalogPage: {
    paddingTop: '40px',
    paddingBottom: '80px',
  },
  header: {
    marginBottom: '32px',
    '@media (max-width: 768px)': {
      textAlign: 'center',
    }
  },
  title: {
    fontSize: '36px',
    marginBottom: '8px',
  },
  subtitle: {
    color: 'hsl(var(--text-secondary))',
    fontSize: '16px',
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    gap: '20px',
    marginBottom: '24px',
    background: 'rgba(30, 41, 59, 0.4)',
    border: '1px solid var(--glass-border)',
  },
  searchWrapper: {
    position: 'relative',
    flex: 1,
    maxWidth: '500px',
  },
  searchIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'hsl(var(--text-muted))',
  },
  searchInput: {
    width: '100%',
    padding: '10px 16px 10px 48px',
    background: 'rgba(15, 23, 42, 0.5)',
    border: '1px solid hsl(var(--border-raw))',
    borderRadius: 'var(--radius-sm)',
    color: '#fff',
    outline: 'none',
    transition: 'var(--transition-fast)',
    '&:focus': {
      borderColor: 'hsl(var(--primary-raw))',
    }
  },
  filtersSelects: {
    display: 'flex',
    gap: '16px',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  filterLabel: {
    fontSize: '14px',
    color: 'hsl(var(--text-secondary))',
  },
  selectInput: {
    padding: '8px 16px',
    background: 'rgba(15, 23, 42, 0.5)',
    border: '1px solid hsl(var(--border-raw))',
    borderRadius: 'var(--radius-sm)',
    color: '#fff',
    outline: 'none',
    cursor: 'pointer',
  },
  categoryPills: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
    paddingBottom: '12px',
    marginBottom: '32px',
  },
  pillBtn: {
    padding: '8px 16px',
    borderRadius: 'var(--radius-full)',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    color: 'hsl(var(--text-secondary))',
    fontWeight: 500,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    whiteSpace: 'nowrap',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.08)',
      color: '#fff',
    }
  },
  activePillBtn: {
    background: 'hsl(var(--primary-raw))',
    color: '#fff',
    border: '1px solid hsl(var(--primary-raw))',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '30px',
  },
  courseCard: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  cardHeader: {
    position: 'relative',
    height: '190px',
    overflow: 'hidden',
  },
  courseThumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  difficultyBadge: {
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
  categoryText: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'hsl(var(--primary-raw))',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  courseTitle: {
    fontSize: '20px',
    marginBottom: '12px',
    lineHeight: 1.35,
  },
  courseDesc: {
    fontSize: '14px',
    color: 'hsl(var(--text-secondary))',
    lineHeight: 1.5,
    marginBottom: '20px',
    flex: 1,
  },
  metaRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    color: 'hsl(var(--text-muted))',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  instructor: {
    fontSize: '14px',
    color: 'hsl(var(--text-muted))',
  },
  cardBtn: {
    padding: '8px 16px',
    fontSize: '14px',
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
      fontSize: '22px',
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
    div[style*="filterBar"] {
      flex-direction: column !important;
      align-items: stretch !important;
    }
    div[style*="searchWrapper"] {
      max-width: none !important;
    }
  }
`;
document.head.appendChild(styleSheet);
