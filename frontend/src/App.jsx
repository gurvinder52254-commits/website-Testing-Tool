import { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
import TestForm from './components/TestForm';
import TestingDashboard from './components/TestingDashboard';
import PageCard from './components/PageCard';
import FinalReport from './components/FinalReport';
import ReportsPage from './components/ReportsPage';
import Header from './components/Header';
import Test from './test';
import DynamicForm from './components/DynamicForm';
import HeroSection from './components/HeroSection';

const WS_URL = `ws://${window.location.hostname}:3001/ws`;
const API_URL = `http://${window.location.hostname}:3001/api`;

// Memoized Dashboard to prevent unnecessary re-renders
const MemoizedDashboard = memo(TestingDashboard);

function App() {
  const [status, setStatus] = useState('idle'); // idle | connecting | testing | complete | error
  const [activeView, setActiveView] = useState('dashboard'); // dashboard | reports | project-detail
  const [selectedReport, setSelectedReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const isTestPage = window.location.pathname === '/test';

  const [testConfig, setTestConfig] = useState(null);
  const [showUserDetailsForm, setShowUserDetailsForm] = useState(false);

  const [wsConnected, setWsConnected] = useState(false);
  const [testId, setTestId] = useState(null);
  const [frontendUrl, setFrontendUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pagesCompleted, setPagesCompleted] = useState(0);
  const [statusLogs, setStatusLogs] = useState([]);
  const [liveScreenshot, setLiveScreenshot] = useState(null);
  const [liveUrl, setLiveUrl] = useState('');
  const [completedPages, setCompletedPages] = useState([]);
  const [finalReport, setFinalReport] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const wsRef = useRef(null);
  const logsEndRef = useRef(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [statusLogs]);

  // Connect WebSocket on mount
  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setWsConnected(true);
      console.log('✅ WebSocket connected');
    };

    ws.onclose = () => {
      setWsConnected(false);
      console.log('🔌 WebSocket disconnected');
      setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = (err) => {
      console.error('WS Error:', err);
      setWsConnected(false);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleWSMessage(data);
      } catch (e) {
        console.error('Failed to parse WS message:', e);
      }
    };
  }, []);

  const addLog = useCallback((message, type = 'info') => {
    const time = new Date().toLocaleTimeString('en-IN', { hour12: false });
    setStatusLogs((prev) => {
      const newLogs = [...prev, { message, type, time }];
      return newLogs.slice(-100);
    });
  }, []);

  const testIdRef = useRef(null);

  const handleWSMessage = useCallback((data) => {
    if (data.type === 'connected') {
      addLog('Connected to testing server', 'success');
      return;
    }

    if (data.testId && testIdRef.current && data.testId !== testIdRef.current) {
      return;
    }

    switch (data.type) {
      case 'status':
        addLog(data.message, 'info');
        break;

      case 'links-discovered':
        setTotalPages(data.totalPages);
        addLog(
          `Discovered ${data.totalPages} pages (${data.headerLinks} header, ${data.footerLinks} footer)`,
          'success'
        );
        break;

      case 'page-start':
        setProgress(data.progress || 0);
        setLiveUrl(data.url);
        addLog(`Testing page ${data.pageIndex + 1}/${data.totalPages}: ${data.text || data.url}`, 'info');
        break;

      case 'live-screenshot':
        setLiveScreenshot(`data:image/png;base64,${data.image}`);
        setLiveUrl(data.url);
        break;

      case 'screenshot-taken':
        addLog(`📸 Screenshot captured: ${data.url}`, 'success');
        break;

      case 'ai-analyzing':
        addLog(`🤖 AI analyzing page ${data.pageIndex + 1}...`, 'ai');
        break;

      case 'ai-complete':
        addLog(`✅ AI analysis complete for page ${data.pageIndex + 1}`, 'success');
        break;

      case 'page-complete':
        setPagesCompleted((prev) => prev + 1);
        setProgress(data.progress || 0);
        setCompletedPages((prev) => {
          const existing = prev.findIndex((p) => p.url === data.result.url || p.pageIndex === data.pageIndex);
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = { ...updated[existing], ...data.result, pageIndex: data.pageIndex };
            return updated;
          }
          return [...prev, { ...data.result, pageIndex: data.pageIndex }];
        });
        break;

      case 'page-error':
        addLog(`❌ Error on page ${data.pageIndex + 1}: ${data.error}`, 'error');
        break;

      case 'test-complete':
        setStatus('complete');
        setProgress(100);
        setFinalReport(data.report);
        addLog('🎉 Testing complete!', 'success');
        break;

      case 'test-error':
        setStatus('error');
        addLog(`❌ Test failed: ${data.error}`, 'error');
        break;

      case 'groq-status':
        addLog(data.message, 'ai');
        break;

      case 'groq-element-analysis':
      case 'groq-test-suggestions':
      case 'groq-code-generated':
      case 'groq-test-execution-start':
      case 'groq-test-count':
      case 'groq-test-running':
      case 'groq-test-execution-complete':
      case 'groq-analysis-complete':
        if (data.message) {
          addLog(data.message, 'success');
        }
        break;

      case 'groq-test-result':
        if (data.status === 'failed') {
          addLog(data.message, 'error');
        } else {
          addLog(data.message, 'success');
        }
        break;

      case 'groq-analysis-error':
        addLog(data.message, 'error');
        break;

      default:
        break;
    }
  }, [addLog]);

  const handleStartTestClick = (fUrl, bUrl, scanType) => {
    setTestConfig({ fUrl, bUrl, scanType });
    setShowUserDetailsForm(true);
  };

  const handleStartTest = async (userDetails = null) => {
    setShowUserDetailsForm(false);
    if (!testConfig) return;

    const { fUrl, bUrl, scanType } = testConfig;

    setStatus('testing');
    setFrontendUrl(fUrl);
    setProgress(0);
    setTotalPages(0);
    setPagesCompleted(0);
    setStatusLogs([]);
    setLiveScreenshot(null);
    setLiveUrl('');
    setCompletedPages([]);
    setFinalReport(null);
    testIdRef.current = null;

    addLog(`Starting test for: ${fUrl}`, 'info');

    try {
      const res = await fetch(`${API_URL}/start-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frontendUrl: fUrl, backendUrl: bUrl || undefined, scanType, userDetails }),
      });
      const data = await res.json();

      if (data.success) {
        setTestId(data.testId);
        testIdRef.current = data.testId;
      } else {
        setStatus('error');
        addLog(`Failed to start test: ${data.error}`, 'error');
      }
    } catch (err) {
      setStatus('error');
      addLog(`Connection error: ${err.message}`, 'error');
    }
  };

  const handleNewTest = useCallback(() => {
    setStatus('idle');
    setActiveView('dashboard');
    setSelectedReport(null);
    setTestId(null);
    setProgress(0);
    setTotalPages(0);
    setPagesCompleted(0);
    setStatusLogs([]);
    setLiveScreenshot(null);
    setLiveUrl('');
    setCompletedPages([]);
    setFinalReport(null);
  }, []);

  const handleScreenshotClick = useCallback((url) => {
    setModalImage(url);
  }, []);

  // Navigation handler
  const handleNavigate = useCallback((view) => {
    if (view === 'dashboard') {
      setActiveView('dashboard');
      setSelectedReport(null);
    } else if (view === 'reports') {
      setActiveView('reports');
      setSelectedReport(null);
    }
  }, []);

  // Select a project from reports to view its dashboard
  const handleSelectProject = useCallback(async (testId) => {
    try {
      setLoadingReport(true);
      const res = await fetch(`${API_URL}/reports/${testId}`);
      const data = await res.json();
      if (data.success && data.report) {
        setSelectedReport(data.report);
        setActiveView('project-detail');
      } else {
        console.error('Failed to load report:', data.error);
      }
    } catch (err) {
      console.error('Error loading report:', err);
    } finally {
      setLoadingReport(false);
    }
  }, []);

  // Memoize results grid
  const resultsGrid = useMemo(() => {
    if (completedPages.length === 0) return null;
    return (
      <section className="results">
        <h2 className="results__title">
          📄 Tested Pages ({completedPages.length}/{totalPages || '?'})
        </h2>
        <div className="results__grid">
          {completedPages.map((page, idx) => (
            <PageCard
              key={page.url || idx}
              page={page}
              onScreenshotClick={handleScreenshotClick}
            />
          ))}
        </div>
      </section>
    );
  }, [completedPages, totalPages, handleScreenshotClick]);

  if (isTestPage) {
    return <Test />;
  }

  return (
    <div className="app">
      {/* Animated Background Orbs */}
      <div className="bg-orbs" aria-hidden="true">
        <div className="bg-orb bg-orb--1"></div>
        <div className="bg-orb bg-orb--2"></div>
        <div className="bg-orb bg-orb--3"></div>
      </div>

      <Header status={status} wsConnected={wsConnected} activeView={activeView} onNavigate={handleNavigate} />

      {/* === REPORTS VIEW === */}
      {activeView === 'reports' && (
        <ReportsPage onSelectProject={handleSelectProject} />
      )}

      {/* === PROJECT DETAIL VIEW (from reports) === */}
      {activeView === 'project-detail' && loadingReport && (
        <div className="reports-page__loading" style={{ marginTop: '80px' }}>
          <div className="reports-page__spinner"></div>
          <span>Loading project report...</span>
        </div>
      )}

      {activeView === 'project-detail' && !loadingReport && selectedReport && (
        <div>
          <button className="reports-back-btn" onClick={() => handleNavigate('reports')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Reports
          </button>

          {selectedReport.pages && selectedReport.pages.length > 0 && (
            <section className="results">
              <h2 className="results__title">
                📄 Tested Pages [{selectedReport.pages.length}]
              </h2>
              <div className="results__grid">
                {selectedReport.pages.map((page, idx) => (
                  <PageCard
                    key={page.url || idx}
                    page={page}
                    onScreenshotClick={handleScreenshotClick}
                  />
                ))}
              </div>
            </section>
          )}

          <FinalReport report={selectedReport} onNewTest={() => handleNavigate('reports')} />
        </div>
      )}

      {/* === DASHBOARD VIEW (default) === */}
      {activeView === 'dashboard' && status === 'idle' && (
        <HeroSection
          wsConnected={wsConnected}
          onStartTestClick={handleStartTestClick}
          onNavigate={handleNavigate}
        />
      )}

      {/* Footer */}
      <footer className="site-footer">
        <div className="site-footer__inner">
          <span className="site-footer__copy">© 2025 WEBTEST AI. ALL SYSTEMS OPERATIONAL.</span>
          <div className="site-footer__links">
            <a href="#" className="site-footer__link">PRIVACY</a>
            <a href="#" className="site-footer__link">API DOCS</a>
            <a href="#" className="site-footer__link site-footer__link--accent">STATUS</a>
            <a href="#" className="site-footer__link">SUPPORT</a>
          </div>
        </div>
      </footer>

      {/* User Details Form Modal */}
      {showUserDetailsForm && (
        <div className="modal-overlay" onClick={() => setShowUserDetailsForm(false)}>
          <div className="modal-content" style={{ padding: 0, background: 'transparent', maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <DynamicForm
              onSubmit={handleStartTest}
              onSkip={() => handleStartTest(null)}
            />
          </div>
        </div>
      )}

      {activeView === 'dashboard' && (status === 'testing' || status === 'error') && (
        <MemoizedDashboard
          status={status}
          progress={progress}
          totalPages={totalPages}
          pagesCompleted={pagesCompleted}
          statusLogs={statusLogs}
          liveScreenshot={liveScreenshot}
          liveUrl={liveUrl}
          logsEndRef={logsEndRef}
        />
      )}

      {activeView === 'dashboard' && resultsGrid}

      {activeView === 'dashboard' && status === 'complete' && finalReport && (
        <FinalReport report={finalReport} onNewTest={handleNewTest} />
      )}

      {activeView === 'dashboard' && status === 'error' && (
        <button className="new-test-btn" onClick={handleNewTest}>
          ← Back to Home
        </button>
      )}

      {modalImage && (
        <div className="modal-overlay" onClick={() => setModalImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalImage(null)}>✕</button>
            <img src={modalImage} alt="Full screenshot" />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
