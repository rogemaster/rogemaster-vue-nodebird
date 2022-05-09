export const state = () => ({});

export const mutations = {};

export const actions = {
    // 페이지가 화면그려지기 전에 실행 되는 함수
    nuxtServerInit({ commit, dispatch, state }, { req }) {
        return dispatch('users/loadUser');
    },
};