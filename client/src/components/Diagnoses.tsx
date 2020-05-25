import React, { useEffect } from "react";
import axios from "axios";
import { Diagnosis } from "../types";
import { List, Label } from "semantic-ui-react";
import { useStateValue, setDiagnosisList } from "../state";
import { apiBaseUrl } from "../constants";

interface Props {
  codes: Array<Diagnosis["code"]>;
}
const Diagnoses: React.FC<Props> = ({ codes }) => {
  const [{ diagnoses }, dispatch] = useStateValue();
  useEffect(() => {
    const fetchDiagnoses = async () => {
      if (diagnoses.length === 0) {
        const { data: diagnoses } = await axios.get<Diagnosis[]>(
          `${apiBaseUrl}/diagnoses`
        );
        dispatch(setDiagnosisList(diagnoses));
      }
    };
    fetchDiagnoses();
  }, [diagnoses, dispatch]);
  if (codes.length === 0) return <>None</>;

  return (
    <List divided selection>
      {codes.map((code) => (
        <List.Item key={code}>
          <Label color="teal" horizontal>
            {code}
          </Label>
          {diagnoses.find((d) => d.code === code)?.name}
        </List.Item>
      ))}
    </List>
  );
};

export default Diagnoses;
