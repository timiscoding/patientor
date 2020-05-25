import React, { useContext } from "react";
import { Table, List, Icon, Accordion } from "semantic-ui-react";
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
      >
        <Icon name="dropdown" />
        <List horizontal relaxed="very">
          <List.Item>{entry.date}</List.Item>
          <List.Item>{camelCaseToSpace(entry.type)}</List.Item>
        </List>
      </Accordion.Title>
      <div>
        <AnimateHeight height={activeIndex === index ? "auto" : 0}>
          <Table compact definition singleLine>
            <Table.Body>
              <Table.Row>
                <Table.Cell collapsing>Description</Table.Cell>
                <Table.Cell>{entry.description}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Specialist</Table.Cell>
                <Table.Cell>{entry.specialist}</Table.Cell>
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
