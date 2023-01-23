import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
import Alerta from '../components/Alerta'

const NuevoPassword = () => {

    const params = useParams()
    const { token } = params

    const [alerta, setAlerta] = useState({})
    const [tokenValido, setTokenValido] = useState(false)
    const [password, setPassword] = useState('')
    const [passwordModificado, setPasswordModificado] = useState(false)

    useEffect(() => {
        const comprobarToken = async () => {
            try {
                await clienteAxios.get(`/usuarios/reset-password/${token}`)
                setTokenValido(true)
            } catch (error) {
                setAlerta({
                    msg: error.response.data.msg,
                    error: true,
                })
            }
        }
        comprobarToken()
    }, [])

    const handleSubmit = async e => {
        e.preventDefault()

        if (password.length < 6) {
            setAlerta({
                msg: 'El password debe ser mínimo de 6 caracteres ',
                error: true,
            })
            return
        }

        try {
            const { data } = await clienteAxios.post(`/usuarios/reset-password/${token}`, { password })
            setAlerta({
                msg: data.msg,
                error: false,
            })
            setPasswordModificado(true)
            setPassword('')
            tokenValido(false)
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
            <h1 className='text-sky-600 font-black text-6xl capitalize'>Restablece tu password y no pierdas acceso a tus
                <span className='text-slate-700'> proyectos</span>
            </h1>
            {msg && <Alerta alerta={alerta} />}
            {tokenValido && !passwordModificado && (
                <form className='my-10 bg-white shadow rounded-lg p-10' onSubmit={handleSubmit}>
                    <div className="my-5">
                        <label
                            className='uppercase text-gray-600 block text-xl font-bold'
                            htmlFor="password">
                            Nuevo Password
                        </label>
                        <input
                            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
                            type="password"
                            name="password"
                            id="password"
                            placeholder='Escribe tu nuevo password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <input
                        type='submit'
                        value='Guardar password'
                        className='bg-sky-700 w-full mb-5 py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors'
                    />
                </form>
            )}
            {passwordModificado && (
                <div className='mt-20 md:mt-10 shadow-lg px-10 py-10 rounded-xl bg-white'>
                    <Link to='/' className='block text-center my-5 text-slate-500 uppercase text-sm'>Inicia sesión!</Link>
                </div>
            )}
        </>
    )
}

export default NuevoPassword