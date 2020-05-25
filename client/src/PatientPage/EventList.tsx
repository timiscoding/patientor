import React, { useState, useMemo } from "react";
import { Entry, EntryType } from "../types";
import {
  Header,
  Segment,
  Icon,
  AccordionTitleProps,
  Accordion,
  PaginationProps,
  Divider,
} from "semantic-ui-react";
import { useLocation, useHistory } from "react-router-dom";
import { useStateValue } from "../state";
import { assertNever } from "../utils";
import {
  OccupationalHealthcareEvent,
  HealthCheckEvent,
  HospitalEvent,
  Pager,
} from "../components";

const EntryDetails: React.FC<{ entry: Entry; index: number }> = ({
  entry,
  index,
}) => {
  switch (entry.type) {
    case EntryType.HealthCheck:
      return <HealthCheckEvent entry={entry} index={index} />;
    case EntryType.Hospital:
      return <HospitalEvent entry={entry} index={index} />;
    case EntryType.OccupationalHealthcare:
      return <OccupationalHealthcareEvent entry={entry} index={index} />;
    default:
      return assertNever(entry);
  }
};

export const AccordionContext = React.createContext({
  activeIndex: 0,
  handleClick: (
    _e: React.MouseEvent,
    _titleProps: AccordionTitleProps
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  ): void => {},
});

const EventList: React.FC<{ entries: Entry[] }> = ({ entries }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { search } = useLocation();
  const history = useHistory();
  const [{ itemCount, itemsPerPage }] = useStateValue();
  const query = useMemo(() => new URLSearchParams(search), [search]);

  const handleClick = (
    e: React.MouseEvent,
    titleProps: AccordionTitleProps
  ) => {
    const { index } = titleProps;
    const newIndex = index === activeIndex ? -1 : (index as number);
    setActiveIndex(newIndex);
  };

  const onPageChange = (
    e: React.SyntheticEvent<HTMLAnchorElement, MouseEvent>,
    data: PaginationProps
  ) => {
    history.push(`?ep=${data.activePage}`);
  };
  if (entries.length === 0) {
    return (
      <Segment attached placeholder>
        <Header as="h2" icon>
          <Icon name="doctor" />
          No patient history has been recorded yet
        </Header>
      </Segment>
    );
  }

  return (
    <div>
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
      <Divider hidden />
      <Segment textAlign="center" basic>
        <Pager
          onPageChange={onPageChange}
          activePage={Number(query.get("ep")) || 1}
          totalPages={Math.ceil(itemCount / itemsPerPage) || ""}
        />
      </Segment>
    </div>
  );
};

export default EventList;
