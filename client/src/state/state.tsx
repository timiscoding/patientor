import React, { createContext, useContext, useReducer } from "react";
import { Patient, Diagnosis } from "../types";

import { Action, setMobile } from "./reducer";
import { Responsive, ResponsiveProps } from "semantic-ui-react";

export type State = {
  patients: { [id: string]: Patient };
  diagnoses: Diagnosis[];
  itemCount: number;
  itemsPerPage: number;
  mobile: boolean;
};

const initialState: State = {
  patients: {},
  diagnoses: [],
  itemCount: 0,
  itemsPerPage: 0,
  mobile: false,
};

export const StateContext = createContext<[State, React.Dispatch<Action>]>([
  initialState,
  () => initialState,
]);

type StateProviderProps = {
  reducer: React.Reducer<State, Action>;
  children: React.ReactElement;
};

export const StateProvider: React.FC<StateProviderProps> = ({
  reducer,
  children,
}: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onWidthChange = (e: React.SyntheticEvent, data: ResponsiveProps) => {
    const maxWidth = Responsive.onlyMobile.maxWidth as number;
    if (data.width > maxWidth) {
      dispatch(setMobile(false));
    } else {
      dispatch(setMobile(true));
    }
  };

  return (
    <StateContext.Provider value={[state, dispatch]}>
      <Responsive
        {...Responsive.onlyMobile}
        onUpdate={onWidthChange}
        fireOnMount
      />
      {children}
    </StateContext.Provider>
  );
};
export const useStateValue = () => useContext(StateContext);
