import Page from './page.js'

class AutenticacionPage extends Page {
    async iniciarSesion(usuario) {
        await $('#login-username').setValue(usuario.usuario)
        await $('#login-password').setValue(usuario.contrasena)
        await $('#btn-login').click()
        await $('#nav-rooms').waitForDisplayed()
    }

    async abrirRegistro() { await $('#link-register').click() }

    async registrar(usuario) {
        await $('input[name="fullName"]').setValue(usuario.nombre)
        await $('input[name="email"]').setValue(usuario.correo)
        await $('input[name="username"]').setValue(usuario.usuario)
        await $('input[name="password"]').setValue(usuario.contrasena)
        await $('input[name="confirmPassword"]').setValue(usuario.contrasena)
        await $('select[name="userType"]').selectByVisibleText(usuario.tipoUsuario)
        await $('input[name="acceptTerms"]').click()
        await $('button[name="btnRegister"]').click()
        await $('#login-form').waitForDisplayed()
        await expect($('#toast')).toHaveText(expect.stringContaining('Cuenta creada'))
    }

    async sesionActiva() {
        await expect($('#current-user')).toBeDisplayed()
        await expect($('#toast')).toHaveText(expect.stringContaining('Bienvenido'))
    }
}

export default new AutenticacionPage()
