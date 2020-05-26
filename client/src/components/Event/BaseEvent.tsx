import React, { useContext } from "react";
import { Table, Grid, Icon, Accordion } from "semantic-ui-react";
import AnimateHeight from "react-animate-height";
import { Entry } from "../../types";
import Diagnoses from "../Diagnoses";
import { AccordionContext } from "../../PatientPage/EventList";
import { camelCaseToSpace } from "../../utils";

interface Props {
  entry: Entry;
  index: number;
}

const BaseEvent: React.FC<Props> = ({ entry, children, index }) => {
  const { activeIndex, handleClick } = useContext(AccordionContext);
  return (
    <>
      <Accordion.Title
        active={activeIndex === index}
        index={index}
        onClick={handleClick}
        className="base-event__accordion-title"
      >
        <Grid divided>
          <Grid.Row columns={2}>
            <Grid.Column mobile={7} tablet={3} computer={3}>
              <Icon name="dropdown" />
              {entry.date}
            </Grid.Column>
            <Grid.Column>{camelCaseToSpace(entry.type)}</Grid.Column>
          </Grid.Row>
        </Grid>
      </Accordion.Title>
      <div>
        <AnimateHeight height={activeIndex === index ? "auto" : 0}>
          <Table compact definition>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Description</Table.Cell>
                <Table.Cell className="word-break">
                  {entry.description}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Specialist</Table.Cell>
                <Table.Cell className="word-break">
                  {entry.specialist}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Diagnoses</Table.Cell>
                <Table.Cell>
                  <Diagnoses codes={entry.diagnosisCodes || []} />
                </Table.Cell>
              </Table.Row>
              {children}
            </Table.Body>
          </Table>
        </AnimateHeight>
      </div>
    </>
  );
};

export default BaseEvent;
