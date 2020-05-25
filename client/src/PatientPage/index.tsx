import React, { useEffect, useState, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Header,
  Loader,
  Icon,
  SemanticICONS,
  Label,
  Tab,
  Segment,
  Accordion,
} from "semantic-ui-react";
import axios from "axios";
import { useAsyncCallback } from "react-async-hook";
import { FormikHelpers } from "formik";
import { useStateValue, updatePatient, addEntry } from "../state";
import {
  PatientEntriesPage,
  Gender,
  NewEntry,
  Entry,
  FormSubmitStatus,
} from "../types";
import EventList from "./EventList";
import { sortByDate } from "../utils";
import { apiBaseUrl } from "../constants";
import AddEventForm, { baseVals } from "../components/AddEventForm";

const iconsByGender: Record<Gender, SemanticICONS> = {
  [Gender.Male]: "man",
  [Gender.Female]: "woman",
  [Gender.Other]: "other gender",
};

const PatientPage: React.FC = () => {
  const [{ patients }, dispatch] = useStateValue();
  const [fullPatient, setFullPatient] = useState<boolean>(false);
  const { id: patientId } = useParams();
  const { search } = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);

  const postEvent = async (
    entry: Partial<NewEntry>,
    formikBag: FormikHelpers<Partial<NewEntry>>
  ) => {
    formikBag.setStatus({});
    try {
      const resp = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${patientId}/entries`,
        entry
      );
      formikBag.resetForm({
        status: FormSubmitStatus.Success,
        values: baseVals,
      });
      return resp.data;
    } catch (err) {
      formikBag.setStatus(FormSubmitStatus.Error);
      throw err;
    }
  };
  const asyncAddEvent = useAsyncCallback(postEvent);
  const patient = patients[patientId];

  useEffect(() => {
    const fetchPatient = async () => {
      const page = query.get("ep") || 1;
      const { data: fullPatient } = await axios.get<PatientEntriesPage>(
        `${apiBaseUrl}/patients/${patientId}?ep=${page}`
      );
      dispatch(updatePatient(fullPatient));
      setFullPatient(true);
    };
    fetchPatient();
  }, [dispatch, search, patientId, query]);

  useEffect(() => {
    if (asyncAddEvent.result) {
      dispatch(addEntry(patientId, asyncAddEvent.result));
    }
  }, [dispatch, asyncAddEvent.result, patientId]);

  if (!fullPatient) {
    return <Loader active>Loading patient...</Loader>;
  }

  const panes = [
    {
      menuItem: { icon: "list", key: "history", content: "History" },
      pane: {
        as: Accordion,
        attached: "bottom",
        key: "history list",
        content: (
          <EventList entries={patient.entries?.sort(sortByDate) || []} />
        ),
      },
    },
    {
      menuItem: { icon: "add circle", key: "add event", content: "Add Event" },
      pane: {
        as: Accordion,
        attached: "bottom",
        key: "add event form",
        content: <AddEventForm onSubmit={asyncAddEvent.execute} />,
      },
    },
  ];
  return (
    <div>
      <Segment attached="top">
        <Header as="h1">
          <Icon.Group size="big">
            <Icon name="user circle" color="grey" />
            <Icon corner name={iconsByGender[patient.gender]} color="red" />
          </Icon.Group>{" "}
          <Header.Content>
            {patient.name}
            <Header.Subheader>
              <Label.Group size="small">
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
      </Segment>
      <Tab
        menu={{ color: "violet", pointing: true }}
        panes={panes}
        renderActiveOnly={false}
      />
    </div>
  );
};

export default PatientPage;
