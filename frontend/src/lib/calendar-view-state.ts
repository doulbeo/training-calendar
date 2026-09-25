const VIEW_KEY = 'training-calendar-view-v1';
let refreshing = false;

export interface CalendarViewState {
  month: string;
  selectedDayId: string | null;
  expandedHistoryFor: string | null;
  scrollY: number;
}

export function loadCalendarView(): CalendarViewState | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(VIEW_KEY) || 'null');
    if (!value || typeof value.month !== 'string'
      || !(value.selectedDayId === null || typeof value.selectedDayId === 'string')
      || !(value.expandedHistoryFor === null || typeof value.expandedHistoryFor === 'string')
      || !Number.isFinite(value.scrollY) || value.scrollY < 0) return null;
    return value;
  } catch {
    return null;
  }
}

export function saveCalendarView(value: CalendarViewState) {
  if (refreshing) return;
  try {
    sessionStorage.setItem(VIEW_KEY, JSON.stringify(value));
  } catch {
    // The current view still works when browser storage is unavailable.
  }
}

export function refreshCalendar() {
  refreshing = true;
  try {
    sessionStorage.removeItem(VIEW_KEY);
  } catch {
    // Refresh is available even when browser storage is blocked.
  }
  window.history.scrollRestoration = 'manual';
  window.location.reload();
}
