import { dataKeys } from "./inputs.js";

function normalize(string) {
    return string.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function mapSystematically(labels) {
    const lookup = {};
    for (let i = 0; i < dataKeys.length; i++) {
        lookup[normalize(dataKeys[i])] = dataKeys[i];
    }

    const matched = [];
    const unmatched = [];
    for (let i = 0; i < labels.length; i++) {
        const label = labels[i];
        const normalizedLabel = normalize(label);
        const foundKey = lookup[normalizedLabel];
        foundKey ? matched.push({ [label]: foundKey }) : unmatched.push(label);
    }
    return { matched, unmatched };
}