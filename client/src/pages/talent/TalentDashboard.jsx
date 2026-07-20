/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import TalentSidebar from '../../components/talent/TalentSidebar';
import AvailableTasksList from '../../components/talent/AvailableTasksList';
import SubmitTaskModal from '../../components/talent/SubmitTaskModal';
import { fetchAvailableTasks, fetchMyTasks } from '../../api/talent';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

/* ──────────────────────────────
   ICON COMPONENTS
────────────────────────────── */
const IcoCheckSquare = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);
const IcoClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IcoActivity = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const IcoWallet = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" />
    <circle cx="16" cy="14" r="1" fill="currentColor" />
  </svg>
);
/* Task category icons */
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
/* Widget icons */
const IcoCalSm = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="14" height="14" rx="2" /><path d="M7 2v4M13 2v4M3 9h14" />
  </svg>
);
const IcoCalXs = () => (
  <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="14" height="14" rx="2" /><path d="M7 2v4M13 2v4M3 9h14" />
  </svg>
);
const IcoClockSm = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

/* ──────────────────────────────
   SPARKLINE — full-width bottom wave
────────────────────────────── */
const Sparkline = () => (
  <svg width="100%" height="32" viewBox="0 0 200 32" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline
      points="0,26 20,22 40,24 60,18 80,20 100,13 120,15 140,9 160,11 180,7 200,9"
      stroke="#2A2A2A"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ──────────────────────────────
   TASK ICON — derived from title keywords
────────────────────────────── */
const getTaskIcon = (title = '') => {
  const t = title.toLowerCase();
  if (t.includes('ui') || t.includes('design') || t.includes('dashboard') || t.includes('frontend') || t.includes('interface')) return <IcoMonitor />;
  if (t.includes('auth') || t.includes('login') || t.includes('security') || t.includes('password')) return <IcoLock />;
  if (t.includes('payment') || t.includes('gateway') || t.includes('billing') || t.includes('wallet') || t.includes('stripe')) return <IcoCreditCard />;
  return <IcoClipboard />;
};

/* ──────────────────────────────
   PURE UTILITIES  (module scope — no Date.now inside render)
────────────────────────────── */
const _timeAgo = (raw, now) => {
  if (!raw) return '';
  const diffMs = now - new Date(raw).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
};

const _dueIn = (raw, now) => {
  if (!raw) return '';
  const diffMs = new Date(raw).getTime() - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  return `Due in ${diffDays} days`;
};

/* ──────────────────────────────
   TIMELINE NODE
────────────────────────────── */
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

/* ──────────────────────────────
   STATUS BADGE — outlined pill matching reference image
────────────────────────────── */
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

/* ══════════════════════════════
   COMPONENT
══════════════════════════════ */
const TalentDashboard = () => {
  const { user } = useAuth();
  const [availableTasks, setAvailableTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [submitTarget, setSubmitTarget] = useState(null);
  const [error, setError] = useState(null);

  const loadAvailable = async () => {
    try { const { data } = await fetchAvailableTasks(); setAvailableTasks(data); }
    catch { setError('Failed to load available tasks'); }
  };

  const loadMyTasks = async () => {
    try { const { data } = await fetchMyTasks(); setMyTasks(data); }
    catch { setError('Failed to load your tasks'); }
  };

  useEffect(() => { loadAvailable(); loadMyTasks(); }, []);

  const handleRefresh = () => { loadAvailable(); loadMyTasks(); };

  /* ── Derived stats ── */
  const completedCount = myTasks.filter((t) => t.status === 'Approved').length;
  const activeTasks = myTasks.filter((t) => t.status === 'Claimed' || t.status === 'Submitted');
  const activeCount = activeTasks.length;
  const underReviewCount = myTasks.filter((t) => t.status === 'Submitted').length;
  const availableCount = availableTasks.length;
  const totalAssignedCount = myTasks.length;
  const progressPercent = totalAssignedCount > 0 ? Math.round((completedCount / totalAssignedCount) * 100) : 0;

  const stats = [
    { label: 'Completed Tasks', value: completedCount, icon: <IcoCheckSquare />, trend: '+3 this week ↗' },
    { label: 'Under Review', value: underReviewCount, icon: <IcoClock />, trend: '+1 this week ↗' },
    { label: 'Current Active', value: activeCount, icon: <IcoActivity />, trend: '+1 this week ↗' },
    { label: 'Total Earned', value: '$0.00', icon: <IcoWallet />, trend: '+$0 this week ↗' },
  ];

  const activeTasksPreview = activeTasks.slice(0, 3);
  const reviewedTasks = myTasks.filter((t) => t.status === 'Approved' || t.status === 'Rejected');

  const deadlines = myTasks
    .filter((t) => t.dueDate && (t.status === 'Claimed' || t.status === 'Submitted'))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  const recentActivities = [...myTasks]
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
    .slice(0, 3);

  /* Snapshot of now — used by module-level pure helpers */
  const nowMs = new Date().getTime();

  const getTimelineSteps = (status) => {
    const stages = ['Claimed', 'In Progress', 'Under Review', 'Completed'];

    // Approved or Rejected means the workflow has finished
    if (status === 'Approved' || status === 'Rejected') {
      return stages.map((label) => ({
        label,
        state: 'done',
      }));
    }

    let activeIndex = 0;

    if (status === 'Claimed') activeIndex = 1;
    else if (status === 'Submitted') activeIndex = 2;

    return stages.map((label, idx) => ({
      label,
      state: idx < activeIndex ? 'done' : idx === activeIndex ? 'active' : 'upcoming',
    }));
  };

  const getActivityMessage = (task) => {
    switch (task.status) {
      case 'Claimed': return { prefix: '', bold: task.title, suffix: ' task claimed' };
      case 'Submitted': return { prefix: 'You submitted ', bold: task.title, suffix: '' };
      case 'Approved': return { prefix: '', bold: task.title, suffix: ' was approved' };
      case 'Rejected': return { prefix: '', bold: task.title, suffix: ' requested changes' };
      default: return { prefix: '', bold: task.title, suffix: ' updated' };
    }
  };

  const fmtDeadlineDate = (raw) => {
    if (!raw) return { day: '', month: '' };
    const d = new Date(raw);
    return {
      day: d.toLocaleDateString('en-US', { day: '2-digit' }),
      month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    };
  };

  const fmtDate = (raw) => {
    if (!raw) return null;
    try {
      const d = new Date(raw);
      if (isNaN(d)) return raw;
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return raw; }
  };

  /* ── Shared card styles ── */
  const card = { background: '#111111', border: '1px solid #1E1E1E', borderRadius: 12 };
  const widgetHeader = {
    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
    color: '#9CA3AF',
  };
  const widgetTitle = { fontSize: 13, fontWeight: 600, color: '#ffffff', margin: 0 };
  const footerLink = { fontSize: 12, color: '#4B5563', background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginTop: 12 };

  const TaskCard = ({ task, isReviewed = false }) => {
    const steps = getTimelineSteps(task.status);
    return (
      <div className="dashboard-card"
        style={{ ...card, padding: '16px 18px 14px', transition: 'border-color 0.15s' }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#085fbcff'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1E1E1E'; }}>

        {/* Row 1: Icon + Title/Desc | Date + Badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
          {/* Category icon */}
          <div className="task-card-icon-box" style={{ width: 38, height: 38, borderRadius: 10, background: '#1A1A1A', border: '1px solid #272727', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', flexShrink: 0, marginTop: 2 }}>
            {getTaskIcon(task.title)}
          </div>

          {/* Title, description, date, status badge wrapper */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#ffffff', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {task.title || 'Untitled Task'}
              </div>

              {/* Date + badge aligned horizontally on the right */}
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
          {/* Timeline */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
            {steps.map((step, idx) => {
              const isLast = idx === steps.length - 1;
              const nextDoneOrActive = !isLast && (steps[idx + 1].state === 'done' || steps[idx + 1].state === 'active');
              return (
                <div key={step.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                  {/* Node container to guarantee centering */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, zIndex: 2 }}>
                    <TimelineNode state={step.state} />
                  </div>
                  {/* Connector Line positioned from center to center */}
                  {!isLast && (
                    <div style={{
                      position: 'absolute',
                      top: 10,
                      left: '50%',
                      width: '100%',
                      height: 1,
                      background: nextDoneOrActive ? '#555555' : '#222222',
                      zIndex: 1
                    }} />
                  )}
                  {/* Label */}
                  <span style={{
                    fontSize: 10, marginTop: 6, textAlign: 'center', lineHeight: 1.2,
                    color: step.state === 'upcoming' ? '#3D3D3D' : '#9CA3AF',
                    zIndex: 2
                  }}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Action button */}
          <button
            disabled={isReviewed}
            onClick={() => !isReviewed && setSubmitTarget(task)}
            className={isReviewed ? "" : "btn-hover-effect"}
            style={{
              flexShrink: 0, padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              cursor: isReviewed ? 'default' : 'pointer', whiteSpace: 'nowrap',
              background: 'transparent', border: '1px solid #2D2D2D', color: isReviewed ? '#4B5563' : '#D1D5DB',
              opacity: isReviewed ? 0.5 : 1,
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!isReviewed) {
                e.currentTarget.style.borderColor = '#555';
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseLeave={(e) => {
              if (!isReviewed) {
                e.currentTarget.style.borderColor = '#2D2D2D';
                e.currentTarget.style.color = '#D1D5DB';
              }
            }}>
            {isReviewed ? 'Reviewed' : (task.status === 'Submitted' ? 'Submit Again' : 'Continue')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0A' }}>
      <style>{`
        /* Minimal hover effects for dashboard sub-elements */
        .dashboard-card {
          transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease !important;
        }
        
        .stat-card-icon-box {
          transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease !important;
        }
        .dashboard-card:hover .stat-card-icon-box {
          background-color: #1e293b !important;
          color: #3b82f6 !important;
          transform: scale(1.05);
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
        
        .footer-link-hover {
          transition: color 0.2s ease, transform 0.2s ease !important;
        }
        .footer-link-hover:hover {
          color: #3b82f6 !important;
          transform: translateX(4px);
        }
        
        .widget-row-item {
          transition: background-color 0.2s ease, padding-left 0.2s ease !important;
          border-radius: 6px;
        }
        .widget-row-item:hover {
          background-color: #161616 !important;
          padding-left: 4px !important;
        }
        
        .widget-row-icon {
          transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease !important;
        }
        .widget-row-item:hover .widget-row-icon {
          background-color: #1e293b !important;
          border-color: rgba(59, 130, 246, 0.3) !important;
          color: #3b82f6 !important;
          transform: scale(1.05);
        }
      `}</style>
      <TalentSidebar />

      <main style={{ marginLeft: 220, flex: 1, minWidth: 0, padding: '28px 32px', overflowX: 'hidden' }}>

        {/* ── HERO ── */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', margin: 0, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.3px' }}>
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ fontSize: 13, color: '#6B7280', marginTop: 4, marginBottom: 0 }}>
            Here&apos;s what&apos;s happening with your work today.
          </p>
        </div>

        {error && (
          <p style={{ fontSize: 13, marginBottom: 20, padding: '10px 16px', borderRadius: 8, color: '#F87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </p>
        )}

        {/* ── STATS ROW ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 14, marginBottom: 24 }}
          className="stats-row">
          {stats.map(({ label, value, icon, trend }) => (
            <div key={label}
              style={{ ...card, padding: '18px 18px 0 18px', overflow: 'hidden', transition: 'border-color 0.15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#085fbcff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1E1E1E'; }}>
              {/* Icon + Label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div className="stat-card-icon-box" style={{ width: 32, height: 32, borderRadius: 8, background: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', flexShrink: 0 }}>
                  {icon}
                </div>
                <span style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', letterSpacing: '0.04em' }}>{label}</span>
              </div>
              {/* Value */}
              <div style={{ fontSize: 32, fontWeight: 700, color: '#ffffff', lineHeight: 1, marginBottom: 6 }}>{value}</div>
              {/* Trend text */}
              <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 8 }}>{trend}</div>
              {/* Sparkline — full width, at bottom */}
              <div style={{ marginLeft: -18, marginRight: -18 }}>
                <Sparkline />
              </div>
            </div>
          ))}
        </div>

        {/* ── MAIN 2-COL GRID ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: 18, marginBottom: 18, alignItems: 'start' }}
          className="main-grid">

          {/* ─── LEFT: My Active Tasks ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* My Active Tasks section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                <div>
                  <h2 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff', margin: 0 }}>My Active Tasks</h2>
                  <p style={{ fontSize: 12, color: '#6B7280', margin: '3px 0 0' }}>Track your progress on active tasks</p>
                </div>
                <Link to="/talent/tasks"
                  className="footer-link-hover"
                  style={{ fontSize: 12, color: '#6B7280', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, paddingTop: 2, flexShrink: 0 }}>
                  View all tasks →
                </Link>
              </div>

              {activeTasksPreview.length === 0 ? (
                <div style={{
                  ...card,
                  padding: '40px 32px',
                  border: '1px dashed #252525',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 10,
                }}>
                  <div style={{ fontSize: 28, lineHeight: 1 }}>📋</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#D1D5DB', margin: 0 }}>No Active Tasks</div>
                  <div style={{ fontSize: 12, color: '#6B7280', maxWidth: 300, lineHeight: 1.6 }}>
                    You haven&apos;t claimed any tasks yet.<br />
                    Browse available tasks below and claim your first assignment.
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {activeTasksPreview.map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))}
                </div>
              )}
            </div>

            {/* Reviewed Tasks Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Header */}
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff', margin: 0 }}>Reviewed Tasks</h2>
                <p style={{ fontSize: 12, color: '#6B7280', margin: '3px 0 0' }}>Outcome of your previously reviewed assignments</p>
              </div>

              {reviewedTasks.length === 0 ? (
                <div style={{
                  ...card,
                  padding: '30px 24px',
                  border: '1px dashed #252525',
                  textAlign: 'center',
                  color: '#4B5563',
                  fontSize: 12.5,
                }}>
                  No reviewed tasks yet. Completed assignments will appear here.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {reviewedTasks.map((task) => (
                    <TaskCard key={task._id} task={task} isReviewed={true} />
                  ))}
                </div>
              )}
            </div>

            {/* ── Bottom cards: Keep it up + Weekly Progress ── */}
            {/* These live inside the left column so they always sit flush below the task list */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.35fr)', gap: 14 }}>

              {/* Join the Community */}
              <div style={{ ...card, padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'border-color 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#085fbcff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1E1E1E'; }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff', margin: '0 0 6px' }}>Join the Community</h3>
                  <p style={{ fontSize: 12, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
                    Discuss tasks, share knowledge, and stay updated.
                  </p>
                </div>
                <button className="btn-hover-effect" style={{
                  marginTop: 16, padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', width: 'fit-content',
                  background: '#1A1A1A', border: '1px solid #2A2A2A', color: '#D1D5DB',
                  transition: 'border-color 0.15s, color 0.15s',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2A2A2A'; e.currentTarget.style.color = '#D1D5DB'; }}>
                  Join Community
                </button>
              </div>

              {/* Weekly Progress */}
              <div style={{ ...card, padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'border-color 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#085fbcff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1E1E1E'; }}>
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', margin: '0 0 2px' }}>Weekly Progress</h3>
                  <p style={{ fontSize: 11, color: '#6B7280', margin: 0 }}>Tasks completed this week</p>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 30, fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>
                      {completedCount} / {totalAssignedCount}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#9CA3AF' }}>{progressPercent}%</span>
                  </div>
                  <div style={{ width: '100%', height: 5, borderRadius: 999, background: '#1F1F1F', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 999, background: '#3B82F6', width: `${progressPercent}%`, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ─── RIGHT: Widgets ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Available Tasks */}
            <div style={{ ...card, padding: '16px 18px 14px', position: 'relative', overflow: 'hidden', transition: 'border-color 0.15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#085fbcff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1E1E1E'; }}>
              <div style={widgetHeader}>
                <IcoCalSm />
                <h3 style={widgetTitle}>Available Tasks</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 38, fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>{availableCount}</div>
                  <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>tasks available</div>
                </div>
                {/* Checklist illustration */}
                <div style={{ opacity: 0.25, display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 4 }}>
                  {[28, 22, 16].map((w, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 12, height: 12, borderRadius: 2, background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                      <div style={{ height: 3, borderRadius: 2, background: '#ffffff', width: w }} />
                    </div>
                  ))}
                </div>
              </div>
              <Link
                to="/talent/browse-tasks"
                className="footer-link-hover"
                style={{ ...footerLink, textDecoration: 'none' }}>
                Browse &amp; Claim →
              </Link>
            </div>

            {/* Upcoming Deadlines */}
            <div style={{ ...card, padding: '16px 18px 14px', transition: 'border-color 0.15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#085fbcff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1E1E1E'; }}>
              <div style={widgetHeader}>
                <IcoCalSm />
                <h3 style={widgetTitle}>Upcoming Deadlines</h3>
              </div>
              {deadlines.length === 0 ? (
                <p style={{ fontSize: 12, color: '#4B5563', margin: 0, padding: '8px 0' }}>No upcoming deadlines.</p>
              ) : (
                <div>
                  {deadlines.map((task, idx) => {
                    const { day, month } = fmtDeadlineDate(task.dueDate);
                    return (
                      <div key={task._id} className="widget-row-item" style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px',
                        borderBottom: idx < deadlines.length - 1 ? '1px solid #1A1A1A' : 'none',
                        margin: '2px -8px',
                      }}>
                        {/* Mini icon */}
                        <div className="widget-row-icon" style={{ width: 28, height: 28, borderRadius: 7, background: '#181818', border: '1px solid #252525', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555555', flexShrink: 0 }}>
                          <IcoCalSm />
                        </div>
                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 500, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</div>
                          <div style={{ fontSize: 11, color: '#6B7280', marginTop: 1 }}>{_dueIn(task.dueDate, nowMs)}</div>
                        </div>
                        {/* Date stacked */}
                        <div style={{ textAlign: 'center', flexShrink: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>{day}</div>
                          <div style={{ fontSize: 9, fontWeight: 600, color: '#6B7280', letterSpacing: '0.1em', marginTop: 2 }}>{month}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <Link to="/talent/tasks" className="footer-link-hover" style={footerLink}>View all deadlines →</Link>
            </div>

            {/* Recent Activity */}
            <div style={{ ...card, padding: '16px 18px 14px', transition: 'border-color 0.15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#085fbcff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1E1E1E'; }}>
              <div style={widgetHeader}>
                <IcoClockSm />
                <h3 style={widgetTitle}>Recent Activity</h3>
              </div>
              {recentActivities.length === 0 ? (
                <p style={{ fontSize: 12, color: '#4B5563', margin: 0, padding: '8px 0' }}>No recent activity.</p>
              ) : (
                <div>
                  {recentActivities.map((task, idx) => {
                    const { prefix, bold, suffix } = getActivityMessage(task);
                    return (
                      <div key={task._id} className="widget-row-item" style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '9px 8px',
                        borderBottom: idx < recentActivities.length - 1 ? '1px solid #1A1A1A' : 'none',
                        margin: '2px -8px',
                      }}>
                        <div className="widget-row-icon" style={{ color: '#555555', flexShrink: 0 }}><IcoClockSm /></div>
                        <p style={{ flex: 1, fontSize: 12, color: '#9CA3AF', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {prefix}
                          <span style={{ color: '#ffffff', fontWeight: 500 }}>{bold}</span>
                          {suffix}
                        </p>
                        <span style={{ fontSize: 11, color: '#4B5563', flexShrink: 0, whiteSpace: 'nowrap' }}>
                          {_timeAgo(task.updatedAt, nowMs)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              <Link to="/talent/tasks" className="footer-link-hover" style={footerLink}>View all activity →</Link>
            </div>

          </div>
        </div>


        {/* ── AVAILABLE TASKS FEED ── */}
        <section id="available-tasks-section" style={{ borderTop: '1px solid #1A1A1A', paddingTop: 24, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: '#ffffff', margin: 0 }}>Available Tasks Feed</h2>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: '#1A1A1A', color: '#6B7280', border: '1px solid #272727' }}>
                {availableTasks.length}
              </span>
            </div>
            <Link to="/talent/browse-tasks"
              className="footer-link-hover"
              style={{ fontSize: 12, color: '#6B7280', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              Browse Tasks →
            </Link>
          </div>
          <AvailableTasksList tasks={availableTasks.slice(0, 3)} onClaimed={handleRefresh} />
        </section>

      </main>

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

export default TalentDashboard;
