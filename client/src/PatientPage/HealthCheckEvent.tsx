import React from "react";
import { Table } from "semantic-ui-react";
import { HealthCheckEntry, HealthCheckRating } from "../types";
import BaseEvent from "./BaseEvent";
import { camelCaseToSpace } from "../utils";

interface Props {
  entry: HealthCheckEntry;
  index: number;
}

type TableCellType = "warning" | "positive" | "negative";

const ratingToColor: Record<HealthCheckRating, TableCellType> = {
  [HealthCheckRating.Healthy]: "positive",
  [HealthCheckRating.LowRisk]: "positive",
  [HealthCheckRating.HighRisk]: "warning",
  [HealthCheckRating.CriticalRisk]: "negative",
};

const HealthCheckEvent: React.FC<Props> = ({ entry, index }) => {
  return (
    <BaseEvent entry={entry} index={index}>
      <Table.Row>
        <Table.Cell>Health Check Rating</Table.Cell>
        <Table.Cell {...{ [ratingToColor[entry.healthCheckRating]]: true }}>
          {camelCaseToSpace(HealthCheckRating[entry.healthCheckRating])}
        </Table.Cell>
      </Table.Row>
    </BaseEvent>
  );
};

export default HealthCheckEvent;
