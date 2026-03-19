import React from 'react';
import { useFirestore } from './hooks/useFirestore';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AssignmentsPage from './components/AssignmentsPage';
import PITPage from './components/PITPage';
import CalendarPage from './components/CalendarPage';

const App = () => {
  const [activePage, setActivePage] = React.useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const assignmentsData = useFirestore('assignments');
  const pitsData = useFirestore('pits');
  const quizzesData = useFirestore('quizzes');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <Dashboard
            assignments={assignmentsData.data}
            pits={pitsData.data}
            quizzes={quizzesData.data}
            setActivePage={setActivePage}
          />
        );
      case 'assignments':
        return (
          <AssignmentsPage
            assignments={assignmentsData.data}
            setAssignments={(updater) => {
              const newData = typeof updater === 'function' ? updater([...assignmentsData.data]) : updater;
              assignmentsData.setDataState(newData);
            }}
            addAssignment={assignmentsData.addData}
            updateAssignment={assignmentsData.updateData}
            deleteAssignment={assignmentsData.deleteData}
          />
        );
      case 'pit':
        return (
          <PITPage 
            pits={pitsData.data} 
            setPits={(updater) => {
              const newData = typeof updater === 'function' ? updater([...pitsData.data]) : updater;
              pitsData.setDataState(newData);
            }} 
            addPIT={pitsData.addData}
            updatePIT={pitsData.updateData}
            deletePIT={pitsData.deleteData}
          />
        );
      case 'calendar':
        return (
          <CalendarPage 
            quizzes={quizzesData.data} 
            setQuizzes={(updater) => {
              const newData = typeof updater === 'function' ? updater([...quizzesData.data]) : updater;
              quizzesData.setDataState(newData);
            }} 
            addQuiz={quizzesData.addData}
            updateQuiz={quizzesData.updateData}
            deleteQuiz={quizzesData.deleteData}
          />
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
        assignments={assignmentsData.data}
        pits={pitsData.data}
        quizzes={quizzesData.data}
      />
      <main
        className="flex-1 overflow-y-auto transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? '256px' : '64px' }}
      >
        {renderPage()}
      </main>
    </div>
  );
};

export default App;

