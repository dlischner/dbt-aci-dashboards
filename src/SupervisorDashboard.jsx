import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ReferenceLine, Legend } from 'recharts';

// Supervisee data
const supervisees = [
  { id: 1, name: 'Dr. Sarah Chen', color: '#ea580c', sessions: 12 },
  { id: 2, name: 'Dr. Marcus Webb', color: '#0284c7', sessions: 9 },
  { id: 3, name: 'Dr. Priya Sharma', color: '#7c3aed', sessions: 15 },
  { id: 4, name: 'Dr. James Liu', color: '#059669', sessions: 7 },
];

// Session trend data for each supervisee
const sessionTrendData = [
  { session: 'S1', date: 'Oct 2', chen: 22, webb: 18, sharma: 24, liu: 19, teamAvg: 20.8 },
  { session: 'S2', date: 'Oct 9', chen: 19, webb: 20, sharma: 23, liu: 17, teamAvg: 19.8 },
  { session: 'S3', date: 'Oct 16', chen: 21, webb: 19, sharma: 25, liu: 20, teamAvg: 21.3 },
  { session: 'S4', date: 'Oct 23', chen: 17, webb: 21, sharma: 24, liu: 18, teamAvg: 20.0 },
  { session: 'S5', date: 'Oct 30', chen: 24, webb: 22, sharma: 26, liu: 21, teamAvg: 23.3 },
  { session: 'S6', date: 'Nov 6', chen: 18, webb: 23, sharma: 24, liu: 19, teamAvg: 21.0 },
  { session: 'S7', date: 'Nov 13', chen: 23, webb: 21, sharma: 25, liu: 22, teamAvg: 22.8 },
  { session: 'S8', date: 'Nov 20', chen: 22, webb: 24, sharma: 25, liu: 20, teamAvg: 22.8 },
  { session: 'S9', date: 'Nov 27', chen: 24, webb: 22, sharma: 26, liu: 23, teamAvg: 23.8 },
];

// Category data by supervisee
const categoryDataByPerson = {
  team: [
    { category: 'Structural', fullName: 'I. Structural Strategies', adherence: 82 },
    { category: 'Assessment', fullName: 'II. Behavioral Assessment', adherence: 76 },
    { category: 'Problem Solving', fullName: 'III. Problem Solving', adherence: 74 },
    { category: 'Contingency', fullName: 'IV. Contingency Mgmt', adherence: 85 },
    { category: 'Exposure', fullName: 'V. Exposure', adherence: 62 },
    { category: 'Cognitive', fullName: 'VI. Cognitive Modification', adherence: 79 },
    { category: 'Validation', fullName: 'VII. Validation', adherence: 88 },
    { category: 'Reciprocal', fullName: 'VIII. Reciprocal Comm.', adherence: 84 },
    { category: 'Irreverent', fullName: 'IX. Irreverent Comm.', adherence: 72 },
    { category: 'Dialectical', fullName: 'X. Dialectical', adherence: 78 },
    { category: 'Case Mgmt', fullName: 'XI. Case Management', adherence: 68 },
    { category: 'Protocols', fullName: 'XII. Protocols', adherence: 71 },
  ],
  chen: [
    { category: 'Structural', fullName: 'I. Structural Strategies', adherence: 85 },
    { category: 'Assessment', fullName: 'II. Behavioral Assessment', adherence: 78 },
    { category: 'Problem Solving', fullName: 'III. Problem Solving', adherence: 72 },
    { category: 'Contingency', fullName: 'IV. Contingency Mgmt', adherence: 88 },
    { category: 'Exposure', fullName: 'V. Exposure', adherence: 65 },
    { category: 'Cognitive', fullName: 'VI. Cognitive Modification', adherence: 82 },
    { category: 'Validation', fullName: 'VII. Validation', adherence: 90 },
    { category: 'Reciprocal', fullName: 'VIII. Reciprocal Comm.', adherence: 86 },
    { category: 'Irreverent', fullName: 'IX. Irreverent Comm.', adherence: 75 },
    { category: 'Dialectical', fullName: 'X. Dialectical', adherence: 80 },
    { category: 'Case Mgmt', fullName: 'XI. Case Management', adherence: 70 },
    { category: 'Protocols', fullName: 'XII. Protocols', adherence: 68 },
  ],
  webb: [
    { category: 'Structural', fullName: 'I. Structural Strategies', adherence: 80 },
    { category: 'Assessment', fullName: 'II. Behavioral Assessment', adherence: 82 },
    { category: 'Problem Solving', fullName: 'III. Problem Solving', adherence: 78 },
    { category: 'Contingency', fullName: 'IV. Contingency Mgmt', adherence: 85 },
    { category: 'Exposure', fullName: 'V. Exposure', adherence: 58 },
    { category: 'Cognitive', fullName: 'VI. Cognitive Modification', adherence: 75 },
    { category: 'Validation', fullName: 'VII. Validation', adherence: 92 },
    { category: 'Reciprocal', fullName: 'VIII. Reciprocal Comm.', adherence: 88 },
    { category: 'Irreverent', fullName: 'IX. Irreverent Comm.', adherence: 65 },
    { category: 'Dialectical', fullName: 'X. Dialectical', adherence: 82 },
    { category: 'Case Mgmt', fullName: 'XI. Case Management', adherence: 72 },
    { category: 'Protocols', fullName: 'XII. Protocols', adherence: 78 },
  ],
  sharma: [
    { category: 'Structural', fullName: 'I. Structural Strategies', adherence: 92 },
    { category: 'Assessment', fullName: 'II. Behavioral Assessment', adherence: 88 },
    { category: 'Problem Solving', fullName: 'III. Problem Solving', adherence: 85 },
    { category: 'Contingency', fullName: 'IV. Contingency Mgmt', adherence: 90 },
    { category: 'Exposure', fullName: 'V. Exposure', adherence: 72 },
    { category: 'Cognitive', fullName: 'VI. Cognitive Modification', adherence: 88 },
    { category: 'Validation', fullName: 'VII. Validation', adherence: 95 },
    { category: 'Reciprocal', fullName: 'VIII. Reciprocal Comm.', adherence: 90 },
    { category: 'Irreverent', fullName: 'IX. Irreverent Comm.', adherence: 82 },
    { category: 'Dialectical', fullName: 'X. Dialectical', adherence: 88 },
    { category: 'Case Mgmt', fullName: 'XI. Case Management', adherence: 75 },
    { category: 'Protocols', fullName: 'XII. Protocols', adherence: 80 },
  ],
  liu: [
    { category: 'Structural', fullName: 'I. Structural Strategies', adherence: 72 },
    { category: 'Assessment', fullName: 'II. Behavioral Assessment', adherence: 68 },
    { category: 'Problem Solving', fullName: 'III. Problem Solving', adherence: 65 },
    { category: 'Contingency', fullName: 'IV. Contingency Mgmt', adherence: 78 },
    { category: 'Exposure', fullName: 'V. Exposure', adherence: 55 },
    { category: 'Cognitive', fullName: 'VI. Cognitive Modification', adherence: 70 },
    { category: 'Validation', fullName: 'VII. Validation', adherence: 82 },
    { category: 'Reciprocal', fullName: 'VIII. Reciprocal Comm.', adherence: 75 },
    { category: 'Irreverent', fullName: 'IX. Irreverent Comm.', adherence: 62 },
    { category: 'Dialectical', fullName: 'X. Dialectical', adherence: 68 },
    { category: 'Case Mgmt', fullName: 'XI. Case Management', adherence: 58 },
    { category: 'Protocols', fullName: 'XII. Protocols', adherence: 60 },
  ],
};

// Improvement opportunities by person
const improvementOpportunitiesByPerson = {
  team: [
    { rank: 1, strategy: 'Exposure Strategies', strategyNum: '13-14', category: 'Exposure', recentRate: '62%', issue: 'Informal exposure underutilized across team', suggestion: 'Review exposure principles in next team meeting' },
    { rank: 2, strategy: 'Consultation to Client', strategyNum: '25', category: 'Case Management', recentRate: '68%', issue: 'Direct intervention instead of coaching', suggestion: 'Role-play consultation-to-client scenarios' },
    { rank: 3, strategy: 'Suicidal Behaviors Protocol', strategyNum: '26', category: 'Protocols', recentRate: '71%', issue: 'Incomplete protocol when triggered', suggestion: 'Ensure all 4 elements completed consistently' },
  ],
  chen: [
    { rank: 1, strategy: 'Chain Analysis', strategyNum: '5', category: 'Problem Solving', recentRate: '56%', issue: 'Missing specific controlling variables', suggestion: 'Focus on identifying specific prompting events' },
    { rank: 2, strategy: 'Consultation to Client', strategyNum: '25', category: 'Case Management', recentRate: '44%', issue: 'Intervening directly rather than coaching', suggestion: 'Default to coaching client to advocate' },
    { rank: 3, strategy: 'Suicidal Behaviors Protocol', strategyNum: '26', category: 'Protocols', recentRate: '67%', issue: 'Missing troubleshooting step', suggestion: 'Complete all 4 protocol elements' },
  ],
  webb: [
    { rank: 1, strategy: 'Informal Exposure', strategyNum: '14', category: 'Exposure', recentRate: '45%', issue: 'Missed opportunities for in-session exposure', suggestion: 'Look for naturally occurring exposure moments' },
    { rank: 2, strategy: 'Irreverent Communication', strategyNum: '21-22', category: 'Irreverent Comm.', recentRate: '52%', issue: 'Overly predictable responses when client stuck', suggestion: 'Practice irreverent responses in supervision' },
    { rank: 3, strategy: 'Cognitive Modification', strategyNum: '15', category: 'Cognitive', recentRate: '68%', issue: 'Insufficient challenging of maladaptive thoughts', suggestion: 'More direct confrontation of cognitive distortions' },
  ],
  sharma: [
    { rank: 1, strategy: 'Informal Exposure', strategyNum: '14', category: 'Exposure', recentRate: '72%', issue: 'Good but room for improvement', suggestion: 'Continue identifying exposure opportunities' },
    { rank: 2, strategy: 'Consultation to Client', strategyNum: '25', category: 'Case Management', recentRate: '75%', issue: 'Occasional direct intervention', suggestion: 'Maintain coaching stance consistently' },
    { rank: 3, strategy: 'Suicidal Behaviors Protocol', strategyNum: '26', category: 'Protocols', recentRate: '80%', issue: 'Minor gaps in troubleshooting', suggestion: 'Strengthen troubleshooting component' },
  ],
  liu: [
    { rank: 1, strategy: 'Exposure Strategies', strategyNum: '13-14', category: 'Exposure', recentRate: '38%', issue: 'Rarely utilizing exposure in sessions', suggestion: 'Prioritize exposure training and practice' },
    { rank: 2, strategy: 'Case Management', strategyNum: '25', category: 'Case Management', recentRate: '42%', issue: 'Frequently intervening for client', suggestion: 'Intensive focus on consultation-to-client' },
    { rank: 3, strategy: 'Suicidal Behaviors Protocol', strategyNum: '26', category: 'Protocols', recentRate: '55%', issue: 'Protocol often incomplete', suggestion: 'Review protocol steps systematically' },
  ],
};

// Balance data by person
const balanceDataByPerson = {
  team: { change: 74, acceptance: 86 },
  chen: { change: 74, acceptance: 88 },
  webb: { change: 72, acceptance: 90 },
  sharma: { change: 82, acceptance: 88 },
  liu: { change: 65, acceptance: 78 },
};

// Flagged sessions for review
const flaggedSessions = [
  { id: 1, supervisee: 'Dr. James Liu', date: 'Nov 25', session: 'Client: M.R.', flag: 'Suicidal Behaviors Protocol missed', severity: 'high', score: 17 },
  { id: 2, supervisee: 'Dr. Sarah Chen', date: 'Nov 22', session: 'Client: K.T.', flag: 'Score below threshold (19/26)', severity: 'medium', score: 19 },
  { id: 3, supervisee: 'Dr. Marcus Webb', date: 'Nov 20', session: 'Client: A.S.', flag: 'Chain Analysis incomplete', severity: 'low', score: 21 },
  { id: 4, supervisee: 'Dr. James Liu', date: 'Nov 18', session: 'Client: J.P.', flag: 'Balance heavily acceptance-leaning', severity: 'medium', score: 18 },
];

// Supervisee comparison data
const superviseeComparison = [
  { name: 'Dr. Priya Sharma', avgScore: 24.7, trend: 'up', sessions: 15, adherentRate: '93%', lowestStrategy: 'Exposure (72%)', color: '#7c3aed' },
  { name: 'Dr. Sarah Chen', avgScore: 21.1, trend: 'up', sessions: 12, adherentRate: '67%', lowestStrategy: 'Chain Analysis (56%)', color: '#ea580c' },
  { name: 'Dr. Marcus Webb', avgScore: 21.1, trend: 'up', sessions: 9, adherentRate: '56%', lowestStrategy: 'Exposure (45%)', color: '#0284c7' },
  { name: 'Dr. James Liu', avgScore: 19.9, trend: 'up', sessions: 7, adherentRate: '43%', lowestStrategy: 'Exposure (38%)', color: '#059669' },
];

export default function SupervisorDashboard() {
  const [selectedPerson, setSelectedPerson] = useState('team');
  const [showAllLines, setShowAllLines] = useState(true);

  const currentCategoryData = categoryDataByPerson[selectedPerson];
  const currentImprovements = improvementOpportunitiesByPerson[selectedPerson];
  const currentBalance = balanceDataByPerson[selectedPerson];
  const balanceRatio = currentBalance.change / (currentBalance.change + currentBalance.acceptance);

  const getPersonKey = (name) => {
    if (name === 'team') return 'team';
    if (name.includes('Chen')) return 'chen';
    if (name.includes('Webb')) return 'webb';
    if (name.includes('Sharma')) return 'sharma';
    if (name.includes('Liu')) return 'liu';
    return 'team';
  };

  const teamAvgScore = 21.9;
  const totalSessions = supervisees.reduce((sum, s) => sum + s.sessions, 0);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
      fontFamily: "'IBM Plex Sans', -apple-system, sans-serif",
      color: '#1e293b',
      padding: '32px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 16px;
          animation: fadeInUp 0.6s ease-out forwards;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        }
        
        .card:hover {
          border-color: rgba(148, 163, 184, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .improvement-card {
          transition: all 0.3s ease;
        }
        
        .improvement-card:hover {
          transform: translateX(4px);
          background: rgba(251, 146, 60, 0.06);
        }
        
        .flagged-row {
          transition: all 0.2s ease;
        }
        
        .flagged-row:hover {
          background: rgba(241, 245, 249, 0.8);
        }
        
        .supervisee-btn {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .supervisee-btn:hover {
          transform: translateY(-1px);
        }
        
        .comparison-row {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .comparison-row:hover {
          background: rgba(241, 245, 249, 0.8);
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '24px', animation: 'fadeInUp 0.4s ease-out' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '8px',
              height: '32px',
              background: 'linear-gradient(180deg, #7c3aed 0%, #5b21b6 100%)',
              borderRadius: '4px',
            }} />
            <h1 style={{ fontSize: '28px', fontWeight: '600', margin: 0, letterSpacing: '-0.5px', color: '#0f172a' }}>
              Supervisor Dashboard
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Team Sessions</div>
              <div style={{ fontSize: '20px', fontWeight: '600', fontFamily: "'IBM Plex Mono', monospace", color: '#334155' }}>{totalSessions}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Team Avg Score</div>
              <div style={{ fontSize: '20px', fontWeight: '600', fontFamily: "'IBM Plex Mono', monospace", color: teamAvgScore >= 23 ? '#16a34a' : '#ea580c' }}>{teamAvgScore}</div>
            </div>
          </div>
        </div>
        <p style={{ color: '#64748b', margin: 0, fontSize: '14px', marginLeft: '20px' }}>
          Clinical Leader View • 4 Supervisees • Last updated: Nov 27, 2024
        </p>
      </div>

      {/* Supervisee Selector */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: '#64748b', marginRight: '8px' }}>View:</span>
        <button
          className="supervisee-btn"
          onClick={() => setSelectedPerson('team')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: selectedPerson === 'team' ? '2px solid #7c3aed' : '1px solid rgba(148, 163, 184, 0.3)',
            background: selectedPerson === 'team' ? 'rgba(124, 58, 237, 0.1)' : 'white',
            color: selectedPerson === 'team' ? '#7c3aed' : '#475569',
            fontWeight: selectedPerson === 'team' ? '600' : '400',
            fontSize: '13px',
          }}
        >
          👥 Team Average
        </button>
        {supervisees.map((s) => (
          <button
            key={s.id}
            className="supervisee-btn"
            onClick={() => setSelectedPerson(getPersonKey(s.name))}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: selectedPerson === getPersonKey(s.name) ? `2px solid ${s.color}` : '1px solid rgba(148, 163, 184, 0.3)',
              background: selectedPerson === getPersonKey(s.name) ? `${s.color}15` : 'white',
              color: selectedPerson === getPersonKey(s.name) ? s.color : '#475569',
              fontWeight: selectedPerson === getPersonKey(s.name) ? '600' : '400',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color }} />
            {s.name.replace('Dr. ', '')}
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>({s.sessions})</span>
          </button>
        ))}
      </div>

      {/* Main Grid - 2x2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>

        {/* 1. Score Trends - All Supervisees */}
        <div className="card" style={{ padding: '24px', animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '13px', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px 0' }}>
                Score Trends by Supervisee
              </h2>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                {selectedPerson === 'team' ? 'All supervisees + team average' : `Highlighting: ${supervisees.find(s => getPersonKey(s.name) === selectedPerson)?.name || 'Team'}`}
              </p>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showAllLines}
                onChange={(e) => setShowAllLines(e.target.checked)}
                style={{ accentColor: '#7c3aed' }}
              />
              Show all lines
            </label>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', flexWrap: 'wrap', fontSize: '11px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '16px', height: '3px', background: '#374151', borderRadius: '2px' }} />
              <span style={{ color: '#64748b' }}>Team Avg</span>
            </div>
            {supervisees.map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: showAllLines || selectedPerson === getPersonKey(s.name) ? 1 : 0.3 }}>
                <div style={{ width: '16px', height: '3px', background: s.color, borderRadius: '2px' }} />
                <span style={{ color: '#64748b' }}>{s.name.replace('Dr. ', '')}</span>
              </div>
            ))}
          </div>

          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sessionTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.15)" />
                <XAxis dataKey="session" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: 'rgba(100, 116, 139, 0.3)' }} />
                <YAxis domain={[0, 26]} stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: 'rgba(100, 116, 139, 0.3)' }} ticks={[0, 13, 23, 26]} />
                <Tooltip
                  contentStyle={{ background: 'rgba(255, 255, 255, 0.97)', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '8px', fontSize: '12px', color: '#1e293b' }}
                />
                <ReferenceLine y={23} stroke="#16a34a" strokeDasharray="5 5" strokeWidth={2} />
                
                {/* Team Average - always visible */}
                <Line type="monotone" dataKey="teamAvg" stroke="#374151" strokeWidth={3} strokeDasharray="8 4" dot={false} name="Team Avg" />
                
                {/* Individual lines */}
                <Line type="monotone" dataKey="chen" stroke="#ea580c" strokeWidth={selectedPerson === 'chen' ? 3 : 2} dot={{ r: selectedPerson === 'chen' ? 4 : 2 }} opacity={showAllLines || selectedPerson === 'chen' ? 1 : 0.15} name="Chen" />
                <Line type="monotone" dataKey="webb" stroke="#0284c7" strokeWidth={selectedPerson === 'webb' ? 3 : 2} dot={{ r: selectedPerson === 'webb' ? 4 : 2 }} opacity={showAllLines || selectedPerson === 'webb' ? 1 : 0.15} name="Webb" />
                <Line type="monotone" dataKey="sharma" stroke="#7c3aed" strokeWidth={selectedPerson === 'sharma' ? 3 : 2} dot={{ r: selectedPerson === 'sharma' ? 4 : 2 }} opacity={showAllLines || selectedPerson === 'sharma' ? 1 : 0.15} name="Sharma" />
                <Line type="monotone" dataKey="liu" stroke="#059669" strokeWidth={selectedPerson === 'liu' ? 3 : 2} dot={{ r: selectedPerson === 'liu' ? 4 : 2 }} opacity={showAllLines || selectedPerson === 'liu' ? 1 : 0.15} name="Liu" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Category Radar */}
        <div className="card" style={{ padding: '24px', animationDelay: '0.2s' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px 0' }}>
            12-Category Performance
          </h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 12px 0' }}>
            {selectedPerson === 'team' ? 'Team average across all categories' : `${supervisees.find(s => getPersonKey(s.name) === selectedPerson)?.name || ''}`}
          </p>

          <div style={{ height: '230px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={currentCategoryData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid stroke="rgba(100, 116, 139, 0.2)" />
                <PolarAngleAxis dataKey="category" tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 9 }} tickCount={5} axisLine={false} />
                <Radar name="Adherence" dataKey="adherence" stroke={selectedPerson === 'team' ? '#7c3aed' : supervisees.find(s => getPersonKey(s.name) === selectedPerson)?.color || '#7c3aed'} fill={selectedPerson === 'team' ? '#7c3aed' : supervisees.find(s => getPersonKey(s.name) === selectedPerson)?.color || '#7c3aed'} fillOpacity={0.25} strokeWidth={2} />
                <Tooltip contentStyle={{ background: 'rgba(255, 255, 255, 0.97)', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '8px', fontSize: '12px', color: '#1e293b' }} formatter={(value, name, props) => [`${value}%`, props.payload.fullName]} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginTop: '8px', padding: '10px', background: 'rgba(249, 115, 22, 0.06)', borderRadius: '8px', border: '1px solid rgba(249, 115, 22, 0.15)' }}>
            <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Lowest 3 Categories</div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[...currentCategoryData].sort((a, b) => a.adherence - b.adherence).slice(0, 3).map((cat) => (
                <div key={cat.category} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
                  <span style={{ color: '#ea580c', fontFamily: "'IBM Plex Mono', monospace", fontWeight: '600' }}>{cat.adherence}%</span>
                  <span style={{ color: '#334155' }}>{cat.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Improvement Opportunities */}
        <div className="card" style={{ padding: '24px', animationDelay: '0.3s' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px 0' }}>
            Top 3 Improvement Opportunities
          </h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px 0' }}>
            {selectedPerson === 'team' ? 'Team-wide priorities' : `For ${supervisees.find(s => getPersonKey(s.name) === selectedPerson)?.name || ''}`}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentImprovements.map((opp, index) => (
              <div key={opp.strategyNum} className="improvement-card" style={{
                padding: '14px',
                background: 'rgba(241, 245, 249, 0.8)',
                borderRadius: '10px',
                borderLeft: '3px solid',
                borderLeftColor: index === 0 ? '#ef4444' : index === 1 ? '#f97316' : '#eab308',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: index === 0 ? 'rgba(239, 68, 68, 0.15)' : index === 1 ? 'rgba(249, 115, 22, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                      borderRadius: '5px', fontSize: '11px', fontWeight: '700',
                      color: index === 0 ? '#dc2626' : index === 1 ? '#ea580c' : '#ca8a04',
                    }}>{opp.rank}</span>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '13px', color: '#0f172a' }}>#{opp.strategyNum} {opp.strategy}</div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>{opp.category}</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '13px', fontWeight: '600', color: '#dc2626' }}>{opp.recentRate}</div>
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', paddingLeft: '28px' }}>
                  <span style={{ color: '#94a3b8' }}>Issue:</span> {opp.issue}
                </div>
                <div style={{ fontSize: '11px', color: '#059669', paddingLeft: '28px', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                  <span style={{ color: '#10b981' }}>→</span>{opp.suggestion}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Change/Acceptance Balance */}
        <div className="card" style={{ padding: '24px', animationDelay: '0.4s' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px 0' }}>
            Change / Acceptance Balance
          </h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px 0' }}>
            {selectedPerson === 'team' ? 'Team dialectical balance' : `${supervisees.find(s => getPersonKey(s.name) === selectedPerson)?.name || ''}`}
          </p>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '11px' }}>
              <span style={{ color: '#0284c7', fontWeight: '500' }}>Change Strategies</span>
              <span style={{ color: '#7c3aed', fontWeight: '500' }}>Acceptance Strategies</span>
            </div>
            
            <div style={{ height: '36px', borderRadius: '8px', overflow: 'hidden', display: 'flex', background: 'rgba(241, 245, 249, 0.8)', position: 'relative', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
              <div style={{ width: `${balanceRatio * 100}%`, background: 'linear-gradient(90deg, #0284c7 0%, #0ea5e9 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '13px', fontFamily: "'IBM Plex Mono', monospace", color: '#fff' }}>{currentBalance.change}%</div>
              <div style={{ width: `${(1 - balanceRatio) * 100}%`, background: 'linear-gradient(90deg, #7c3aed 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '13px', fontFamily: "'IBM Plex Mono', monospace", color: '#fff' }}>{currentBalance.acceptance}%</div>
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: '#1e293b', transform: 'translateX(-50%)', opacity: 0.3 }} />
            </div>

            <div style={{
              marginTop: '10px', padding: '10px',
              background: currentBalance.acceptance - currentBalance.change > 10 ? 'rgba(139, 92, 246, 0.08)' : 'rgba(16, 185, 129, 0.08)',
              borderRadius: '8px',
              border: `1px solid ${currentBalance.acceptance - currentBalance.change > 10 ? 'rgba(139, 92, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span style={{ fontSize: '16px' }}>{currentBalance.acceptance - currentBalance.change > 10 ? '⚖️' : '✓'}</span>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '500', color: '#0f172a' }}>
                  {currentBalance.acceptance - currentBalance.change > 10 ? 'Leaning toward Acceptance' : 'Well Balanced'}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  {currentBalance.acceptance - currentBalance.change > 10 ? 'Consider increasing change-oriented interventions' : 'Maintaining dialectical synthesis'}
                </div>
              </div>
            </div>
          </div>

          {/* Mini comparison for team view */}
          {selectedPerson === 'team' && (
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Balance by Supervisee</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {supervisees.map(s => {
                  const bal = balanceDataByPerson[getPersonKey(s.name)];
                  const ratio = bal.change / (bal.change + bal.acceptance);
                  return (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '70px', fontSize: '11px', color: '#475569' }}>{s.name.replace('Dr. ', '')}</div>
                      <div style={{ flex: 1, height: '12px', borderRadius: '4px', overflow: 'hidden', display: 'flex', background: '#f1f5f9' }}>
                        <div style={{ width: `${ratio * 100}%`, background: '#0ea5e9' }} />
                        <div style={{ width: `${(1 - ratio) * 100}%`, background: '#8b5cf6' }} />
                      </div>
                      <div style={{ width: '60px', fontSize: '10px', fontFamily: "'IBM Plex Mono', monospace", color: '#64748b', textAlign: 'right' }}>{bal.change}/{bal.acceptance}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section - Flagged Sessions & Comparison Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
        
        {/* Flagged Sessions Queue */}
        <div className="card" style={{ padding: '24px', animationDelay: '0.5s' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '13px', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px 0' }}>
                Flagged Sessions
              </h2>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Sessions requiring supervisor review</p>
            </div>
            <span style={{
              padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600',
              background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626',
            }}>{flaggedSessions.length} pending</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {flaggedSessions.map((session) => (
              <div key={session.id} className="flagged-row" style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: session.severity === 'high' ? 'rgba(239, 68, 68, 0.3)' : session.severity === 'medium' ? 'rgba(249, 115, 22, 0.3)' : 'rgba(148, 163, 184, 0.2)',
                background: session.severity === 'high' ? 'rgba(239, 68, 68, 0.04)' : 'white',
                cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: session.severity === 'high' ? '#ef4444' : session.severity === 'medium' ? '#f97316' : '#94a3b8',
                    }} />
                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#0f172a' }}>{session.supervisee}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{session.date}</span>
                </div>
                <div style={{ paddingLeft: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '2px' }}>{session.session}</div>
                  <div style={{ fontSize: '12px', color: session.severity === 'high' ? '#dc2626' : '#ea580c', fontWeight: '500' }}>
                    {session.flag}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supervisee Comparison Table */}
        <div className="card" style={{ padding: '24px', animationDelay: '0.6s' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px 0' }}>
            Supervisee Comparison
          </h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px 0' }}>Performance summary across all supervisees</p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ textAlign: 'left', padding: '8px 12px', color: '#64748b', fontWeight: '500' }}>Supervisee</th>
                  <th style={{ textAlign: 'center', padding: '8px 12px', color: '#64748b', fontWeight: '500' }}>Avg Score</th>
                  <th style={{ textAlign: 'center', padding: '8px 12px', color: '#64748b', fontWeight: '500' }}>Trend</th>
                  <th style={{ textAlign: 'center', padding: '8px 12px', color: '#64748b', fontWeight: '500' }}>Sessions</th>
                  <th style={{ textAlign: 'center', padding: '8px 12px', color: '#64748b', fontWeight: '500' }}>Adherent %</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', color: '#64748b', fontWeight: '500' }}>Lowest Strategy</th>
                </tr>
              </thead>
              <tbody>
                {superviseeComparison.map((person, idx) => (
                  <tr 
                    key={person.name} 
                    className="comparison-row"
                    onClick={() => setSelectedPerson(getPersonKey(person.name))}
                    style={{ borderBottom: '1px solid #f1f5f9', background: selectedPerson === getPersonKey(person.name) ? 'rgba(124, 58, 237, 0.05)' : 'transparent' }}
                  >
                    <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: person.color }} />
                      <span style={{ fontWeight: '500', color: '#0f172a' }}>{person.name}</span>
                    </td>
                    <td style={{ textAlign: 'center', padding: '12px' }}>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: '600', color: person.avgScore >= 23 ? '#16a34a' : '#ea580c' }}>{person.avgScore}</span>
                    </td>
                    <td style={{ textAlign: 'center', padding: '12px' }}>
                      <span style={{ color: person.trend === 'up' ? '#16a34a' : '#dc2626', fontSize: '14px' }}>
                        {person.trend === 'up' ? '↑' : '↓'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', padding: '12px', fontFamily: "'IBM Plex Mono', monospace", color: '#475569' }}>{person.sessions}</td>
                    <td style={{ textAlign: 'center', padding: '12px' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: '4px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
                        background: parseInt(person.adherentRate) >= 80 ? 'rgba(22, 163, 74, 0.1)' : parseInt(person.adherentRate) >= 60 ? 'rgba(249, 115, 22, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: parseInt(person.adherentRate) >= 80 ? '#16a34a' : parseInt(person.adherentRate) >= 60 ? '#ea580c' : '#dc2626',
                      }}>{person.adherentRate}</span>
                    </td>
                    <td style={{ padding: '12px', color: '#64748b', fontSize: '11px' }}>{person.lowestStrategy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '24px', padding: '16px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
        DBT AC-I Supervisor Dashboard Mock-up • Data shown is illustrative • Based on Harned, Schmidt, & Korslund (2021)
      </div>
    </div>
  );
}
