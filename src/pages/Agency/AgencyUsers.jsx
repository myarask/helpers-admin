import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Dialog,
  DialogTitle,
  DialogActions,
  FormControl,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Select,
  DialogContent,
  DialogContentText,
  Typography,
} from '@material-ui/core';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { TextField } from 'formik-material-ui';
import { Loading } from 'components';
import DeleteIcon from '@material-ui/icons/Delete';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .required('No password provided.')
    .min(8, '8 Character Minimum')
    .matches(/[a-z]/, 'at least one lowercase chararacter')
    .matches(/[A-Z]/, 'at least one uppercase character')
    .matches(/[1-9]/, 'at least one digit'),
});

const CREATE_AGENCY_USER = gql`
  mutation CreateAgencyUser(
    $email: String!
    $agencyId: Int!
    $password: String!
  ) {
    createAgencyUser(email: $email, agencyId: $agencyId, password: $password) {
      id
    }
  }
`;

const GET_AGENCY = gql`
  query($id: ID!) {
    agencyRoles {
      id
      name
    }
    agency(id: $id) {
      users {
        id
        user {
          email
          fullName
        }
        roles {
          roleId
        }
      }
    }
  }
`;

const SET_AGENCY_USER_ROLES = gql`
  mutation SetAgencyUserRoles($agencyUserId: Int!, $roleIds: [Int]!) {
    setAgencyUserRoles(agencyUserId: $agencyUserId, roleIds: $roleIds) {
      id
    }
  }
`;

const DELETE_AGENCY_USER = gql`
  mutation DeleteAgencyUser($agencyUserId: Int!) {
    deleteAgencyUser(agencyUserId: $agencyUserId)
  }
`;

const Agency = () => {
  const { id } = useParams();

  const [users, setUsers] = useState();
  const [roles, setRoles] = useState();
  const [idForDelete, setIdForDelete] = useState();

  const options = { variables: { id } };
  const { loading, data, error } = useQuery(GET_AGENCY, options);
  const [createAgencyUser] = useMutation(CREATE_AGENCY_USER);
  const [deleteAgencyUser] = useMutation(DELETE_AGENCY_USER);
  const [setAgencyUserRoles] = useMutation(SET_AGENCY_USER_ROLES);

  useEffect(() => {
    if (!data) return;

    // eslint-disable-next-line
    const users = {};
    data.agency.users.forEach((user) => {
      users[user.id] = {
        ...user.user,
        roleIds: user.roles.map((role) => role.roleId),
      };
    });
    setUsers(users);

    // eslint-disable-next-line
    const roles = data.agencyRoles.map((role) => (
      <MenuItem key={role.id} value={role.id}>
        {role.name}
      </MenuItem>
    ));
    setRoles(roles);
  }, [data]);

  const handleConfirmDelete = () => {
    setIdForDelete(null);
    deleteAgencyUser({ variables: { agencyUserId: idForDelete } });
    setUsers((prev) => {
      const { [idForDelete]: removed, ...rest } = prev;
      return rest;
    });
  };

  const handleRoleChange = async (event) => {
    const { name, value: roleIds } = event.target;
    const agencyUserId = Number(name);

    setUsers((prev) => ({
      ...prev,
      [agencyUserId]: {
        ...prev[agencyUserId],
        roleIds,
      },
    }));

    const variables = { agencyUserId, roleIds };
    await setAgencyUserRoles({ variables });
  };

  const handleClickDelete = (agencyUserId) => {
    setIdForDelete(Number(agencyUserId));
  };

  const handleSubmit = async (values) => {
    const resp = await createAgencyUser({
      variables: { ...values, agencyId: Number(id) },
    });

    setUsers((prev) => ({
      ...prev,
      [resp.data.createAgencyUser.id]: {
        ...values,
        roleIds: [],
      },
    }));
  };

  if (error) return <Typography color="error">Error</Typography>;
  if (loading || !users || !roles) return <Loading />;

  return (
    <>
      <Card>
        <CardHeader title="Agency Users" />
        <CardContent>
          <List>
            {Object.entries(users).map(([key, user]) => (
              <ListItem key={key}>
                <ListItemText primary={user.fullName} secondary={user.email} />
                <FormControl style={{ width: '300px' }}>
                  <Select
                    value={user.roleIds}
                    multiple
                    name={key}
                    onChange={handleRoleChange}
                  >
                    {roles}
                  </Select>
                </FormControl>
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => handleClickDelete(key)}
                    id={key}
                    edge="end"
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
        <CardContent>
          <Typography>New User</Typography>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ submitForm, isSubmitting }) => (
              <Form>
                <Field
                  fullWidth
                  component={TextField}
                  name="email"
                  label="Email"
                  required
                />
                <Field
                  fullWidth
                  component={TextField}
                  type="password"
                  name="password"
                  label="Password"
                  required
                />
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
            )}
          </Formik>
        </CardContent>
      </Card>

      <Dialog onClose={() => setIdForDelete(null)} open={Boolean(idForDelete)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <>Are you sure you want to delete </>
            <>{(users[idForDelete] || {}).email}</>
            <> from this agency?</>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => setIdForDelete(null)}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Agency;
