import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
import Alerta from '../components/Alerta'
// Importamos el hook de auth
import useAuth from '../hooks/useAuth'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // Hacemos el destructuring de auth provider a traves del hook
    const { setAuth, alerta, setAlerta } = useAuth()

    // Usamos el useNavigate para que una vez que el login sea correcto nos lleve a proyectos
    const navigate = useNavigate()


    const handleSubmit = async e => {
        e.preventDefault()

        if ([email, password].includes('')) {
            setAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true,
            })
            return
        }

        try {
            const { data } = await clienteAxios.post('/usuarios/login', { email, password })
            setAuth(data)
            localStorage.setItem("token", data.token)
            setAlerta({})
            navigate('/proyectos')
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true,
            })
        }
    }

    const { msg } = alerta

    return (
        <>
            <h1 className='text-sky-600 font-black text-6xl capitalize'>Inicia sesión y administra tus
                <span className='text-slate-700'> proyectos</span>
            </h1>
            {msg && <Alerta alerta={alerta} />}
            <form className='my-10 bg-white shadow rounded-lg p-10' onSubmit={handleSubmit}>
                <div className="my-5">
                    <label
                        className='uppercase text-gray-600 block text-xl font-bold'
                        htmlFor="email">
                        Email
                    </label>
                    <input
                        className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
                        type="email"
                        name="email"
                        id="email"
                        placeholder='Email de registro'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="my-5">
                    <label
                        className='uppercase text-gray-600 block text-xl font-bold'
                        htmlFor="password">
                        Password
                    </label>
                    <input
                        className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
                        type="password"
                        name="password"
                        id="password"
                        placeholder='Password de registro'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <input
                    type='submit'
                    value='Iniciar Sesión'
                    className='bg-sky-700 w-full mb-5 py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors'
                />
            </form>

            <nav className='lg:flex lg:justify-between'>
                <Link
                    to='registrar'
                    className='block text-center my-5 text-slate-500 uppercase text-sm'
                >
                    ¿No tienes una cuenta?, Regístrate!
                </Link>
                <Link
                    to='olvide-password'
                    className='block text-center my-5 text-slate-500 uppercase text-sm'
                >
                    Olvide mi password
                </Link>
            </nav>
        </>
    )
}

export default Login