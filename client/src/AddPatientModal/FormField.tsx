import React, { useEffect } from "react";
import { ErrorMessage, Field, FieldProps, useField } from "formik";
import { Dropdown, DropdownProps, Form, Icon } from "semantic-ui-react";
import axios from "axios";
import { useAsyncCallback } from "react-async-hook";
import { Diagnosis, Gender } from "../types";
import { useStateValue, setDiagnosisList } from "../state";
import { apiBaseUrl } from "../constants";

// structure of a single option
export type GenderOption = {
  value: Gender;
  label: string;
};

// props for select field component
type SelectFieldProps = {
  name: string;
  label: string;
  options: GenderOption[];
};

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options,
}: SelectFieldProps) => (
  <Form.Field>
    <label>{label}</label>
    <Field as="select" name={name} className="ui dropdown">
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label || option.value}
        </option>
      ))}
    </Field>
  </Form.Field>
);

interface TextProps extends FieldProps {
  label: string;
  placeholder: string;
}

export const TextField: React.FC<TextProps> = ({
  field,
  label,
  placeholder,
}) => (
  <Form.Field>
    <label>{label}</label>
    <Field placeholder={placeholder} {...field} />
    <div style={{ color: "red" }}>
      <ErrorMessage name={field.name} />
    </div>
  </Form.Field>
);

/*
  for exercises 9.24.-
*/
interface NumberProps extends FieldProps {
  label: string;
  errorMessage?: string;
  min: number;
  max: number;
}

export const NumberField: React.FC<NumberProps> = ({
  field,
  label,
  min,
  max,
}) => (
  <Form.Field>
    <label>{label}</label>
    <Field {...field} type="number" min={min} max={max} />

    <div style={{ color: "red" }}>
      <ErrorMessage name={field.name} />
    </div>
  </Form.Field>
);

export const DiagnosisSelection: React.FC<{
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
