import React from "react";
import { Diagnosis } from "../types";
import { List } from "semantic-ui-react";

interface Props {
  codes: Array<Diagnosis["code"]>;
}
const Diagnoses: React.FC<Props> = ({ codes }) => {
  if (codes.length === 0) return <>None</>;
  return <List items={codes} celled horizontal />;
};

export default Diagnoses;
