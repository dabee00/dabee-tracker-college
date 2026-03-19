import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AssignmentsPage from './components/AssignmentsPage';
import PITPage from './components/PITPage';
import CalendarPage from './components/CalendarPage';
import { initialAssignments, initialPITs, initialQuizzes } from './data/initialData';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [assignments, setAssignments] = useState(initialAssignments);
  const [pits, setPits] = useState(initialPITs);
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <Dashboard
            assignments={assignments}
            pits={pits}
            quizzes={quizzes}
            setActivePage={setActivePage}
          />
        );
      case 'assignments':
        return (
          <AssignmentsPage
            assignments={assignments}
            setAssignments={setAssignments}
          />
        );
      case 'pit':
        return (
          <PITPage pits={pits} setPits={setPits} />
        );
      case 'calendar':
        return (
          <CalendarPage quizzes={quizzes} setQuizzes={setQuizzes} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        assignments={assignments}
        pits={pits}
        quizzes={quizzes}
      />
      <main
        className="flex-1 overflow-y-auto transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? '256px' : '64px' }}
      >
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
