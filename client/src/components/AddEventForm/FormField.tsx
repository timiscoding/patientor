import React from "react";
import { Form } from "semantic-ui-react";
import { useField } from "formik";
import { DiagnosisSelection } from "../../AddPatientModal/FormField";

const TextField: React.FC<{
  label: string;
  name: string;
  [x: string]: any;
}> = ({ label, name, ...props }) => {
  const [field, meta] = useField(name);
  return (
    <Form.Field
      label={label}
      control="input"
      error={meta.touched && meta.error}
      {...field}
      {...props}
    />
  );
};

export { TextField, DiagnosisSelection };
