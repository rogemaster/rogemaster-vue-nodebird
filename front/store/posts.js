// 게시글
export const state = () => ({
    mainPosts: []
});

export const mutations = {
    addMainPost(state, payload) {
        state.mainPosts.unshift(payload);
    },

    removeMainPost(state, payload) {
        const index = state.mainPosts.findIndex(v => v.id === payload.id);
        state.mainPosts.splice(index, 1);
    }
};

export const actions = {
    add({ commit }, payload) {
        // 서버에 게시글 등록요청
        commit('addMainPost', payload);
    },

    remove({ commit }, payload) {
        commit('removeMainPost', payload);
    }
}