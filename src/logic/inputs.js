import dotenv from 'dotenv';
dotenv.config();

export const formFillingInformation = {
    sleep: 500,
    input: "input",
    textarea: "textarea",
    file: "file",
    combobox: "combobox",
    checkbox: "checkbox",
    radio: "radio",
    button: "button",
    submit: "submit"
}

export const chats = {
    formatPattern: /```(?:json)?\s*([\s\S]*?)\s*```/i,
    model: 'gemini-2.0-flash'
}

export const dataKeys = ['email', 'firstName', 'lastName', 'fullName', 'phone', 'location', 'address', 'citizenship', 'ethnicity', 'gender', 'pronouns', 'veteran', 'resume', 'github', 'linkedin'];

export const defaultPrompt = `
    The current objective is to automate the job application process by scraping input fields and their labels from various job websites. 
    Since different sites use inconsistent labels for the same information (e.g., "Last Name" vs. "Family Name"), 
    the challenge is to normalize these labels to a standardized format for consistent data mapping.

    <Task>
        You are building an automated system to assist with filling out job application forms across different websites. 
        Each site may use different word for the same input field, for example, "Last Name" on one site may appear as "Family Name" on another. 
        This inconsistency in labeling makes it difficult to directly map scraped label to a standardized user profile.

        These are examples of a list of label found in two different websites.
        <Website1>
        [
            "Last Name"
        ]
        </Website1>
        <Website2>
        [
            "Family Name"
        ]
        </Website2>

        The goal is to map each label to a corresponding standardized user data key based on the semantic meaning.
        This mapping ensures consistent data extraction and autofill across different websites with varying label conventions.
    </Task>

    <Reasoning>
        To accurately map labels from websites to standardized user data keys, follow this systematic 3-step chain of thought:

        Step 1: Understand the labels and context
        These labels form a semantic context for the field.

        Step 2: Map Based on Semantic Meaning  
        Use your knowledge of language, synonyms, and typical job application fields to semantically match each label context to a standardized user data key.
        For example:
        - "Family Name", "Surname", or "Last Name" → lastName
        - "Given Name" or "First Name" → firstName
        - "LinkedIn Profile", "LinkedIn URL" → linkedin
        If no match is semantically clear or useful (e.g., "Company"), do not return anything.

        Step 3: Structure the output in desired format  
        Return the final result as a list of mappings in the format:
        [
            { "Label Text": matchedUserDataKey }
        ]
        Ensure each label is individually evaluated and clearly associated with its output. This format supports automation by enabling downstream systems to process and autofill data consistently.
        Always prioritize semantic accuracy over surface similarity, and do not return when you are uncertain.
    </Reasoning>

    <Example>
        Input:
        [
            'Name',
            'Contact Number',
            'LinkedIn profile',
            "Any other links you'd like to share e.g. website",
            'Resume (if you have one)',
            'Which of these industries would you be interested in working with?',
        ]

        User data keys: ${JSON.stringify(dataKeys, null, 2)}

        Output:
        [
            { "Name": "fullName" },
            { "Contact Number": "phone" },
            { "LinkedIn profile": "linkedin" },
            { "Resume (if you have one)": "resume" }
        ]

        The output maps each label to a standardized user data key based on its semantic meaning. 
        Labels like "Name" and "Contact Number" are clearly associated with "fullName" and "phone", while "LinkedIn profile" directly maps to "linkedin". 
        Any label that doesn't correspond to a known user data key, like "Which of these industries would you be interested in working with?", is not to be returned to indicate it's not relevant for the form automation.
    </Example>

    <Inputs>
        {{LABELS}}: This is the list containing labels extracted from a website.
        ${JSON.stringify(dataKeys, null, 2)}: This is the list of standardized user data keys (e.g., "firstName", "lastName", etc.)
    </Inputs>

    <Instructions>
        You will receive a list of labels extracted from a website’s form, representing the semantic context of the field.
        Your task is to map each of these labels to a standardized user data key, selected from the list of available keys. The goal is to normalize inconsistent labels across websites into a consistent format for automation.

        Output Format:
        1. For each label, you will return one object with exactly one key-value pair.
        2. The key should be the most relevant label text (e.g., "Name").
        3. The value should be the corresponding standardized user data key (e.g., "fullName").
        4. If the label does not map to a known user data key, it is not to be returned to indicate it's irrelevant.

        Important Notes:
        - Evaluate each label based on its semantic meaning, not just literal text. Consider common synonyms (e.g., "Family Name" → "lastName").
        - If no standardized user data key is a good semantic match, do not return label or null to indicate the label is irrelevant or unsupported.
        
        Example output:
        [
            { "Name": "fullName" },
            { "Contact Number": "phone" },
            { "LinkedIn profile": "linkedin" },
            { "Resume (if you have one)": "resume" }
        ]
    </Instructions>
`;

export const label = {
    ancestor: (i) => `ancestor::*[${i}]`,
    child: "child::label | child::legend"
};

export const applicationPageElements = [
    { category: "text", tag: "textarea, input:not([type='hidden']):not([type='submit']), input[role='combobox'], input[type='file'], input[type='checkbox'], input[type='radio']" },
    { category: "dropdown", tag: "select", pageElementAttributes: { isOptions: true } },
    { category: "action", tag: "input[type='submit'], input[type='button'], button", pageElementAttributes: { isLabel: true } }
];

export const onboardingPageElement = [{ category: "text", tag: "input:not([role='combobox']):not([type='file']):not([type='radio']):not([type='checkbox']):not([type='hidden']):not([type='submit'])" }]

export const ALLOW_LIST = [
    'accept', 'allow', 'agree', 'ok', 'okay', 'close',
    'apply', 'send', 'join', 'go', 'interested', 'draft', 'that'
];

export const DENY_LIST = ['linkedin', 'indeed'];

export const appConfig = {
    browser: "chrome",
    maxClicks: 3,
    buttonTag: "button, a",
    timeOut: 5000,
    sleep: 2000,
    getLabelMaxAttempts: 6
}