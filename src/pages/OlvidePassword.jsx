import clienteAxios from '../config/clienteAxios'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Alerta from '../components/Alerta'


const OlvidePassword = () => {

    const [email, setEmail] = useState('')
    const [alerta, setAlerta] = useState({})

    const handleSubmit = async e => {
        e.preventDefault()

        const emailRegex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);

        if (email === '') {
            setAlerta({
                msg: 'Por favor introduce tu email con el que te registraste',
                error: true,
            })
            return
        }

        const isValidEmail = emailRegex.test(email);

        if (!isValidEmail) {
            setAlerta({
                msg: 'Por favor introduce un email valido',
                error: true,
            })
            return
        }

        try {
            const { data } = await clienteAxios.post('/usuarios/reset-password', { email })
            setAlerta({
                msg: data.msg,
                error: false,
            })
            setEmail('')
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
            <h1 className='text-sky-600 font-black text-6xl capitalize'>Recupera tu acceso y no pierdas tus
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

                <input
                    type='submit'
                    value='Enviar instrucciones'
                    className='bg-sky-700 w-full mb-5 py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors'
                />
            </form>

            <nav className='lg:flex lg:justify-between'>
                <Link
                    to='/registrar'
                    className='block text-center my-5 text-slate-500 uppercase text-sm'
                >
                    ¿No tienes una cuenta?, Regístrate!
                </Link>
                <Link
                    to='/'
                    className='block text-center my-5 text-slate-500 uppercase text-sm'
                >
                    ¿Ya tienes una cuenta?, Inicia Sesión!
                </Link>
            </nav>
        </>
    )
}

export default OlvidePassword