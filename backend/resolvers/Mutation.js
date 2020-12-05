const createAuth0User = async ({ auth0, models, user, password }) => {
  const payload = {
    connection: 'Username-Password-Authentication',
    email: user.email,
    password,
    verify_email: true,
  };

  const { data } = await auth0.post('users', payload);
  models.User.update({ auth0Id: data.user_id }, { where: { id: user.id } });
  // TODO: force user to change password
};

const updateAuth0User = async (auth0, user, patchNewMetaData = {}) => {
  const { data } = await auth0.get(`users/${user.auth0Id}`);
  const payload = {
    user_metadata: {
      ...data.user_metadata,
      roleIdsByAgency: {
        ...data.user_metadata.roleIdsByAgency,
        ...patchNewMetaData.roleIdsByAgency,
      },
    },
  };
  await auth0.patch(`users/${user.auth0Id}`, payload);
};

module.exports = {
  approveClient: async (_, { id }, { models }) => {
    await models.Client.update(
      { approvedAt: models.sequelize.literal('CURRENT_TIMESTAMP') },
      { where: { id } }
    );
    return models.Client.findOne({ id });
  },
  unapproveClient: async (_, { id }, { models }) => {
    await models.Client.update({ approvedAt: null }, { where: { id } });
    return models.Client.findOne({ id });
  },
  createAgency: (_, { name }, { models }) => models.Agency.create({ name }),
  async createAgencyUser(_, { email, agencyId, password }, { models, auth0 }) {
    const [user] = await models.User.findOrCreate({ where: { email } });
    const agencyUser = await models.AgencyUser.create({
      userId: user.id,
      agencyId,
    });

    if (!user.auth0Id) {
      await createAuth0User({ auth0, models, user, password });
    }

    return agencyUser;
  },
  async createInternalUser(_, { email, password }, { models, auth0 }) {
    const [user] = await models.User.findOrCreate({ where: { email } });
    const internalUser = await models.InternalUser.create({
      userId: user.id,
    });

    if (!user.auth0Id) {
      await createAuth0User({ auth0, models, user, password });
    }

    return internalUser;
  },
  deleteAgencyUser: (_, { agencyUserId }, { models }) => {
    return models.AgencyUser.destroy({ where: { id: agencyUserId } });
  },
  deleteInternalUser: (_, { internalUserId }, { models }) => {
    return models.InternalUser.destroy({ where: { id: internalUserId } });
  },
  async updateAgency(_, { name, id }, { models }) {
    // TO DO: check if the user has permissions to update an agency
    const newAgency = await models.Agency.update(
      { name },
      { returning: true, plain: true, where: { id } }
    );

    return newAgency[1].dataValues;
  },
  async deleteAgency(_, { id }, { models }) {
    // TO DO: check if the user has permissions to delete an agency
    return models.Agency.destroy({ where: { id } });
  },
  async setAgencyUserRoles(_, { agencyUserId, roleIds }, { models, auth0 }) {
    // TO DO: check if the user has permissions to change agency user roles
    const conditions = { agencyUserId };

    await models.AgencyUserRole.destroy({ where: conditions });

    const agencyUserRoles = roleIds.map((roleId) => ({
      ...conditions,
      roleId,
    }));

    const options = { returning: true };

    const AgencyUserRole = await models.AgencyUserRole.bulkCreate(
      agencyUserRoles,
      options
    );

    // update auth0 meta data example
    // [ { agencyUserId: 82, roleId: 4 }, { agencyUserId: 82, roleId: 1 } ]

    const agencyUser = await models.AgencyUser.findByPk(agencyUserId);
    const user = await models.User.findByPk(agencyUser.userId);

    const auth0MetaData = {
      roleIdsByAgency: {
        [agencyUser.agencyId]: roleIds,
      },
    };

    await updateAuth0User(auth0, user, auth0MetaData);

    return AgencyUserRole;
  },
  async setInternalUserRoles(_, { internalUserId, roleIds }, { models }) {
    // TO DO: check if the user has permissions to change internal user roles
    const conditions = { internalUserId };

    await models.InternalUserRole.destroy({ where: conditions });

    const internalUserRoles = roleIds.map((roleId) => ({
      ...conditions,
      roleId,
    }));

    const options = { returning: true };

    return models.InternalUserRole.bulkCreate(internalUserRoles, options);
  },
};
