export const now = new Date(),
  currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59),
  startDateDefault = new Date(new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0)),
  timeSaveLogs = 30; //days
