import { useState } from 'react'
import Alerta from './Alerta'
import useProyectos from '../hooks/useProyectos'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'

const FormularioProyecto = () => {

    const { mostrarAlerta, alerta, submitProyecto, proyecto } = useProyectos()

    const [id, setId] = useState(null)
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [fechaEntrega, setFechaEntrega] = useState('')
    const [cliente, setCliente] = useState('')

    // Usamos useParams para leer si hay algo en la url y si existe es editar
    const params = useParams()

    // Usamos un useEffect para llenar el formulario
    useEffect(() => {
        if (params.id) {
            setId(params.id)
            setNombre(proyecto.nombre)
            setDescripcion(proyecto.descripcion)
            setFechaEntrega(proyecto.fechaEntrega?.split('T')[0])
            setCliente(proyecto.cliente)
        }
    }, [params])


    const handleSubmit = async e => {
        e.preventDefault()

        if ([nombre, descripcion, cliente, fechaEntrega].includes('')) {
            mostrarAlerta({
                msg: "Todos los campos son obligatorios",
                error: true,
            })
            return
        }

        // Si la comprobación del formulario es valida entonces mandamos los datos al provider
        await submitProyecto({ id, nombre, descripcion, fechaEntrega, cliente })

        if ([id].includes('')) {
            setNombre('')
            setDescripcion('')
            setCliente('')
            setFechaEntrega('')
            setCliente('')
        } else {
            setId(null)
        }
    }

    const { msg } = alerta

    return (
        <form
            className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow'
            onSubmit={handleSubmit}
        >
            {msg && <Alerta alerta={alerta} />}
            <div className='mb-5'>
                <label
                    htmlFor="nombre"
                    className='text-gray-700 uppercase font-bold text-sm'
                >
                    Nombre Proyecto
                </label>
                <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    className='w-full border p-2 mt-2 placeholder-gray-400 rounded-md'
                    placeholder='Ingresa el nombre del proyecto'
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                />
            </div>

            <div className='mb-5'>
                <label
                    htmlFor="descripcion"
                    className='text-gray-700 uppercase font-bold text-sm'
                >
                    Descripción Proyecto
                </label>
                <textarea
                    name="descripcion"
                    id="descripcion"
                    className='w-full border p-2 mt-2 placeholder-gray-400 rounded-md'
                    placeholder='Ingresa la descripción del proyecto'
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
                />
            </div>

            <div className='mb-5'>
                <label
                    htmlFor="fecha-entrega"
                    className='text-gray-700 uppercase font-bold text-sm'
                >
                    Fecha de Entrega
                </label>
                <input
                    type="date"
                    name="fecha-entrega"
                    id="fecha-entrega"
                    className='w-full border p-2 mt-2 placeholder-gray-400 rounded-md'
                    value={fechaEntrega}
                    onChange={e => setFechaEntrega(e.target.value)}
                />
            </div>

            <div className='mb-5'>
                <label
                    htmlFor="cliente"
                    className='text-gray-700 uppercase font-bold text-sm'
                >
                    Cliente
                </label>
                <input
                    type="text"
                    name="cliente"
                    id="cliente"
                    className='w-full border p-2 mt-2 placeholder-gray-400 rounded-md'
                    placeholder='Ingresa el nombre del cliente'
                    value={cliente}
                    onChange={e => setCliente(e.target.value)}
                />
            </div>

            <input
                type="submit"
                value={id ? 'Actualizar Proyecto' : 'Crear Proyecto'}
                className='bg-sky-600 w-full p-3 rounded text-white font-bold uppercase hover:bg-sky-700 transition-colors cursor-pointer'
            />
        </form>
    )
}

export default FormularioProyecto