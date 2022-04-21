<template>
    <v-container>
        <PostForm v-if="me" />
        <div>
            <PostCard v-for="p in mainPosts" :key="p.id" :post="p" />
        </div>
    </v-container>
</template>

<script>
import PostCard from '@/components/PostCard.vue';
import PostForm from '@/components/PostForm.vue';

export default {
    components: {
        PostCard,
        PostForm,
    },

    data() {
        return {
        }
    },

    fetch({ store }) {   // component가 마운트 되기 전에 실행
        store.dispatch('posts/loaadPosts');
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
                    this.$store.dispatch('posts/loaadPosts');
                }
            }
        }
    },
}
</script>

<style>

</style>