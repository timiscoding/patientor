import React from "react";
import { Formik, FormikHelpers } from "formik";
import {
  Form,
  Button,
  Header,
  Segment,
  Icon,
  Message,
} from "semantic-ui-react";
import { object, string, array } from "yup";
import { FormField, DiagnosisSelection } from "./FormField";
import { NewHospitalEntry } from "../../types";

const AddEventForm: React.FC<{
  onSubmit(
    values: NewHospitalEntry,
    formikBag: FormikHelpers<NewHospitalEntry>
  ): void;
}> = ({ onSubmit }) => {
  return (
    <Segment>
      <Header as="h2">New Event</Header>
      <Formik
        initialValues={{
          type: "Hospital",
          description: "",
          specialist: "",
          diagnosisCodes: [],
          discharge: {
            date: "",
            criteria: "",
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
        onSubmit={onSubmit}
      >
        {({
          setFieldTouched,
          setFieldValue,
          dirty,
          isValid,
          handleReset,
          handleSubmit,
          isSubmitting,
          setStatus,
          status,
        }) => {
          const onClick = () => {
            // clear last Message if user interacts with form again
            setStatus({});
          };
          return (
            <Form
              onReset={handleReset}
              onSubmit={handleSubmit}
              {...status}
              onClick={onClick}
            >
              <FormField
                label="Description"
                name="description"
                readOnly={isSubmitting}
                required
              />
              <FormField
                label="Specialist"
                name="specialist"
                readOnly={isSubmitting}
                required
              />
              <DiagnosisSelection
                name="diagnosisCodes"
                readOnly={isSubmitting}
              />
              <Form.Group>
                <FormField
                  label="Discharge Date"
                  name="discharge.date"
                  type="date"
                  width={3}
                  readOnly={isSubmitting}
                  required
                />
                <FormField
                  label="Discharge Criteria"
                  name="discharge.criteria"
                  width={13}
                  readOnly={isSubmitting}
                  required
                />
              </Form.Group>
              <Message
                success
                header="Success"
                content="A new event has been created"
              />
              <Message
                error
                header="Error"
                content="Event could not be created. Please try again."
              />
              <Button
                type="submit"
                disabled={!dirty || !isValid || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Icon name="spinner" loading />
                    Adding event...
                  </>
                ) : (
                  "Add event"
                )}
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Segment>
  );
};

export default AddEventForm;
