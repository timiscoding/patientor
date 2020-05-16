import React from "react";
import { Formik, Form } from "formik";
import { object, string, array } from "yup";
import { TextField, DiagnosisSelection } from "./FormField";

const AddEventForm = () => {
  return (
    <div>
      <Formik
        initialValues={{
          description: "a",
          specialist: "b",
          diagnosisCodes: [],
          discharge: {
            date: "2020-01-01",
            criteria: "s",
          },
        }}
        validationSchema={object()
          .shape({
            description: string().required("Required field"),
            specialist: string().required("Required field"),
            disagnosisCodes: array().of(string().required()),
            discharge: object()
              .shape({
                date: string().required("Required field"),
                criteria: string().required("Required field"),
              })
              .required("Required field"),
          })
          .required("Required field")}
        onSubmit={(data) => alert(JSON.stringify(data, null, 2))}
      >
        {({ setFieldTouched, setFieldValue }) => (
          <Form className="form ui">
            <TextField label="Description" name="description" required />
            <TextField label="Specialist" name="specialist" required />
            <DiagnosisSelection
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
            />
            <TextField label="Criteria" name="discharge.criteria" required />
            <TextField
              label="Date"
              name="discharge.date"
              placeholder="YYYY-MM-DD"
              required
            />

            <button type="submit">Add event</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddEventForm;
