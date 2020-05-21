import React, { useState, useContext } from "react";
import { Formik, FormikConfig } from "formik";
import { object, string, array, mixed, Schema } from "yup";

import { NewEntry, EntryType, FormSubmitStatus } from "../../types";
import AddEventForm from "./AddEventForm";

export const baseVals = {
  description: "",
  specialist: "",
  diagnosisCodes: [],
  type: "",
} as Partial<NewEntry>;

const baseSchema = object().shape({
  description: string().required("Required field"),
  specialist: string().required("Required field"),
  disagnosisCodes: array().ensure().of(string().required()),
  type: mixed().required("Required field").oneOf(Object.keys(EntryType)),
});

const FormikReinitContext = React.createContext<{
  initEventType(newVals: object, newSchema: { [x: string]: Schema<any> }): void;
}>({ initEventType: () => {} });

export const useFormikReinitContext = () => useContext(FormikReinitContext);

const Form: React.FC<{
  onSubmit: FormikConfig<Partial<NewEntry>>["onSubmit"];
}> = ({ onSubmit }) => {
  const [initialValues, setInitialValues] = useState<Partial<NewEntry>>(
    baseVals
  );
  const [validationSchema, setValidationSchema] = useState<Schema<any>>(
    baseSchema
  );

  const initEventType = (
    newVals: object,
    newSchema: { [x: string]: Schema<any> }
  ): void => {
    setInitialValues({
      ...baseVals,
      ...newVals,
    });
    setValidationSchema(baseSchema.shape(newSchema));
  };

  return (
    <FormikReinitContext.Provider value={{ initEventType }}>
      <Formik
        initialValues={initialValues}
        initialStatus={FormSubmitStatus.Inactive}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        component={AddEventForm}
      />
    </FormikReinitContext.Provider>
  );
};

export default Form;
