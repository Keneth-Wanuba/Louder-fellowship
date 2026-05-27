
export const WEEKLY_PROGRAM = {
  0: "Join us for our Main Service today at 9am & 11am!", // Sunday
  1: "Join us on Zoom tonight at 8pm for our Monday Fellowship.", // Monday
  2: "Don't miss our Bible Study tonight at 6pm.", // Tuesday
  3: "Mid-week Service is on today at 5pm. See you there!", // Wednesday
  4: "Join our powerful Prayer Meeting tonight at 8pm on Zoom.", // Thursday
  5: "Prepare for our Night Vigil tonight starting at 10pm.", // Friday
  6: "Join the Community Outreach team today!" // Saturday
};

export function getTodayReminder() {
  const day = new Date().getDay();
  return WEEKLY_PROGRAM[day as keyof typeof WEEKLY_PROGRAM];
}
