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
  List,
  SemanticCOLORS,
  Responsive,
  ResponsiveProps,
} from "semantic-ui-react";
import axios from "axios";
import { useAsyncCallback } from "react-async-hook";
import { FormikHelpers } from "formik";
import startCase from "lodash/startCase";

import { useStateValue, updatePatient, addEntry } from "../state";
import {
  PatientEntriesPage,
  Gender,
  NewEntry,
  Entry,
  FormSubmitStatus,
  HealthCheckRating,
} from "../types";
import EventList from "./EventList";
import { apiBaseUrl } from "../constants";
import AddEventForm, { baseVals } from "../components/AddEventForm";

const iconsByGender: Record<
  Gender,
  { name: SemanticICONS; color: "blue" | "pink" | "grey" }
> = {
  [Gender.Male]: { name: "man", color: "blue" },
  [Gender.Female]: { name: "woman", color: "pink" },
  [Gender.Other]: { name: "other gender", color: "grey" },
};

const recentHealthRating: Record<
  HealthCheckRating | "unknown",
  {
    content: string;
    color: SemanticCOLORS;
  }
> = {
  unknown: { content: "Not Available", color: "grey" },
  [HealthCheckRating.Healthy]: {
    content: startCase(HealthCheckRating[HealthCheckRating.Healthy]),
    color: "green",
  },
  [HealthCheckRating.LowRisk]: {
    content: startCase(HealthCheckRating[HealthCheckRating.LowRisk]),
    color: "blue",
  },
  [HealthCheckRating.HighRisk]: {
    content: startCase(HealthCheckRating[HealthCheckRating.HighRisk]),
    color: "orange",
  },
  [HealthCheckRating.CriticalRisk]: {
    content: startCase(HealthCheckRating[HealthCheckRating.CriticalRisk]),
    color: "red",
  },
};

const PatientPage: React.FC = () => {
  const [{ patients }, dispatch] = useStateValue();
  const [fullPatient, setFullPatient] = useState<boolean>(false);
  const [mobile, setMobile] = useState<boolean>(false);
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

  const onWidthChange = (e: React.SyntheticEvent, data: ResponsiveProps) => {
    const maxWidth = Responsive.onlyMobile.maxWidth as number;
    setMobile(data.width < maxWidth);
  };

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
        content: <EventList entries={patient.entries || []} />,
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
      <Responsive
        {...Responsive.onlyMobile}
        onUpdate={onWidthChange}
        fireOnMount
      />
      <Segment attached="top">
        <Header size={mobile ? "medium" : "large"} className="word-break">
          <Icon {...iconsByGender[patient.gender]} />
          {patient.name}
        </Header>
        <Label.Group size="small">
          <List divided verticalAlign="middle" size="tiny">
            <List.Item>
              <Label horizontal basic>
                <Icon name="heart" color="red" />
                Last Health Check
              </Label>
              <Label
                horizontal
                basic
                {...recentHealthRating[
                  patient.recentHealthCheckRating ?? "unknown"
                ]}
              />
            </List.Item>
            <List.Item>
              <Label horizontal basic>
                <Icon name="birthday" color="brown" />
                DOB
              </Label>
              {patient.dateOfBirth}
            </List.Item>
            <List.Item>
              <Label horizontal basic>
                <Icon name="hashtag" />
                SSN
              </Label>
              {patient.ssn}
            </List.Item>
            <List.Item className="word-break">
              <Label horizontal basic>
                <Icon name="briefcase" color="green" />
                JOB
              </Label>
              {patient.occupation}
            </List.Item>
          </List>
        </Label.Group>
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
