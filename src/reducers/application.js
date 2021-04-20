export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";
export const UPDATE_SPOTS = "UPDATE_SPOTS";
export const WEBSOCKET_UPDATE = "WEBSOCKET_UPDATE";

export default function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.value };
    case SET_APPLICATION_DATA:
      return {...state, days: action.dayValue, appointments: action.appointmentsValue, interviewers: action.interviewersValue };
    case SET_INTERVIEW: {
      return { ...state, appointments: action.value }
    }
    case UPDATE_SPOTS: {
      return { ...state, days: action.value }
    }
    case WEBSOCKET_UPDATE: {
      if (action.valueInterview === null) {

        const appointment = {
          ...state.appointments[action.valueId],
          interview: null
        };

        const appointments = {
          ...state.appointments,
          [action.valueId]: appointment
        };

        return { ...state, appointments: appointments }

      } else {

        const appointment = {
          ...state.appointments[action.valueId],
          interview: {...action.valueInterview}
        };

        const appointments = {
          ...state.appointments,
          [action.valueId]: appointment
        };

        return { ...state, appointments: appointments }
      }
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}
