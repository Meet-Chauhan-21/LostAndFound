import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import RegistrationForm from './pages/RegistrationForm';
import LoginForm from './pages/LoginForm';
import HomePage from './pages/HomePage';
import HowItWorksPage from './pages/HowItWorksPage';
import ServicesPage from './pages/ServicesPage'
import ContactPage from './pages/ContactPage';
import ItemDetailPage from './pages/ItemDetailPage';
import ProfilePage from './pages/ProfilePage'
import ItemUpdateForm from './pages/ItemUpdateForm'
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminPostPage from './pages/AdminPostPage';
import AdminEditPage from './pages/AdminEditPage';


function App() {
  const [count, setCount] = useState(0);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/HowItWorksPage" element={<HowItWorksPage />} />
          <Route path="/ServicesPage" element={<ServicesPage />} />
          <Route path="/ContactPage" element={<ContactPage />} />
          <Route path="/detail/:id" element={<ItemDetailPage />} />
          <Route path="/ProfilePage" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/ItemUpdateForm/:id" element={
            <ProtectedRoute>
              <ItemUpdateForm />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/post" element={
            <AdminProtectedRoute>
              <AdminPostPage />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/edit/:id" element={
            <AdminProtectedRoute>
              <AdminEditPage />
            </AdminProtectedRoute>
          } />
          
          {/* Catch-all route - redirect to home page for any invalid URLs */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
