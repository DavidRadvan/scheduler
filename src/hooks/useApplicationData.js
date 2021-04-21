import { useReducer, useEffect } from "react";

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
  UPDATE_SPOTS,
  WEBSOCKET_UPDATE
} from "reducers/application";

const axios = require('axios');

export default function useApplicationData(initial) {

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
    .catch((error) => console.log(error));
  }, []);

// configures webSocket
  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8001');

    webSocket.onmessage = function(event) {

      const msg = JSON.parse(event.data);

      if (msg.type === "SET_INTERVIEW") {
        dispatch({ type: WEBSOCKET_UPDATE, valueId: msg.id, valueInterview: msg.interview});
      }

    }
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
