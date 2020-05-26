export const maxInputLengths = {
  patient: {
    name: 100,
    ssn: 30,
    occupation: 100,
  },
  event: {
    description: 500,
    specialist: 50,
    diagnosisCodes: 20,
    hospital: {
      discharge: {
        criteria: 200,
      },
    },
    occupationalHealthcare: {
      employerName: 100,
      sickLeave: {
        startDate: 10,
        endDate: 10,
      },
    },
  },
};
