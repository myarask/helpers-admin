const { gql } = require('apollo-server-express');

module.exports = gql`
  directive @hasRole(roles: [String]) on FIELD | FIELD_DEFINITION

  type User {
    id: Int!
    email: String
    fullName: String
  }

  type InternalUserRole {
    id: Int!
    roleId: Int!
  }

  type AgencyUserRole {
    id: Int!
    roleId: Int!
  }

  type AgencyUser {
    id: Int!
    user: User
    roles: [AgencyUserRole]
  }

  type Client {
    id: Int
    user: User
    approvedAt: String
    fullName: String
    city: String
    country: String
    line1: String
    line2: String
    postalCode: String
    state: String
  }

  type InternalUser {
    id: Int!
    user: User
    roles: [InternalUserRole]
  }

  type Agency {
    id: Int!
    name: String
    users: [AgencyUser]!
  }

  type Role {
    id: Int!
    name: String!
  }

  type Query {
    agencies: [Agency!]!
    agency(id: ID): Agency!
    agencyOwners(agencyId: Int!): [AgencyUser]
    agencyRoles: [Role!]!
    clients: [Client]
    internalRoles: [Role!]!
    internalUsers: [InternalUser]
    roles: [Role!]!
    user(id: ID): User!
  }

  type Mutation {
    approveClient(id: Int!): Client
    unapproveClient(id: Int!): Client

    createAgency(name: String!): Agency @hasRole(roles: ["Admin", "Owner"])

    createAgencyUser(
      email: String!
      agencyId: Int!
      password: String!
    ): AgencyUser @hasRole(roles: ["Admin", "Owner"])

    createInternalUser(email: String!, password: String!): InternalUser
      @hasRole(roles: ["Admin", "Owner"])

    deleteAgencyUser(agencyUserId: Int!): Int
      @hasRole(roles: ["Admin", "Owner"])

    deleteInternalUser(internalUserId: Int!): Int
      @hasRole(roles: ["Admin", "Owner"])

    updateAgency(name: String!, id: ID!): Agency
      @hasRole(roles: ["Admin", "Owner"])

    deleteAgency(id: ID!): Int @hasRole(roles: ["Admin", "Owner"])

    setAgencyUserRoles(agencyUserId: Int!, roleIds: [Int]!): [AgencyUserRole]
      @hasRole(roles: ["Admin", "Owner"])

    setInternalUserRoles(
      internalUserId: Int!
      roleIds: [Int]!
    ): [InternalUserRole] @hasRole(roles: ["Admin", "Owner"])
  }
`;
