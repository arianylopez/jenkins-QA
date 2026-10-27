function sumarDias(fecha, dias) {
    const resultado = new Date(fecha)
    resultado.setDate(resultado.getDate() + dias)
    return resultado
}

function formatoFecha(fecha) {
    const anio = fecha.getFullYear()
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const dia = String(fecha.getDate()).padStart(2, '0')
    return `${anio}-${mes}-${dia}`
}

export function crearRangoReserva(noches, anticipacion = 3) {
    const inicio = sumarDias(new Date(), anticipacion)
    const fin = sumarDias(inicio, noches)

    return { inicio: formatoFecha(inicio), fin: formatoFecha(fin), noches }
}
