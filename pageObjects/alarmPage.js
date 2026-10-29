class AlarmPage {
  
  // 🔹 Selectores
  get alarmTab() { return $('id=com.google.android.deskclock:id/navigation_bar_item_icon_container'); }
  get addButton() { return $('~Add alarm'); }
  get okBtn() { return $('id=com.google.android.deskclock:id/material_timepicker_ok_button'); }
  get cancelBtn() { return $('id=com.google.android.deskclock:id/material_timepicker_cancel_button'); }
 // get deleteBtn() { return $('android=new UiSelector().resourceId("com.google.android.deskclock:id/delete'); }
  // Selector dinámico para la hora/minuto
  hourElement(hour) { 
    return $(`android=new UiSelector().text("${hour}")`);
  }

  minuteElement(minute) { 
    return $(`android=new UiSelector().text("${minute}")`);
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
    await this.alarmTab.waitForDisplayed({ timeout: 5000 });
    await this.alarmTab.click();
  }

  async createAlarm(hour, minute) {
    await this.addButton.waitForDisplayed({ timeout: 5000 });
    await this.addButton.click();
    await browser.takeScreenshot();
    await this.hourElement(hour).click();
    await browser.takeScreenshot();
    await this.minuteElement(minute).click();
    await browser.takeScreenshot();
    await this.okBtn.click();
    await browser.takeScreenshot();
  }

  async isAlarmDisplayed(time) {
    const alarm = this.alarmWithTime(time);
    await alarm.waitForDisplayed({ timeout: 5000 });
    return alarm.isDisplayed();
  }

  async cancelAlarm(hour, minute) {
    await this.addButton.waitForDisplayed({ timeout: 5000 });
    await this.addButton.click();
    await this.hourElement(hour).click();
    await this.minuteElement(minute).click();


    await this.cancelBtn.click();
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