// 게시글
export const state = () => ({
    mainPosts: [],
    hasMorePost: true,
});

const limit = 10;

export const mutations = {
    addMainPost(state, payload) {
        state.mainPosts.unshift(payload);
    },

    removeMainPost(state, payload) {
        const index = state.mainPosts.findIndex(v => v.id === payload.id);
        state.mainPosts.splice(index, 1);
    },

    addComment(state, payload) {
        const index = state.mainPosts.findIndex(v => v.id === payload.postId);
        state.mainPosts[index].comments.unshift(payload);
    },

    loadPost(state, payload) {
        // Array(limit).fill() > 빈배열을 만드는 방법
        const fakerPost = Array(limit).fill().map(v => ({
            id: Math.random().toString(),
            user: {
                id: 1,
                nickname: 'rogemaster'
            },
            content: `Hello Infinite scrolling~ ${Math.random()}`,
            comments: [],
            image: [],
        }));
        state.mainPosts = state.mainPosts.concat(fakerPost);
        state.hasMorePost = fakerPost.length === limit;
    }
};

export const actions = {
    add({ commit }, payload) {
        // 서버에 게시글 등록요청
        commit('addMainPost', payload);
    },

    remove({ commit }, payload) {
        commit('removeMainPost', payload);
    },

    addComment({ commit }, payload) {
        commit('addComment', payload);
    },

    loaadPosts({ commit, state }, payload) {
        if(state.hasMorePost) {
            commit('loadPost', payload);
        }
    }
}