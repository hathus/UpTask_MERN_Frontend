import { formatFecha } from '../helpers'
import useAdmin from '../hooks/useAdmin'
import useProyectos from '../hooks/useProyectos'

const Tarea = ({ tarea }) => {

    const { _id, nombre, descripcion, fechaEntrega, prioridad, estado, completado } = tarea

    const { handleModalEditarTarea, handleModalEliminarTarea, completarTarea } = useProyectos()
    const admin = useAdmin()

    return (
        <div className='border-b p-5 flex justify-between items-center'>
            <div className='flex flex-col items-start px-3'>
                <p className='mb-1 text-xl'>{nombre}</p>
                <p className='mb-1 text-sm uppercase text-gray-500'>{descripcion}</p>
                <p className='mb-1 text-gray-600'>Fecha de Entrega: {formatFecha(fechaEntrega)}</p>
                <p className='py-1 text-gray-600'>Prioridad: <span className={`${prioridad === 'Alta' ? 'bg-red-400' : prioridad === 'Media' ? 'bg-orange-400' : 'bg-slate-400'} rounded-md py-0 px-1 text-white`}>{prioridad}</span></p>
                {estado && <p className='text-sm p-1 bg-green-500 rounded-md text-gray-600font-bold'>Completado por: {completado?.nombre}</p>}
            </div>
            <div className='flex flex-col lg:flex-row gap-3'>
                <button
                    type='button'
                    onClick={() => completarTarea(_id)}
                    className={`${estado ? 'bg-sky-500 hover:bg-sky-700' : 'bg-gray-500 hover:bg-gray-700'} cursor-pointer transition-colors px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`}
                >
                    {estado ? 'Completa' : 'Incompleta'}
                </button>

                {admin && (
                    <>
                        <button
                            type='button'
                            className='bg-indigo-500 hover:bg-indigo-700 cursor-pointer transition-colors px-4 py-3 text-white uppercase font-bold text-sm rounded-lg'
                            onClick={() => handleModalEditarTarea(tarea)}
                        >
                            Editar
                        </button>
                        <button
                            type="button"
                            className='bg-red-500 hover:bg-red-700 cursor-pointer transition-colors px-4 py-3 text-white uppercase font-bold text-sm rounded-lg'
                            onClick={() => handleModalEliminarTarea(tarea)}
                        >
                            Eliminar
                        </button>
                    </>
                )}
            </div>
        </div >
    )
}

export default Tarea