import type {Core} from "@strapi/strapi";

import { registerFirebase } from './register-firebase';


export const getMutations = (context: { strapi: Core.Strapi, nexus: any }) => {
  const { nexus, strapi } = context

  const mutations = {
    registerFirebase,
  }

  return nexus.extendType({
    type: 'Mutation',

    definition(t) {
      for (const [name, getConfig] of Object.entries(mutations)) {
        const config = getConfig(context);

        t.field(name, config);
      }
    },
  });
}