import { Key } from 'selenium-webdriver';
import { hasNameField } from './utils.js';
import { formFillingInformation } from "./inputs.js";

async function clickElement(driver, element) {
    try {
        await element.click();
        await driver.sleep(formFillingInformation.sleep);
    } catch (error) {}
}

async function clearField(driver, element) {
    try {
        await element.clear();
        await driver.sleep(formFillingInformation.sleep);
    } catch (error) {}
}

async function sendKeysWithValue(driver, element, value) {
    try {
        await element.sendKeys(value);
        await driver.sleep(formFillingInformation.sleep);
    } catch (error) {}
}

async function fillInputFields(driver, field, element, userData) {
    const { tag, type, userDataKey, role } = field;
    if ((tag === formFillingInformation.input && type !== formFillingInformation.file) || tag === formFillingInformation.textarea) {
        const valueToFill = userDataKey == null ? 'N/A' : userData[userDataKey];
        await clearField(driver, element);
        await sendKeysWithValue(driver, element, valueToFill);
        if (tag === formFillingInformation.input && role === formFillingInformation.combobox) {
            if (userDataKey == null) {
                await element.sendKeys(Key.ARROW_UP);
                await driver.sleep(formFillingInformation.sleep);
                await element.sendKeys(Key.ENTER);
            } else {
                await element.sendKeys(Key.ENTER);
            }
            await driver.sleep(formFillingInformation.sleep);
        }
    } else if (tag === formFillingInformation.input && type === formFillingInformation.file && userDataKey != null) {
        await sendKeysWithValue(driver, element, userData[userDataKey]);
    }
}

export async function fillInTheForm(driver, fields, userData) {
    for (let field of fields) {
        const element = field.webElement;

        const isFillable = (field.tag === formFillingInformation.input || field.tag === formFillingInformation.textarea)
            && ![formFillingInformation.checkbox, formFillingInformation.radio, formFillingInformation.button, formFillingInformation.submit].includes(field.type);
        if (isFillable) {
            await fillInputFields(driver, field, element, userData);
            continue;
        }

        if (field.type === formFillingInformation.checkbox) {
            if (field.userDataKey != null) {
                if (userData[field.userDataKey] === field.label) {
                    await clickElement(driver, element);
                }
            } else {
                await clickElement(driver, element);
            }
            continue;
        }

        if (field.type === formFillingInformation.radio) {
            if (field.userDataKey != null) {
                if (userData[field.userDataKey] === field.label) {
                    await clickElement(driver, element);
                }
            } else {
                await clickElement(driver, element);
            }
            continue;
        }

        if (field.tag === formFillingInformation.button) {
            if (field.userDataKey != null) {
                if (userData[field.userDataKey] === field.buttonText) {
                    await clickElement(driver, element);
                }
            } else {
                await clickElement(driver, element);
            }
            continue;
        }

        if (field.tag === formFillingInformation.input &&
           [formFillingInformation.submit, formFillingInformation.button].includes(field.type)) {
            await clickElement(driver, element);
        }
    }
    return await hasNameField(driver);
}