import React from 'react';
import { Card, CardHeader, CardContent } from '@material-ui/core';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Formik } from 'formik';
import history from 'utils/history';
import paths from 'constants/paths';
import { AgencyForm } from 'components';

const CREATE_AGENCY = gql`
  mutation CreateAgency($name: String!) {
    createAgency(name: $name) {
      name
    }
  }
`;

const initialValues = {
  name: '',
};

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  }
  return errors;
};

const NewAgency = () => {
  const [createAgency] = useMutation(CREATE_AGENCY);

  return (
    <Card>
      <CardHeader title="New Agency" />
      <CardContent>
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={async (values, { setSubmitting }) => {
            await createAgency({ variables: { name: values.name } });
            setSubmitting(false);
            history.push(paths.agencies);
          }}
        >
          {({ submitForm, isSubmitting }) => (
            <AgencyForm isSubmitting={isSubmitting} submitForm={submitForm} />
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default NewAgency;
