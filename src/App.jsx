import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { VisitorProvider } from './context/VisitorContext';
import Homepage from './pages/Homepage';
import NewVisitorForm from './pages/NewVisitorForm';
import AdminPanel from './pages/AdminPanel';
import GuardPanel from './pages/GuardPanel';
import EmployeePanel from './pages/EmployeePanel';
import ReturningVisitor from './pages/ReturningVisitor';
import EmployeeLogin from './pages/EmployeeLogin';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <VisitorProvider>
        <div className="app-container">
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/new-visitor" element={<NewVisitorForm />} />
              <Route path="/existing-visitor" element={<ReturningVisitor />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/guard" element={<GuardPanel />} />
              <Route
                path="/employee"
                element={
                  <ProtectedRoute>
                    <EmployeePanel />
                  </ProtectedRoute>
                }
              />
              <Route path="/employee-login" element={<EmployeeLogin />} />
            </Routes>
          </main>
        </div>
      </VisitorProvider>
    </Router>
  );
}

export default App;
