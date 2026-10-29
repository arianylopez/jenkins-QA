class AlarmPage {
  
  // 🔹 Selectores
  get alarmTab() { return $('id=com.google.android.deskclock:id/tab_menu_alarm'); }
  get addButton() { return $('~Add alarm'); }
  get nativePicker() { return $('id=android:id/timePicker'); }
  get hourHeader() { return $('id=android:id/hours'); }
  get minuteHeader() { return $('id=android:id/minutes'); }
  get okBtn() { return $('//*[@resource-id="android:id/button1" or @resource-id="com.google.android.deskclock:id/material_timepicker_ok_button"]'); }
  get cancelBtn() { return $('//*[@resource-id="android:id/button2" or @resource-id="com.google.android.deskclock:id/material_timepicker_cancel_button"]'); }
 // get deleteBtn() { return $('android=new UiSelector().resourceId("com.google.android.deskclock:id/delete'); }
  // Selector dinámico para la hora/minuto
  hourElement(hour) { 
    return $(`android=new UiSelector().text("${hour}")`);
  }

  minuteElement(minute) { 
    return $(`android=new UiSelector().text("${minute}")`);
  }

  dialNumber(value) {
    // El selector nativo expone los numeros en content-desc, no en text.
    return $(`~${Number(value)}`);
  }

  async selectTime(hour, minute) {
    const hourValue = Number(hour);
    const minuteValue = Number(minute);
    if (!Number.isInteger(hourValue) || hourValue < 0 || hourValue > 23 ||
        !Number.isInteger(minuteValue) || minuteValue < 0 || minuteValue > 59) {
      throw new Error(`Hora invalida: ${hour}:${minute}`);
    }

    await this.cancelBtn.waitForDisplayed({ timeout: 15000 });
    if (await this.nativePicker.isExisting()) {
      await this.hourHeader.click();
      const hourOption = await this.dialNumber(hourValue);
      await hourOption.waitForDisplayed({ timeout: 10000 });
      await hourOption.click();
      await this.minuteHeader.click();
      const minuteOption = await this.dialNumber(minuteValue);
      await minuteOption.waitForDisplayed({ timeout: 10000 });
      await minuteOption.click();
      await browser.waitUntil(async () =>
        Number(await this.hourHeader.getText()) === hourValue &&
        Number(await this.minuteHeader.getText()) === minuteValue, {
          timeout: 10000,
          timeoutMsg: `El selector no muestra la hora solicitada ${hour}:${minute}.`,
        });
      console.log(`ALARM_TIME_SELECTED: ${hour}:${minute} en selector nativo.`);
    } else {
      // Conservar el flujo original para la version con selector Material.
      const hourOption = await this.hourElement(hour);
      await hourOption.waitForDisplayed({ timeout: 10000 });
      await hourOption.click();
      const minuteOption = await this.minuteElement(minute);
      await minuteOption.waitForDisplayed({ timeout: 10000 });
      await minuteOption.click();
    }
  }

  alarmWithTime(time) {
    return $(`android=new UiSelector().textContains("${time}")`);
  }

 expandAlarm(position) {
    return $(`(//android.view.View[@resource-id="com.google.android.deskclock:id/clock_switch_flow"])[${position}]`);
    }

 deleteBtn() {
        return $('android=new UiSelector().resourceId("com.google.android.deskclock:id/delete_button")');
    }
  // 🔹 Métodos de acción
  async openAlarmTab() {
    const cancel = await this.cancelBtn;
    if (await cancel.isDisplayed()) {
      console.log('ALARM_DIALOG_RESET: cancelando un dialogo pendiente del escenario anterior.');
      await cancel.click();
      await cancel.waitForDisplayed({ reverse: true, timeout: 10000 });
    }
    console.log('ALARM_TAB: esperando la pestana de alarmas.');
    const tab = await this.alarmTab;
    await tab.waitForDisplayed({ timeout: 15000 });
    console.log('ALARM_TAB: pulsando la pestana de alarmas.');
    await tab.click();
    await this.addButton.waitForDisplayed({ timeout: 15000 });
    console.log('ALARM_TAB_READY: boton Add alarm visible.');
  }

  async createAlarm(hour, minute) {
    await this.addButton.waitForDisplayed({ timeout: 15000 });
    await this.addButton.click();
    await this.selectTime(hour, minute);
    await this.okBtn.waitForDisplayed({ timeout: 10000 });
    await this.okBtn.click();
    await this.addButton.waitForDisplayed({ timeout: 15000 });
    await browser.takeScreenshot();
  }

  async isAlarmDisplayed(time) {
    const alarm = this.alarmWithTime(time);
    await alarm.waitForDisplayed({ timeout: 5000 });
    return alarm.isDisplayed();
  }

  async cancelAlarm(hour, minute) {
    await this.addButton.waitForDisplayed({ timeout: 15000 });
    await this.addButton.click();
    await this.selectTime(hour, minute);
    await this.cancelBtn.waitForDisplayed({ timeout: 10000 });
    await this.cancelBtn.click();
    await this.addButton.waitForDisplayed({ timeout: 15000 });
    await browser.takeScreenshot();
  }

  async deleteAlarm(time,position) {
    const alarm = await this.alarmWithTime(time);
    await expect(alarm).toBeDisplayed();

    const expand = await this.expandAlarm(position);
    if (await expand.isDisplayed()) {
        await expand.click();
        await driver.pause(5000);
    }

    const delBtn = await this.deleteBtn();
    await driver.pause(5000);
    await delBtn.waitForDisplayed({ timeout: 5000 });
    await delBtn.click();
  }

}

module.exports = new AlarmPage();
