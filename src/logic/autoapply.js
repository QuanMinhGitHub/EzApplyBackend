import { Builder } from 'selenium-webdriver';
import { fillInTheForm } from './submit.js';
import { mapSystematically } from './map.js';
import { formatGenAIResponse, chatWithGemini, extractLabelsForMapping } from './chats.js';
import { mapFieldsWithUserDataKey, transformFields } from './transform.js';
import { extractFields } from './extract.js';
import { onboarding } from "./onboarding.js";
import { defaultPrompt, appConfig } from './inputs.js';

export default async function autoapply(url, userData) {
    let driver = await new Builder().forBrowser(appConfig.browser).build();

    try {
        const currentUrl = await onboarding(driver, url);
        const fields = await extractFields(driver, currentUrl);
        const transformedFields = transformFields(fields);
        const extractedLabels = extractLabelsForMapping(transformedFields);
        const { matched, unmatched } = mapSystematically(extractedLabels);
        const prompt = defaultPrompt.replace("{{LABELS}}", JSON.stringify(unmatched), null, 2);
        const response = await chatWithGemini(prompt);
        const allMappings = [...matched, ...formatGenAIResponse(response)];
        const finalFields = mapFieldsWithUserDataKey(transformedFields, allMappings);
        return await fillInTheForm(driver, finalFields, userData);
    } catch (error) {
        console.log("Error in autoapply function", error);
    } finally {
        driver.quit();
    }
}