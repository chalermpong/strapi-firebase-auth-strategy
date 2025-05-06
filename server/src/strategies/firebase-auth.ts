import {DecodedIdToken, getAuth} from 'firebase-admin/auth'
const USER_PERMISSIONS_PLUGIN = 'plugin::users-permissions.user'

const getUserPermissionsService = (name: string) => {
  return strapi.plugin('users-permissions').service(name)
}

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

export const firebaseAuthStrategy = {
  name: 'firebase-auth-strategies',
  authenticate: async (ctx) => {
    let firUser: DecodedIdToken
    try {
      firUser = await getToken(ctx)
    } catch {
      return {authenticated: false}
    }

    const user = await strapi.db.query(USER_PERMISSIONS_PLUGIN)
      .findOne({where: {username: `firebase.uid.${firUser.uid}`}, populate: ['role']})

    if (!user) {
      return {
        authenticated: true,
        credentials: {firUser},
      }
    }
    // Fetch user's permissions
    const permissions = await getUserPermissionsService('permission').findRolePermissions(user.role.id)
    const contentPermissions = permissions.map(getUserPermissionsService('permission').toContentAPIPermission)

    // Generate an ability (content API engine) based on the given permissions
    const ability = await strapi.contentAPI.permissions.engine.generateAbility(contentPermissions)

    ctx.state.user = user

    return {
      authenticated: true,
      credentials: {
        ...user,
        firUser,
      },
      ability,
    }
  },
}
