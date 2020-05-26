import React, { useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  Header,
  Table,
  Button,
  Segment,
  PaginationProps,
  Icon,
  Responsive,
  Sticky,
  Ref,
  GridColumn,
  Placeholder,
  Loader,
} from "semantic-ui-react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { startCase, words, upperFirst } from "lodash";

import { PatientFormValues } from "../AddPatientModal/AddPatientForm";
import AddPatientModal from "../AddPatientModal";
import { Patient, Page } from "../types";
import { apiBaseUrl } from "../constants";
import { HealthRatingBar, Pager } from "../components";
import { useStateValue, setPatientList } from "../state";

const PatientListPage: React.FC = () => {
  const [{ patients, itemCount, itemsPerPage }, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation<{ forceRefresh: boolean }>();
  const history = useHistory();
  const tableRef = useRef();
  const openModal = (): void => setModalOpen(true);

  const query = useMemo(() => new URLSearchParams(location.search), [
    location.search,
  ]);

  React.useEffect(() => {
    const fetchPatientList = async () => {
      const page = query.get("pp") || 1;
      try {
        const { data: patientListFromApi } = await axios.get<Page<Patient>>(
          `${apiBaseUrl}/patients?pp=${page}`
        );
        dispatch(setPatientList(patientListFromApi));
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    };
    fetchPatientList();
  }, [dispatch, query, location]);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewPatient = async (values: PatientFormValues) => {
    try {
      await axios.post<Patient>(`${apiBaseUrl}/patients`, values);
      closeModal();
      history.push("/");
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data.error);
    }
  };

  const onPageChange = (
    e: React.SyntheticEvent<HTMLAnchorElement, MouseEvent>,
    data: PaginationProps
  ) => {
    history.push(`?pp=${data.activePage}`);
  };

  return (
    <div className="App">
      <Header as="h2">
        <Icon name="address book outline" />
        Patients
      </Header>

      <Ref innerRef={tableRef}>
        <GridColumn>
          <Loader active={loading}>Loading</Loader>
          <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
            <div className="patient-list__add-patient-btn-wrapper">
              <Sticky
                context={tableRef}
                offset={95}
                styleElement={{ width: "auto", right: 20 }}
              >
                <Button
                  disabled={loading}
                  circular
                  size="big"
                  primary
                  icon="user plus"
                  onClick={() => openModal()}
                ></Button>
              </Sticky>
            </div>
          </Responsive>
          {loading ? (
            <Table celled striped compact attached="top">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell collapsing>Gender</Table.HeaderCell>
                  <Table.HeaderCell>Occupation</Table.HeaderCell>
                  <Table.HeaderCell collapsing>Health Rating</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Array(10)
                  .fill(null)
                  .map((_, i) => (
                    <Table.Row key={i}>
                      {Array(4)
                        .fill(null)
                        .map((_, j) => (
                          <Table.Cell key={j}>
                            <Placeholder>
                              <Placeholder.Line />
                            </Placeholder>
                          </Table.Cell>
                        ))}
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          ) : (
            <Table celled striped compact attached="top">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell collapsing>Gender</Table.HeaderCell>
                  <Table.HeaderCell>Occupation</Table.HeaderCell>
                  <Table.HeaderCell collapsing>Health Rating</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {Object.values(patients).map((patient: Patient) => (
                  <Table.Row key={patient.id}>
                    <Table.Cell>
                      <Link
                        to={`/patients/${patient.id}`}
                        className="word-break"
                      >
                        {words(patient.name, /\w+/g).map(upperFirst).join(" ")}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{startCase(patient.gender)}</Table.Cell>
                    <Table.Cell className="word-break">
                      {startCase(patient.occupation)}
                    </Table.Cell>
                    <Table.Cell>
                      {Number.isInteger(
                        patient.recentHealthCheckRating as number
                      ) ? (
                        <HealthRatingBar
                          rating={patient.recentHealthCheckRating as number}
                        />
                      ) : (
                        "Not Available"
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
          <Responsive minWidth={Responsive.onlyMobile.maxWidth}>
            <Segment clearing attached="bottom">
              <Button
                primary
                size="small"
                animated="vertical"
                floated="right"
                onClick={() => openModal()}
                disabled={loading}
              >
                <Button.Content visible>
                  <Icon name="user plus" />
                  New Patient
                </Button.Content>
                <Button.Content hidden>
                  <Icon name="dollar" color="yellow" fitted />
                  <Icon name="dollar" color="yellow" fitted />
                  <Icon name="dollar" color="yellow" fitted />
                </Button.Content>
              </Button>
            </Segment>
          </Responsive>
        </GridColumn>
      </Ref>
      <AddPatientModal
        modalOpen={modalOpen}
        onSubmit={submitNewPatient}
        error={error}
        onClose={closeModal}
      />
      <Segment textAlign="center" basic>
        <Pager
          onPageChange={onPageChange}
          activePage={Number(query.get("pp")) || 1}
          totalPages={Math.ceil(itemCount / itemsPerPage) || ""}
          disabled={loading}
        />
      </Segment>
    </div>
  );
};

export default PatientListPage;
