

export function dataFormat(dateValue) {
    const date = new Date(dateValue);

    const y = date.getFullYear();
    const M = (date.getMonth() + 1 + '').padStart(2, '0');
    const d = (date.getDay() + '').padStart(2, '0');
    const h = (date.getHours() + '').padStart(2, '0');
    const m = (date.getMinutes() + '').padStart(2, '0');
    const s = (date.getSeconds() + '').padStart(2, '0');

    return `${y}-${M}-${d}-${h}-${m}-${s}`;
}
