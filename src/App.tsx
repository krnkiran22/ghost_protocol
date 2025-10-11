import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage, IPRegistrationPage } from '@/pages';

function App() {
  return (
    <div className="min-h-screen bg-background-primary">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<IPRegistrationPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
