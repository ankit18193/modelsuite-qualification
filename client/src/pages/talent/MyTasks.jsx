import { useState, useEffect } from 'react';
import TalentSidebar from '../../components/talent/TalentSidebar';
import SubmitTaskModal from '../../components/talent/SubmitTaskModal';
import { fetchMyTasks } from '../../api/talent';

/* ── SVG Icons: page-level UI ── */
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

/* ── SVG Icons: shared with TalentDashboard TaskCard ── */
const IcoMonitor = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);
const IcoLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IcoCreditCard = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);
const IcoClipboard = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" />
  </svg>
);
const IcoCalXs = () => (
  <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="14" height="14" rx="2" /><path d="M7 2v4M13 2v4M3 9h14" />
  </svg>
);

/* ── Task Icon — same logic as TalentDashboard ── */
const getTaskIcon = (title = '') => {
  const t = title.toLowerCase();
  if (t.includes('ui') || t.includes('design') || t.includes('dashboard') || t.includes('frontend') || t.includes('interface')) return <IcoMonitor />;
  if (t.includes('auth') || t.includes('login') || t.includes('security') || t.includes('password')) return <IcoLock />;
  if (t.includes('payment') || t.includes('gateway') || t.includes('billing') || t.includes('wallet') || t.includes('stripe')) return <IcoCreditCard />;
  return <IcoClipboard />;
};

/* ── Timeline Node — identical to TalentDashboard ── */
const TimelineNode = ({ state }) => {
  if (state === 'done') {
    return (
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        background: '#ffffff', border: '2px solid #ffffff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    );
  }
  if (state === 'active') {
    return (
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        border: '2px solid #555555', background: 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#888888', display: 'block' }} />
      </div>
    );
  }
  return (
    <div style={{
      width: 20, height: 20, borderRadius: '50%',
      border: '2px solid #2D2D2D', background: 'transparent', flexShrink: 0,
    }} />
  );
};

/* ── Status Badge — identical to TalentDashboard ── */
const StatusBadge = ({ status }) => {
  const label = status === 'Submitted' ? 'Under Review' : status === 'Claimed' ? 'In Progress' : status;
  const styles = {
    padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 600,
    letterSpacing: '0.03em', whiteSpace: 'nowrap',
    background: 'transparent',
    border: '1px solid #333333',
    color: '#9CA3AF',
  };
  if (status === 'Submitted') { styles.border = '1px solid #854d0e'; styles.color = '#fbbf24'; }
  if (status === 'Approved') { styles.border = '1px solid #166534'; styles.color = '#4ade80'; }
  if (status === 'Rejected') { styles.border = '1px solid #7f1d1d'; styles.color = '#f87171'; }
  return <span style={styles}>{label}</span>;
};

/* ── Pure helper to format date strings ── */
const fmtDate = (raw) => {
  if (!raw) return null;
  try {
    const d = new Date(raw);
    if (isNaN(d)) return raw;
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return raw; }
};

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [submitTarget, setSubmitTarget] = useState(null);

  /* ── Filter / Tab states ── */
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const loadTasks = async () => {
    try {
      const { data } = await fetchMyTasks();
      setTasks(data);
    } catch {
      setError('Failed to load tasks');
    }
  };

  useEffect(() => {
    let active = true;
    const fetchTasks = async () => {
      try {
        const { data } = await fetchMyTasks();
        if (active) {
          setTasks(data);
        }
      } catch {
        if (active) {
          setError('Failed to load tasks');
        }
      }
    };
    fetchTasks();
    return () => { active = false; };
  }, []);

  const handleRefresh = () => {
    loadTasks();
  };

  /* ── getTimelineSteps — identical to TalentDashboard ── */
  const getTimelineSteps = (status) => {
    const stages = ['Claimed', 'In Progress', 'Under Review', 'Completed'];
    if (status === 'Approved' || status === 'Rejected') {
      return stages.map((label) => ({ label, state: 'done' }));
    }
    let activeIndex = 0;
    if (status === 'Claimed') activeIndex = 1;
    else if (status === 'Submitted') activeIndex = 2;
    return stages.map((label, idx) => ({
      label,
      state: idx < activeIndex ? 'done' : idx === activeIndex ? 'active' : 'upcoming',
    }));
  };

  /* ── TaskCard — exact replica of TalentDashboard's TaskCard ── */
  const card = { background: '#111111', border: '1px solid #1E1E1E', borderRadius: 12 };
  const TaskCard = ({ task, isReviewed = false }) => {
    const steps = getTimelineSteps(task.status);
    return (
      <div className="dashboard-card"
        style={{ ...card, padding: '16px 18px 14px', transition: 'border-color 0.15s' }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#085fbcff'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1E1E1E'; }}>

        {/* Row 1: Icon + Title/Desc | Date + Badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
          <div className="task-card-icon-box" style={{ width: 38, height: 38, borderRadius: 10, background: '#1A1A1A', border: '1px solid #272727', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', flexShrink: 0, marginTop: 2 }}>
            {getTaskIcon(task.title)}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#ffffff', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {task.title || 'Untitled Task'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                {isReviewed ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#6B7280' }}>
                    <IcoCalXs /> Reviewed: {fmtDate(task.updatedAt)}
                  </span>
                ) : (
                  task.dueDate && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#6B7280' }}>
                      <IcoCalXs /> Due: {fmtDate(task.dueDate)}
                    </span>
                  )
                )}
                <StatusBadge status={task.status} />
              </div>
            </div>
            {task.description && (
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {task.description}
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Timeline + Action button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
            {steps.map((step, idx) => {
              const isLast = idx === steps.length - 1;
              const nextDoneOrActive = !isLast && (steps[idx + 1].state === 'done' || steps[idx + 1].state === 'active');
              return (
                <div key={step.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, zIndex: 2 }}>
                    <TimelineNode state={step.state} />
                  </div>
                  {!isLast && (
                    <div style={{
                      position: 'absolute', top: 10, left: '50%', width: '100%', height: 1,
                      background: nextDoneOrActive ? '#555555' : '#222222', zIndex: 1
                    }} />
                  )}
                  <span style={{
                    fontSize: 10, marginTop: 6, textAlign: 'center', lineHeight: 1.2,
                    color: step.state === 'upcoming' ? '#3D3D3D' : '#9CA3AF', zIndex: 2
                  }}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            disabled={isReviewed}
            onClick={() => !isReviewed && setSubmitTarget(task)}
            className={isReviewed ? '' : 'btn-hover-effect'}
            style={{
              flexShrink: 0, padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              cursor: isReviewed ? 'default' : 'pointer', whiteSpace: 'nowrap',
              background: 'transparent', border: '1px solid #2D2D2D', color: isReviewed ? '#4B5563' : '#D1D5DB',
              opacity: isReviewed ? 0.5 : 1, transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => { if (!isReviewed) { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#fff'; } }}
            onMouseLeave={(e) => { if (!isReviewed) { e.currentTarget.style.borderColor = '#2D2D2D'; e.currentTarget.style.color = '#D1D5DB'; } }}>
            {isReviewed ? 'Reviewed' : (task.status === 'Submitted' ? 'Submit Again' : 'Continue')}
          </button>
        </div>
      </div>
    );
  };

  /* ── Process filtering & sorting ── */
  const filteredTasks = tasks
    .filter((task) => {
      // 1. Tab Filter
      if (activeTab === 'In Progress') return task.status === 'Claimed';
      if (activeTab === 'Under Review') return task.status === 'Submitted';
      if (activeTab === 'Completed') return task.status === 'Approved' || task.status === 'Rejected';
      return true;
    })
    .filter((task) => {
      // 2. Status Dropdown Filter
      if (statusFilter === 'All') return true;
      if (statusFilter === 'In Progress') return task.status === 'Claimed';
      if (statusFilter === 'Under Review') return task.status === 'Submitted';
      if (statusFilter === 'Completed') return task.status === 'Approved';
      if (statusFilter === 'Rejected') return task.status === 'Rejected';
      return true;
    })
    .filter((task) => {
      // 3. Search input
      const query = searchQuery.toLowerCase();
      return (
        (task.title || '').toLowerCase().includes(query) ||
        (task.description || '').toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      // 4. Sort selection
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
        /* Custom hover classes */
        .dashboard-card {
          transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease !important;
        }
        .dashboard-card:hover {
          border-color: #085fbcff !important;
        }
        
        .task-card-icon-box {
          transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease !important;
        }
        .dashboard-card:hover .task-card-icon-box {
          background-color: #1e293b !important;
          border-color: rgba(59, 130, 246, 0.3) !important;
          color: #3b82f6 !important;
        }
        
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
              My Tasks
            </h1>
            <p style={{ fontSize: 13, color: '#6B7280', marginTop: 4, marginBottom: 0 }}>
              View and manage all tasks assigned to you.
            </p>
          </div>
          {/* Notification Icon */}
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

        {/* ── TABS ── */}
        <div style={{ display: 'flex', gap: 20, borderBottom: '1px solid #141414', marginBottom: 18, paddingBottom: 1 }}>
          {['All Tasks', 'In Progress', 'Under Review', 'Completed'].map((tab) => {
            const isTabActive = activeTab === (tab === 'All Tasks' ? 'All' : tab);
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab === 'All Tasks' ? 'All' : tab)}
                style={{
                  background: 'none', border: 'none', padding: '0 0 10px 0', fontSize: 13, fontWeight: isTabActive ? 600 : 500,
                  color: isTabActive ? '#ffffff' : '#6B7280', cursor: 'pointer', position: 'relative',
                  fontFamily: 'Inter, sans-serif', transition: 'color 0.15s'
                }}>
                {tab}
                {isTabActive && (
                  <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 1.5, background: '#ffffff' }} />
                )}
              </button>
            );
          })}
        </div>

        {/* ── FILTER ROW ── */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: 12, color: '#6B7280', display: 'flex', alignItems: 'center' }}>
              <IcoSearch />
            </span>
            <input
              type="text"
              placeholder="Search tasks..."
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

          {/* Status Dropdown */}
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Under Review">Under Review</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>

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
            onClick={() => { setSearchQuery(''); setStatusFilter('All'); setSortBy('newest'); }}
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

        {/* ── TASK CARDS VERTICAL STACK ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredTasks.length === 0 ? (
            <div style={{
              background: '#111111', border: '1px dashed #222222', borderRadius: 12, padding: '48px 24px',
              textAlign: 'center', color: '#4B5563', fontSize: 13
            }}>
              No tasks found matching criteria.
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isReviewed = task.status === 'Approved' || task.status === 'Rejected';
              return <TaskCard key={task._id} task={task} isReviewed={isReviewed} />;
            })
          )}
        </div>

      </main>

      {/* Task Submission Modal */}
      {submitTarget && (
        <SubmitTaskModal
          task={submitTarget}
          onClose={() => setSubmitTarget(null)}
          onSubmitted={handleRefresh}
        />
      )}
    </div>
  );
};

export default MyTasks;
