class ExtrasPage {
    async tab(name) {
        if(name === "Stopwatch") {
            return $(`android=new UiSelector().text("Stopwatch")`);
        }
        if (name === "Timer") {
            const tabs = await $$('id=com.google.android.deskclock:id/navigation_bar_item_icon_container');
            return tabs[2];
        }
        if (name === "Clock") {
            const tabs = await $$('id=com.google.android.deskclock:id/navigation_bar_item_icon_container');
            return tabs[1];
        }
        return $(`~${name}`); 
    }
    
    get startTimerBtn() { return $('id=com.google.android.deskclock:id/add_timer_button'); }
    get playPauseTimerBtn() { return $('id=com.google.android.deskclock:id/play_pause'); }

    get addCityBtn() { return $('id=com.google.android.deskclock:id/fab'); }
    get searchCityInput() { return $('id=com.google.android.deskclock:id/open_search_view_edit_text'); }
    cityResult() { return $('//android.support.v7.widget.RecyclerView[@resource-id="com.google.android.deskclock:id/search_results_view"]/android.widget.LinearLayout[1]'); }

    get startStopwatchBtn() { return $('id=com.google.android.deskclock:id/start_stop_button'); }
    get pauseStopwatchBtn() { return $('id=com.google.android.deskclock:id/start_stop_button'); }
    get lapStopwatchBtn() { return $('id=com.google.android.deskclock:id/lap_button'); }
    get resetStopwatchBtn() { return $('id=com.google.android.deskclock:id/reset_button'); }

    async goToTab(tabName) {
        if (typeof driver !== 'undefined') {
            await driver.updateSettings({ waitForIdleTimeout: 100 });
        }
        
        const tabElement = await this.tab(tabName);
        await tabElement.waitForDisplayed({ timeout: 5000 });
        await tabElement.click();
    }

    async enterTimerMinutes(min) {
        const chars = min.split('');
        for (const char of chars) {
            const key = await $(`android=new UiSelector().text("${char}")`);
            await key.waitForDisplayed({ timeout: 5000 });
            await key.click();
        }
    }

    async startTimer() {
        await this.startTimerBtn.waitForDisplayed({ timeout: 5000 });
        await this.startTimerBtn.click();
    }

    async clickAddCity() {
        await this.addCityBtn.waitForDisplayed({ timeout: 5000 });
        await this.addCityBtn.click();
    }

    async searchAndSelectCity(city) {
        await this.searchCityInput.waitForDisplayed({ timeout: 5000 });
        await this.searchCityInput.setValue(city);
        const result = await this.cityResult();
        await result.waitForDisplayed({ timeout: 5000 });
        await result.click();
    }

    async startStopwatch() {
        await this.startStopwatchBtn.waitForDisplayed({ timeout: 5000 });
        await this.startStopwatchBtn.click();
    }

    async pauseStopwatch() {
        await this.pauseStopwatchBtn.waitForDisplayed({ timeout: 5000 });
        await this.pauseStopwatchBtn.click();
    }

    async lapStopwatch() {
        await this.lapStopwatchBtn.waitForDisplayed({ timeout: 5000 });
        await this.lapStopwatchBtn.click();
    }
    
    async resetStopwatch() {
        await this.resetStopwatchBtn.waitForDisplayed({ timeout: 5000 });
        await this.resetStopwatchBtn.click();
    }
}

module.exports = new ExtrasPage();
