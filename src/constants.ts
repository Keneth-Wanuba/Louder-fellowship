
export const WEEKLY_PROGRAM = {
  0: "Join us for our Main Service today at 7am & 9am!", // Sunday
  1: "Join us on Zoom tonight at 8pm for our Monday Fellowship.", // Monday
  2: "Zoom prophetic one on one tonight at 8pm.", // Tuesday
  3: "Intercession meeting is on today at 7pm. See you there!", // Wednesday
  4: "Dream interpretation Meeting tonight at 8pm on Zoom.", // Thursday
  5: "Prepare for our Night Vigil tonight starting at 8pm.", // Friday
  6: "Children's cell;1pm, choirpractice;5pm, all today!" // Saturday
};

export function getTodayReminder() {
  const day = new Date().getDay();
  return WEEKLY_PROGRAM[day as keyof typeof WEEKLY_PROGRAM];
}
