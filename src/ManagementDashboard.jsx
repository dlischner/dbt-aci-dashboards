import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, AreaChart, Area, ReferenceLine } from 'recharts';

// Contract/Payer threshold
const CONTRACT_THRESHOLD = 85; // % adherent sessions required

// Organization structure
const programs = [
  { id: 'adult', name: 'Adult DBT Program', teams: ['Team A', 'Team B'] },
  { id: 'adolescent', name: 'Adolescent DBT Program', teams: ['Team C'] },
  { id: 'iopPhp', name: 'IOP/PHP Program', teams: ['Team D', 'Team E'] },
];

// Monthly adherence trend data
const monthlyAdherenceTrend = [
  { month: 'Jun', adherentPct: 72, sessionsRated: 145, totalSessions: 180 },
  { month: 'Jul', adherentPct: 75, sessionsRated: 162, totalSessions: 190 },
  { month: 'Aug', adherentPct: 78, sessionsRated: 171, totalSessions: 195 },
  { month: 'Sep', adherentPct: 82, sessionsRated: 185, totalSessions: 200 },
  { month: 'Oct', adherentPct: 84, sessionsRated: 192, totalSessions: 205 },
  { month: 'Nov', adherentPct: 87, sessionsRated: 198, totalSessions: 210 },
];

// Program breakdown data
const programBreakdown = [
  { program: 'Adult DBT', adherentPct: 89, sessionsRated: 85, totalSessions: 95, ratingCoverage: 89, therapists: 8, color: '#7c3aed' },
  { program: 'Adolescent DBT', adherentPct: 84, sessionsRated: 52, totalSessions: 58, ratingCoverage: 90, therapists: 4, color: '#0284c7' },
  { program: 'IOP/PHP', adherentPct: 82, sessionsRated: 61, totalSessions: 72, ratingCoverage: 85, therapists: 6, color: '#059669' },
];

// Supervisor breakdown
const supervisorBreakdown = [
  { name: 'Dr. Williams', program: 'Adult DBT', adherentPct: 91, supervisees: 4, sessionsRated: 48, trend: 'up' },
  { name: 'Dr. Martinez', program: 'Adult DBT', adherentPct: 86, supervisees: 4, sessionsRated: 37, trend: 'stable' },
  { name: 'Dr. Thompson', program: 'Adolescent DBT', adherentPct: 84, supervisees: 4, sessionsRated: 52, trend: 'up' },
  { name: 'Dr. Patel', program: 'IOP/PHP', adherentPct: 83, supervisees: 3, sessionsRated: 32, trend: 'up' },
  { name: 'Dr. Kim', program: 'IOP/PHP', adherentPct: 80, supervisees: 3, sessionsRated: 29, trend: 'down' },
];

// Trainee time-to-adherence data
const traineeProgress = [
  { name: 'Dr. Nguyen', startDate: 'Aug 2024', monthsInTraining: 4, currentAvg: 22.1, adherentSessions: 8, totalSessions: 12, status: 'on-track', projectedCert: 'Jan 2025' },
  { name: 'Dr. Brown', startDate: 'Sep 2024', monthsInTraining: 3, currentAvg: 20.5, adherentSessions: 5, totalSessions: 9, status: 'on-track', projectedCert: 'Feb 2025' },
  { name: 'Dr. Garcia', startDate: 'Jul 2024', monthsInTraining: 5, currentAvg: 18.2, adherentSessions: 4, totalSessions: 14, status: 'at-risk', projectedCert: 'TBD' },
  { name: 'Dr. Anderson', startDate: 'Oct 2024', monthsInTraining: 2, currentAvg: 19.8, adherentSessions: 3, totalSessions: 6, status: 'on-track', projectedCert: 'Mar 2025' },
];

// Typical onboarding curve (benchmark)
const onboardingCurve = [
  { month: 1, avgScore: 17, benchmark: 17 },
  { month: 2, avgScore: 19, benchmark: 19 },
  { month: 3, avgScore: 20.5, benchmark: 21 },
  { month: 4, avgScore: 22, benchmark: 22 },
  { month: 5, avgScore: 23, benchmark: 23 },
  { month: 6, avgScore: 23.5, benchmark: 24 },
];

// Certification pipeline
const certificationPipeline = {
  certified: 12,
  nearCertification: 3, // >80% adherent, close to threshold
  inTraining: 4,
  total: 19,
};

// Risk flags
const riskFlags = [
  { id: 1, type: 'protocol', severity: 'high', title: 'Suicidal Behaviors Protocol Gaps', description: 'IOP/PHP Team D: 67% protocol compliance (below 90% threshold)', metric: '67%', program: 'IOP/PHP', actionNeeded: 'Immediate review required' },
  { id: 2, type: 'declining', severity: 'high', title: 'Declining Trend Alert', description: 'Dr. Kim: 3 consecutive months of declining adherence', metric: '↓12%', program: 'IOP/PHP', actionNeeded: 'Supervisor consultation needed' },
  { id: 3, type: 'diary', severity: 'medium', title: 'Diary Card Review Gaps', description: 'Adolescent DBT: 78% diary card adherence (target: 95%)', metric: '78%', program: 'Adolescent DBT', actionNeeded: 'Training reinforcement' },
  { id: 4, type: 'trainee', severity: 'medium', title: 'Trainee Behind Schedule', description: 'Dr. Garcia: Month 5 with 29% adherent sessions', metric: '29%', program: 'Adult DBT', actionNeeded: 'Intensified supervision plan' },
  { id: 5, type: 'coverage', severity: 'low', title: 'Rating Coverage Below Target', description: 'IOP/PHP: 85% sessions rated (target: 90%)', metric: '85%', program: 'IOP/PHP', actionNeeded: 'Review rating workflow' },
];

// Strategy-wide patterns
const systemWideWeaknesses = [
  { strategy: 'Informal Exposure (#14)', adherence: 58, status: 'critical' },
  { strategy: 'Consultation to Client (#25)', adherence: 65, status: 'warning' },
  { strategy: 'Suicidal Behaviors Protocol (#26)', adherence: 72, status: 'warning' },
];

export default function ManagementDashboard() {
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('q4');

  // Calculate current metrics
  const currentMonth = monthlyAdherenceTrend[monthlyAdherenceTrend.length - 1];
  const prevMonth = monthlyAdherenceTrend[monthlyAdherenceTrend.length - 2];
  const adherentDelta = currentMonth.adherentPct - prevMonth.adherentPct;
  const totalSessionsRated = monthlyAdherenceTrend.reduce((sum, m) => sum + m.sessionsRated, 0);
  const totalSessions = monthlyAdherenceTrend.reduce((sum, m) => sum + m.totalSessions, 0);
  const overallCoverage = Math.round((totalSessionsRated / totalSessions) * 100);
  const meetsThreshold = currentMonth.adherentPct >= CONTRACT_THRESHOLD;

  const highRiskCount = riskFlags.filter(r => r.severity === 'high').length;
  const mediumRiskCount = riskFlags.filter(r => r.severity === 'medium').length;

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
        
        .metric-card {
          transition: all 0.2s ease;
        }
        
        .metric-card:hover {
          transform: translateY(-2px);
        }
        
        .risk-row {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .risk-row:hover {
          background: rgba(241, 245, 249, 0.8);
        }
        
        .program-btn {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .program-btn:hover {
          transform: translateY(-1px);
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '24px', animation: 'fadeInUp 0.4s ease-out' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '8px',
              height: '32px',
              background: 'linear-gradient(180deg, #0f172a 0%, #334155 100%)',
              borderRadius: '4px',
            }} />
            <h1 style={{ fontSize: '28px', fontWeight: '600', margin: 0, letterSpacing: '-0.5px', color: '#0f172a' }}>
              Executive Dashboard
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                background: 'white',
                fontSize: '13px',
                color: '#475569',
              }}
            >
              <option value="q4">Q4 2024</option>
              <option value="q3">Q3 2024</option>
              <option value="ytd">Year to Date</option>
            </select>
          </div>
        </div>
        <p style={{ color: '#64748b', margin: 0, fontSize: '14px', marginLeft: '20px' }}>
          Organization-Wide DBT Quality Metrics • Contract Period: 2024-2025
        </p>
      </div>

      {/* Top KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {/* Adherent % */}
        <div className="card metric-card" style={{ padding: '20px', animationDelay: '0.1s' }}>
          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            Adherent Sessions
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ 
              fontSize: '36px', 
              fontWeight: '700', 
              fontFamily: "'IBM Plex Mono', monospace",
              color: meetsThreshold ? '#16a34a' : '#ea580c',
            }}>
              {currentMonth.adherentPct}%
            </span>
            <span style={{
              fontSize: '13px',
              fontWeight: '500',
              color: adherentDelta >= 0 ? '#16a34a' : '#dc2626',
              background: adherentDelta >= 0 ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)',
              padding: '2px 6px',
              borderRadius: '4px',
            }}>
              {adherentDelta >= 0 ? '↑' : '↓'}{Math.abs(adherentDelta)}%
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
            Target: {CONTRACT_THRESHOLD}%
          </div>
        </div>

        {/* Contract Status */}
        <div className="card metric-card" style={{ padding: '20px', animationDelay: '0.15s' }}>
          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            Contract Status
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ 
              fontSize: '28px',
            }}>
              {meetsThreshold ? '✓' : '⚠️'}
            </span>
            <div>
              <div style={{ 
                fontSize: '18px', 
                fontWeight: '600',
                color: meetsThreshold ? '#16a34a' : '#ea580c',
              }}>
                {meetsThreshold ? 'Meeting' : 'Below'}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Threshold</div>
            </div>
          </div>
        </div>

        {/* Sessions Rated */}
        <div className="card metric-card" style={{ padding: '20px', animationDelay: '0.2s' }}>
          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            Sessions Rated
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '36px', fontWeight: '700', fontFamily: "'IBM Plex Mono', monospace", color: '#0f172a' }}>
              {totalSessionsRated}
            </span>
            <span style={{ fontSize: '14px', color: '#94a3b8' }}>/{totalSessions}</span>
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
            {overallCoverage}% coverage
          </div>
        </div>

        {/* Certified Therapists */}
        <div className="card metric-card" style={{ padding: '20px', animationDelay: '0.25s' }}>
          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            Certified Therapists
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '36px', fontWeight: '700', fontFamily: "'IBM Plex Mono', monospace", color: '#0f172a' }}>
              {certificationPipeline.certified}
            </span>
            <span style={{ fontSize: '14px', color: '#94a3b8' }}>/{certificationPipeline.total}</span>
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
            {certificationPipeline.nearCertification} near certification
          </div>
        </div>

        {/* Risk Alerts */}
        <div className="card metric-card" style={{ padding: '20px', animationDelay: '0.3s', background: highRiskCount > 0 ? 'rgba(254, 242, 242, 0.9)' : undefined }}>
          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            Risk Alerts
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ 
              fontSize: '36px', 
              fontWeight: '700', 
              fontFamily: "'IBM Plex Mono', monospace",
              color: highRiskCount > 0 ? '#dc2626' : '#16a34a',
            }}>
              {riskFlags.length}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: '500' }}>{highRiskCount} high</span>
              <span style={{ fontSize: '11px', color: '#ea580c' }}>{mediumRiskCount} medium</span>
            </div>
          </div>
        </div>
      </div>

      {/* Program Filter */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: '#64748b', marginRight: '8px' }}>Filter:</span>
        <button
          className="program-btn"
          onClick={() => setSelectedProgram('all')}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            border: selectedProgram === 'all' ? '2px solid #0f172a' : '1px solid rgba(148, 163, 184, 0.3)',
            background: selectedProgram === 'all' ? 'rgba(15, 23, 42, 0.05)' : 'white',
            color: selectedProgram === 'all' ? '#0f172a' : '#475569',
            fontWeight: selectedProgram === 'all' ? '600' : '400',
            fontSize: '12px',
          }}
        >
          All Programs
        </button>
        {programs.map(p => (
          <button
            key={p.id}
            className="program-btn"
            onClick={() => setSelectedProgram(p.id)}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: selectedProgram === p.id ? '2px solid #0f172a' : '1px solid rgba(148, 163, 184, 0.3)',
              background: selectedProgram === p.id ? 'rgba(15, 23, 42, 0.05)' : 'white',
              color: selectedProgram === p.id ? '#0f172a' : '#475569',
              fontWeight: selectedProgram === p.id ? '600' : '400',
              fontSize: '12px',
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Adherence Trend Over Time */}
        <div className="card" style={{ padding: '24px', animationDelay: '0.35s' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px 0' }}>
            Adherence Trend
          </h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px 0' }}>
            % of sessions meeting adherence threshold (≥23/26) by month
          </p>

          <div style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyAdherenceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="adherenceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.15)" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: 'rgba(100, 116, 139, 0.3)' }} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: 'rgba(100, 116, 139, 0.3)' }} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{ background: 'rgba(255, 255, 255, 0.97)', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(value, name) => [`${value}%`, 'Adherent Sessions']}
                />
                <ReferenceLine y={CONTRACT_THRESHOLD} stroke="#16a34a" strokeDasharray="5 5" strokeWidth={2} label={{ value: `Target: ${CONTRACT_THRESHOLD}%`, position: 'right', fontSize: 10, fill: '#16a34a' }} />
                <Area type="monotone" dataKey="adherentPct" stroke="#7c3aed" strokeWidth={3} fill="url(#adherenceGradient)" dot={{ fill: '#7c3aed', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Program Breakdown */}
        <div className="card" style={{ padding: '24px', animationDelay: '0.4s' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px 0' }}>
            Performance by Program
          </h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px 0' }}>
            Adherence rate and rating coverage
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {programBreakdown.map((prog) => (
              <div key={prog.program}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: prog.color }} />
                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#0f172a' }}>{prog.program}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: prog.adherentPct >= CONTRACT_THRESHOLD ? '#16a34a' : '#ea580c',
                    }}>
                      {prog.adherentPct}%
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ flex: 1, height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${prog.adherentPct}%`, 
                      height: '100%', 
                      background: prog.adherentPct >= CONTRACT_THRESHOLD ? '#16a34a' : '#ea580c',
                      borderRadius: '4px',
                    }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '10px', color: '#94a3b8' }}>
                  <span>{prog.sessionsRated} sessions rated ({prog.ratingCoverage}% coverage)</span>
                  <span>{prog.therapists} therapists</span>
                </div>
              </div>
            ))}
          </div>

          {/* Contract threshold marker */}
          <div style={{ 
            marginTop: '16px', 
            padding: '10px', 
            background: 'rgba(22, 163, 74, 0.06)', 
            borderRadius: '6px',
            border: '1px solid rgba(22, 163, 74, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <div style={{ width: '12px', height: '2px', background: '#16a34a' }} />
            <span style={{ fontSize: '11px', color: '#16a34a' }}>Contract threshold: {CONTRACT_THRESHOLD}% adherent</span>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Supervisor Breakdown */}
        <div className="card" style={{ padding: '24px', animationDelay: '0.45s' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px 0' }}>
            Performance by Supervisor
          </h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px 0' }}>
            Team adherence rates by supervising clinician
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ textAlign: 'left', padding: '8px', color: '#64748b', fontWeight: '500' }}>Supervisor</th>
                  <th style={{ textAlign: 'left', padding: '8px', color: '#64748b', fontWeight: '500' }}>Program</th>
                  <th style={{ textAlign: 'center', padding: '8px', color: '#64748b', fontWeight: '500' }}>Adherent %</th>
                  <th style={{ textAlign: 'center', padding: '8px', color: '#64748b', fontWeight: '500' }}>Trend</th>
                  <th style={{ textAlign: 'center', padding: '8px', color: '#64748b', fontWeight: '500' }}>Sessions</th>
                </tr>
              </thead>
              <tbody>
                {supervisorBreakdown.map((sup) => (
                  <tr key={sup.name} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 8px', fontWeight: '500', color: '#0f172a' }}>{sup.name}</td>
                    <td style={{ padding: '10px 8px', color: '#64748b', fontSize: '11px' }}>{sup.program}</td>
                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                      <span style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontWeight: '600',
                        color: sup.adherentPct >= CONTRACT_THRESHOLD ? '#16a34a' : '#ea580c',
                      }}>
                        {sup.adherentPct}%
                      </span>
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                      <span style={{ 
                        color: sup.trend === 'up' ? '#16a34a' : sup.trend === 'down' ? '#dc2626' : '#94a3b8',
                        fontSize: '14px',
                      }}>
                        {sup.trend === 'up' ? '↑' : sup.trend === 'down' ? '↓' : '→'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'center', fontFamily: "'IBM Plex Mono', monospace", color: '#475569' }}>
                      {sup.sessionsRated}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Time to Adherence - Trainee Progress */}
        <div className="card" style={{ padding: '24px', animationDelay: '0.5s' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px 0' }}>
            Trainee Time-to-Adherence
          </h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px 0' }}>
            Progress toward certification (target: 6 months)
          </p>

          {/* Onboarding curve chart */}
          <div style={{ height: '120px', marginBottom: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={onboardingCurve} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.1)" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} tickFormatter={(v) => `M${v}`} />
                <YAxis domain={[15, 26]} stroke="#94a3b8" fontSize={10} tickLine={false} ticks={[17, 20, 23, 26]} />
                <ReferenceLine y={23} stroke="#16a34a" strokeDasharray="3 3" strokeWidth={1} />
                <Tooltip contentStyle={{ background: 'rgba(255, 255, 255, 0.97)', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '6px', fontSize: '11px' }} />
                <Line type="monotone" dataKey="benchmark" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Benchmark" />
                <Line type="monotone" dataKey="avgScore" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3 }} name="Avg Trainee" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Trainee list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {traineeProgress.map((trainee) => (
              <div key={trainee.name} style={{
                padding: '10px 12px',
                background: trainee.status === 'at-risk' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(241, 245, 249, 0.6)',
                borderRadius: '8px',
                border: trainee.status === 'at-risk' ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid transparent',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#0f172a' }}>{trainee.name}</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '8px' }}>Month {trainee.monthsInTraining}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ 
                      fontSize: '12px', 
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: trainee.currentAvg >= 23 ? '#16a34a' : trainee.currentAvg >= 20 ? '#ea580c' : '#dc2626',
                    }}>
                      {trainee.currentAvg} avg
                    </span>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '500',
                      background: trainee.status === 'on-track' ? 'rgba(22, 163, 74, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: trainee.status === 'on-track' ? '#16a34a' : '#dc2626',
                    }}>
                      {trainee.status === 'on-track' ? 'On Track' : 'At Risk'}
                    </span>
                  </div>
                </div>
                <div style={{ marginTop: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b' }}>
                  <span>{trainee.adherentSessions}/{trainee.totalSessions} adherent sessions ({Math.round(trainee.adherentSessions/trainee.totalSessions*100)}%)</span>
                  <span>Est. cert: {trainee.projectedCert}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Certification Pipeline Summary */}
          <div style={{ marginTop: '16px', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Certification Pipeline</div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#16a34a', fontFamily: "'IBM Plex Mono', monospace" }}>{certificationPipeline.certified}</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Certified</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#0284c7', fontFamily: "'IBM Plex Mono', monospace" }}>{certificationPipeline.nearCertification}</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Near Cert</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#7c3aed', fontFamily: "'IBM Plex Mono', monospace" }}>{certificationPipeline.inTraining}</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>In Training</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Flags Section */}
      <div className="card" style={{ padding: '24px', animationDelay: '0.55s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '13px', fontWeight: '500', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px 0' }}>
              Risk Flags & Action Items
            </h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
              Issues requiring management attention
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '500', background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626' }}>
              {highRiskCount} High
            </span>
            <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '500', background: 'rgba(249, 115, 22, 0.1)', color: '#ea580c' }}>
              {mediumRiskCount} Medium
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {riskFlags.map((risk) => (
            <div key={risk.id} className="risk-row" style={{
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid',
              borderColor: risk.severity === 'high' ? 'rgba(239, 68, 68, 0.3)' : risk.severity === 'medium' ? 'rgba(249, 115, 22, 0.2)' : 'rgba(148, 163, 184, 0.2)',
              background: risk.severity === 'high' ? 'rgba(239, 68, 68, 0.03)' : 'white',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: risk.severity === 'high' ? '#ef4444' : risk.severity === 'medium' ? '#f97316' : '#94a3b8',
                  }} />
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{risk.title}</span>
                </div>
                <span style={{ 
                  fontSize: '13px', 
                  fontWeight: '700', 
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: risk.severity === 'high' ? '#dc2626' : '#ea580c',
                }}>
                  {risk.metric}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px', paddingLeft: '16px' }}>
                {risk.description}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '16px' }}>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>{risk.program}</span>
                <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: '500' }}>→ {risk.actionNeeded}</span>
              </div>
            </div>
          ))}
        </div>

        {/* System-wide Strategy Weaknesses */}
        <div style={{ marginTop: '20px', padding: '14px', background: '#f8fafc', borderRadius: '10px' }}>
          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
            System-Wide Strategy Gaps (Training Priority)
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            {systemWideWeaknesses.map((item) => (
              <div key={item.strategy} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: item.status === 'critical' ? '#dc2626' : '#ea580c',
                }} />
                <span style={{ fontSize: '12px', color: '#475569' }}>{item.strategy}</span>
                <span style={{ 
                  fontSize: '12px', 
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: '600',
                  color: item.status === 'critical' ? '#dc2626' : '#ea580c',
                }}>
                  {item.adherence}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '24px', padding: '16px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
        DBT AC-I Executive Dashboard Mock-up • Data shown is illustrative • Contract Period: 2024-2025
      </div>
    </div>
  );
}
