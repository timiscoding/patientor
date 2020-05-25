import React, { useMemo, useRef } from "react";
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
  Rail,
  GridColumn,
} from "semantic-ui-react";
import { Link, useLocation, useHistory } from "react-router-dom";

import { PatientFormValues } from "../AddPatientModal/AddPatientForm";
import AddPatientModal from "../AddPatientModal";
import { Patient, Page } from "../types";
import { apiBaseUrl } from "../constants";
import { HealthRatingBar, Pager } from "../components";
import { useStateValue, setPatientList } from "../state";

const PatientListPage: React.FC = () => {
  const [{ patients, itemCount, itemsPerPage }, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();
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
          <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
            <Rail position="right" internal>
              <Sticky context={tableRef} offset={95}>
                <Button
                  floated="right"
                  circular
                  size="big"
                  primary
                  icon="user plus"
                  onClick={() => openModal()}
                ></Button>
              </Sticky>
            </Rail>
          </Responsive>

          <Table celled striped selectable compact attached="top">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell collapsing>Gender</Table.HeaderCell>
                <Table.HeaderCell>Occupation</Table.HeaderCell>
                <Table.HeaderCell collapsing>Health Rating</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {Object.values(patients)
                .reverse()
                .map((patient: Patient) => (
                  <Table.Row key={patient.id}>
                    <Table.Cell>
                      <Link to={`/patients/${patient.id}`}>{patient.name}</Link>
                    </Table.Cell>
                    <Table.Cell>{patient.gender}</Table.Cell>
                    <Table.Cell>{patient.occupation}</Table.Cell>
                    <Table.Cell>
                      {Number.isInteger(
                        patient.recentHealthCheckRating as number
                      ) ? (
                        <HealthRatingBar
                          rating={patient.recentHealthCheckRating as number}
                        />
                      ) : (
                        "Not available"
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>

          <Responsive minWidth={Responsive.onlyMobile.maxWidth}>
            <Segment clearing attached="bottom">
              <Button
                floated="right"
                icon
                primary
                labelPosition="left"
                size="small"
                onClick={() => openModal()}
              >
                <Icon name="user plus" />
                New Patient
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
        />
      </Segment>
    </div>
  );
};

export default PatientListPage;

//TODO sticky add patient button
// TODO make backend work on mobile. baseApiUrl prob needs to be relative
// TODO fix wide entries in mobile
// TODO fix date field height style before edit
// TODO make patient header text smaller on mobile
// TODO limit max characters for input fields
