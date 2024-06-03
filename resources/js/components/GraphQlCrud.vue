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