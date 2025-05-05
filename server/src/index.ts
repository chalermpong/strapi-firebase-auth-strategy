/**
 * Application methods
 */
import bootstrap from './bootstrap';
import destroy from './destroy';
import register from './register';

/**
 * Plugin server methods
 */
import config from './config';
import routes from './routes';
import controllers from './controllers';
import contentTypes from './content-types';
import policies from './policies';
import middlewares from './middlewares';

export default {
  register,
  bootstrap,
  destroy,
  config,
  controllers,
  routes,
  contentTypes,
  policies,
  middlewares
};
