import React from "react";
import { Table, Icon, Label } from "semantic-ui-react";
import { OccupationalHealthcareEntry } from "../../types";
import BaseEvent from "./BaseEvent";

interface Props {
  entry: OccupationalHealthcareEntry;
  index: number;
}

const OccupationalHealthcareEvent: React.FC<Props> = ({ entry, index }) => {
  return (
    <BaseEvent entry={entry} index={index}>
      <Table.Row>
        <Table.Cell>Employer</Table.Cell>
        <Table.Cell>{entry.employerName}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Sick Leave</Table.Cell>
        <Table.Cell>
          {entry.sickLeave ? (
            <>
              <Label>{entry.sickLeave.startDate}</Label>
              <Icon name="arrow right" />
              <Label>{entry.sickLeave.endDate}</Label>
            </>
          ) : (
            "None"
          )}
        </Table.Cell>
      </Table.Row>
    </BaseEvent>
  );
};

export default OccupationalHealthcareEvent;
