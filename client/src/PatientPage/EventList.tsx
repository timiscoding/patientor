import React, { useState } from "react";
import { Entry } from "../types";
import {
  Header,
  Segment,
  Icon,
  AccordionTitleProps,
  Accordion,
} from "semantic-ui-react";
import { assertNever } from "../utils";
import {
  OccupationalHealthcareEvent,
  HealthCheckEvent,
  HospitalEvent,
} from "../components/Event";

const EntryDetails: React.FC<{ entry: Entry; index: number }> = ({
  entry,
  index,
}) => {
  switch (entry.type) {
    case "HealthCheck":
      return <HealthCheckEvent entry={entry} index={index} />;
    case "Hospital":
      return <HospitalEvent entry={entry} index={index} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEvent entry={entry} index={index} />;
    default:
      return assertNever(entry);
  }
};

export const AccordionContext = React.createContext({
  activeIndex: 0,
  handleClick: (
    e: React.MouseEvent,
    titleProps: AccordionTitleProps
  ): void => {},
});

const EventList: React.FC<{ entries: Entry[] }> = ({ entries }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const handleClick = (
    e: React.MouseEvent,
    titleProps: AccordionTitleProps
  ) => {
    const { index } = titleProps;
    const newIndex = index === activeIndex ? -1 : (index as number);
    setActiveIndex(newIndex);
  };

  if (entries.length === 0) {
    return (
      <Segment placeholder>
        <Header as="h2" icon>
          <Icon name="doctor" />
          No patient history has been recorded yet
        </Header>
      </Segment>
    );
  }
  return (
    <div>
      <Header as="h2">History</Header>
      <Accordion styled fluid>
        <AccordionContext.Provider
          value={{
            activeIndex,
            handleClick,
          }}
        >
          {entries.map((entry, i) => (
            <EntryDetails entry={entry} index={i} key={entry.id} />
          ))}
        </AccordionContext.Provider>
      </Accordion>
    </div>
  );
};

export default EventList;
