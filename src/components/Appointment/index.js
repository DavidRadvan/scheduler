import React from "react";

import "components/Appointment/styles.scss";
import useVisualMode from "hooks/useVisualMode";

import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE"
  const SAVING = "SAVING"
  const DELETING = "DELETING"
  const CONFIRM = "CONFIRM"
  const EDIT = "EDIT"

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {

    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW));

  }

  function deleteInterview(id) {

    transition(DELETING);
    props.cancelInterview(id)
      .then(() => transition(EMPTY))
  }

return (
  <article className="appointment">
  <Header
    time={props.time}
  />
  {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
  {mode === SHOW && (
    <Show
      id={props.id}
      student={props.interview["student"]}
      interviewer={props.interview.interviewer.name}
      onDelete={() => transition(CONFIRM)}
      onEdit={() => transition(EDIT)}
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
  {mode === DELETING && (
    <Status
      message="Deleting"
    />
  )}
  {mode === CONFIRM && (
    <Confirm
      id={props.id}
      message="Delete the appointment?"
      onCancel={() => back()}
      onConfirm={deleteInterview}
    />
  )}
  {mode === EDIT && (
    <Form
      name={props.interview["student"]}
      interviewers={props.interviewers}
      interviewer={props.interview.interviewer.id}
      onSave={save}
      onCancel={() => back()}
    />
  )}
  </article>
);

};
