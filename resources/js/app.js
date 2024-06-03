import './bootstrap';

import { createApp, provide, h } from 'vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core';

import ExampleComponent from './components/ExampleComponent.vue';

const httpLink = createHttpLink({
  uri: 'http://127.0.0.1:8000/graphql',
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
    render: () => h(ExampleComponent)
});

app.mount("#app")