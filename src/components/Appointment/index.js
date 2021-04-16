import React from "react";

import "components/Appointment/styles.scss";
import useVisualMode from "hooks/useVisualMode";

import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE"
  const SAVING = "SAVING"

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {

    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING, true);
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW));

  }

return (
  <article className="appointment">
  <Header
    time={props.time}
  />
  {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
  {mode === SHOW && (
  <Show
    student={props.interview["student"]}
    interviewer={props.interview.interviewer.name}
  />
  )}
  {mode === CREATE && (
  <Form
    name=""
    interviewers={props.interviewers}
    interviewer={null}
    onSave={save}
    onCancel={() => back()}
  />
  )}
  {mode === SAVING && (
  <Status
    message="Saving"
  />
  )}
  </article>
);

};
