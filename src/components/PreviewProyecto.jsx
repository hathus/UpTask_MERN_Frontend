import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const PreviewProyecto = ({ proyecto }) => {
    const { auth } = useAuth()

    const { _id, nombre, cliente, creador } = proyecto

    return (
        <div className='border-b p-5 justify-between flex flex-col md:flex-row'>
            <div className='flex items-center gap-2 mb-2'>
                <p className='flex-1'>
                    {nombre}
                    <br />
                    <span className='text-sm text-gray-500 uppercase'>{' '}{cliente}</span>
                    <br />
                    {auth._id !== creador ? (
                        <span className='text-xs bg-green-500 rounded-md p-1 text-white font-bold uppercase'>{' '} Colaborador</span>
                    ) : (
                        <span className='text-xs bg-orange-400 rounded-md p-1 text-white font-bold uppercase'>{' '} Propietario</span>
                    )}
                </p>
            </div>
            <Link to={`${_id}`} className='text-gray-600 hover:text-gray-800 uppercase text-sm font-bold'>Ver Proyecto</Link>
        </div>
    )
}

export default PreviewProyecto