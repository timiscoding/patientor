import React from "react";
import { mixed, string } from "yup";
import { Form, DropdownProps } from "semantic-ui-react";
import { useField } from "formik";
import {
  HealthCheckRating,
  NewHealthCheckEntry,
  Event,
  EntryType,
} from "../../../types";

const options = Object.keys(HealthCheckRating)
  .filter((key) => !isNaN(Number((HealthCheckRating as any)[key])))
  .map((key) => ({
    text: key,
    value: (HealthCheckRating as any)[key],
  }));

const HealthCheckEvent: Event<
  { className: string; style: React.CSSProperties },
  NewHealthCheckEntry
> = ({ className, style }) => {
  const [{ value }, meta, helpers] = useField("healthCheckRating");
  const onChange = (e: React.SyntheticEvent<any>, data: DropdownProps) => {
    helpers.setTouched(true);
    helpers.setValue(data.value);
  };
  return (
    <div className={className} style={style}>
      <Form.Select
        options={options}
        label="Health Rating"
        required
        onChange={onChange}
        value={value}
        error={meta.touched && meta.error}
      />
    </div>
  );
};

HealthCheckEvent.initialValues = {
  healthCheckRating: "",
  type: EntryType.HealthCheck,
};

HealthCheckEvent.validationSchema = {
  healthCheckRating: mixed()
    .oneOf(
      Object.values(HealthCheckRating).filter((key) =>
        isNaN(Number((HealthCheckRating as any)[key]))
      )
    )
    .required("Required field"),
  type: string().equals(Object.keys(EntryType)).required(),
};

HealthCheckEvent.type = EntryType.HealthCheck;

export { HealthCheckEvent };
