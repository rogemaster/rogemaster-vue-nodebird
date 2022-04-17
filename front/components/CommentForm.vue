<template>
  <v-form ref="form" v-model="valid" style="position: relative" @submit.prevent="onSubmitForm">
      <v-textarea
            v-model="content"
            filed
            auto-grow
            label="댓글 달기"
            :hide-details="hideDetails"
            :success-messages="successMessages"
            :success="success"
            @input="onChangeTextarea"
        />
      <v-btn type="submit" color="green" dark absolute top right>등록</v-btn>
  </v-form>
</template>

<script>
export default {
    props: {
        postId: {
            type: Number,
            required: true
        }
    },

    data() {
        return {
            valid: false,
            content: '',
            hideDetails: false,
            successMessages: '',
            success: false,
        }
    },

    computed: {
         me() {
            return this.$store.state.users.me;
        },
    },

    methods: {
        onChangeTextarea(value) {
            if(value.length) {
                this.hideDetails = true;
                this.success = false;
                this.successMessages = '';
            }
        },

        onSubmitForm() {
            if(this.$refs.form.validate()) {
                this.$store.dispatch('posts/addComment', {
                    id: Date.now(),
                    postId: this.postId,
                    content: this.content,
                    user: {
                        nickname: this.me.nickname
                    }
                })
                .then(() => {
                    this.content = '';
                    this.hideDetails = false;
                    this.success = true;
                    this.successMessages = '댓글이 작성되었습니다.';
                })
                .catch(() => {

                })
            }
        }
    },
}
</script>

<style>

</style>