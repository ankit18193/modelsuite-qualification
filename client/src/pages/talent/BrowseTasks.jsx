import { useState, useEffect } from 'react';
import TalentSidebar from '../../components/talent/TalentSidebar';
import TaskCard from '../../components/talent/TaskCard';
import { fetchAvailableTasks } from '../../api/talent';

/* ── SVG Icons ── */
const IcoSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IcoBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const IcoSliders = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
    <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
    <line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/>
    <line x1="17" y1="16" x2="23" y2="16"/>
  </svg>
);

const BrowseTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  /* ── Filter states ── */
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const loadTasks = async () => {
    try {
      const { data } = await fetchAvailableTasks();
      setTasks(data);
    } catch {
      setError('Failed to load available tasks');
    }
  };

  useEffect(() => {
    let active = true;
    const fetchTasks = async () => {
      try {
        const { data } = await fetchAvailableTasks();
        if (active) {
          setTasks(data);
        }
      } catch {
        if (active) {
          setError('Failed to load available tasks');
        }
      }
    };
    fetchTasks();
    return () => { active = false; };
  }, []);

  /* ── Process filtering & sorting ── */
  const filteredTasks = tasks
    .filter((task) => {
      const query = searchQuery.toLowerCase();
      return (
        (task.title || '').toLowerCase().includes(query) ||
        (task.description || '').toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      return 0;
    });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0A' }}>
      <style>{`
        .btn-hover-effect {
          transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.15s ease !important;
        }
        .btn-hover-effect:hover {
          background-color: #161616 !important;
          border-color: #085fbcff !important;
          color: #ffffff !important;
          transform: translateY(-1px);
        }
        .btn-hover-effect:active {
          transform: translateY(0);
        }

        .filter-select {
          background: #111111;
          border: 1px solid #1E1E1E;
          color: #D1D5DB;
          font-size: 13px;
          border-radius: 8px;
          padding: 8px 12px;
          cursor: pointer;
          outline: none;
          transition: border-color 0.15s;
        }
        .filter-select:hover {
          border-color: #333;
        }
      `}</style>
      
      <TalentSidebar />

      <main style={{ marginLeft: 220, flex: 1, minWidth: 0, padding: '28px 32px', overflowX: 'hidden' }}>

        {/* ── HEADER ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', margin: 0, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.3px' }}>
              Browse Tasks
            </h1>
            <p style={{ fontSize: 13, color: '#6B7280', marginTop: 4, marginBottom: 0 }}>
              Discover available tasks and claim work that matches your skills.
            </p>
          </div>
          {/* Decorative Bell Notification Icon matching My Tasks */}
          <button style={{
            width: 38, height: 38, borderRadius: '50%', background: '#111111', border: '1px solid #1E1E1E',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', cursor: 'pointer',
            transition: 'border-color 0.15s, color 0.15s'
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1E1E1E'; e.currentTarget.style.color = '#9CA3AF'; }}>
            <IcoBell />
          </button>
        </div>

        {error && (
          <p style={{ fontSize: 13, marginBottom: 20, padding: '10px 16px', borderRadius: 8, color: '#F87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </p>
        )}

        {/* ── FILTER ROW ── */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: 12, color: '#6B7280', display: 'flex', alignItems: 'center' }}>
              <IcoSearch />
            </span>
            <input
              type="text"
              placeholder="Search available tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '9px 12px 9px 36px', background: '#111111', border: '1px solid #1E1E1E',
                borderRadius: 8, color: '#FFFFFF', fontSize: 13, outline: 'none', transition: 'border-color 0.15s'
              }}
              onFocus={e => e.target.style.borderColor = '#333'}
              onBlur={e => e.target.style.borderColor = '#1E1E1E'}
            />
          </div>

          {/* Sort Dropdown */}
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="dueDate">Due Date</option>
            <option value="title">Alphabetical</option>
          </select>

          {/* Reset Filters Button */}
          <button
            onClick={() => { setSearchQuery(''); setSortBy('newest'); }}
            style={{
              padding: '8px 12px', background: '#111111', border: '1px solid #1E1E1E', borderRadius: 8,
              color: '#D1D5DB', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              transition: 'border-color 0.15s, color 0.15s'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1E1E1E'; e.currentTarget.style.color = '#D1D5DB'; }}>
            <IcoSliders />
            <span>Reset</span>
          </button>
        </div>

        {/* ── TASK CARDS GRID ── */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          {filteredTasks.length === 0 ? (
            <div style={{
              background: '#111111', border: '1px dashed #222222', borderRadius: 12, padding: '48px 24px',
              textAlign: 'center', color: '#4B5563', fontSize: 13, gridColumn: '1 / -1'
            }}>
              No discoverable tasks found matching criteria. Check back later!
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard key={task._id} task={task} showClaimButton={true} onClaimed={loadTasks} />
            ))
          )}
        </div>

      </main>
    </div>
  );
};

export default BrowseTasks;
