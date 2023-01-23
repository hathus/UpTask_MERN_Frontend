import { useState, useEffect, createContext } from 'react'
import clienteAxios from '../config/clienteAxios'
import { useNavigate } from 'react-router-dom'

// Se crea la instancia de context
const AuthContext = createContext()

// Se crea el provider que hará el render de todos los elementos en
// children
const AuthProvider = ({ children }) => {
    // Creamos un state para almacenar el inicio de sesión, como retornamos
    // un json, entonces el state es un objeto
    const [auth, setAuth] = useState({})
    const [alerta, setAlerta] = useState({})
    const [cargando, setCargando] = useState(true)

    const navigate = useNavigate()

    // Usamos un eseEffect para comprobar que existe un token de sesión
    useEffect(() => {
        const autenticarUsuario = async () => {
            const token = localStorage.getItem("token")
            if (!token) {
                setCargando(false)
                return
            }

            // Creamos la configuración para enviar el token en el header
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            }

            try {
                const { data } = await clienteAxios.get('/usuarios/perfil', config)
                setAuth(data)
                //navigate('/proyectos')
            } catch (error) {
                setAlerta({
                    msg: error.response.data.msg,
                    error: true,
                })
                setAuth({})
            }
            setCargando(false)
        }
        autenticarUsuario()
    }, [])

    const cerrarSessionAuth = () => {
        setAuth({})
    }

    return (
        // Ponemos el componente de context provider y dentro el children que contendrá
        // a los componentes hijo
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                alerta,
                setAlerta,
                cargando,
                cerrarSessionAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider,
}

export default AuthContext