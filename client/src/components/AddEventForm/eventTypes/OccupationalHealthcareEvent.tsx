import React from "react";
import { string, object, ValidationError } from "yup";
import { Form, Label, Segment, Icon } from "semantic-ui-react";
import { FormField } from "../FormField";
import {
  NewOccupationalHealthcareEntry,
  Event,
  EntryType,
} from "../../../types";

const OccupationalHealthcareEvent: Event<
  { style: React.CSSProperties; className: string },
  NewOccupationalHealthcareEntry
> = ({ style, className }) => {
  return (
    <div style={style} className={className}>
      <FormField name="employerName" label="Employer" required />
      <Segment>
        <Label attached="top left">
          <Icon name="bed" />
          Sick leave
        </Label>
        <Form.Group grouped>
          <FormField
            name="sickLeave.startDate"
            label="Start date"
            type="date"
          />
          <FormField name="sickLeave.endDate" label="End date" type="date" />
        </Form.Group>
      </Segment>
    </div>
  );
};

OccupationalHealthcareEvent.initialValues = {
  employerName: "",
  sickLeave: { startDate: "", endDate: "" },
  type: EntryType.OccupationalHealthcare,
};

OccupationalHealthcareEvent.validationSchema = {
  type: string().equals(Object.keys(EntryType)).required(),
  employerName: string().required("Required field"),
  sickLeave: object()
    .shape({
      startDate: string().default(""),
      endDate: string().default(""),
    })
    .test(
      "is sick leave partially filled",
      "Sick leave start and end date must be completely filled or empty",
      ({ startDate, endDate }) => {
        if (startDate.length === 0 && endDate.length === 0)
          return Promise.resolve(true);
        const s = Date.parse(startDate);
        const e = Date.parse(endDate);
        if (isNaN(s))
          return Promise.resolve(
            new ValidationError(
              "Sick leave must have a valid start date",
              startDate,
              "sickLeave.startDate"
            )
          );
        if (isNaN(e))
          return Promise.resolve(
            new ValidationError(
              "Sick leave must have a valid end date",
              endDate,
              "sickLeave.endDate"
            )
          );
        if (s > e) {
          return Promise.resolve(
            new ValidationError(
              "Start date must be before end date",
              startDate,
              "sickLeave.startDate"
            )
          );
        }
        return Promise.resolve(true);
      }
    ),
};

OccupationalHealthcareEvent.type = EntryType.OccupationalHealthcare;

export { OccupationalHealthcareEvent };
