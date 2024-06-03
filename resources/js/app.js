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