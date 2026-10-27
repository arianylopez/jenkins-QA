import Page from './page.js'

class HabitacionesPage extends Page {
    async abrirDetallePrimeraHabitacion() {
        await $('a[href^="/habitaciones/"]').waitForClickable()
        await $('a[href^="/habitaciones/"]').click()
    }

    async validarDetalle() { await expect($('.room-detail__title')).toBeDisplayed() }
    async seleccionarHabitacion() { await $('button[aria-label="Reservar esta habitación"]').click() }
}

export default new HabitacionesPage()
