import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ReferenceLine } from 'recharts';

// Sample data based on DBT AC-I structure
const sessionTrendData = [
  { session: 'S1', score: 22, date: 'Oct 2' },
  { session: 'S2', score: 19, date: 'Oct 9' },
  { session: 'S3', score: 21, date: 'Oct 16' },
  { session: 'S4', score: 17, date: 'Oct 23' },
  { session: 'S5', score: 24, date: 'Oct 30' },
  { session: 'S6', score: 18, date: 'Nov 6' },
  { session: 'S7', score: 23, date: 'Nov 13' },
  { session: 'S8', score: 22, date: 'Nov 20' },
  { session: 'S9', score: 24, date: 'Nov 27' },
];

// 12 DBT AC-I categories with adherence percentages
const categoryData = [
  { category: 'Structural', fullName: 'I. Structural Strategies', adherence: 85, strategies: '1-2' },
  { category: 'Assessment', fullName: 'II. Behavioral Assessment', adherence: 78, strategies: '3-4' },
  { category: 'Problem Solving', fullName: 'III. Problem Solving', adherence: 72, strategies: '5-10' },
  { category: 'Contingency', fullName: 'IV. Contingency Mgmt', adherence: 88, strategies: '11-12' },
  { category: 'Exposure', fullName: 'V. Exposure', adherence: 65, strategies: '13-14' },
  { category: 'Cognitive', fullName: 'VI. Cognitive Modification', adherence: 82, strategies: '15' },
  { category: 'Validation', fullName: 'VII. Validation', adherence: 90, strategies: '16-17' },
  { category: 'Reciprocal', fullName: 'VIII. Reciprocal Comm.', adherence: 86, strategies: '18-19' },
  { category: 'Irreverent', fullName: 'IX. Irreverent Comm.', adherence: 75, strategies: '20-21' },
  { category: 'Dialectical', fullName: 'X. Dialectical', adherence: 80, strategies: '22-24' },
  { category: 'Case Mgmt', fullName: 'XI. Case Management', adherence: 70, strategies: '25' },
  { category: 'Protocols', fullName: 'XII. Protocols', adherence: 68, strategies: '26' },
];

// Improvement opportunities with specific strategy details
const improvementOpportunities = [
  {
    rank: 1,
    strategy: 'Chain Analysis',
    strategyNum: 5,
    category: 'Problem Solving',
    recentRate: '56%',
    issue: 'Often missing specific controlling variables',
    suggestion: 'Focus on identifying the specific prompting event and linking vulnerabilities to the behavior',
  },
  {
    rank: 2,
    strategy: 'Consultation to Client',
    strategyNum: 25,
    category: 'Case Management',
    recentRate: '44%',
    issue: 'Intervening directly rather than coaching client',
    suggestion: 'Default to coaching client to advocate for themselves with other providers',
  },
  {
    rank: 3,
    strategy: 'Suicidal Behaviors Protocol',
    strategyNum: 26,
    category: 'Protocols',
    recentRate: '67%',
    issue: 'Missing troubleshooting step when protocol triggered',
    suggestion: 'Ensure all 4 elements: assessment, problem-solving, commitment, troubleshooting',
  },
];

// Change vs Acceptance strategy mapping
const changeStrategies = [5, 6, 7, 8, 9, 10, 11, 13, 14, 15]; // Problem solving, contingency, exposure, cognitive
const acceptanceStrategies = [16, 17, 18, 19, 20]; // Validation, reciprocal communication

export default function DBTACIDashboard() {
  const [selectedSession, setSelectedSession] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const currentScore = sessionTrendData[sessionTrendData.length - 1].score;
  const previousScore = sessionTrendData[sessionTrendData.length - 2].score;
  const scoreDelta = currentScore - previousScore;
  const avgScore = (sessionTrendData.reduce((sum, s) => sum + s.score, 0) / sessionTrendData.length).toFixed(1);

  // Calculate change/acceptance balance (simulated)
  const changeAdherence = 74;
  const acceptanceAdherence = 88;
  const balanceRatio = changeAdherence / (changeAdherence + acceptanceAdherence);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
      fontFamily: "'IBM Plex Sans', -apple-system, sans-serif",
      color: '#1e293b',
      padding: '32px',
    }}>
      {/* Google Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
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
        
        .balance-indicator {
          transition: all 0.5s ease;
        }
      `}</style>

      {/* Header */}
      <div style={{ 
        marginBottom: '32px',
        animation: 'fadeInUp 0.4s ease-out',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '8px',
            height: '32px',
            background: 'linear-gradient(180deg, #fb923c 0%, #ea580c 100%)',
            borderRadius: '4px',
          }} />
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '600',
            margin: 0,
            letterSpacing: '-0.5px',
            color: '#0f172a',
          }}>
            DBT AC-I Dashboard
          </h1>
        </div>
        <p style={{ 
          color: '#64748b', 
          margin: 0,
          fontSize: '14px',
          marginLeft: '20px',
        }}>
          Adherence Monitoring • Dr. Sarah Chen • Last updated: Nov 27, 2024
        </p>
      </div>

      {/* Main Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: 'auto auto',
        gap: '24px',
      }}>

        {/* 1. Overall Score Trend */}
        <div className="card" style={{ 
          padding: '24px',
          animationDelay: '0.1s',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <h2 style={{ 
                fontSize: '13px', 
                fontWeight: '500', 
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                margin: '0 0 8px 0',
              }}>
                Overall Score Trend
              </h2>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span style={{ 
                  fontSize: '42px', 
                  fontWeight: '700',
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: currentScore >= 23 ? '#16a34a' : '#ea580c',
                }}>
                  {currentScore}
                </span>
                <span style={{ color: '#94a3b8', fontSize: '18px' }}>/26</span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: scoreDelta >= 0 ? '#16a34a' : '#dc2626',
                  background: scoreDelta >= 0 ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '6px',
                }}>
                  {scoreDelta >= 0 ? '↑' : '↓'} {Math.abs(scoreDelta)}
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>9-Session Avg</div>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: '600',
                fontFamily: "'IBM Plex Mono', monospace",
                color: '#334155',
              }}>
                {avgScore}
              </div>
            </div>
          </div>

          {/* Threshold Legend */}
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            marginBottom: '16px',
            fontSize: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ 
                width: '24px', 
                height: '2px', 
                background: '#16a34a',
              }} />
              <span style={{ color: '#64748b' }}>Adherent threshold (≥23)</span>
            </div>
          </div>

          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sessionTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.15)" />
                <XAxis 
                  dataKey="session" 
                  stroke="#94a3b8" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(100, 116, 139, 0.3)' }}
                />
                <YAxis 
                  domain={[0, 26]} 
                  stroke="#94a3b8" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(100, 116, 139, 0.3)' }}
                  ticks={[0, 13, 23, 26]}
                />
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.97)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#1e293b',
                  }}
                  formatter={(value) => [`${value}/26`, 'Score']}
                />
                <ReferenceLine 
                  y={23} 
                  stroke="#16a34a" 
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#ea580c"
                  strokeWidth={3}
                  dot={{ fill: '#ea580c', strokeWidth: 0, r: 5 }}
                  activeDot={{ r: 7, fill: '#ea580c', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. 12-Category Radar Chart */}
        <div className="card" style={{ 
          padding: '24px',
          animationDelay: '0.2s',
        }}>
          <h2 style={{ 
            fontSize: '13px', 
            fontWeight: '500', 
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            margin: '0 0 16px 0',
          }}>
            12-Category Performance
          </h2>
          
          <div style={{ height: '260px', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={categoryData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid stroke="rgba(100, 116, 139, 0.2)" />
                <PolarAngleAxis 
                  dataKey="category" 
                  tick={{ fill: '#475569', fontSize: 10 }}
                  tickLine={false}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]}
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  tickCount={5}
                  axisLine={false}
                />
                <Radar
                  name="Adherence"
                  dataKey="adherence"
                  stroke="#ea580c"
                  fill="#f97316"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.97)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#1e293b',
                  }}
                  formatter={(value, name, props) => [
                    `${value}%`,
                    props.payload.fullName
                  ]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Legend - Lowest 3 */}
          <div style={{ 
            marginTop: '12px',
            padding: '12px',
            background: 'rgba(249, 115, 22, 0.06)',
            borderRadius: '8px',
            border: '1px solid rgba(249, 115, 22, 0.15)',
          }}>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Areas Needing Focus
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {categoryData
                .sort((a, b) => a.adherence - b.adherence)
                .slice(0, 3)
                .map((cat, i) => (
                  <div key={cat.category} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                  }}>
                    <span style={{ 
                      color: '#ea580c',
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontWeight: '600',
                    }}>
                      {cat.adherence}%
                    </span>
                    <span style={{ color: '#334155' }}>{cat.fullName}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* 3. Top 3 Improvement Opportunities */}
        <div className="card" style={{ 
          padding: '24px',
          animationDelay: '0.3s',
        }}>
          <h2 style={{ 
            fontSize: '13px', 
            fontWeight: '500', 
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            margin: '0 0 20px 0',
          }}>
            Top 3 Improvement Opportunities
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {improvementOpportunities.map((opp, index) => (
              <div 
                key={opp.strategyNum}
                className="improvement-card"
                style={{
                  padding: '16px',
                  background: 'rgba(241, 245, 249, 0.8)',
                  borderRadius: '12px',
                  borderLeft: '3px solid',
                  borderLeftColor: index === 0 ? '#ef4444' : index === 1 ? '#f97316' : '#eab308',
                  cursor: 'pointer',
                  animation: `slideIn 0.4s ease-out ${0.1 * (index + 1)}s forwards`,
                  opacity: 0,
                }}
              >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: index === 0 ? 'rgba(239, 68, 68, 0.15)' : index === 1 ? 'rgba(249, 115, 22, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: index === 0 ? '#dc2626' : index === 1 ? '#ea580c' : '#ca8a04',
                    }}>
                      {opp.rank}
                    </span>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: '#0f172a' }}>
                        #{opp.strategyNum} {opp.strategy}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {opp.category}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#dc2626',
                  }}>
                    {opp.recentRate}
                  </div>
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#64748b',
                  marginBottom: '8px',
                  paddingLeft: '34px',
                }}>
                  <span style={{ color: '#94a3b8' }}>Issue:</span> {opp.issue}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#059669',
                  paddingLeft: '34px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '6px',
                }}>
                  <span style={{ color: '#10b981' }}>→</span>
                  {opp.suggestion}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Change/Acceptance Balance Indicator */}
        <div className="card" style={{ 
          padding: '24px',
          animationDelay: '0.4s',
        }}>
          <h2 style={{ 
            fontSize: '13px', 
            fontWeight: '500', 
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            margin: '0 0 20px 0',
          }}>
            Change / Acceptance Balance
          </h2>

          {/* Balance Visualization */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '8px',
              fontSize: '12px',
            }}>
              <span style={{ color: '#0284c7', fontWeight: '500' }}>Change Strategies</span>
              <span style={{ color: '#7c3aed', fontWeight: '500' }}>Acceptance Strategies</span>
            </div>
            
            {/* Balance Bar */}
            <div style={{
              height: '40px',
              borderRadius: '8px',
              overflow: 'hidden',
              display: 'flex',
              background: 'rgba(241, 245, 249, 0.8)',
              position: 'relative',
              border: '1px solid rgba(148, 163, 184, 0.2)',
            }}>
              <div 
                className="balance-indicator"
                style={{
                  width: `${balanceRatio * 100}%`,
                  background: 'linear-gradient(90deg, #0284c7 0%, #0ea5e9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '14px',
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: '#fff',
                }}
              >
                {changeAdherence}%
              </div>
              <div 
                className="balance-indicator"
                style={{
                  width: `${(1 - balanceRatio) * 100}%`,
                  background: 'linear-gradient(90deg, #7c3aed 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '14px',
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: '#fff',
                }}
              >
                {acceptanceAdherence}%
              </div>
              
              {/* Center Marker */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                bottom: 0,
                width: '2px',
                background: '#1e293b',
                transform: 'translateX(-50%)',
                opacity: 0.3,
              }} />
            </div>

            {/* Balance Status */}
            <div style={{
              marginTop: '12px',
              padding: '12px',
              background: acceptanceAdherence - changeAdherence > 10 
                ? 'rgba(139, 92, 246, 0.08)' 
                : 'rgba(16, 185, 129, 0.08)',
              borderRadius: '8px',
              border: `1px solid ${acceptanceAdherence - changeAdherence > 10 
                ? 'rgba(139, 92, 246, 0.2)' 
                : 'rgba(16, 185, 129, 0.2)'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <span style={{ fontSize: '18px' }}>
                {acceptanceAdherence - changeAdherence > 10 ? '⚖️' : '✓'}
              </span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#0f172a' }}>
                  {acceptanceAdherence - changeAdherence > 10 
                    ? 'Leaning toward Acceptance' 
                    : 'Well Balanced'}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {acceptanceAdherence - changeAdherence > 10 
                    ? 'Consider increasing change-oriented interventions (problem solving, exposure)' 
                    : 'Maintaining dialectical synthesis between poles'}
                </div>
              </div>
            </div>
          </div>

          {/* Strategy Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Change Strategies */}
            <div>
              <div style={{ 
                fontSize: '11px', 
                color: '#0284c7', 
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}>
                Change-Oriented
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
                {['Chain Analysis', 'Generate Solutions', 'Activate Behavior', 'Exposure', 'Challenge Cognitions'].map((s, i) => (
                  <div key={s} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    color: '#475569',
                  }}>
                    <span>{s}</span>
                    <span style={{ 
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: [78, 85, 88, 65, 82][i] >= 80 ? '#059669' : '#ea580c',
                      fontWeight: '500',
                    }}>
                      {[78, 85, 88, 65, 82][i]}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Acceptance Strategies */}
            <div>
              <div style={{ 
                fontSize: '11px', 
                color: '#7c3aed', 
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}>
                Acceptance-Oriented
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
                {['V4 Learning History', 'V5 Current Events', 'V6 Radical Genuineness', 'Warm Engagement', 'Self-Disclosure'].map((s, i) => (
                  <div key={s} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    color: '#475569',
                  }}>
                    <span>{s}</span>
                    <span style={{ 
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: [85, 92, 88, 95, 80][i] >= 80 ? '#059669' : '#ea580c',
                      fontWeight: '500',
                    }}>
                      {[85, 92, 88, 95, 80][i]}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#94a3b8',
      }}>
        DBT AC-I Dashboard Mock-up • Data shown is illustrative • Based on Harned, Schmidt, & Korslund (2021)
      </div>
    </div>
  );
}
