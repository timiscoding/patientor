import React from "react";
import { mixed } from "yup";
import { Form, DropdownProps } from "semantic-ui-react";
import { useField } from "formik";
import {
  HealthCheckRating,
  NewHealthCheckEntry,
  Event,
  EntryType,
} from "../../../types";

const fieldName = "healthCheckRating";
const options = Object.keys(HealthCheckRating)
  .filter((key) => !isNaN(Number((HealthCheckRating as any)[key])))
  .map((key) => ({
    text: key,
    value: (HealthCheckRating as any)[key],
  }));

const HealthCheckEvent: Event<{}, NewHealthCheckEntry> = () => {
  const [{ value }, meta, helpers] = useField(fieldName);
  const onChange = (e: React.SyntheticEvent<any>, data: DropdownProps) => {
    helpers.setTouched(true);
    helpers.setValue(data.value);
  };
  return (
    <>
      <Form.Select
        options={options}
        label="Health Rating"
        required
        onChange={onChange}
        value={value}
        error={meta.touched && meta.error}
      />
    </>
  );
};

HealthCheckEvent.initialValues = {
  [fieldName]: "",
};

HealthCheckEvent.validationSchema = {
  [fieldName]: mixed()
    .oneOf(
      Object.values(HealthCheckRating).filter((key) =>
        isNaN(Number((HealthCheckRating as any)[key]))
      )
    )
    .required("Required field"),
};

HealthCheckEvent.type = EntryType.HealthCheck;

export { HealthCheckEvent };
