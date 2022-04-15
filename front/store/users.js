// 유저정보
export const state = () => ({
    me: null,
});

export const mutations = {
    setMe(state, payload) {
        state.me = payload;
    },
};

export const actions = {
    signUp({ commit }, signUpInfo) {
        // 서버에 회원가입 요청을 보내는 부분
        console.log('회원가입:: ', signUpInfo);
        commit('setMe', signUpInfo);
    },

    logIn({ commit }, loginInfo) {
        commit('setMe', loginInfo);
    },

    logOut({ commit }, payload) {
        commit('setMe', null);
    },
};