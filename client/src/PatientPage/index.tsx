import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header, Loader, Icon, SemanticICONS, Label } from "semantic-ui-react";
import axios from "axios";
import { useAsyncCallback } from "react-async-hook";
import { FormikHelpers } from "formik";
import { useStateValue, updatePatient, addEntry } from "../state";
import {
  Patient,
  Gender,
  NewHospitalEntry,
  NewHealthCheckEntry,
  NewOccupationalHealthcareEntry,
  Entry,
} from "../types";
import EventList from "./EventList";
import { sortByDate } from "../utils";
import { apiBaseUrl } from "../constants";
import AddEventForm from "../components/AddEventForm";

const iconsByGender: Record<Gender, SemanticICONS> = {
  [Gender.Male]: "man",
  [Gender.Female]: "woman",
  [Gender.Other]: "other gender",
};

const PatientPage: React.FC = () => {
  const [{ patients }, dispatch] = useStateValue();
  const [fullPatient, setFullPatient] = useState<boolean>(false);
  const { id: patientId } = useParams();
  const postEvent = async (
    entry: NewHospitalEntry,
    formikBag: FormikHelpers<NewHospitalEntry>
  ) => {
    formikBag.setStatus({});
    try {
      const resp = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${patientId}/entries`,
        entry
      );
      formikBag.resetForm({
        status: {
          success: true,
        },
      });
      return resp.data;
    } catch (err) {
      formikBag.setStatus({
        error: true,
      });
      throw err;
    }
  };
  const asyncAddEvent = useAsyncCallback(postEvent);
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

  useEffect(() => {
    if (asyncAddEvent.result) {
      dispatch(addEntry(patientId, asyncAddEvent.result));
    }
  }, [dispatch, asyncAddEvent.result, patientId]);

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
      <AddEventForm onSubmit={asyncAddEvent.execute} />
    </div>
  );
};

export default PatientPage;
