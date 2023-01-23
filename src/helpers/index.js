export const formatFecha = (fecha) => {
    const fechaEntrega = new Date(fecha.split('T')[0].split('-'));
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

    return fechaEntrega.toLocaleDateString('es-MX', options)
}