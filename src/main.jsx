import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ClinicianDashboard from './ClinicianDashboard'
import SupervisorDashboard from './SupervisorDashboard'
import ManagementDashboard from './ManagementDashboard'
import PayerDashboard from './PayerDashboard'

function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
      fontFamily: "'IBM Plex Sans', -apple-system, sans-serif",
      padding: '48px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');
      `}</style>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '600', 
          color: '#0f172a',
          marginBottom: '8px',
        }}>
          DBT AC-I Dashboard Mock-ups
        </h1>
        <p style={{ 
          color: '#64748b', 
          fontSize: '16px',
          marginBottom: '48px',
        }}>
          Interactive prototypes for different user roles
        </p>

        <div style={{ display: 'grid', gap: '20px' }}>
          {[
            { 
              path: '/clinician', 
              title: 'Clinician Dashboard', 
              description: 'Individual therapist view with personal performance trends, category strengths, improvement opportunities, and change/acceptance balance.',
              color: '#ea580c'
            },
            { 
              path: '/supervisor', 
              title: 'Supervisor Dashboard', 
              description: 'Team oversight with supervisee comparisons, drill-down capabilities, flagged sessions queue, and aggregate metrics.',
              color: '#7c3aed'
            },
            { 
              path: '/management', 
              title: 'Management Dashboard', 
              description: 'Executive view with contract compliance, program breakdowns, trainee time-to-adherence, certification pipeline, and risk flags.',
              color: '#0f172a'
            },
            { 
              path: '/payer', 
              title: 'Payer Dashboard', 
              description: 'Contract monitoring with adherence tracking, rating coverage, network benchmarking, quality indicators, and renewal recommendations.',
              color: '#0284c7'
            },
          ].map((dashboard) => (
            <Link 
              key={dashboard.path}
              to={dashboard.path}
              style={{
                display: 'block',
                padding: '24px',
                background: 'white',
                borderRadius: '12px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = dashboard.color;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.2)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{
                  width: '6px',
                  height: '24px',
                  background: dashboard.color,
                  borderRadius: '3px',
                }} />
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#0f172a',
                  margin: 0,
                }}>
                  {dashboard.title}
                </h2>
              </div>
              <p style={{ 
                color: '#64748b', 
                fontSize: '14px',
                margin: 0,
                paddingLeft: '18px',
                lineHeight: '1.5',
              }}>
                {dashboard.description}
              </p>
            </Link>
          ))}
        </div>

        <p style={{ 
          color: '#94a3b8', 
          fontSize: '12px',
          marginTop: '48px',
          textAlign: 'center',
        }}>
          Based on DBT AC-I (Harned, Schmidt, & Korslund, 2021) • Data shown is illustrative
        </p>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clinician" element={<ClinicianDashboard />} />
        <Route path="/supervisor" element={<SupervisorDashboard />} />
        <Route path="/management" element={<ManagementDashboard />} />
        <Route path="/payer" element={<PayerDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
