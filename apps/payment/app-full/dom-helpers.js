import { el } from 'redom';

export function createDEVFromText(items) {
    return el('div', [
            items.map((item) => item)
        ]
    );
}