<template>
    <div>
        <v-container>
            <v-card>
                <v-container>
                    <v-subheader>회원가입</v-subheader>
                    <v-form ref="form" v-model="valid" @submit.prevent="onSubmitForm">
                        <v-text-field 
                            v-model="email" 
                            label="이메일" 
                            type="email" 
                            :rules="emailRules" 
                            required 
                        />
                        <v-text-field 
                            v-model="password" 
                            label="비밀번호" 
                            type="password" 
                            :rules="passwordRules" 
                            required 
                        />
                        <v-text-field 
                            v-model="passwordCheck" 
                            label="비밀번호 확인" 
                            type="password"
                            :rules="passwordCheckRules" 
                            required 
                        />
                        <v-text-field 
                            v-model="nickname" 
                            label="닉네임" 
                            type="nickname"
                            :rules="nicknameRules" 
                            required 
                        />
                        <v-checkbox 
                            v-model="terms" 
                            label="위 사항에 모두 동의합니다."
                            :rules="[v => !!v || '약관 동의는 필수 입니다.']"
                            required 
                        />
                        <v-btn color="green" type="submit" :disabled="!valid">가입하기</v-btn>
                    </v-form>
                </v-container>
            </v-card>
        </v-container>
    </div>
</template>

<script>
export default {
    middleware: 'anonymous',

    data() {
        return {
            valid: false,
            email: '',
            password: '',
            passwordCheck: '',
            nickname: '',
            terms: '',
            emailRules: [
                v => !!v || '이메일은 필수 입니다.',
                v => /.+@.+/.test(v) || '이메일이 유효하지 않습니다.',
            ],
            nicknameRules: [
                v => !!v || '닉네임은 필수 입니다.',
            ],
            passwordCheckRules: [
                v => !!v || '비밀번호 확인은 필수 입니다.',
                v => v === this.password || '비밀번호가 일치하지 않습니다.',
            ],
            passwordRules: [
                v => !!v || '비밀번호는 필수 입니다.',
            ],
        }
    },

    computed: {
        me() {
            return this.$store.state.users.me;
        }
    },

    watch: {
        me(value, oldValue) {
            if(value) {
                this.$router.push({path: '/'});
            }
        }
    },

    methods: {
        onSubmitForm() {
            if (this.$refs.form.validate()) {
                const signUpInfo = {
                    email: this.email,
                    password: this.password,
                    nickname: this.nickname
                }
                this.$store.dispatch('users/signUp', signUpInfo)
                .then(() => {
                    this.$router.push({ path: '/' });
                })
                .catch(() => {
                    alert('회원가입 실패');
                })
            }
        },
    },
}
</script>

<style>

</style>