// Importamos react router dom
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import ConfirmarCuenta from './pages/ConfirmarCuenta'
import Login from './pages/Login'
import NuevoPassword from './pages/NuevoPassword'
import OlvidePassword from './pages/OlvidePassword'
import Registrar from './pages/Registrar'
// Importamos el context provider
import { AuthProvider } from './context/AuthProvider'
import { ProyectosProvider } from './context/ProyectosProvider'
// Paginas protegidas
import RutaProtegida from './layouts/RutaProtegida'
import Proyectos from './pages/Proyectos'
import NuevoProyecto from './pages/NuevoProyecto'
import NuevoColaborador from './pages/NuevoColaborador'
import Proyecto from './pages/Proyecto'
import EditarProyecto from './pages/EditarProyecto'

function App() {

    return (
        <BrowserRouter>
            {/* El AuthProvider que es el context debe de rodear los elementos de routes que
            contienen los element que son las pages */}
            <AuthProvider>
                <ProyectosProvider>
                    <Routes>
                        {/* Creamos las rutas para el área publica y colocamos en el arreglo los elementos */}
                        <Route path='/' element={
                            <AuthLayout />
                        }>
                            {/* Creamos otra ruta para las paginas que vamos a utilizar */}
                            <Route index element={<Login />} />
                            <Route path='registrar' element={<Registrar />} />
                            <Route path='olvide-password' element={<OlvidePassword />} />
                            <Route path='olvide-password/:token' element={<NuevoPassword />} />
                            <Route path='confirmar/:id' element={<ConfirmarCuenta />} />
                        </Route>
                        {/* Creamos las rutas para el área privada */}
                        <Route path="/proyectos" element={<RutaProtegida />}>
                            <Route index element={<Proyectos />} />
                            <Route path='crear-proyecto' element={<NuevoProyecto />} />
                            <Route path='nuevo-colaborador/:id' element={<NuevoColaborador />} />
                            <Route path=':id' element={<Proyecto />} />
                            <Route path='editar/:id' element={<EditarProyecto />} />
                        </Route>
                    </Routes>
                </ProyectosProvider>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
