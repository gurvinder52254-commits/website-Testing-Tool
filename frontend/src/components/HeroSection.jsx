import React from 'react';
import Hero3D from './Three/Hero3D';
import { useHeroAnimation } from './Three/GsapAnimations';
import TestForm from './TestForm';

export default function HeroSection({ wsConnected, onStartTestClick, onNavigate }) {
  const heroRef = useHeroAnimation();

  return (
    <div className="hero-section" ref={heroRef}>
      <Hero3D />
      {/* Hero Content */}
      <section className="hero">
        <div className="hero__badge">
          <span className="hero__badge-dot"></span>
          <span className="hero__badge-text">System Status: Active</span>
        </div>

        <h1 className="hero__title">
          AI-Powered Testing<br />
          <span className="hero__title-gradient">for Your Websites.</span>
        </h1>
        <p className="hero__desc">
          Automatically crawl, screenshot, and analyze every page of your website with AI-powered quality scoring, SEO audits, and detailed performance reports.
        </p>

        <div className="hero__stats">
          <div className="hero__stat">
            <span className="hero__stat-value">50+</span>
            <span className="hero__stat-label">Test Checks</span>
          </div>
          <div className="hero__stat-divider"></div>
          <div className="hero__stat">
            <span className="hero__stat-value">AI</span>
            <span className="hero__stat-label">Analysis</span>
          </div>
          <div className="hero__stat-divider"></div>
          <div className="hero__stat">
            <span className="hero__stat-value">∞</span>
            <span className="hero__stat-label">Pages</span>
          </div>
        </div>
      </section>

      {/* Test Form */}
      <TestForm onSubmit={onStartTestClick} disabled={!wsConnected} />

      {/* Core Node Hierarchy */}
      <section className="nodes-section">
        <div className="nodes-section__header">
          <h2 className="nodes-section__title">How It Works</h2>
          <p className="nodes-section__desc">Three powerful steps to comprehensive website testing.</p>
        </div>
        <div className="features">
          <div className="feature-card feature-card--primary">
            <div className="feature-card__orb">
              <div className="feature-card__orb-glow feature-card__orb-glow--primary"></div>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="feature-card__orb-icon feature-card__orb-icon--primary">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              <div className="feature-card__orbit feature-card__orbit--primary">
                <div className="feature-card__particle feature-card__particle--primary"></div>
              </div>
            </div>
            <h3 className="feature-card__title">Deep Page Scan</h3>
            <p className="feature-card__desc">Crawls every link in your header & footer, tests each page individually with full screenshot capture.</p>
            <div className="feature-card__bar">
              <div className="feature-card__bar-fill feature-card__bar-fill--primary" style={{ width: '85%' }}></div>
            </div>
          </div>

          <div className="feature-card feature-card--secondary">
            <div className="feature-card__orb">
              <div className="feature-card__orb-glow feature-card__orb-glow--secondary"></div>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="feature-card__orb-icon feature-card__orb-icon--secondary">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <div className="feature-card__orbit feature-card__orbit--secondary">
                <div className="feature-card__particle feature-card__particle--secondary"></div>
              </div>
            </div>
            <h3 className="feature-card__title">AI Quality Score</h3>
            <p className="feature-card__desc">Gemini AI analyzes your UI design, layout, content quality, and accessibility to generate a quality score.</p>
            <div className="feature-card__bar">
              <div className="feature-card__bar-fill feature-card__bar-fill--secondary" style={{ width: '62%' }}></div>
            </div>
          </div>

          <div className="feature-card feature-card--tertiary">
            <div className="feature-card__orb">
              <div className="feature-card__orb-glow feature-card__orb-glow--tertiary"></div>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="feature-card__orb-icon feature-card__orb-icon--tertiary">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <div className="feature-card__orbit feature-card__orbit--tertiary">
                <div className="feature-card__particle feature-card__particle--tertiary"></div>
              </div>
            </div>
            <h3 className="feature-card__title">Detailed Reports</h3>
            <p className="feature-card__desc">Get comprehensive reports with SEO audits, broken links, network performance, and actionable recommendations.</p>
            <div className="feature-card__bar">
              <div className="feature-card__bar-fill feature-card__bar-fill--tertiary" style={{ width: '94%' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-section__glow cta-section__glow--1"></div>
        <div className="cta-section__glow cta-section__glow--2"></div>
        <div className="cta-section__content">
          <h2 className="cta-section__title">Ready to test your website?</h2>
          <p className="cta-section__desc">Start a comprehensive AI-powered analysis of your website in seconds. No configuration required.</p>
          <div className="cta-section__buttons">
            <button className="cta-section__btn cta-section__btn--primary" onClick={() => document.getElementById('frontend-url-input')?.focus()}>
              START TESTING
            </button>
            <button className="cta-section__btn cta-section__btn--secondary" onClick={() => onNavigate('reports')}>
              VIEW REPORTS
            </button>
          </div>
        </div>
      </section>

      {/* Live Telemetry Stream + Analysis */}
      <section className="telemetry-section">
        <div className="telemetry-stream">
          <div className="telemetry-stream__header">
            <div className="telemetry-stream__header-left">
              <span className="telemetry-stream__ping"></span>
              <span className="telemetry-stream__label">LIVE TESTING STREAM</span>
            </div>
            <span className="telemetry-stream__buffer">BUFFER: 1024KB/S</span>
          </div>
          <div className="telemetry-stream__body">
            <div className="telemetry-stream__scan-line"></div>
            <div className="telemetry-stream__log telemetry-stream__log--dim">
              <span className="telemetry-stream__time">[21:40:02]</span>
              <span className="telemetry-stream__msg">SYS_LINK_ESTABLISHED: SERVER_01</span>
              <span className="telemetry-stream__status telemetry-stream__status--ok">OK</span>
            </div>
            <div className="telemetry-stream__log">
              <span className="telemetry-stream__time">[21:40:05]</span>
              <span className="telemetry-stream__msg">CRAWLING_PAGE_HEADER: {'{HASH_0X7A2}'}</span>
              <span className="telemetry-stream__status telemetry-stream__status--scan">SCANNING...</span>
            </div>
            <div className="telemetry-stream__log telemetry-stream__log--warn">
              <span className="telemetry-stream__time">[21:40:12]</span>
              <span className="telemetry-stream__msg telemetry-stream__msg--error">WARNING: BROKEN_LINK_DETECTED</span>
              <span className="telemetry-stream__status telemetry-stream__status--error">FLAGGED</span>
            </div>
            <div className="telemetry-stream__log">
              <span className="telemetry-stream__time">[21:40:18]</span>
              <span className="telemetry-stream__msg">AI_ANALYSIS_QUEUED: 14% COMPLETE</span>
              <span className="telemetry-stream__status telemetry-stream__status--pending">PENDING</span>
            </div>
            <div className="telemetry-stream__log telemetry-stream__log--dim">
              <span className="telemetry-stream__time">[21:40:22]</span>
              <span className="telemetry-stream__msg">LATENCY_CHECK: 12ms</span>
              <span className="telemetry-stream__status telemetry-stream__status--scan">DONE</span>
            </div>
            <div className="telemetry-stream__log telemetry-stream__log--faded">
              <span className="telemetry-stream__time">[21:40:30]</span>
              <span className="telemetry-stream__msg">SCREENSHOT_CAPTURED...</span>
              <span className="telemetry-stream__status">SAVED</span>
            </div>
            <div className="telemetry-stream__log">
              <span className="telemetry-stream__time">[21:40:35]</span>
              <span className="telemetry-stream__msg">SEO_AUDIT_COMPLETE: PAGE_04</span>
              <span className="telemetry-stream__status telemetry-stream__status--ok">OK</span>
            </div>
            <div className="telemetry-stream__log telemetry-stream__log--dim">
              <span className="telemetry-stream__time">[21:40:42]</span>
              <span className="telemetry-stream__msg">GENERATING_REPORT...</span>
              <span className="telemetry-stream__status telemetry-stream__status--scan">SYNC</span>
            </div>
          </div>
        </div>

        <div className="telemetry-charts">
          <div className="telemetry-chart-card telemetry-chart-card--secondary">
            <div className="telemetry-chart-card__header">
              <h3 className="telemetry-chart-card__title">Test Coverage</h3>
              <p className="telemetry-chart-card__sub">CROSS-PAGE ANALYSIS</p>
            </div>
            <div className="telemetry-chart-card__bars">
              <div className="tbar" style={{ height: '40%', background: 'rgba(0,240,255,0.2)', borderTop: '2px solid var(--accent-primary)' }}></div>
              <div className="tbar" style={{ height: '70%', background: 'rgba(0,240,255,0.2)', borderTop: '2px solid var(--accent-primary)' }}></div>
              <div className="tbar" style={{ height: '55%', background: 'rgba(221,183,255,0.2)', borderTop: '2px solid var(--accent-secondary)' }}></div>
              <div className="tbar" style={{ height: '90%', background: 'rgba(0,240,255,0.2)', borderTop: '2px solid var(--accent-primary)' }}></div>
              <div className="tbar" style={{ height: '30%', background: 'rgba(255,176,205,0.2)', borderTop: '2px solid var(--accent-pink)' }}></div>
            </div>
          </div>
          <div className="telemetry-chart-card telemetry-chart-card--tertiary">
            <div className="telemetry-chart-card__header">
              <h3 className="telemetry-chart-card__title">Quality Index</h3>
              <p className="telemetry-chart-card__sub">AI SCORE AGGREGATE</p>
            </div>
            <div className="telemetry-chart-card__donut">
              <svg className="donut-svg" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="40" fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                <circle cx="48" cy="48" r="40" fill="transparent" stroke="var(--accent-pink)" strokeWidth="4" strokeDasharray="251" strokeDashoffset="62" strokeLinecap="round" className="donut-fill" />
              </svg>
              <span className="donut-label">75%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Defense & Performance Cards */}
      <section className="info-cards-section">
        <div className="info-card info-card--error">
          <div className="info-card__header">
            <div className="info-card__icon info-card__icon--error">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <div>
              <h3 className="info-card__title">Security Audit</h3>
              <p className="info-card__desc">Active vulnerability scanning and SSL verification.</p>
            </div>
          </div>
          <div className="info-card__tags">
            <span className="info-card__tag info-card__tag--error">XSS_CHECK</span>
            <span className="info-card__tag info-card__tag--primary">SSL_VERIFIED</span>
            <span className="info-card__tag info-card__tag--secondary">HEADERS_OK</span>
          </div>
        </div>
        <div className="info-card info-card--primary">
          <div className="info-card__header">
            <div className="info-card__icon info-card__icon--primary">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            </div>
            <div>
              <h3 className="info-card__title">Performance Stats</h3>
              <p className="info-card__desc">Page load speed and core web vitals analysis.</p>
            </div>
          </div>
          <div className="info-card__perf">
            <div className="info-card__perf-bar">
              <div className="info-card__perf-fill" style={{ width: '92%' }}></div>
            </div>
            <div className="info-card__perf-labels">
              <span>LCP STABILITY</span>
              <span className="info-card__perf-value">ULTRA FAST</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
