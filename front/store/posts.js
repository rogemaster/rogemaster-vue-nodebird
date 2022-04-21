// 게시글
export const state = () => ({
    mainPosts: [],
    hasMorePost: true,
});

// 테스트용 서버 없을 경우 이용
const totalPosts = 51;
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
        const diff = totalPosts - state.mainPosts.length; // 아직 불러오지 않은 게시글 수
        const fakerPost = Array(diff > limit ? limit : diff).fill().map(v => ({
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