import { useState, useEffect } from "react";

const axios = require('axios');

export default function useApplicationData(initial) {

  const [state, setState] = useState(initial);

  const setDay = day => setState({ ...state, day });

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
  .then((response) => {
    setState({...state, appointments});
  });
  }

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
      .then((response) => {
        setState({...state, appointments});
      });
  }

  useEffect(() => {
    Promise.all([
      axios.get('api/days'),
      axios.get('api/appointments'),
      axios.get('api/interviewers')
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    })
}, []);

  return { state, setDay, bookInterview, cancelInterview };
}