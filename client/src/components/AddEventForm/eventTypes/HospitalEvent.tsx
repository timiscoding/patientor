import React from "react";
import { Form, Segment, Label, Icon } from "semantic-ui-react";
import { useFormikContext } from "formik";
import { object, string, date } from "yup";

import { FormField } from "../FormField";
import { NewHospitalEntry, Event, EntryType } from "../../../types";

const HospitalEvent: Event<{}, NewHospitalEntry> = () => {
  const { isSubmitting } = useFormikContext();
  return (
    <>
      <Segment>
        <Label attached="top left">
          <Icon name="sign out" />
          Discharge
        </Label>
        <Form.Group>
          <FormField
            label="Date"
            name="discharge.date"
            type="date"
            width={3}
            readOnly={isSubmitting}
            required
          />
          <FormField
            label="Criteria"
            name="discharge.criteria"
            width={13}
            readOnly={isSubmitting}
            required
          />
        </Form.Group>
      </Segment>
    </>
  );
};

HospitalEvent.initialValues = {
  discharge: {
    date: "",
    criteria: "",
  },
};

HospitalEvent.validationSchema = {
  discharge: object()
    .shape({
      date: date().required("Required field"),
      criteria: string().required("Required field"),
    })
    .required("Required field"),
};

HospitalEvent.type = EntryType.Hospital;

export { HospitalEvent };
