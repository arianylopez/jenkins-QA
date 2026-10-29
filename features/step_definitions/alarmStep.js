import { Given, When, Then } from '@wdio/cucumber-framework'
import AlarmPage from '../../pageObjects/alarmPage.js'

Given('Estoy en la pestaña de alarmas', async () => {
    await AlarmPage.openAlarmTab();
});

When('Creo una alarma a las {string} horas y {string} minutos', async (hora, minuto) => {
    await AlarmPage.createAlarm(hora, minuto);
});

When('Cancelo la creación de una alarma a las {string} horas y {string} minutos', async (hora, minuto) => {
    await AlarmPage.cancelAlarm(hora, minuto);
});

Then('La alarma a las {string}:{string} debería estar visible', async (hora, minuto) => {
    await AlarmPage.alarmWithTime(`${hora}:${minuto}`).waitForDisplayed({ timeout: 15000 });
});

When('Elimino la alarma a las {string}:{string}', async (hora, minuto) => {
    await AlarmPage.deleteAlarm(`${hora}:${minuto}`, 3);
});

Then('La alarma a las {string}:{string} no debería existir', async (hora, minuto) => {
    // Una perdida de conexion tambien debe fallar; no convertir cualquier error en ausencia.
    await AlarmPage.alarmWithTime(`${hora}:${minuto}`).waitForExist({ reverse: true, timeout: 15000 });
});
