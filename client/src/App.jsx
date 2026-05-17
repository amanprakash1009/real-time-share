import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Room from './pages/Room';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * App: Root component defining the application's routing structure.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Room route (Can be accessed by guests if they have the code, but usually requires some form of access. We'll leave it public for the real-time share aspect, or you can protect it) */}
        <Route path="/room/:roomId" element={<Room />} />
        {/* A route to create a new room and immediately redirect */}
        <Route path="/room/new" element={<Navigate to={`/room/${Math.random().toString(36).substring(2, 8).toUpperCase()}`} replace />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rooms" element={<Dashboard />} />
          <Route path="/history" element={<Dashboard />} />
          <Route path="/settings" element={<Dashboard />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
