// Department-wise rules
const departmentTimingRules = {
  marketing: {
    lateLoginTime: 10 * 60 + 4, // 09:00 AM
    halfDayTime: 12 * 60, // 12:00 PM
    logoutTime: 17 * 60, // 05:00 PM
    isNightShift: false,
  },
  it: {
    lateLoginTime: 21 * 60 + 4, // 09:00 PM
    halfDayTime: 24 * 60, // 12:00 AM
    logoutTime: 6 * 60, // 06:00 AM (next day)
    isNightShift: true,
  },
  hr: {
    lateLoginTime: 10 * 60 + 4, // 09:00 AM
    halfDayTime: 12 * 60, // 12:00 PM
    logoutTime: 17 * 60, // 05:00 PM
    isNightShift: false,
  },
  sales: {
    lateLoginTime: 11 * 60 + 4, // 11:00 AM
    halfDayTime: 13 * 60, // 01:00 PM
    logoutTime: 18 * 60, // 06:00 PM
    isNightShift: false,
  },
};

export default departmentTimingRules;
