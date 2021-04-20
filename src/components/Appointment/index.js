import React, { useEffect } from "react";

import "components/Appointment/styles.scss";
import useVisualMode from "hooks/useVisualMode";

import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE"
  const SAVING = "SAVING"
  const DELETING = "DELETING"
  const CONFIRM = "CONFIRM"
  const EDIT = "EDIT"
  const ERROR_SAVE = "ERROR_SAVE"
  const ERROR_DELETE = "ERROR_DELETE"

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  useEffect(() => {
    if (props.interview && mode === EMPTY) {
      transition(SHOW);
    }
    if (props.interview === null && mode === SHOW) {
      transition(EMPTY);
    }
  }, [props.interview, transition, mode]);

  function save(name, interviewer) {

    const interview = {
      student: name,
      interviewer
    };

    if (interview.interviewer === null) {
      return;
    }

    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(() => transition(ERROR_SAVE, true))
  }

  function deleteInterview(id) {

    transition(DELETING, true);
    props.cancelInterview(id)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true))
  }

return (
  <article className="appointment" data-testid="appointment">
  <Header
    time={props.time}
  />
  {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
  {mode === SHOW && props.interview && (
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
  {mode === ERROR_SAVE && (
    <Error
      message="Could not save appointment."
      onClose={() => back()}
    />
  )}
  {mode === ERROR_DELETE && (
    <Error
      message="Could not delete appointment."
      onClose={() => back()}
    />
  )}
  </article>
);

};
