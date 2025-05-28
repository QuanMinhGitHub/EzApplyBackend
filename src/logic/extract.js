import { By } from 'selenium-webdriver';
import { appConfig, label, applicationPageElements } from './inputs.js';

async function getOptions(element, tag) {
    let options = await element.findElements(By.css(tag));
    let optionTexts = [];
    for (let option of options) {
        let text = await option.getText();
        optionTexts.push(text);
    }
    return optionTexts;
}

async function getLabel(element) {
    const labels = {};

    for (let i = 1; i <= appConfig.getLabelMaxAttempts; i++) {
        try {
            const ancestor = await element.findElement(By.xpath(label.ancestor(i)));
            try {
                const labelOrLegend = await ancestor.findElement(By.xpath(label.child));
                const text = await labelOrLegend.getText();
                labels[`ancestor${i}`] = text;
            } catch (childError) {
                labels[`ancestor${i}`] = null;
            }

        } catch (error) {
            break;
        }
    }
    return labels;
}

async function getCommonElement(element) {
    return {
        webElement: element,
        tag: (await element.getTagName()).toLowerCase(),
        id: await element.getAttribute('id'),
        class: await element.getAttribute('class'),
        type: await element.getAttribute('type') || null,
        role: await element.getAttribute('role') || null,
        label: await getLabel(element)
    }
}

async function getPageElement(driver, tag, pageElementAttributes = {}) {
    try {
        let elements = await driver.findElements(By.css(tag));
        let fields = [];
        for (let element of elements) {
            let commonElement = await getCommonElement(element);
            if (pageElementAttributes.isLabel) commonElement.buttonText = await element.getText() || (await element.getAttribute('value')) || null;
            if (pageElementAttributes.isOptions) commonElement.options = await getOptions(element, 'option');
            fields.push(commonElement);
        }
        return fields;

    } catch (error) {
        console.log("Error in the getPageElement function", error);
    }
}

async function getPage(driver, pageElements) {
    try {
        let fields = []
        for (let pageElement of pageElements) {
            const pageFields = await getPageElement(driver, pageElement.tag, pageElement.pageElementAttributes);
            fields.push(...(pageFields || []));
        }
        return fields;

    } catch (error) {
        console.log("Error in the getPage function", error);
    }
}

export async function extractFields(driver) {
    const fields = await getPage(driver, applicationPageElements);
    return fields;
}