import React from 'react';
import gql from 'graphql-tag';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { useQuery, useMutation } from '@apollo/react-hooks';

const GET_DATA = gql`
  query {
    clients {
      id
      approvedAt
      user {
        fullName
      }
      fullName
    }
  }
`;

const APPROVE_CLIENT = gql`
  mutation ApproveClient($id: Int!) {
    approveClient(id: $id) {
      id
      approvedAt
    }
  }
`;

const UNAPPROVE_CLIENT = gql`
  mutation UnapproveClient($id: Int!) {
    unapproveClient(id: $id) {
      id
      approvedAt
    }
  }
`;

const Clients = () => {
  const [approveClient] = useMutation(APPROVE_CLIENT);
  const [unapproveClient] = useMutation(UNAPPROVE_CLIENT);
  const { loading, data, refetch } = useQuery(GET_DATA, {
    fetchPolicy: 'cache-and-network',
  });

  const approve = async (variables) => {
    await approveClient({ variables });
    refetch();
  };

  const unapprove = async (variables) => {
    await unapproveClient({ variables });
    refetch();
  };

  if (loading) return <CircularProgress />;

  return (
    <Card style={{ height: '100%', overflow: 'auto' }}>
      <CardHeader title="Clients" />
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client Name</TableCell>
                <TableCell>Requester Name</TableCell>
                <TableCell>Approved At</TableCell>
                <TableCell>Options</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.fullName}</TableCell>
                  <TableCell>{client.user.fullName}</TableCell>
                  <TableCell>{client.approvedAt}</TableCell>
                  <TableCell>
                    {client.approvedAt ? (
                      <Button onClick={() => unapprove(client)}>
                        Unapprove
                      </Button>
                    ) : (
                      <Button onClick={() => approve(client)}>Approve</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default Clients;
