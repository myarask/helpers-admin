import React, { useState } from 'react';
import gql from 'graphql-tag';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import paths from 'constants/paths';

const DELETE_AGENCY = gql`
  mutation DeleteAgency($id: ID!) {
    deleteAgency(id: $id)
  }
`;

const Agency = () => {
  const { id } = useParams();
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const variables = { id };
  const [deleteAgency] = useMutation(DELETE_AGENCY, { variables });

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteAgency();
    history.push(paths.agencies);
  };

  return (
    <>
      <Card>
        <CardHeader title="Advanced" />
        <CardContent>
          <Button
            color="primary"
            size="small"
            variant="contained"
            onClick={() => setIsOpen(true)}
          >
            Delete Agency
          </Button>
        </CardContent>
      </Card>

      <Dialog onClose={() => setIsOpen(false)} open={isOpen}>
        <DialogTitle>Are you sure you want to delete this agency?</DialogTitle>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Agency;
