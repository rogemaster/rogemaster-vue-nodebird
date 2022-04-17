// 유저정보
export const state = () => ({
    me: null,
    follwerList: [],
    follwingList: []
});

export const mutations = {
    setMe(state, payload) {
        state.me = payload;
    },

    changeNickname(state, payload) {
        state.me.nickname = payload.nickname;
    }
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

    changeNickname({ commit }, payload) {
        commit('changeNickname', payload);
    }
};