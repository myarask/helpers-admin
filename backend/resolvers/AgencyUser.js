module.exports = {
  roles: (AgencyUser) => AgencyUser.getAgencyUserRoles(),
  user: (AgencyUser) => AgencyUser.getUser(),
};
