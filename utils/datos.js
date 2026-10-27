export const usuarioExistente = {
    usuario: 'lvargas',
    contrasena: 'Huesped123!'
}

export function crearUsuario() {
    const identificador = `${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(-12)

    return {
        nombre: `Usuario QA ${identificador}`,
        correo: `qa${identificador}@hotel.test`,
        usuario: `qa${identificador}`,
        contrasena: 'Password123!',
        tipoUsuario: 'Frecuente'
    }
}
