import { useEffect, useState, createContext } from 'react'
import clienteAxios from '../config/clienteAxios'
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import useAuth from '../hooks/useAuth'

let socket;

const ProyectosContext = createContext()

const ProyectosProvider = ({ children }) => {

    const [alerta, setAlerta] = useState({})
    const [proyectos, setProyectos] = useState([])
    const [proyecto, setProyecto] = useState({})
    const [cargando, setCargando] = useState(false)
    const [modalFormTarea, setModalFormTarea] = useState(false)
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
    const [tarea, setTarea] = useState({})
    const [colaborador, setColaborador] = useState({})
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
    const [buscador, setBuscador] = useState(false)

    const navigate = useNavigate()

    const { auth } = useAuth()

    /**
     * Effect que carga los proyectos de la BD
     */
    useEffect(() => {
        const obtenerProyectos = async () => {
            try {
                // Checamos la existencia del token
                const token = localStorage.getItem("token")
                if (!token) return

                // Creamos el objeta de la cabecera para enviar el token
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                }

                const { data } = await clienteAxios.get('/proyectos', config)
                setProyectos(data)
            } catch (error) {
                mostrarAlerta({
                    msg: error.message,
                    error: true,
                })
            }
        }
        obtenerProyectos()
    }, [auth])

    /**
     * UseEffect que se encarga de la conexión a socket io
     */
    useEffect(() => {
        socket = io(import.meta.env.VITE_API_URL)
    }, [])

    /**
     * Alerta, recibe un objeto con el mensaje, error ? true : false
     * Timeout de 3s
     * @param {Object} alerta 
     */
    const mostrarAlerta = alerta => {
        setAlerta(alerta)
        setTimeout(() => {
            setAlerta({})
        }, 3000);
    }

    /**
     * Acción del submit del formulario de proyecto, id ? edita : nuevo registro
     * @param {Object} proyecto 
     */
    const submitProyecto = async proyecto => {
        if (proyecto.id) {
            await editarProyecto(proyecto)
        } else {
            await nuevoProyecto(proyecto)
        }
    }

    /**
     * Nuevo proyecto, obtiene un objeto del formulario de proyecto
     * @param {Object} proyecto 
     * @returns 
     */
    const nuevoProyecto = async proyecto => {
        try {
            // Checamos la existencia del token
            const token = localStorage.getItem("token")
            if (!token) return

            // Creamos el objeta de la cabecera para enviar el token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            }

            // Enviamos los datos al backend para su almacenaje en la bd
            const { data } = await clienteAxios.post('/proyectos', proyecto, config)

            // Creamos una copia del state de proyectos y agregamos data
            setProyectos([...proyectos, data])

            mostrarAlerta({
                msg: "Proyecto creado correctamente",
                error: false,
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000);
        } catch (error) {
            mostrarAlerta({
                msg: error.message,
                error: true,
            })
        }
    }

    /**
     * Edita el proyecto de la bd y actualiza el state
     * @param {Object} proyecto 
     * @returns Proyecto Actualizado
     */
    const editarProyecto = async proyecto => {
        try {
            // Checamos la existencia del token
            const token = localStorage.getItem("token")
            if (!token) return

            // Creamos el objeta de la cabecera para enviar el token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            }

            // Enviamos los datos al backend para su almacenaje en la bd
            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)

            // Creamos una copia del state de proyectos y agregamos data
            const proyectoActualizado = proyectos.map(proyectoOnState => proyectoOnState._id === data._id ? data : proyectoOnState)
            setProyectos(proyectoActualizado)

            mostrarAlerta({
                msg: "Proyecto actualizado correctamente",
                error: false,
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000);
        } catch (error) {
            mostrarAlerta({
                msg: error.message,
                error: true,
            })
        }
    }

    /**
     * Obtiene un proyecto por su id
     * @param {string} id 
     * @returns {object} set proyecto on state
     */
    const obtenerProyecto = async id => {
        setCargando(true)
        try {
            // Checamos la existencia del token
            const token = localStorage.getItem("token")
            if (!token) return

            // Creamos el objeta de la cabecera para enviar el token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            }

            const { data } = await clienteAxios.get(`/proyectos/${id}`, config)
            setProyecto(data)
            setAlerta({})
        } catch (error) {
            navigate("/proyectos")

            mostrarAlerta({
                msg: error.response.data.msg,
                error: true,
            })

            setTimeout(() => {
                setAlerta({})
            }, 3000);
        } finally {
            setCargando(false)
        }
    }

    /**
     * Elimina un proyecto por su id
     * @param {string} id del proyecto
     * @returns {object} proyecto actualizado en el state 
     */
    const eliminarProyecto = async id => {
        try {
            // Checamos la existencia del token
            const token = localStorage.getItem("token")
            if (!token) return

            // Creamos el objeta de la cabecera para enviar el token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            }

            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config)

            // usamos un filter para actualizar los proyectos
            const proyectosActualizados = proyectos.filter(proyectosOnState => proyectosOnState._id !== id)
            setProyectos(proyectosActualizados)

            mostrarAlerta({
                msg: data.msg,
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000);
        } catch (error) {
            mostrarAlerta({
                msg: error.message,
                error: true
            })
        }
    }

    /**
     * Creamos una función para controlar el modal de formulario tarea
     */
    const handleModalTarea = () => {
        setModalFormTarea(!modalFormTarea)
        setTarea({})
    }

    /**
     * Función para guardar la tarea id ? edita : nuevo registro
     * @param {object} tarea 
     */
    const submitTarea = async tarea => {

        if (tarea?.id) {
            await editarTarea(tarea)
        } else {
            await nuevaTarea(tarea)
        }
    }

    /**
     * Agrega nuevas tareas al proyecto
     * @param {object} tarea 
     * @returns {object} tareas on state
     */
    const nuevaTarea = async tarea => {
        try {
            // Checamos la existencia del token
            const token = localStorage.getItem("token")
            if (!token) return

            // Creamos el objeta de la cabecera para enviar el token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            }

            const { data } = await clienteAxios.post('/tareas', tarea, config)

            setAlerta({})
            setModalFormTarea(false)

            // Socket.IO, le pasamos la tarea creada
            socket.emit("nueva tarea", data)
        } catch (error) {
            mostrarAlerta({ msg: error.message, error: true })
        }
    }

    /**
     * Edita una tarea registrada en un proyecto
     * @param {object} tarea 
     * @returns {object}
     */
    const editarTarea = async tarea => {
        try {
            // Checamos la existencia del token
            const token = localStorage.getItem("token")
            if (!token) return

            // Creamos el objeta de la cabecera para enviar el token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            }

            const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)

            setAlerta({})
            setModalFormTarea(false)

            // SOCKET IO
            socket.emit("actualizar tarea", data)

        } catch (error) {
            mostrarAlerta({ msg: error.message, error: true })
        }
    }

    /**
     * Función que abre y cierra el modal de editar tarea y recibe la tarea en el state
     * @param {object} tarea 
     */
    const handleModalEditarTarea = tarea => {
        setTarea(tarea)
        setModalFormTarea(true)
    }

    /**
     * Función que abre y cierra el modal de eliminar y recibe la tarea en el state
     * @param {object} tarea 
     */
    const handleModalEliminarTarea = tarea => {
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)
    }

    /**
     * Función para eliminar una tarea de un proyecto
     * @returns {object} tareas actualizadas
     */
    const eliminarTarea = async () => {
        try {
            // Checamos la existencia del token
            const token = localStorage.getItem("token")
            if (!token) return

            // Creamos el objeta de la cabecera para enviar el token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            }

            const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config)

            setAlerta({
                msg: data.msg,
                error: false
            })

            setModalEliminarTarea(false)

            // SOCKET IO
            socket.emit("eliminar tarea", tarea)

            setTarea({})
            setTimeout(() => {
                setAlerta({})
            }, 3000);
        } catch (error) {
            mostrarAlerta({ msg: error.message, error: true })
        }
    }

    /**
     * Buscamos el Colaborador
     * @param {*} email 
     * @returns 
     */
    const submitColaborador = async email => {
        setCargando(true)

        try {
            // Checamos la existencia del token
            const token = localStorage.getItem("token")
            if (!token) return

            // Creamos el objeta de la cabecera para enviar el token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            }

            const { data } = await clienteAxios.post("/proyectos/colaboradores", { email }, config)
            setColaborador(data)
            setAlerta({})
        } catch (error) {
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            })
        } finally {
            setCargando(false)
        }
    }

    /**
     * Agregamos el colaborador
     * @param {*} email 
     * @returns 
     */
    const agregarColaborador = async email => {
        try {
            // Checamos la existencia del token
            const token = localStorage.getItem("token")
            if (!token) return

            // Creamos el objeta de la cabecera para enviar el token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            }

            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)


            setAlerta({
                msg: data.msg,
                error: false
            })

            setColaborador({})

            setTimeout(() => {
                setAlerta({})
            }, 3000);

        } catch (error) {
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    /**
     * Función que abre o cierra el modal de eliminar colaborador y recibe el colaborador en el state
     * @param {object} colaborador 
     */
    const handleModalEliminarColaborador = colaborador => {
        setColaborador(colaborador)
        setModalEliminarColaborador(!modalEliminarColaborador)
    }

    /**
     * Elimina un colaborador de un proyecto
     * @returns {object} colaboradores actualizados
     */
    const eliminarColaborador = async () => {
        try {
            // Checamos la existencia del token
            const token = localStorage.getItem("token")
            if (!token) return

            // Creamos el objeta de la cabecera para enviar el token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            }

            const { data } = await clienteAxios.post(`/proyectos/elimina-colaborador/${proyecto._id}`, { id: colaborador._id }, config)

            // Creamos una copia del proyecto que esta en el state
            const proyectoActualizado = { ...proyecto }

            // Aplicamos un filter al arreglo de colaboradores
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id)

            setProyecto(proyectoActualizado)

            setAlerta({
                msg: data.msg,
                error: false
            })

            setColaborador({})
            setModalEliminarColaborador(false)
            setTimeout(() => {
                setAlerta({})
            }, 3000);
        } catch (error) {
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    /**
     * Función para marcar completa o incompleta una tarea
     * @param {string} id 
     */
    const completarTarea = async id => {
        try {
            // Checamos la existencia del token
            const token = localStorage.getItem("token")
            if (!token) return

            // Creamos el objeta de la cabecera para enviar el token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            }

            const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)

            setTarea({})
            setAlerta({})

            // SOCKET IO
            socket.emit("cambiar estado", data)


        } catch (error) {
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    /**
     * Muestra el modal de búsqueda
     */
    const handleBuscador = () => {
        setBuscador(!buscador)
    }

    // Funciones de socket IO

    /**
     * Función que propaga una tarea agregada a un proyecto especifico 
     */
    const submitTareasProyecto = tarea => {
        // Agregamos la tarea al state
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]
        setProyecto(proyectoActualizado)
    }

    /**
     * Función que elimina una tarea de un proyecto en especifico y
     * propaga el resultado
     * @param {*} tarea 
     */
    const eliminarTareaProyecto = tarea => {
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaOnState => tareaOnState._id !== tarea._id)

        setProyecto(proyectoActualizado)
    }

    /**
     * Función que actualiza la tarea de un proyecto especifico y propaga su resultado
     * @param {*} tarea 
     */
    const actualizarTareaProyecto = tarea => {
        // Agregamos la tarea actualizada al state
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaOnState => tareaOnState._id === tarea._id ? tarea : tareaOnState)
        setProyecto(proyectoActualizado)
    }

    /**
     * Función que cambia el estado de una tarea y propaga los resultados
     * @param {*} tarea 
     */
    const cambiarEstadoTarea = tarea => {
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }

    const cerrarSessionProyectos = () => {
        setAlerta({})
        setTarea({})
        setProyecto({})
        setProyectos([])
    }

    return (
        <ProyectosContext.Provider value={{
            proyectos,
            mostrarAlerta,
            alerta,
            submitProyecto,
            obtenerProyecto,
            proyecto,
            cargando,
            eliminarProyecto,
            modalFormTarea,
            handleModalTarea,
            submitTarea,
            handleModalEditarTarea,
            tarea,
            modalEliminarTarea,
            handleModalEliminarTarea,
            eliminarTarea,
            submitColaborador,
            colaborador,
            agregarColaborador,
            modalEliminarColaborador,
            handleModalEliminarColaborador,
            eliminarColaborador,
            completarTarea,
            buscador,
            handleBuscador,
            submitTareasProyecto,
            eliminarTareaProyecto,
            actualizarTareaProyecto,
            cambiarEstadoTarea,
            cerrarSessionProyectos,
        }}>
            {children}
        </ProyectosContext.Provider>
    )
}

export {
    ProyectosProvider,
}

export default ProyectosContext