const rolesById = {
  1: 'Owner',
  2: 'Admin',
  3: 'Inspector',
  4: 'Caregiver',
  5: 'Caretaker',
};

const directiveResolvers = {
  hasRole: async (next, _, { roles }, { user, models }) => {
    const User = await models.User.findOne({
      where: { auth0Id: user.sub },
      include: {
        model: models.InternalUser,
        include: models.InternalUserRole,
      },
    });

    const { InternalUser } = User.dataValues;
    const { InternalUserRoles } = InternalUser.dataValues;
    const userRoles = InternalUserRoles.map(({ roleId }) => rolesById[roleId]);

    const hasRole = userRoles.some((userRole) => roles.includes(userRole));

    if (hasRole) {
      return next();
    }
    throw new Error('Incorrect role');
  },
};

module.exports = { directiveResolvers };
