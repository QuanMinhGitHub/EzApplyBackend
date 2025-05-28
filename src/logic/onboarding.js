import { By } from 'selenium-webdriver';
import { ALLOW_LIST, DENY_LIST } from './inputs.js';
import { appConfig } from './inputs.js';
import { hasNameField, clickButton } from './utils.js';

function textMatchesAllowWord(text) {
    return ALLOW_LIST.some(term => {
        const regex = new RegExp(`\\b${term}\\b`, 'i');
        return regex.test(text);
    });
}

async function getButtons(driver) {
    const elements = await driver.findElements(By.css(appConfig.buttonTag));
    const buttonArray = [];
    for (const element of elements) {
        const text = (await element.getText()).trim();
        if (text) buttonArray.push({ element, text });
    }
    return buttonArray;
}

export async function onboarding(driver, url) {
    await driver.get(url);
    let clickCount = 0;
    if (await hasNameField(driver)) return;

    const currentUrl = await driver.getCurrentUrl();
    while (clickCount < appConfig.maxClicks) {
        const buttons = await getButtons(driver);
        const match = buttons.find(({ text }) =>
            !DENY_LIST.some(term => text.toLowerCase().includes(term)) &&
            textMatchesAllowWord(text)
        );
        
        if (!match) break;

        await clickButton(driver, match.element);
        clickCount++;

        if (await hasNameField(driver)) return;
    }
    return currentUrl;
}