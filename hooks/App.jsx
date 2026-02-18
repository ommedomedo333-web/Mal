import AdminRoute from './components/AdminRoute'
import AdminPanel from './pages/AdminPanel'

// داخل Routes
<Route 
  path="/admin" 
  element={
    <AdminRoute>
      <AdminPanel />
    </AdminRoute>
  } 
/>