import type { Core } from '@strapi/strapi'
import { initializeApp } from 'firebase-admin/app'
import { credential } from 'firebase-admin'
import { registerGraphql } from './graphql'
import { firebaseAuthStrategy } from './strategies/firebase-auth'

const PLUGIN_ID = 'plugin::firebase-auth-strategy'

const register = ({ strapi }: { strapi: Core.Strapi }) => {

  const serviceAccount = strapi.config.get(`${PLUGIN_ID}.serviceAccount`)
  strapi.log.info('Firebase service account', serviceAccount)
  initializeApp({
    credential: credential.cert(serviceAccount),
  });

  strapi.get('auth').register('content-api', firebaseAuthStrategy);

  if (strapi.plugin('graphql')) {
    registerGraphql({ strapi });
  }

};

export default register;
