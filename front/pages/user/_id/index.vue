<template>
    <v-container>
        <div>
            <PostCard v-for="p in mainPosts" :key="p.id" :post="p" />
        </div>
    </v-container>
</template>

<script>
import PostCard from '@/components/PostCard.vue';

export default {
    components: {
        PostCard,
    },

    data() {
        return {
        }
    },

    fetch({ store }) {   // component가 마운트 되기 전에 실행
        store.dispatch('posts/loadPosts');
    },

    computed: {
        me() {
            return this.$store.state.users.me;
        },

        mainPosts() {
            return this.$store.state.posts.mainPosts;
        },

        hasMorePost() {
            return this.$store.state.posts.hasMorePost;
        }
    },

    mounted() {
        window.addEventListener('scroll', this.onScroll);
    },

    beforeDestroy() {
        window.removeEventListener('scroll', this.onScroll);
    },

    methods: {
        onScroll() {
            if(window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
                if(this.hasMorePost) {
                    this.$store.dispatch('posts/loadPosts');
                }
            }
        }
    },
}
</script>

<style>

</style>