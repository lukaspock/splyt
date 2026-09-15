const KEY = "splyt_streak_celebration_last_shown_date";

export function shouldCelebrateToday(todayIso: string): boolean {
    return localStorage.getItem(KEY) !== todayIso;
}

export function markCelebratedToday(todayIso: string): void {
    localStorage.setItem(KEY, todayIso);
}
