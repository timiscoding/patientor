import React from "react";
import { Table, Breadcrumb } from "semantic-ui-react";
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
        <Table.Cell className="word-break">{entry.employerName}</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Sick Leave</Table.Cell>
        <Table.Cell>
          {entry.sickLeave ? (
            <Breadcrumb size="small">
              <Breadcrumb.Section content={entry.sickLeave.startDate} />
              <Breadcrumb.Divider icon="right chevron" />
              <Breadcrumb.Section content={entry.sickLeave.endDate} />
            </Breadcrumb>
          ) : (
            "None"
          )}
        </Table.Cell>
      </Table.Row>
    </BaseEvent>
  );
};

export default OccupationalHealthcareEvent;
