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
import {
  HospitalEvent,
  HealthCheckEvent,
  OccupationalHealthcareEvent,
} from "./eventTypes";
import { FormField, DiagnosisSelection } from "./FormField";
import {
  NewEntry,
  NewHealthCheckEntry,
  NewHospitalEntry,
  NewOccupationalHealthcareEntry,
  EntryType,
} from "../../types";

// const getEvent: Record<EntryType, React.FC> = {
//   [EntryType.Hospital]: HospitalEvent,
//   [EntryType.HealthCheck]: HealthCheckEvent,
//   [EntryType.OccupationalHealthcare]: OccupationalHealthcareEvent,
// };

const AddEventForm: React.FC<{
  onSubmit(
    values: NewHospitalEntry,
    formikBag: FormikHelpers<NewHospitalEntry>
  ): void;
}> = ({ onSubmit }) => {
  const EventType = HospitalEvent;
  const initialValues = {
    type: EventType.type,
    description: "",
    specialist: "",
    diagnosisCodes: [],
    ...EventType.initialValues,
  } as NewHospitalEntry;
  const schemaShape = {
    description: string().required("Required field"),
    specialist: string().required("Required field"),
    disagnosisCodes: array().of(string().required()),
    ...EventType.validationSchema,
  };
  return (
    <Segment>
      <Header as="h2">New Event</Header>
      <Formik
        initialValues={initialValues}
        validationSchema={object()
          .shape(schemaShape)
          .required("Required field")}
        onSubmit={onSubmit}
      >
        {({
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
              <EventType />
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
