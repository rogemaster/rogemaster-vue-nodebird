<template>
    <v-container>
        <div>
            <PostCard />
            <PostCard />
            <PostCard />
            <PostCard />
            <PostCard />
        </div>
    </v-container>
</template>

<script>
import PostCard from '@/components/PostCard.vue';

export default {
    components: {
        PostCard
    },

    data() {
        return {
        }
    },   
}
</script>

<style>

</style>