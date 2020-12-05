module.exports = {
  roles: (InternalUser) => InternalUser.getInternalUserRoles(),
  user: (InternalUser) => InternalUser.getUser(),
};
