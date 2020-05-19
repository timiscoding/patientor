import React from "react";
import { Form, FormFieldProps, Input } from "semantic-ui-react";
import { useField } from "formik";
import { DiagnosisSelection } from "../../AddPatientModal/FormField";

const FormField: React.FC<{
  label: string;
  name: string;
  type?: FormFieldProps["type"];
  width?: FormFieldProps["width"];
  [x: string]: any;
}> = ({ label, name, type, width, ...props }) => {
  const [field, meta] = useField(name);
  return (
    <Form.Field
      width={width}
      label={label}
      type={type}
      error={
        meta.touched && meta.error && { content: meta.error, pointing: "above" }
      }
      control={Input}
      {...field}
      {...props}
    />
  );
};

export { FormField, DiagnosisSelection };
