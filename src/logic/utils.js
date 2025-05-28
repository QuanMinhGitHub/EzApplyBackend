import { until, error } from 'selenium-webdriver';
import { transformFields } from './transform.js';
import { onboardingPageElement } from './inputs.js';
import { extractFields } from './extract.js';
import { appConfig } from './inputs.js';

export async function hasNameField(driver) {
    const rawFields = await extractFields(driver, onboardingPageElement);
    const fields = transformFields(rawFields);
    return fields.some(field => field.label && field.label.toLowerCase().includes('name'));
}

export async function clickButton(driver, element) {
    try {
        await driver.wait(until.elementIsVisible(element), appConfig.timeOut);
        await driver.wait(until.elementIsEnabled(element), appConfig.timeOut);
        await element.click();
    } catch (clickError) {
        if (clickError instanceof error.StaleElementReferenceError) {
            await driver.wait(until.elementIsVisible(element), appConfig.timeOut);
            await driver.wait(until.elementIsEnabled(element), appConfig.timeOut);
            await element.click();
        }
    }
}