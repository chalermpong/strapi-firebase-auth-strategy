import type {Core} from '@strapi/strapi'
import {getMutations} from './mutations'

export const registerGraphql = ({strapi}: { strapi: Core.Strapi }) => {
  const extensionService = strapi.plugin('graphql').service('extension')

  extensionService.use(({nexus}) => {
    const mutations = getMutations({strapi, nexus})

    return {
      types: [mutations],
    }
  })
}


