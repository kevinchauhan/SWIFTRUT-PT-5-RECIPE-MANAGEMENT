import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomePage from './pages/Home';
import RecipeFormPage from './pages/RecipeForm';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-violet-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipe-form" element={<RecipeFormPage />} />
            <Route path="/recipe-form/:id" element={<RecipeFormPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;
