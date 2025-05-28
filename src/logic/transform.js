export function mapFieldsWithUserDataKey(fields, allMappings) {
    const keyToDataKeyMap = Object.assign({}, ...allMappings);

    const fieldsWithDataKey = [];
    for (let i = 0; i < fields.length; i++) {
        const lookupKey = fields[i].groupLabel != null ? fields[i].groupLabel : fields[i].label;
        const resolvedDataKey = keyToDataKeyMap.hasOwnProperty(lookupKey) ? keyToDataKeyMap[lookupKey] : null;
        fieldsWithDataKey.push({ ...fields[i], userDataKey: resolvedDataKey });
    }
    return fieldsWithDataKey;
}

function getGroupKey(key, value, counts) { return counts[`${key}|${value}`] > 1; }

function deriveLabels(object, counts) {
    const keys = [];
    for (const key in object) {
        if (object[key] != null) keys.push(key);
    }

    if (keys.length === 0) return { label: null, groupLabel: null };

    if (keys.length === 1) {
        const isGroup = getGroupKey(keys[0], object[keys[0]], counts);
        return { label: isGroup ? null : object[keys[0]], groupLabel: isGroup ? object[keys[0]] : null };
    }

    let isGroupKey = null;
    for (let i = 0; i < keys.length; i++) {
        if (getGroupKey(keys[i], object[keys[i]], counts)) {
            isGroupKey = keys[i];
            break;
        }
    }

    if (isGroupKey) {
        const remainingValues = [];
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] !== isGroupKey) remainingValues.push(object[keys[i]]);
        }
        const label = remainingValues.length ? remainingValues.join(' ') : null;
        return { label, groupLabel: object[isGroupKey] };
    }

    const allValues = [];
    for (let i = 0; i < keys.length; i++) {
        allValues.push(object[keys[i]]);
    }
    return { label: allValues.join(' '), groupLabel: null };
}

function processFields(fields, counts) {
    const result = [];
    for (let i = 0; i < fields.length; i++) {
        const derived = deriveLabels(fields[i].label || {}, counts);
        result.push({ ...fields[i], label: derived.label, groupLabel: derived.groupLabel });
    }
    return result;
}

function findGroupLabel(fields) {
    const counts = {};
    for (let i = 0; i < fields.length; i++) {
        const object = fields[i].label || {};
        for (const key in object) {
            const value = object[key];
            if (value != null) {
                const count = `${key}|${value}`;
                counts[count] = (counts[count] || 0) + 1;
            }
        }
    }
    return counts;
}

export function transformFields(fields) {
    const counts = findGroupLabel(fields);
    return processFields(fields, counts);
}