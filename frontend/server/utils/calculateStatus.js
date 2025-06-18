// Calculate login status
const calculateStatus = (loginAt, rules, dateStr) => {
  const date = new Date(dateStr);
  if (date.getDay() === 0) return "Sunday";
  if (!loginAt) return "No Login";

  const loginHour = loginAt.getHours();
  const loginMinute = loginAt.getMinutes();
  const loginInMinutes = loginHour * 60 + loginMinute;

  if (loginInMinutes <= rules.lateLoginTime) {
    return "On Time";
  } else if (loginInMinutes <= rules.halfDayTime) {
    return "Late";
  } else {
    return "Half Day";
  }
};

export default calculateStatus;
