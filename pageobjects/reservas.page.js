import Page from './page.js'

class ReservasPage extends Page {
    async reservar(rango) {
        await $('#reservation-modal').waitForDisplayed()
        await $('#btn-open-reservation-calendar').click()
        await this.seleccionarRangoCalendario('reservation-calendar', rango)
        await $('select[name="arrivalTime"]').selectByIndex(1)
        await $('input[name="acceptPolicy"]').click()
        await $('#btn-confirm-reservation').click()
        await $('#toast').waitForDisplayed()
    }

    async validarReserva() { await expect($('#toast')).toHaveText(expect.stringContaining('Reserva R')) }
    async abrirMisReservas() { await $('#nav-reservations').click() }

    async seleccionarReservaExistente() {
        const boton = await $('button[name^="modify-"]')
        await boton.waitForClickable()
        this.reservaId = (await boton.getAttribute('name')).replace('modify-', '')
        await boton.click()
        await $('#modify-modal').waitForDisplayed()
    }

    async modificarReserva(rango) {
        await $('#modify-mode-custom').click()
        await $('#btn-open-modify-calendar').click()
        await this.seleccionarRangoCalendario('modify-calendar', rango)
        await expect($('#modify-new-nights')).toHaveText('14 noches')
        await $('#btn-confirm-modify').click()
        await $(`.reservations-table [data-reservation-id="${this.reservaId}"]`).waitForDisplayed()
    }

    async validarModificacion() {
        await expect($(`[data-reservation-id="${this.reservaId}"] [data-col="nights"]`)).toHaveText('14')
    }

    async cancelarReserva() {
        await $(`button[name="cancel-${this.reservaId}"]`).click()
        await $('#cancel-dialog').waitForDisplayed()
        await $('#cancel-dialog-accept').click()
    }

    async validarCancelacion() {
        await expect($(`[data-reservation-id="${this.reservaId}"] [data-col="status"]`)).toHaveText('Cancelada')
    }
}

export default new ReservasPage()
