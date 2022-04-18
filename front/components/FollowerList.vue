<template>
    <v-list>
        <v-list-item v-for=" f in followerList" :key="f.id">
            <span>{{ f.nickname }}</span>
            <v-btn text @click="onRemoveFollower(f)">
                <v-icon>mdi-minus-circle-outline</v-icon>
            </v-btn>
        </v-list-item>
    </v-list>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState('users', ['followerList'])
    },

    methods: {
        onRemoveFollower(data) {
            console.log(data);
            this.$store.dispatch('users/removeFollower', data)
            .then(() => {
                alert('처리가 완료되었습니다.');
            })
            .catch(() => {
                alert('처리가 실패 하였습니다.')
            })
        }
    },
}
</script>

<style>

</style>