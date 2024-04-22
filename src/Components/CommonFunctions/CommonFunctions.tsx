export function minutesSpellingTransform(n: number, text_forms = ["минута", "минуты", "минут"]) {
    const m = Math.abs(n) % 100;
    const n1 = m % 10;
    if (m > 10 && m < 20) {
        return text_forms[2];
    }
    if (n1 > 1 && n1 < 5) {
        return text_forms[1];
    }
    if (n1 == 1) {
        return text_forms[0];
    }
    return text_forms[2];
}