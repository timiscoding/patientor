import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Formik, Form } from "formik";
import { object, string, mixed, date } from "yup";

import { FormField, SelectField, GenderOption } from "../components";
import { Gender, Patient, Modify } from "../types";
import { maxInputLengths } from "../constants";

/*
 * use type Patient, but omit id and entries,
 * because those are irrelevant for new patient object.
 */
export type PatientFormValues = Modify<
  Omit<Patient, "id" | "entries">,
  { gender: Gender | "" }
>;

interface Props {
  onSubmit: (values: PatientFormValues) => void;
  onCancel: () => void;
}

const genderOptions: GenderOption[] = [
  { value: Gender.Male, text: "Male" },
  { value: Gender.Female, text: "Female" },
  { value: Gender.Other, text: "Other" },
];

const requiredError = "Field is required";
export const AddPatientForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  return (
    <Formik
      initialValues={{
        name: "",
        ssn: "",
        dateOfBirth: "",
        occupation: "",
        gender: "",
      }}
      onSubmit={onSubmit}
      validationSchema={object().shape({
        name: string()
          .required(requiredError)
          .max(maxInputLengths.patient.name),
        ssn: string().required(requiredError).max(maxInputLengths.patient.ssn),
        dateOfBirth: date().required(requiredError),
        occupation: string()
          .required(requiredError)
          .max(maxInputLengths.patient.occupation),
        gender: mixed().oneOf(Object.values(Gender)).required(requiredError),
      })}
    >
      {({ isValid, dirty }) => {
        return (
          <Form className="form ui">
            <FormField label="Name" placeholder="Name" name="name" required />
            <FormField
              label="Social Security Number"
              placeholder="SSN"
              name="ssn"
              required
            />
            <FormField
              label="Date Of Birth"
              placeholder="YYYY-MM-DD"
              name="dateOfBirth"
              type="date"
              required
            />
            <FormField
              label="Occupation"
              placeholder="Occupation"
              name="occupation"
              required
            />
            <SelectField
              label="Gender"
              placeholder="Select gender"
              name="gender"
              options={genderOptions}
              required
            />
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} secondary>
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  primary
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddPatientForm;
