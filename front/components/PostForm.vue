<template>
    <v-card style="margin-bottom: 20px;">
        <v-container>
            <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
                <v-textarea
                    v-model="content"
                    outlined
                    auto-grow
                    clearble
                    label="어떤 신기한 일이 있었나요?"
                    :hide-details="hideDetails"
                    :success-messages="successMessages"
                    :success="success"
                    :rules="[v => !!v.trim() || '내용을 입력 하세요.']"
                    @input="onChangeTextarea"
                />
                <v-btn type="submit" color="green" absolute right>등록</v-btn>
                <v-btn>이미지 업로드</v-btn>
            </v-form>
        </v-container>
    </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data() {
        return {
            hideDetails: false,
            successMessages: '',
            success: false,
            valid: false,
            content: '',
        }
    },

    computed: {
        ...mapState('users', ['me'])
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
                this.$store.dispatch('posts/add', {
                    content: this.content,
                    user: {
                        nickname: this.me.nickname
                    },
                    comments: [],
                    image: [],
                    id: Date.now(),
                    createdAt: Date.now()
                })
                .then(() => {
                    this.content = '';
                    this.hideDetails = false;
                    this.success = true;
                    this.successMessages = '게시글 등록 성공!';
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