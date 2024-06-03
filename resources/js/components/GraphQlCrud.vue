<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">GraphQL CRUD</div>
                </div>
            </div>
        </div>


        <form class="form" @submit.prevent="saveForm">
            <div class="row">
                <div class="col-sm-3">
                    <input type="text" class="form-control" placeholder="Name .." v-model="form.name">
                </div>
                <div class="col-sm-4">
                    <input type="email" class="form-control" placeholder="Email .." v-model="form.email">
                </div>
                <div class="col-sm-3">
                    <input type="password" class="form-control" placeholder="password .." v-model="form.password">
                </div>

                <div class="col-sm-2">
                    <button type="submit" class="btn btn-dark">Save</button>
                </div>
            </div>
        </form>



        <div v-if="isListLoading">Loading..</div>
        <div v-else>
            <ul v-if="list && list.users">
                <li v-for="user in list.users" :key="user.id">
                    {{user.name}} {{user.email}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import { reactive } from 'vue'
    import { useQuery, useMutation  } from '@vue/apollo-composable'
    import gql from 'graphql-tag'

    export default {
        setup () {
            const form = reactive({
                name: '',
                email: '',
                password: ''
            });

            const resetForm = () => {
                form.name = '';
                form.email = '';
                form.password = '';
            }

            const { result: list, loading: isListLoading } = useQuery(gql`
                query getUsers {
                    users {
                        email
                        name
                    }
                }
            `);

            const saveForm = () => {
                let data = {
                    name : form.name,
                    email : form.email,
                    password : form.password
                }

                createUser(data)
            }

            const { mutate: createUser, error, loading: isCreateProcessing } = useMutation(gql`
                mutation createUser (
                        $name: String!  
                        $email: String!  
                        $password: String!  
                    ) {
                    createUser(input: {
                        name: $name  
                        email: $email  
                        password: $password  
                    }) {
                        id
                        name
                        email
                    }
                }
            `);

            return { list, isListLoading, form, saveForm, createUser, isCreateProcessing };
        }
    };
</script>