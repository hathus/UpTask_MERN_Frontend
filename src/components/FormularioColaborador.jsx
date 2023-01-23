import { useState } from 'react'
import useProyectos from '../hooks/useProyectos'
import Alerta from './Alerta'

const FormularioColaborador = () => {

    const [email, setEmail] = useState('')

    const { alerta, mostrarAlerta, submitColaborador } = useProyectos()

    const handleSubmit = e => {
        e.preventDefault()

        if (email === '') {
            mostrarAlerta({
                msg: "El Email es obligatorio",
                error: true
            })
            return
        }

        submitColaborador(email)
    }

    const { msg } = alerta

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow"
        >
            {msg && <Alerta alerta={alerta} />}

            <div className='mb-5'>
                <label
                    htmlFor="email"
                    className='text-gray-700 uppercase font-bold text-sm'
                >
                    Email Colaborador
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    className='w-full border p-2 mt-2 placeholder-gray-400 rounded-md'
                    placeholder='Ingresa el email del colaborador'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>

            <input
                type="submit"
                value='Buscar Colaborador'
                className='bg-sky-600 w-full p-3 rounded text-white font-bold uppercase hover:bg-sky-700 transition-colors cursor-pointer'
            />
        </form>
    )
}

export default FormularioColaborador