import React from "react";

import "components/InterviewerListItem.scss";
const classNames = require('classnames');

export default function InterviewerListItem(props) {

  const interviewerClass = classNames("interviewers__item", {
    "interviewers__item--selected": props.selected
  });

  const interviewerClassImg = classNames("interviewers__item-image", {
    "interviewers__item--selected-image": props.selected
  });

  function displayName() {
    return props.selected ? props.name : "";
  }

  return (
    <li className={interviewerClass} onClick={() => props.setInterviewer(props.id)}>
      <img
        className={interviewerClassImg}
        src={props.avatar}
        alt={props.name}
      />
      {displayName()}
    </li>
  );
}
