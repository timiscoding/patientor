import React from "react";
import {
  FormikHelpers,
  FormikState,
  FormikHandlers,
  FormikComputedProps,
} from "formik";
import {
  Transition,
  Form,
  Button,
  Segment,
  Icon,
  Message,
} from "semantic-ui-react";

import EventTypeForm from "./EventTypeForm";
import { FormField, DiagnosisSelection } from "../FormField";
import { NewEntry, FormSubmitStatus } from "../../types";

const AddEventForm: React.FC<{
  dirty: FormikComputedProps<NewEntry>["dirty"];
  isValid: FormikComputedProps<NewEntry>["isValid"];
  handleReset: FormikHandlers["handleReset"];
  handleSubmit: FormikHandlers["handleSubmit"];
  isSubmitting: FormikState<NewEntry>["isSubmitting"];
  setStatus: FormikHelpers<NewEntry>["setStatus"];
  status: FormSubmitStatus;
}> = ({
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
    setStatus(FormSubmitStatus.Inactive);
  };
  return (
    <Form onReset={handleReset} onSubmit={handleSubmit} onClick={onClick}>
      <Segment attached>
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
        <DiagnosisSelection name="diagnosisCodes" readOnly={isSubmitting} />
        <EventTypeForm />
      </Segment>
      <Segment attached>
        <Button type="submit" disabled={!dirty || !isValid || isSubmitting}>
          {isSubmitting ? (
            <>
              <Icon name="spinner" loading />
              Adding event...
            </>
          ) : (
            "Add event"
          )}
        </Button>
      </Segment>
      <Transition
        animation="fade down"
        visible={status === FormSubmitStatus.Success}
      >
        <Message
          onDismiss={onClick}
          success
          attached="bottom"
          header="Success"
          content="A new event has been created"
        />
      </Transition>
      <Transition
        animation="fade down"
        visible={status === FormSubmitStatus.Error}
      >
        <Message
          onDismiss={onClick}
          error
          attached="bottom"
          header="Error"
          content="Event could not be created. Please try again."
        />
      </Transition>
    </Form>
  );
};

export default AddEventForm;
