import useAdmin from '../hooks/useAdmin'
import useProyectos from '../hooks/useProyectos'


const Colaborador = ({ colaborador }) => {

    const { handleModalEliminarColaborador } = useProyectos()
    const admin = useAdmin()

    const { nombre, email } = colaborador

    return (
        <div className='p-5 flex justify-between border-b items-center'>
            <div>
                <p>{nombre}</p>
                <p className='text-sm text-gray-700'>{email}</p>
            </div>

            <div>
                {admin && (
                    <button
                        className='bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg'
                        onClick={() => handleModalEliminarColaborador(colaborador)}
                    >
                        Eliminar
                    </button>
                )}
            </div>
        </div>
    )
}

export default Colaborador