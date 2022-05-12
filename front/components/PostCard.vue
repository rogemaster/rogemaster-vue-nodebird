<template>
    <div style="margin-bottom: 20px;">
        <v-card>
            <PostImages :images="post.Images || []" />
            <v-card-title>
                <h3><nuxt-link :to="`/user/${post.id}`">{{ post.User.nickname }}</nuxt-link></h3>
            </v-card-title>
            <v-card-text>
                <div>
                    <div>{{ post.content }}</div>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-btn text color="orange">
                    <v-icon>mdi-repeat-variant</v-icon>
                </v-btn>
                <v-btn text color="orange" @click="onclickHeart">
                    <v-icon>{{ heartIcon }}</v-icon>
                </v-btn>
                <v-btn text color="orange" @click="onToggleComment">
                    <v-icon>mdi-comment-outline</v-icon>
                </v-btn>
                <v-menu offset-y open-on-hover>
                    <template #activator="{ on }">
                        <v-btn text color="orange" v-on="on">
                            <v-icon>mdi-dots-horizontal</v-icon>
                        </v-btn>
                    </template>
                    <div style="background: white">
                        <v-btn dark color="red" @click="onRemovePost">삭제</v-btn>
                        <v-btn text color="orange" @click="onEditPost">수정</v-btn>
                    </div>
                </v-menu>
            </v-card-actions>
        </v-card>
        <template v-if="commentOpened">
            <CommentForm :post-id="post.id" />
            <v-list>
                <v-list-item v-for="c in post.comments" :key="c.id">
                    <v-list-item-avatar color="teal">
                        <span>{{ c.user.nickname[0] }}</span>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title>{{ c.user.nickname }}</v-list-item-title>
                        <v-list-item-subtitle>{{ c.content }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </template>
    </div>
</template>

<script>
import CommentForm from '@/components/CommentForm.vue';
import PostImages from '@/components/PostImages.vue';

export default {
    components: {
        CommentForm,
        PostImages
    },

    props: {
        post: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            commentOpened: false,
        }
    },

    computed: {
        me() {
            return this.$store.state.users.me;
        },

        liked() {
            const me = this.$store.state.users.me;
            return !!(this.post.Likers || []).find(v => v.id === (me && me.id));
        },

        heartIcon() {
            return this.liked ? 'mdi-heart' : 'mdi-heart-outline';
        }
    },

    methods: {
        onRemovePost() {
            this.$store.dispatch('posts/remove', {
                postId: this.post.id
            });
        },

        onEditPost() {
            this.$store.dispatch('posts/edit', {
                postId: this.post.id,
                content: this.post.content
            });
        },

        onToggleComment() {
            if(!this.commentOpened) {
                this.$store.dispatch('loadComments', {
                    postId: this.postId,
                });
            }
            this.commentOpened = !this.commentOpened;
        },

        onclickHeart() {
            if(!this.me) {
                return alert('로그인이 필요합니다.');
            }
            
            if(this.liked) {
                return this.$store.dispatch('posts/unlikePost', {
                    postId: this.post.id,
                });
            }

            if(this.liked) {
                return this.$store.dispatch('posts/likePost', {
                    postId: this.post.id,
                });
            }
        },

        onReteet() {
            if(!this.me) {
                return alert('로그인이 필요합니다.');
            }
            
            this.$store.dispatch('posts/retweet', {
                postId: this.post.id,
            });
        }
    },
    
}
</script>

<style scoped>
a {
    color: inherit;
    text-decoration: none;
}
</style>