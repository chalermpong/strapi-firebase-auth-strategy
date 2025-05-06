# strapi-firebase-auth-strategy

Use Firebase Auth ID Token with your strapi backend

## Installation

1. Install the plugin
```bash
npm i --save @chalermpong/strapi-firebase-auth-strategy
```

2. In Firebase console, generate a private key file for Firebase Service Account https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments

3. Add the following code in your `config/plugins.ts` file.
```ts
import serviceAccount from 'path/to/firebase-adminsdk-fbsvc-xxx.json'

export default ({env}) => ({
  'firebase-auth-strategy': {
    enabled: true,
    config: {
      serviceAccount: serviceAccount,
    },
  },
})
```

How to use

1. Just authenticate your user with Firebase. 
2. Get ID token of your user, then add `Authorization: Bearer [Firebase ID Token]` to your http request to strapi.
3. Every user needs to call `registerFirebase` api first to create a new `user-permission.user` record. After that he can start using other api on your backend. 
