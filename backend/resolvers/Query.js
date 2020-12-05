module.exports = {
  agencies: (_, __, { models }) => models.Agency.findAll(),
  agency: (_, { id }, { models }) => models.Agency.findByPk(id),
  clients: (_, __, { models }) => models.Client.findAll(),
  roles: (_, __, { models }) => models.Role.findAll(),
  internalRoles: (_, __, { models }) =>
    models.Role.findAll({ where: { isInternalRole: true } }),
  internalUsers: (_, __, { models }) =>
    models.InternalUser.findAll({ include: models.User }),
  agencyRoles: (_, __, { models }) =>
    models.Role.findAll({ where: { isAgencyRole: true } }),
  user: (_, { id }, { models }) => models.User.findByPk(id),
};
