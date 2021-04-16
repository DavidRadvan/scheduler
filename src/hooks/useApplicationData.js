import { useReducer, useEffect } from "react";

const axios = require('axios');

export default function useApplicationData(initial) {

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const UPDATE_SPOTS = "UPDATE_SPOTS";

  function reducer(state, action) {
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
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const [state, dispatch] = useReducer(reducer, initial);

  const setDay = day => dispatch({ type: SET_DAY, value: day});

  // bookInterview creates a new interview for the given appointment id
  function bookInterview(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: {...interview}
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, {
    id: appointment.id,
    time: appointment.time,
    interview: {
      student: appointment.interview.student,
      interviewer: appointment.interview.interviewer,
    },
  })
  .then(() => {
    dispatch({ type: SET_INTERVIEW, value: appointments});
  })
  }

// cancelInterview cancels an interview for the given appointment id
  function cancelInterview(id) {

    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        dispatch({ type: SET_INTERVIEW, value: appointments});
      })
  }

// loads data from server to client
  useEffect(() => {
    Promise.all([
      axios.get('api/days'),
      axios.get('api/appointments'),
      axios.get('api/interviewers')
    ]).then((all) => {
      dispatch({ type: SET_APPLICATION_DATA, dayValue: all[0].data, appointmentsValue: all[1].data, interviewersValue: all[2].data});
    })
  }, []);

// configures webSocket
  useEffect(() => {
    const webSocket = new WebSocket('ws://localhost:8001');
    webSocket.onopen = function(event) {
      webSocket.send("ping");
    };
    webSocket.onmessage = function(event) {
      const msg = JSON.parse(event.data);

      if (msg.type === "SET_INTERVIEW") {
        if (msg.interview === null) {
          const appointment = {
            ...state.appointments[msg.id],
            interview: null
          };

          const appointments = {
            ...state.appointments,
            [msg.id]: appointment
          };

          dispatch({ type: SET_INTERVIEW, value: appointments});

        } else {
          const appointment = {
            ...state.appointments[msg.id],
            interview: {...msg.interview}
          };

          const appointments = {
            ...state.appointments,
            [msg.id]: appointment
          };
          dispatch({ type: SET_INTERVIEW, value: appointments});
        }
      }
    };
  }, []);

// refreshes days data when appointments change, used to update spots
  useEffect(() => {
    axios.get('api/days')
    .then((response) => {
      dispatch({ type: UPDATE_SPOTS, value: response.data});
    })
  }, [state.appointments]);

  return { state, setDay, bookInterview, cancelInterview };
}
