export default class Page {
    async open() {
        await browser.url('https://hotel-qa-f51.pages.dev/login?reset=true')
        await $('#login-form').waitForDisplayed()
    }

    async seleccionarFechaCalendario(calendario, fecha) {
        const selector = `#${calendario} [data-date="${fecha}"]`
        for (let intento = 0; intento < 8; intento += 1) {
            const dia = await $(selector)
            if (await dia.isExisting()) {
                await dia.click()
                return
            }
            await $(`#${calendario}-next`).click()
        }
        throw new Error(`No se encontró la fecha ${fecha} en ${calendario}`)
    }

    async seleccionarRangoCalendario(calendario, rango) {
        await this.seleccionarFechaCalendario(calendario, rango.inicio)
        await this.seleccionarFechaCalendario(calendario, rango.fin)
    }
}
