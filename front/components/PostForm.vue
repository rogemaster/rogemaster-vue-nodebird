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
                <input ref="imageInput" type="file" multiple hidden @change="onChangeImages">
                <v-btn type="button" @click="onClickImageUpload">이미지 업로드</v-btn>
                <div>
                    <div v-for="(p, i) in imagePaths" :key="p" style="display: inline-block">
                        <img :src="`http://localhost:3080/${p}`" :alt="p" style="width: 200px">
                        <div>
                            <button type="button" @click="onRemoveImage(i)">제거</button>
                        </div>
                    </div>
                </div>
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
        ...mapState('users', ['me']),
        ...mapState('posts', ['imagePaths']),
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
        },

        onClickImageUpload() {
            this.$refs.imageInput.click();
        },

        onChangeImages(e) {
            console.log(e.target.files);
            const imageFormData = new FormData();
            // e.target.files --> 배열이 아닌 객채형식인 유사 배열
            // 그러므로 forEach를 강제로 적용하기위해서 아래 방식으로 사용함.
            // 결과 = { image: [file1, file2] }
            [].forEach.call(e.target.files, (f) => {
                imageFormData.append('image', f);
            });

            this.$store.dispatch('posts/uploadImages', imageFormData);
        },

        onRemoveImage(index) {
            this.$store.commit('removeImagePath', index);
        }
    },
}
</script>

<style>

</style>