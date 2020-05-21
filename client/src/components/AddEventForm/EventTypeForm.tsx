import React from "react";
import { Divider, Form, DropdownProps, Transition } from "semantic-ui-react";
import { useField, useFormikContext } from "formik";
import {
  HospitalEvent,
  HealthCheckEvent,
  OccupationalHealthcareEvent,
} from "./eventTypes";
import { NewEntry, EntryType, Event } from "../../types";
import { camelCaseToSpace } from "../../utils";
import { baseVals, useFormikReinitContext } from "./";

const options = Object.keys(EntryType).map((k) => ({
  text: camelCaseToSpace(EntryType[k as keyof typeof EntryType]),
  value: k,
}));

const getEvent: Record<EntryType, Event<any, NewEntry>> = {
  [EntryType.Hospital]: HospitalEvent,
  [EntryType.HealthCheck]: HealthCheckEvent,
  [EntryType.OccupationalHealthcare]: OccupationalHealthcareEvent,
};

const EventTypeForm: React.FC = () => {
  const [typeField, typeMeta, typeHelpers] = useField("type");
  const { values, setValues } = useFormikContext();
  const { initEventType } = useFormikReinitContext();

  const onChange = (e: React.SyntheticEvent<any>, data: DropdownProps) => {
    const type = data.value as keyof typeof EntryType;
    typeHelpers.setTouched(true);
    typeHelpers.setValue(type);
    const event = getEvent[EntryType[type]];
    initEventType(event.initialValues, event.validationSchema);
    const curBaseVals = Object.keys(baseVals).reduce(
      (r, key) => ({ ...r, [key]: (values as any)[key] }),
      {}
    );
    setValues({ ...curBaseVals, type, ...event.initialValues }, false);
  };

  const type = typeField.value as keyof typeof EntryType;
  const EventTypeForm = typeField.value
    ? getEvent[EntryType[type]]
    : React.Fragment; // render nothing when no type selected

  return (
    <>
      <Divider />
      <Form.Select
        options={options}
        label="Type"
        value={typeField.value}
        onChange={onChange}
        error={typeMeta.touched && typeMeta.error}
        required
      />
      <Transition.Group duration={3000}>
        <EventTypeForm />
      </Transition.Group>
    </>
  );
};

export default EventTypeForm;
