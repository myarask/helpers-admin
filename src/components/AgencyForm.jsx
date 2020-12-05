import React from 'react';
import { Field, Form } from 'formik';
import { Button, LinearProgress } from '@material-ui/core';
import { TextField } from 'formik-material-ui';

const AgencyForm = ({ isSubmitting, submitForm }) => (
  <Form>
    <Field fullWidth component={TextField} name="name" label="Name" />
    <br />
    {isSubmitting && <LinearProgress />}
    <br />
    <Button
      variant="contained"
      color="primary"
      disabled={isSubmitting}
      onClick={submitForm}
    >
      Submit
    </Button>
  </Form>
);

export default AgencyForm;
