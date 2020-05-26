import React from "react";
import { Table } from "semantic-ui-react";
import { HospitalEntry } from "../../types";
import BaseEvent from "./BaseEvent";

interface Props {
  entry: HospitalEntry;
  index: number;
}

const HospitalEvent: React.FC<Props> = ({ entry, index }) => {
  return (
    <BaseEvent entry={entry} index={index}>
      <Table.Row>
        <Table.Cell>Discharge</Table.Cell>
        <Table.Cell className="word-break">
          {entry.discharge.date}
          <br />
          {entry.discharge.criteria}
        </Table.Cell>
      </Table.Row>
    </BaseEvent>
  );
};

export default HospitalEvent;
