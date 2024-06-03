# GraphQL & Laravel + Vue

- https://www.youtube.com/playlist?list=PLEhEHUEU3x5qsA5JnRzhgOghrH9Vqz4cg
- https://www.youtube.com/watch?v=4z3EMCc4bP4

## Lighthouse at back

- https://www.toptal.com/graphql/laravel-graphql-server-tutorial
- https://backpackforlaravel.com/articles/tutorials/setup-graphql-in-laravel-using-lighthouse
- https://medium.com/@brandon.shar/graphql-laravel-and-vue-part-1-backend-576d0c1095a7

```
composer require nuwave/lighthouse
```

https://github.com/nuwave/lighthouse/releases

```
php artisan vendor:publish
```

Select `Provider: Nuwave\Lighthouse\LighthouseServiceProvider` to publish at prompt.

2 files gets created:
- `config\lighthouse.php`
- `graphql\schema.graphql`

In config file, make sure it's pointing correctly to `graphql\schema.graphql`
```php
'schema' => [
    'register' => base_path('graphql/schema.graphql'),
],
```

`graphql/schema.graphql`
```
type User {
  id: ID!
  name: String!
  email: String!
}

type Query {
  user(id: ID! @eq): User @find
  users: [User!]! @all
}
```

Setup your MVC and DB for `User`

Check `{domain}/graphql` in Postman

How to test GraphQL in Postman: https://learning.postman.com/docs/sending-requests/supported-api-frameworks/graphql

![](/Illustrations/lighthouse-postman.png)

Or you can install GraphiQL in your Lavavel website

```
composer require mll-lab/laravel-graphiql
php artisan vendor:publish --tag=graphiql-config

{domain}/graphiql
```

![](/Illustrations/lighthouse-graphiql.png)

ChromeiQL extension also works

### More notes

- https://auth0.com/blog/developing-and-securing-graphql-apis-with-laravel
- https://github.com/folkloreinc/laravel-graphql/issues/270
- https://stackoverflow.com/questions/58369552/so-composer-require-rebing-graphql-laravel-fails
- https://miguelpiedrafita.com/laravel-graphql-gotchas
- https://amp.reddit.com/r/laravel/comments/bharfj/using_graphql_with_laravel/
- https://www.freecodecamp.org/news/graphql-with-laravel-and-vue-js/
  - https://www.youtube.com/watch?v=4z3EMCc4bP4
- https://medium.com/@sadnub/migrating-to-graphql-on-laravel-with-lighthouse-42bd96d9d73
- https://github.com/nuwave/lighthouse/issues/77
- https://www.swoole.co.uk/article/Build-a-GraphQL-API-on-top-of-Swoole
- https://www.youtube.com/playlist?list=PLcfD4HARQRF_PPy_0TN1NERYVK0iF5Y0Q
- https://siler.leocavalcante.dev/

## Apollo in front

### Old way

`npm install vue-apollo apollo-boost graphql`

`resources/js/app.js`
```js
import ApolloClient from 'apollo-boost';
import VueApollo from 'vue-apollo';

require('./bootstrap');

window.Vue = require('vue');
Vue.use(VueApollo)

Vue.component('example', require('./components/ExampleComponent.vue').default);

const apolloClient = new ApolloClient({
  uri: 'http://127.0.0.1:8000/graphql'
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

const app = new Vue({
    el: '.vuepart',
    apolloProvider
});
```

`resources/views/welcome.blade.php` replace body with:
```html
<body class="antialiased">
    <div class="vuepart">
        <example></example>
    </div>
    <script src="js/app.js"></script>
</body>
```

`resources/js/components/ExampleComponent.vue`
```html
<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Example Component</div>

                    <div class="card-body">
                        I'm an example component.
                    </div>
                </div>
            </div>
        </div>

        <div v-if="$apollo.loading">Loading..</div>
        <div v-else>
            <div v-for="user in users">
                <h1>Name: {{user.name}}</h1>
                <p>Email: {{user.email }}</p>
            </div>
        </div>
    </div>
</template>

<script>
    import { gql } from "apollo-boost";

    export default {
        mounted() {
            console.log('Component mounted.');
        },
        data: function() {
            return {
                //query data is added
                users: {}
            };
        },
        apollo: {
            //this query will update the `users` data property
            users: {
                query: gql`
                {
                    users {
                        name
                        email
                    }
                }`
            }
        }
    };
</script>
```

`npm run dev`

#### More notes

- https://reactgo.com/vue-apollo-tutorial/ <sub>good</sub>
- https://github.com/sadhakbj/Laravel-Vue-Graphql
- https://vue-apollo.netlify.app/guide/#sponsors
- https://medium.com/@brandon.shar/graphql-laravel-and-vue-part-2-frontend-ef5624312956
- https://www.youtube.com/watch?v=hvjW-MQEwIM
- https://www.digitalocean.com/community/tutorials/how-to-build-a-blog-with-vue-graphql-and-apollo-client

### New way

- Vue components + Laravel 11 + Vite: https://arpanext.medium.com/how-to-install-vue-bootsrap-with-laravel-and-vite-from-scratch-198a4924bb42
- https://www.youtube.com/watch?v=t7W5vl0kzXU
  - https://github.com/ajayyadavexpo/laravel-9-graphql-vue-3-crud/blob/master/resources/js/app.js
- https://v4.apollo.vuejs.org/guide/installation.html
  - https://v4.apollo.vuejs.org/guide-composable/query.html

```
npm install --save-dev vue @vitejs/plugin-vue
npm install --save graphql graphql-tag @apollo/client @vue/apollo-composable
```

`vite.config.js`
```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        vue({ 
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
    resolve: { 
        alias: {
            vue: 'vue/dist/vue.esm-bundler.js',
        },
    },
});
```

`resources/js/app.js`
```js
import './bootstrap';

import { createApp, provide, h } from 'vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core';

import GraphQlCrud from './components/GraphQlCrud.vue';

const httpLink = createHttpLink({
  uri: `${window.location.origin}/graphql`,
})

const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})

const app = createApp({
    setup () {
        provide(DefaultApolloClient, apolloClient)
    },
    render: () => h(GraphQlCrud)
});

app.mount("#vuepart")
```

`resources/views/welcome.blade.php`
```html
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <div id="vuepart">
    </div>
</body>
```

`resources/js/components/ExampleComponent.vue`
```html
<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">GraphQL CRUD</div>
                </div>
            </div>
        </div>

        <div v-if="loading">Loading..</div>
        <div v-else>
            <ul v-if="result && result.users">
                <li v-for="user in result.users" :key="user.id">
                    {{user.name}} {{user.email}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import { useQuery, useMutation  } from '@vue/apollo-composable'
    import gql from 'graphql-tag'

    export default {
        setup () {
            const { result, loading } = useQuery(gql`
                query getUsers {
                    users {
                        email
                        name
                    }
                }
            `);

            return { result, loading };
        }
    };
</script>
```

![](/Illustrations/apollo-simple.png)

Now we have the simplest setup finished

---

# Complete the CRUD - Backend

`schema.graphql`
```
type User {
  id: ID!
  name: String!
  email: String!
}

type Query {
  user(id: ID! @eq): User @find
  users: [User!]! @all
}

type Mutation {
  createUser(input: CreateUserInput @spread): User @create
  updateUser(id: ID!, input: UpdateUserInput @spread): User @update
  deleteUser(id: ID!): User @delete
}

input CreateUserInput{
  name: String!
  email: String! @rules(apply:["email","unique:users,email"])
  password: String! @hash @rules(apply:["min:5"])
}

input UpdateUserInput{
  name: String!
  password: String! @hash @rules(apply:["min:5"])
}
```

Read All
```
query {
    users {
        email
        name
    }
}
```

Read One
```
query {
  user(id: 1) {
    id
    name
    email
  }
}
```

Create
```
mutation {
  createUser(input: {
    name:"John Poe"
    email:"john.poe@example.com"
    password: "password"
  }) {
    id
    name
    email
  }
}
```

Update
```
mutation {
  updateUser(id: 1, input: {
    name:"John Poe"
    password: "password"
  }) {
    id
    name
    email
  }
}
```

Delete
```

```

---

# Todos

Upload file: https://devpress.csdn.net/vue/62f0d3c57e6682346618346b.html
