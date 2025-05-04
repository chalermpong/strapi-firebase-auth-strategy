import type { Core } from '@strapi/strapi'
import { initializeApp } from 'firebase-admin/app'
import { credential } from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'
import { errors } from '@strapi/utils'

const PLUGIN_ID = 'plugin::firebase-auth-plugin'
const USER_PERMISSIONS_PLUGIN = 'plugin::users-permissions.user'


const register = ({ strapi }: { strapi: Core.Strapi }) => {

  const serviceAccount = strapi.config.get(`${PLUGIN_ID}.serviceAccount`)
  strapi.log.info('Firebase service account', serviceAccount)
  initializeApp({
    credential: credential.cert(serviceAccount),
  });

  const getUserPermissionsService = (name: string) => {
    return strapi.plugin('users-permissions').service(name);
  };

  const getToken = async (ctx)=> {
    let token: string

    if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
      const parts = ctx.request.header.authorization.split(/\s+/)

      if (parts[0].toLowerCase() !== 'bearer' || parts.length !== 2) {
        return null
      }

      token = parts[1]
    } else {
      return null
    }

    return verify(token)
  }

  const verify = async (token: string) => {
    return getAuth().verifyIdToken(token)
  }

  strapi.get('auth').register('content-api', {
    name: 'firebase-auth-strategies',
    authenticate: async (ctx) => {
      let uid: string
      try {
        const firUser = await getToken(ctx)
        uid = firUser.uid
        console.log(`Hello fir.uid:${uid}`)
      } catch (err) {
        return { authenticated: false }
      }

      const user = await strapi.db.query(USER_PERMISSIONS_PLUGIN)
          .findOne({ where: { username: `firebase.uid.${uid}` }, populate: ['role'] })

      if (!user) {
        throw new errors.ApplicationError('User not found. Please register first.')
      }
      // Fetch user's permissions
      const permissions = getUserPermissionsService('permission').findRolePermissions(user.role.id)
        .map(getUserPermissionsService('permission').toContentAPIPermission)

      // Generate an ability (content API engine) based on the given permissions
      const ability = await strapi.contentAPI.permissions.engine.generateAbility(permissions);

      ctx.state.user = user;

      return {
        authenticated: true,
        credentials: user,
        ability,
      };
    },
  });

};

export default register;
