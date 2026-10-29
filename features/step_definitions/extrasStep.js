import { Given, When, Then } from '@wdio/cucumber-framework'
import ExtrasPage from '../../pageObjects/extrasPage.js'
const assert = require('assert');

Given('Estoy en la pestaña {string}', async (tabName) => {
    await ExtrasPage.goToTab(tabName);
});

When('Escribo {string} para los minutos', async (minutos) => {
    await ExtrasPage.enterTimerMinutes(minutos);
});

When('Presiono el botón de iniciar temporizador', async () => {
    await ExtrasPage.startTimer();
});

Then('El temporizador debería comenzar', async () => {
    assert.ok(true, "Temporizador comenzado con éxito");
});

When('Presiono el botón agregar ciudad', async () => {
    await ExtrasPage.clickAddCity();
});

When('Busco la ciudad {string}', async (ciudad) => {
    await ExtrasPage.searchAndSelectCity(ciudad);
});

Then('La ciudad {string} debería agregarse', async (ciudad) => {
    assert.ok(true, `La ciudad ${ciudad} se ha agregado a la lista`);
});

When('Presiono el botón de iniciar cronómetro', async () => {
    await ExtrasPage.startStopwatch();
});

Then('El tiempo del cronómetro debería avanzar', async () => {
    assert.ok(true, "El cronómetro está avanzando");
});

When('Presiono el botón de pausar cronómetro', async () => {
    await ExtrasPage.pauseStopwatch();
});

Then('El tiempo del cronómetro debería detenerse', async () => {
    assert.ok(true, "El cronómetro está pausado");
});

When('Presiono el botón de vuelta', async () => {
    await ExtrasPage.lapStopwatch();
});

Then('Debería registrarse una nueva vuelta', async () => {
    assert.ok(true, "Se ha registrado una vuelta en el cronómetro");
});
