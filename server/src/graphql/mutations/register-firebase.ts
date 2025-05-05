import type {Core} from "@strapi/strapi";


export const registerFirebase = (context: { strapi: Core.Strapi, nexus: any }) => {

  const { nexus, strapi } = context

  const { nonNull } = nexus

  return {
    type: nonNull('UsersPermissionsLoginPayload'),
    description: 'Register a user with Firebase ID Token',
    async resolve(parent, args, context) {

      if (context.state?.auth?.strategy.name !== 'firebase-auth-strategies') {
        throw new Error('Firebase ID Token is missing or invalid');
      }

      const userId = context.state?.auth?.credentials?.id
      const firUser = context.state?.auth?.credentials?.firUser

      const profile = {
        username: `firebase.uid.${firUser.uid}`,
        email: firUser.email,
        confirmed: true,
      }

      if (!userId) {
        // New user

        const advancedSettings: any = await strapi
          .store({ type: 'plugin', name: 'users-permissions', key: 'advanced' })
          .get();

        // Retrieve default role.
        const defaultRole = await strapi.db
          .query('plugin::users-permissions.role')
          .findOne({ where: { type: advancedSettings.default_role } });

        // Create the new user.
        const newUser = {
          ...profile,
          role: defaultRole.id,
        };
        const createdUser = await strapi.db
          .query('plugin::users-permissions.user')
          .create({ data: newUser });
        return {
          user: createdUser,
          jwt: '',
        };
      } else {
        // Existing user -> Update profile
        const updatedUser = await strapi.db
          .query('plugin::users-permissions.user')
          .update({
            where: {id: userId},
            data: {
              ...profile,
            },
            populate: ['role'],
          })
        return {
          user: updatedUser,
          jwt: '',
        };
      }
    },
  }
}