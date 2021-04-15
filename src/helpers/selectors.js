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

export function getInterview(state, interview) {

  if (interview === null) {
    return null;
  }

  for (let key in state.interviewers) {
    if (state.interviewers[key].id === interview.interviewer) {
      return {...interview, interviewer: state.interviewers[key]}
    }
  }
}

export function getInterviewersForDay(state, day) {

  const filteredDays = state.days.filter(dayObj => dayObj.name === day);
  const result = [];

  if (filteredDays.length !== 0) {
    for (let interviewerId of filteredDays[0].interviewers) {
      for (let key in state.interviewers) {
        if (interviewerId === state.interviewers[key].id) {
          result.push(state.interviewers[key]);
        }
      }
    }
  }

  return result;
}
