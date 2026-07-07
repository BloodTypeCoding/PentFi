import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Ingresos from './pages/Ingresos'
import Salidas from './pages/Salidas'
import Membresia from './pages/Membresia'
import LibroDiario from './pages/LibroDiario'
import FacturaPage from './pages/FacturaPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/ingresos" element={<Ingresos />} />
        <Route path="/salidas" element={<Salidas />} />
        <Route path="/membresia" element={<Membresia />} />
        <Route path="/libro-diario" element={<LibroDiario />} />
        <Route path="/factura/:id" element={<FacturaPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App