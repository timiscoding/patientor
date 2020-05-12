import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header, Loader, Icon, SemanticICONS, Label } from "semantic-ui-react";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { useStateValue, updatePatient } from "../state";
import { Patient, Gender } from "../types";
import EventList from "./EventList";
import { sortByDate } from "../utils";

const iconsByGender: Record<Gender, SemanticICONS> = {
  [Gender.Male]: "man",
  [Gender.Female]: "woman",
  [Gender.Other]: "other gender",
};

const PatientPage: React.FC = () => {
  const [{ patients }, dispatch] = useStateValue();
  const [fullPatient, setFullPatient] = useState<boolean>(false);
  const { id: patientId } = useParams();
  const patient = patients[patientId];

  useEffect(() => {
    const fetchPatient = async () => {
      if (!patient?.ssn) {
        const { data: fullPatient } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${patientId}`
        );
        dispatch(updatePatient(fullPatient));
      } else {
        setFullPatient(true);
      }
    };
    fetchPatient();
  }, [patientId, dispatch, patient]);

  if (!fullPatient) {
    return <Loader active>Loading patient...</Loader>;
  }
  return (
    <div>
      <Header as="h1">
        <Icon.Group size="big">
          <Icon name="user circle" color="grey" />
          <Icon corner name={iconsByGender[patient.gender]} color="red" />
        </Icon.Group>{" "}
        <Header.Content>
          {patient.name}
          <Header.Subheader>
            <Label.Group color="teal" size="small">
              <Label>
                <Icon name="birthday" />
                DOB
                <Label.Detail>{patient.dateOfBirth}</Label.Detail>
              </Label>
              <Label>
                <Icon name="hashtag" />
                SSN
                <Label.Detail>{patient.ssn}</Label.Detail>
              </Label>
              <Label>
                <Icon name="briefcase" />
                JOB
                <Label.Detail>{patient.occupation}</Label.Detail>
              </Label>
            </Label.Group>
          </Header.Subheader>
        </Header.Content>
      </Header>
      <EventList entries={patient.entries?.sort(sortByDate) || []} />
    </div>
  );
};

export default PatientPage;
