import { Given, When, Then } from '@wdio/cucumber-framework'
import AutenticacionPage from '../../pageobjects/autenticacion.page.js'
import HabitacionesPage from '../../pageobjects/habitaciones.page.js'
import ReservasPage from '../../pageobjects/reservas.page.js'
import Page from '../../pageobjects/page.js'
import { usuarioExistente, crearUsuario } from '../../utils/datos.js'
import { crearRangoReserva } from '../../utils/fechas.js'
import { capturarEvidencia } from '../../utils/evidencias.js'

let usuarioRegistrado

// Inciso 1
Given('que el usuario ingresa a la página del hotel', async () => { await new Page().open() })

When('inicia sesión con credenciales válidas', async () => {
    await AutenticacionPage.iniciarSesion(usuarioExistente)
    await capturarEvidencia()
})

Then('debe visualizar correctamente la página principal', async () => { await AutenticacionPage.sesionActiva() })

When('visualiza el detalle de una habitación y la selecciona', async () => {
    await HabitacionesPage.abrirDetallePrimeraHabitacion()
    await HabitacionesPage.validarDetalle()
    await capturarEvidencia()
    await HabitacionesPage.seleccionarHabitacion()
})

When('realiza una reserva de {int} noches', async (noches) => {
    await ReservasPage.reservar(crearRangoReserva(noches, 30))
    await capturarEvidencia()
})

Then('debe visualizar la reserva realizada correctamente', async () => { await ReservasPage.validarReserva() })

When('registra un usuario nuevo', async () => {
    usuarioRegistrado = crearUsuario()
    await AutenticacionPage.abrirRegistro()
    await AutenticacionPage.registrar(usuarioRegistrado)
    await capturarEvidencia()
})

When('inicia sesión con el usuario registrado cuando corresponde', async () => {
    await AutenticacionPage.iniciarSesion(usuarioRegistrado)
    await AutenticacionPage.sesionActiva()
})

When('accede a la sección Mis reservas y selecciona una reserva existente', async () => {
    await ReservasPage.abrirMisReservas()
    await ReservasPage.seleccionarReservaExistente()
})

When('modifica la reserva para que dure {int} noches', async (noches) => {
    await ReservasPage.modificarReserva(crearRangoReserva(noches, 60))
    await capturarEvidencia()
})

Then('debe visualizar la modificación guardada correctamente', async () => { await ReservasPage.validarModificacion() })
When('cancela la reserva seleccionada', async () => { await ReservasPage.cancelarReserva(); await capturarEvidencia() })
Then('debe visualizar la cancelación realizada correctamente', async () => { await ReservasPage.validarCancelacion() })
