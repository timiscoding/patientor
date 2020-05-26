import React from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Container, Menu } from "semantic-ui-react";

import PatientListPage from "./PatientListPage";
import PatientPage from "./PatientPage";
const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Menu fixed="top" inverted color="blue" size="large" borderless>
          <Container>
            <Menu.Item
              active
              header
              as={Link}
              to="/"
              name="Patientor"
              icon="doctor"
            />
          </Container>
        </Menu>
        <Container className="page-content">
          <Switch>
            <Route exact path="/" render={() => <PatientListPage />} />
            <Route path="/patients/:id" component={PatientPage} />
          </Switch>
        </Container>
      </Router>
    </div>
  );
};

export default App;
