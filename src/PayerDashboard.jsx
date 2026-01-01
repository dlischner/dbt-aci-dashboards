import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, ReferenceLine, ComposedChart, Area } from 'recharts';

// Contract thresholds
const CONTRACT_ADHERENCE_THRESHOLD = 70;
const CONTRACT_RATING_COVERAGE_THRESHOLD = 80;

// Practice being viewed
const practiceName = "Behavioral Health Associates";
const contractPeriod = "2024-2025";
const contractStartDate = "January 2024";

// Monthly compliance data
const monthlyComplianceData = [
  { month: 'Jan', adherentPct: 72, ratingCoverage: 75, sessionsRated: 142, totalSessions: 189 },
  { month: 'Feb', adherentPct: 74, ratingCoverage: 78, sessionsRated: 156, totalSessions: 200 },
  { month: 'Mar', adherentPct: 76, ratingCoverage: 80, sessionsRated: 168, totalSessions: 210 },
  { month: 'Apr', adherentPct: 79, ratingCoverage: 82, sessionsRated: 176, totalSessions: 215 },
  { month: 'May', adherentPct: 81, ratingCoverage: 83, sessionsRated: 183, totalSessions: 220 },
  { month: 'Jun', adherentPct: 82, ratingCoverage: 85, sessionsRated: 191, totalSessions: 225 },
  { month: 'Jul', adherentPct: 84, ratingCoverage: 86, sessionsRated: 198, totalSessions: 230 },
  { month: 'Aug', adherentPct: 85, ratingCoverage: 87, sessionsRated: 205, totalSessions: 235 },
  { month: 'Sep', adherentPct: 86, ratingCoverage: 88, sessionsRated: 215, totalSessions: 245 },
  { month: 'Oct', adherentPct: 87, ratingCoverage: 89, sessionsRated: 222, totalSessions: 250 },
  { month: 'Nov', adherentPct: 78, ratingCoverage: 90, sessionsRated: 230, totalSessions: 255 },
];

// Benchmark comparison data (anonymized practices)
const benchmarkData = [
  { name: 'Practice D', adherentPct: 72, rank: 8 },
  { name: 'Practice G', adherentPct: 76, rank: 7 },
  { name: 'Practice B', adherentPct: 79, rank: 6 },
  { name: 'Practice F', adherentPct: 82, rank: 5 },
  { name: 'Practice E', adherentPct: 84, rank: 4 },
  { name: practiceName, adherentPct: 88, rank: 3, isTarget: true },
  { name: 'Practice A', adherentPct: 91, rank: 2 },
  { name: 'Practice C', adherentPct: 94, rank: 1 },
];

// Quality indicators
const qualityIndicators = {
  suicidalBehaviorsProtocol: { current: 91, threshold: 90, trend: 'up', label: 'Suicidal Behaviors Protocol' },
  diaryCardReview: { current: 94, threshold: 90, trend: 'stable', label: 'Diary Card Review' },
  organizeByTargets: { current: 89, threshold: 85, trend: 'up', label: 'Organize by Targets' },
  certifiedTherapists: { current: 85, threshold: 75, trend: 'up', label: 'Therapist Certification Rate' },
};

// Red flags
const redFlags = [
  { id: 1, active: false, title: 'Sudden Adherence Drop', description: '≥10% decline in single month', status: 'clear', lastTriggered: null },
  { id: 2, active: false, title: 'Low Rating Coverage', description: 'Below 80% sessions rated', status: 'clear', lastTriggered: 'Mar 2024' },
  { id: 3, active: true, title: 'Protocol Underperformance', description: 'Chain Analysis at 78% (below 85%)', status: 'monitoring', lastTriggered: 'Current' },
  { id: 4, active: false, title: 'Chronic Non-Compliance', description: '3+ months below threshold', status: 'resolved', lastTriggered: 'Apr 2024' },
];

// Contract renewal indicators
const renewalIndicators = {
  trajectory: 'improving', // improving, stable, declining
  monthsCompliant: 4, // consecutive months meeting threshold
  totalMonthsInContract: 11,
  priorFeedbackItems: 3,
  feedbackAddressed: 3,
  qiInitiatives: [
    { name: 'Chain Analysis Training', status: 'in-progress', startDate: 'Oct 2024' },
    { name: 'Protocol Compliance Audit', status: 'completed', startDate: 'Aug 2024' },
    { name: 'New Therapist Onboarding Revision', status: 'completed', startDate: 'Jun 2024' },
  ],
  overallStatus: 'recommend-renewal', // recommend-renewal, conditional, not-recommended
};

// Calculate current metrics
const currentMonth = monthlyComplianceData[monthlyComplianceData.length - 1];
const prevMonth = monthlyComplianceData[monthlyComplianceData.length - 2];
const ytdSessionsRated = monthlyComplianceData.reduce((sum, m) => sum + m.sessionsRated, 0);
const ytdTotalSessions = monthlyComplianceData.reduce((sum, m) => sum + m.totalSessions, 0);
const ytdCoverage = Math.round((ytdSessionsRated / ytdTotalSessions) * 100);
const ytdAdherent = Math.round(monthlyComplianceData.reduce((sum, m) => sum + m.adherentPct, 0) / monthlyComplianceData.length);
const practiceRank = benchmarkData.find(p => p.isTarget)?.rank || 0;
const totalPractices = benchmarkData.length;
const percentile = Math.round(((totalPractices - practiceRank + 1) / totalPractices) * 100);

export default function PayerDashboard() {
  const [selectedView, setSelectedView] = useState('current');

  const meetsAdherenceThreshold = currentMonth.adherentPct >= CONTRACT_ADHERENCE_THRESHOLD;
  const meetsCoverageThreshold = currentMonth.ratingCoverage >= CONTRACT_RATING_COVERAGE_THRESHOLD;
  const activeRedFlags = redFlags.filter(r => r.active).length;

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
        
        .card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 16px;
          animation: fadeInUp 0.6s ease-out forwards;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        }
        
        .card:hover {
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }
        
        .compliance-meter {
          transition: all 0.5s ease;
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '28px', animation: 'fadeInUp 0.4s ease-out' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '8px',
              height: '36px',
              background: 'linear-gradient(180deg, #0369a1 0%, #0284c7 100%)',
              borderRadius: '4px',
            }} />
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: '600', margin: 0, letterSpacing: '-0.5px', color: '#0f172a' }}>
                {practiceName}
              </h1>
              <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>
                Contract Period: {contractPeriod} • Started: {contractStartDate}
              </p>
            </div>
          </div>
          
          {/* Overall Status Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}>
            <div className="status-badge" style={{
              background: renewalIndicators.overallStatus === 'recommend-renewal' 
                ? 'rgba(22, 163, 74, 0.1)' 
                : renewalIndicators.overallStatus === 'conditional'
                ? 'rgba(249, 115, 22, 0.1)'
                : 'rgba(239, 68, 68, 0.1)',
              color: renewalIndicators.overallStatus === 'recommend-renewal'
                ? '#16a34a'
                : renewalIndicators.overallStatus === 'conditional'
                ? '#ea580c'
                : '#dc2626',
            }}>
              <span style={{ fontSize: '16px' }}>
                {renewalIndicators.overallStatus === 'recommend-renewal' ? '✓' : renewalIndicators.overallStatus === 'conditional' ? '⚠' : '✗'}
              </span>
              {renewalIndicators.overallStatus === 'recommend-renewal' 
                ? 'Recommend Renewal' 
                : renewalIndicators.overallStatus === 'conditional'
                ? 'Conditional'
                : 'Review Required'}
            </div>
          </div>
        </div>
      </div>

      {/* Contract Compliance KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        
        {/* Adherence % */}
        <div className="card" style={{ padding: '20px', animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Adherence Rate
            </div>
            <span style={{
              padding: '3px 8px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: '600',
              background: meetsAdherenceThreshold ? 'rgba(22, 163, 74, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: meetsAdherenceThreshold ? '#16a34a' : '#dc2626',
            }}>
              {meetsAdherenceThreshold ? 'MEETING' : 'BELOW'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ 
              fontSize: '40px', 
              fontWeight: '700', 
              fontFamily: "'IBM Plex Mono', monospace",
              color: meetsAdherenceThreshold ? '#16a34a' : '#dc2626',
            }}>
              {currentMonth.adherentPct}%
            </span>
          </div>
          <div style={{ marginTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
              <span>Contract threshold</span>
              <span>{CONTRACT_ADHERENCE_THRESHOLD}%</span>
            </div>
            <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${Math.min(currentMonth.adherentPct, 100)}%`, 
                height: '100%', 
                background: meetsAdherenceThreshold ? '#16a34a' : '#dc2626',
                borderRadius: '3px',
              }} />
            </div>
          </div>
        </div>

        {/* Rating Coverage */}
        <div className="card" style={{ padding: '20px', animationDelay: '0.15s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Rating Coverage
            </div>
            <span style={{
              padding: '3px 8px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: '600',
              background: meetsCoverageThreshold ? 'rgba(22, 163, 74, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: meetsCoverageThreshold ? '#16a34a' : '#dc2626',
            }}>
              {meetsCoverageThreshold ? 'MEETING' : 'BELOW'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ 
              fontSize: '40px', 
              fontWeight: '700', 
              fontFamily: "'IBM Plex Mono', monospace",
              color: meetsCoverageThreshold ? '#16a34a' : '#dc2626',
            }}>
              {currentMonth.ratingCoverage}%
            </span>
          </div>
          <div style={{ marginTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
              <span>Contract threshold</span>
              <span>{CONTRACT_RATING_COVERAGE_THRESHOLD}%</span>
            </div>
            <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${Math.min(currentMonth.ratingCoverage, 100)}%`, 
                height: '100%', 
                background: meetsCoverageThreshold ? '#16a34a' : '#dc2626',
                borderRadius: '3px',
              }} />
            </div>
          </div>
        </div>

        {/* Benchmark Ranking */}
        <div className="card" style={{ padding: '20px', animationDelay: '0.2s' }}>
          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
            Network Ranking
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ 
              fontSize: '40px', 
              fontWeight: '700', 
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#0284c7',
            }}>
              #{practiceRank}
            </span>
            <span style={{ fontSize: '16px', color: '#94a3b8' }}>of {totalPractices}</span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#64748b' }}>
            <span style={{ 
              fontWeight: '600', 
              color: '#0284c7',
              background: 'rgba(2, 132, 199, 0.1)',
              padding: '2px 6px',
              borderRadius: '4px',
            }}>
              {percentile}th percentile
            </span>
            <span style={{ marginLeft: '6px' }}>among contracted providers</span>
          </div>
        </div>

        {/* Red Flags */}
        <div className="card" style={{ padding: '20px', animationDelay: '0.25s', background: activeRedFlags > 0 ? 'rgba(254, 243, 199, 0.5)' : undefined }}>
          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
            Active Red Flags
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ 
              fontSize: '40px', 
              fontWeight: '700', 
              fontFamily: "'IBM Plex Mono', monospace",
              color: activeRedFlags > 0 ? '#d97706' : '#16a34a',
            }}>
              {activeRedFlags}
            </span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#64748b' }}>
            {activeRedFlags > 0 
              ? <span style={{ color: '#d97706' }}>Requires monitoring</span>
              : <span style={{ color: '#16a34a' }}>No active concerns</span>
            }
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Compliance Trend */}
        <div className="card" style={{ padding: '24px', animationDelay: '0.3s' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px 0' }}>
            Contract Period Compliance Trend
          </h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px 0' }}>
            Adherence rate and rating coverage over time
          </p>

          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyComplianceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="adherenceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.15)" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[60, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{ background: 'rgba(255, 255, 255, 0.97)', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(value, name) => [`${value}%`, name === 'adherentPct' ? 'Adherence' : 'Rating Coverage']}
                />
                <ReferenceLine y={CONTRACT_ADHERENCE_THRESHOLD} stroke="#16a34a" strokeDasharray="5 5" strokeWidth={2} />
                <ReferenceLine y={CONTRACT_RATING_COVERAGE_THRESHOLD} stroke="#0284c7" strokeDasharray="5 5" strokeWidth={1} />
                <Area type="monotone" dataKey="adherentPct" fill="url(#adherenceGradient)" stroke="#0284c7" strokeWidth={3} dot={{ fill: '#0284c7', r: 4 }} name="adherentPct" />
                <Line type="monotone" dataKey="ratingCoverage" stroke="#7c3aed" strokeWidth={2} dot={{ fill: '#7c3aed', r: 3 }} name="ratingCoverage" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '24px', marginTop: '12px', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
              <div style={{ width: '16px', height: '3px', background: '#0284c7', borderRadius: '2px' }} />
              <span style={{ color: '#64748b' }}>Adherence Rate</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
              <div style={{ width: '16px', height: '3px', background: '#7c3aed', borderRadius: '2px' }} />
              <span style={{ color: '#64748b' }}>Rating Coverage</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
              <div style={{ width: '16px', height: '2px', background: '#16a34a', borderRadius: '2px' }} />
              <span style={{ color: '#64748b' }}>Threshold ({CONTRACT_ADHERENCE_THRESHOLD}%)</span>
            </div>
          </div>
        </div>

        {/* Benchmark Comparison */}
        <div className="card" style={{ padding: '24px', animationDelay: '0.35s' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px 0' }}>
            Network Comparison
          </h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px 0' }}>
            Performance vs. other contracted DBT providers
          </p>

          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={benchmarkData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.1)" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[60, 100]} stroke="#94a3b8" fontSize={10} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} width={90} tick={({ x, y, payload }) => (
                  <text x={x} y={y} dy={4} textAnchor="end" fontSize={10} fill={payload.value === practiceName ? '#0284c7' : '#94a3b8'} fontWeight={payload.value === practiceName ? 600 : 400}>
                    {payload.value === practiceName ? '► ' + payload.value : payload.value}
                  </text>
                )} />
                <Tooltip
                  contentStyle={{ background: 'rgba(255, 255, 255, 0.97)', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(value) => [`${value}%`, 'Adherence']}
                />
                <ReferenceLine x={CONTRACT_ADHERENCE_THRESHOLD} stroke="#16a34a" strokeDasharray="5 5" />
                <Bar dataKey="adherentPct" radius={[0, 4, 4, 0]}>
                  {benchmarkData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.isTarget ? '#0284c7' : entry.adherentPct >= CONTRACT_ADHERENCE_THRESHOLD ? '#94a3b8' : '#cbd5e1'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Quality Indicators */}
        <div className="card" style={{ padding: '24px', animationDelay: '0.4s' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px 0' }}>
            Quality Indicators
          </h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 20px 0' }}>
            Key fidelity markers beyond overall adherence
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.entries(qualityIndicators).map(([key, indicator]) => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#0f172a' }}>{indicator.label}</span>
                    <span style={{ 
                      fontSize: '10px', 
                      color: indicator.trend === 'up' ? '#16a34a' : indicator.trend === 'down' ? '#dc2626' : '#94a3b8',
                    }}>
                      {indicator.trend === 'up' ? '↑' : indicator.trend === 'down' ? '↓' : '→'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: indicator.current >= indicator.threshold ? '#16a34a' : '#dc2626',
                    }}>
                      {indicator.current}%
                    </span>
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '9px',
                      fontWeight: '600',
                      background: indicator.current >= indicator.threshold ? 'rgba(22, 163, 74, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: indicator.current >= indicator.threshold ? '#16a34a' : '#dc2626',
                    }}>
                      {indicator.current >= indicator.threshold ? 'PASS' : 'BELOW'}
                    </span>
                  </div>
                </div>
                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
                  <div style={{ 
                    width: `${indicator.current}%`, 
                    height: '100%', 
                    background: indicator.current >= indicator.threshold ? '#16a34a' : '#dc2626',
                    borderRadius: '3px',
                  }} />
                  <div style={{
                    position: 'absolute',
                    left: `${indicator.threshold}%`,
                    top: '-2px',
                    bottom: '-2px',
                    width: '2px',
                    background: '#374151',
                  }} />
                </div>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>
                  Threshold: {indicator.threshold}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Red Flags Detail */}
        <div className="card" style={{ padding: '24px', animationDelay: '0.45s' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px 0' }}>
            Red Flag Monitoring
          </h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 20px 0' }}>
            Automated compliance alerts
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {redFlags.map((flag) => (
              <div key={flag.id} style={{
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid',
                borderColor: flag.active 
                  ? 'rgba(217, 119, 6, 0.3)' 
                  : flag.status === 'resolved' 
                  ? 'rgba(22, 163, 74, 0.2)' 
                  : 'rgba(148, 163, 184, 0.2)',
                background: flag.active ? 'rgba(254, 243, 199, 0.3)' : 'white',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: flag.active ? '#d97706' : flag.status === 'resolved' ? '#16a34a' : '#94a3b8',
                    }} />
                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#0f172a' }}>{flag.title}</span>
                  </div>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '600',
                    background: flag.active 
                      ? 'rgba(217, 119, 6, 0.15)' 
                      : flag.status === 'resolved' 
                      ? 'rgba(22, 163, 74, 0.1)' 
                      : 'rgba(148, 163, 184, 0.1)',
                    color: flag.active ? '#d97706' : flag.status === 'resolved' ? '#16a34a' : '#64748b',
                  }}>
                    {flag.active ? 'ACTIVE' : flag.status === 'resolved' ? 'RESOLVED' : 'CLEAR'}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', paddingLeft: '16px' }}>
                  {flag.description}
                </div>
                {flag.lastTriggered && (
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px', paddingLeft: '16px' }}>
                    {flag.active ? 'Status: ' : 'Last triggered: '}{flag.lastTriggered}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contract Renewal Section */}
      <div className="card" style={{ padding: '24px', animationDelay: '0.5s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '13px', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px 0' }}>
              Contract Renewal Indicators
            </h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
              Factors informing renewal recommendation
            </p>
          </div>
          <div className="status-badge" style={{
            background: renewalIndicators.overallStatus === 'recommend-renewal' 
              ? 'rgba(22, 163, 74, 0.1)' 
              : renewalIndicators.overallStatus === 'conditional'
              ? 'rgba(249, 115, 22, 0.1)'
              : 'rgba(239, 68, 68, 0.1)',
            color: renewalIndicators.overallStatus === 'recommend-renewal'
              ? '#16a34a'
              : renewalIndicators.overallStatus === 'conditional'
              ? '#ea580c'
              : '#dc2626',
            padding: '8px 16px',
            fontSize: '14px',
          }}>
            <span style={{ fontSize: '18px' }}>
              {renewalIndicators.overallStatus === 'recommend-renewal' ? '✓' : renewalIndicators.overallStatus === 'conditional' ? '⚠' : '✗'}
            </span>
            {renewalIndicators.overallStatus === 'recommend-renewal' 
              ? 'Recommend Renewal' 
              : renewalIndicators.overallStatus === 'conditional'
              ? 'Conditional Renewal'
              : 'Review Required'}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          
          {/* Trajectory */}
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Trajectory
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                fontSize: '24px',
                color: renewalIndicators.trajectory === 'improving' ? '#16a34a' : renewalIndicators.trajectory === 'stable' ? '#0284c7' : '#dc2626',
              }}>
                {renewalIndicators.trajectory === 'improving' ? '↑' : renewalIndicators.trajectory === 'stable' ? '→' : '↓'}
              </span>
              <span style={{ 
                fontSize: '16px', 
                fontWeight: '600',
                color: renewalIndicators.trajectory === 'improving' ? '#16a34a' : renewalIndicators.trajectory === 'stable' ? '#0284c7' : '#dc2626',
                textTransform: 'capitalize',
              }}>
                {renewalIndicators.trajectory}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
              {renewalIndicators.monthsCompliant} consecutive months compliant
            </div>
          </div>

          {/* Feedback Responsiveness */}
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Feedback Response
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ 
                fontSize: '28px', 
                fontWeight: '700',
                fontFamily: "'IBM Plex Mono', monospace",
                color: renewalIndicators.feedbackAddressed === renewalIndicators.priorFeedbackItems ? '#16a34a' : '#ea580c',
              }}>
                {renewalIndicators.feedbackAddressed}
              </span>
              <span style={{ fontSize: '14px', color: '#94a3b8' }}>/{renewalIndicators.priorFeedbackItems}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
              Prior feedback items addressed
            </div>
          </div>

          {/* Contract Duration */}
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Contract Progress
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ 
                fontSize: '28px', 
                fontWeight: '700',
                fontFamily: "'IBM Plex Mono', monospace",
                color: '#0f172a',
              }}>
                {renewalIndicators.totalMonthsInContract}
              </span>
              <span style={{ fontSize: '14px', color: '#94a3b8' }}>/12 months</span>
            </div>
            <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${(renewalIndicators.totalMonthsInContract / 12) * 100}%`, height: '100%', background: '#0284c7', borderRadius: '2px' }} />
            </div>
          </div>

          {/* QI Initiatives */}
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              QI Initiatives
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {renewalIndicators.qiInitiatives.map((qi, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: qi.status === 'completed' ? '#16a34a' : '#0284c7',
                  }} />
                  <span style={{ color: '#475569' }}>{qi.name}</span>
                  <span style={{ 
                    fontSize: '9px', 
                    color: qi.status === 'completed' ? '#16a34a' : '#0284c7',
                    marginLeft: 'auto',
                  }}>
                    {qi.status === 'completed' ? '✓' : 'In Progress'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '24px', padding: '16px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
        DBT AC-I Payer Dashboard • Confidential • Generated: November 2024
      </div>
    </div>
  );
}
