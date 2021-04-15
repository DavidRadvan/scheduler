export function getAppointmentsForDay(state, day) {

  const filteredDays = state.days.filter(dayObj => dayObj.name === day);
  const result = [];

  if (filteredDays.length !== 0) {
    for (let appointmentId of filteredDays[0].appointments) {
      for (let key in state.appointments) {
        if (appointmentId === state.appointments[key].id) {
          result.push(state.appointments[key]);
        }
      }
    }
  }

  return result;
}
