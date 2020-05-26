import React, { useEffect } from "react";
import { useField } from "formik";
import {
  FormFieldProps,
  Input,
  Dropdown,
  DropdownProps,
  Form,
  Icon,
} from "semantic-ui-react";
import axios from "axios";
import { useAsyncCallback } from "react-async-hook";
import { Diagnosis, Gender } from "../types";
import { useStateValue, setDiagnosisList } from "../state";
import { apiBaseUrl } from "../constants";

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

// structure of a single option
export type GenderOption = {
  value: Gender;
  text: string;
};

const SelectField: React.FC<{
  name: string;
  label: string;
  options: Array<{ value: string; text: string }>;
  required?: boolean;
  placeholder?: string;
}> = ({ name, label, options, required, placeholder }) => {
  const [{ value }, meta, helpers] = useField(name);
  const onChange = (e: React.SyntheticEvent, data: DropdownProps) => {
    helpers.setTouched(true);
    helpers.setValue(data.value);
  };
  return (
    <Form.Select
      options={options}
      label={label}
      onChange={onChange}
      value={value}
      error={meta.touched && meta.error}
      required={required}
      placeholder={placeholder}
    />
  );
};

const DiagnosisSelection: React.FC<{
  name: string;
  readOnly?: boolean;
}> = ({ name, readOnly = false }) => {
  const [field, meta, helpers] = useField(name);
  const [{ diagnoses }, dispatch] = useStateValue();

  const fetchDiagnoses = async (): Promise<Diagnosis[]> => {
    if (diagnoses.length !== 0) return Promise.resolve(diagnoses);
    return (await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`)).data;
  };
  const asyncDiagnosesOnClick = useAsyncCallback(fetchDiagnoses);

  useEffect(() => {
    if (asyncDiagnosesOnClick.result) {
      dispatch(setDiagnosisList(asyncDiagnosesOnClick.result));
    }
  }, [dispatch, asyncDiagnosesOnClick.result]);

  const onChange = (
    _event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps
  ) => {
    helpers.setTouched(true);
    helpers.setValue(data.value);
  };

  const stateOptions = diagnoses.map((diagnosis) => ({
    key: diagnosis.code,
    text: `${diagnosis.name} (${diagnosis.code})`,
    value: diagnosis.code,
  }));

  return (
    <Form.Field error={meta.touched && meta.error}>
      <label>Diagnoses</label>
      <Dropdown
        lazyLoad
        noResultsMessage={
          asyncDiagnosesOnClick.loading ? (
            <div>
              <Icon name="life ring" loading color="blue" />
              Fetching diagnosis codes...
            </div>
          ) : asyncDiagnosesOnClick.error ? (
            <div>
              <Icon name="warning sign" color="red" />
              Error fetching diagnosis codes. Please try again
            </div>
          ) : (
            <div>
              <Icon name="search" />
              No results
            </div>
          )
        }
        fluid
        multiple
        search
        selection
        options={stateOptions}
        onChange={onChange}
        onOpen={asyncDiagnosesOnClick.execute}
        disabled={readOnly}
        value={field.value}
      />
    </Form.Field>
  );
};

export { FormField, DiagnosisSelection, SelectField };
