import clienteAxios from '../config/clienteAxios'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Alerta from '../components/Alerta'

const Registrar = () => {

    /**
     * Creamos el state para los elementos de nuestro formulario
     */
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repetirPassword, setRepetirPassword] = useState('')
    const [alerta, setAlerta] = useState({})

    // Validando el formulario
    const handleSubmit = async e => {
        e.preventDefault()

        // /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        //const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm");

        // Si los elementos del formulario alguno de ellos esta vacío entonces llenamos 
        // el state de la alerta e interrumpimos el proceso
        if ([nombre, email, password, repetirPassword].includes('')) {
            setAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true,
            })
            return
        }

        if (password !== repetirPassword) {
            setAlerta({
                msg: 'Los passwords no son iguales',
                error: true,
            })
            return
        }

        if (password.length < 6) {
            setAlerta({
                msg: 'El password debe de contener al menos 6 caracteres',
                error: true,
            })
            return
        }

        // const isValidEmail = emailRegex.test(email);

        // if (!isValidEmail) {
        //     setAlerta({
        //         msg: 'Por favor introduce un correo valido',
        //         error: true,
        //     })
        //     return
        // }

        //  Si las comprobaciones no arrojan errores entonces limpiamos alerta
        setAlerta({})

        // Comunicamos el front con el back
        try {
            const { data } = await clienteAxios.post('/usuarios',
                {
                    nombre,
                    password,
                    email,
                }
            )
            setAlerta({
                msg: data.msg,
                error: false,
            })

            setNombre('')
            setEmail('')
            setPassword('')
            setRepetirPassword('')
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }

    }

    // Comprobamos si existe algo en alerta y lo des construimos 
    const { msg } = alerta

    return (
        <>
            <h1 className='text-sky-600 font-black text-6xl capitalize'>Crea tu cuenta y administra tus
                <span className='text-slate-700'> proyectos</span>
            </h1>
            {/* Si la alerta tienen algo entonces mostramos el componente */}
            {msg && <Alerta alerta={alerta} />}
            <form className='my-10 bg-white shadow rounded-lg p-10' onSubmit={handleSubmit}>
                <div className="my-5">
                    <label
                        className='uppercase text-gray-600 block text-xl font-bold'
                        htmlFor="nombre">
                        Nombre
                    </label>
                    <input
                        className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
                        type="text"
                        name="nombre"
                        id="nombre"
                        placeholder='Ingresa tu nombre'
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                    />
                </div>

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

                <div className="my-5">
                    <label
                        className='uppercase text-gray-600 block text-xl font-bold'
                        htmlFor="password2">
                        Repetir password
                    </label>
                    <input
                        className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
                        type="password"
                        name="password2"
                        id="password2"
                        placeholder='Repite tu password de registro'
                        value={repetirPassword}
                        onChange={e => setRepetirPassword(e.target.value)}
                    />
                </div>

                <input
                    type='submit'
                    value='Crear tu cuenta'
                    className='bg-sky-700 w-full mb-5 py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors'
                />
            </form>

            <nav className='lg:flex lg:justify-between'>
                <Link
                    to='/'
                    className='block text-center my-5 text-slate-500 uppercase text-sm'
                >
                    ¿Ya tienes una cuenta?, Inicia Sesión!
                </Link>
                <Link
                    to='/olvide-password'
                    className='block text-center my-5 text-slate-500 uppercase text-sm'
                >
                    Olvide mi password
                </Link>
            </nav>
        </>
    )
}

export default Registrar