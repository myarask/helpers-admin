import React from 'react';
import { Card, CardHeader, CardContent, Typography } from '@material-ui/core';
import { Formik } from 'formik';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { AgencyForm, Loading } from 'components';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
});

const GET_AGENCY = gql`
  query($id: ID!) {
    agency(id: $id) {
      name
    }
  }
`;

const UPDATE_AGENCY = gql`
  mutation UpdateAgency($name: String!, $id: ID!) {
    updateAgency(name: $name, id: $id) {
      name
    }
  }
`;

const Agency = () => {
  const { id } = useParams();

  const variables = { id };
  const options = { variables };
  const { loading, data, error } = useQuery(GET_AGENCY, options);

  const [updateAgency] = useMutation(UPDATE_AGENCY);

  const handleSubmit = (values) => {
    return updateAgency({ variables: { ...values, id } });
  };

  if (error) return <Typography color="error">Error</Typography>;
  if (loading) return <Loading />;

  return (
    <Card>
      <CardHeader title="Agency Details" />
      <CardContent>
        <Formik
          initialValues={data.agency}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(props) => <AgencyForm {...props} />}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default Agency;
