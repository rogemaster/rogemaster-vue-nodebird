<template>
    <div>
        <PostImages :images="post.Images || []" />
        <v-card-title>
            <h3>
                <nuxt-link :to="`/user/${post.id}`">{{ post.User.nickname }}</nuxt-link>
                <v-btn v-if="canFollow" @click="onFollow">팔로우</v-btn>
                <v-btn v-if="canUnFollow" @click="onUnFollow">언팔라우</v-btn>
            </h3>
        </v-card-title>
        <v-card-text>
            <div>
                <div>{{ post.content }}</div>
            </div>
        </v-card-text>
    </div>
</template>

<script>
import PostImages from '@/components/PostImages.vue';
export default {
    components: {
        PostImages,
    },

    props: {
        post: {
            type: Object,
            required: true
        }
    },

    computed: {
        me() {
            return this.$store.state.users.me;
        },

        canFollow() {
            return this.me && this.post.User.id !== this.me.id && !this.me.Followings.find(v => v.id === this.post.User.id);
        },

        canUnFollow() {
            return this.me && this.post.User.id !== this.me.id && this.me.Followings.find(v => v.id === this.post.User.id);
        }
    },

    methods: {
        onFollow() {
            this.$store.dispatch('users/follow', {
                userId: this.post.User.id,
            });
        },

        onUnFollow() {
            this.$store.dispatch('users/unfollow', {
                userId: this.post.User.id,
            });
        },
    },
}
</script>

<style scoped>
a {
    text-decoration: none;
    color: inherit;
}
</style>