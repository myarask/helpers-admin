import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CircularProgress,
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
import { TextField } from 'formik-material-ui';
import { Formik, Field, Form } from 'formik';
import DeleteIcon from '@material-ui/icons/Delete';
import * as Yup from 'yup';
import { useQuery, useMutation, gql } from '@apollo/client';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .required('No password provided.')
    .min(8, '8 Character Minimum')
    .matches(/[a-z]/, 'at least one lowercase chararacter')
    .matches(/[A-Z]/, 'at least one uppercase character')
    .matches(/[1-9]/, 'at least one digit'),
});

const DATA = gql`
  query {
    internalRoles {
      id
      name
    }
    internalUsers {
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
`;

const CREATE_INTERNAL_USER = gql`
  mutation CreateInternalUser($email: String!, $password: String!) {
    createInternalUser(email: $email, password: $password) {
      id
    }
  }
`;

const DELETE_INTERNAL_USER = gql`
  mutation DeleteInternalUser($internalUserId: Int!) {
    deleteInternalUser(internalUserId: $internalUserId)
  }
`;

const SET_INTERNAL_USER_ROLES = gql`
  mutation SetInternalUserRoles($internalUserId: Int!, $roleIds: [Int]!) {
    setInternalUserRoles(internalUserId: $internalUserId, roleIds: $roleIds) {
      id
    }
  }
`;

const Users = () => {
  const [users, setUsers] = useState();
  const [roles, setRoles] = useState();
  const [idForDelete, setIdForDelete] = useState();

  const [setInternalUserRoles] = useMutation(SET_INTERNAL_USER_ROLES);
  const [createInternalUser] = useMutation(CREATE_INTERNAL_USER);
  const [deleteInternalUser] = useMutation(DELETE_INTERNAL_USER);

  const { loading, data, error } = useQuery(DATA);

  useEffect(() => {
    if (!data) return;

    // eslint-disable-next-line
    const users = {};
    data.internalUsers.forEach((user) => {
      users[user.id] = {
        ...user.user,
        roleIds: user.roles.map((role) => role.roleId),
      };
    });
    setUsers(users);

    // eslint-disable-next-line
    const roles = data.internalRoles.map((role) => (
      <MenuItem key={role.id} value={role.id}>
        {role.name}
      </MenuItem>
    ));
    setRoles(roles);
  }, [data]);

  const handleRoleChange = async (event) => {
    const { name, value: roleIds } = event.target;
    const internalUserId = Number(name);

    setUsers((prev) => ({
      ...prev,
      [internalUserId]: {
        ...prev[internalUserId],
        roleIds,
      },
    }));

    const variables = { internalUserId, roleIds };
    await setInternalUserRoles({ variables });
  };

  const handleSubmit = async (values) => {
    const resp = await createInternalUser({
      variables: values,
    });

    setUsers((prev) => ({
      ...prev,
      [resp.data.createInternalUser.id]: {
        ...values,
        roleIds: [],
      },
    }));
  };

  const handleClickDelete = (id) => {
    setIdForDelete(Number(id));
  };

  const handleConfirmDelete = () => {
    setIdForDelete(null);
    deleteInternalUser({ variables: { internalUserId: idForDelete } });
    setUsers((prev) => {
      const { [idForDelete]: removed, ...rest } = prev;
      return rest;
    });
  };

  if (error) return <Typography color="error">Error</Typography>;
  if (loading || !users || !roles) return <CircularProgress />;

  return (
    <>
      <Card>
        <CardHeader title="Internal Users" />
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
            <>Are you sure you want to remove </>
            <>{(users[idForDelete] || {}).email}</>
            <> as an internal user?</>
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

export default Users;
