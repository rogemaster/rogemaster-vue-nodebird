// 게시글
export const state = () => ({
    mainPosts: [],
    hasMorePost: true,
    imagePaths: [],
});

// 테스트용 서버 없을 경우 이용
const totalPosts = 51;
const limit = 10;

export const mutations = {
    addMainPost(state, payload) {
        state.mainPosts.unshift(payload);
        state.imagePaths = [];
    },

    removeMainPost(state, payload) {
        const index = state.mainPosts.findIndex(v => v.id === payload.postId);
        state.mainPosts.splice(index, 1);
    },

    addComment(state, payload) {
        const index = state.mainPosts.findIndex(v => v.id === payload.postId);
        state.mainPosts[index].comments.unshift(payload);
    },

    loadComments(state, payload) {
        const index = state.mainPosts.findIndex(v => v.id === payload.postId);
        state.mainPosts[index].comments = payload;
    },

    loadPost(state, payload) {
        // mock data 처리
        // Array(limit).fill() > 빈배열을 만드는 방법
        // const diff = totalPosts - state.mainPosts.length; // 아직 불러오지 않은 게시글 수
        // const fakerPost = Array(diff > limit ? limit : diff).fill().map(v => ({
        //     id: Math.random().toString(),
        //     User: {
        //         id: 1,
        //         nickname: 'rogemaster'
        //     },
        //     content: `Hello Infinite scrolling~ ${Math.random()}`,
        //     comments: [],
        //     image: [],
        // }));

        // 실제 데이터 처리
        state.mainPosts = state.mainPosts.concat(payload);
        state.hasMorePost = payload.length === limit;
    },

    concatImagePaths(state, payload) {
        state.imagePaths = state.imagePaths.concat(payload); // 이미지 합치기
    },

    removeImagePath(state, payload) {
        state.imagePaths.splice(payload, 1);
    }
};

export const actions = {
    add({ commit, state }, payload) {
        // 서버에 게시글 등록요청
        this.$axios.post('http://localhost:3085/post', {
            content: payload.content,
            image: state.imagePaths,
        }, { withCredentials: true })
        .then(({ data }) => {
            commit('addMainPost', data);
        })
        .catch((error) => {
            console.log(error);
        })
    },

    remove({ commit }, payload) {
        this.$axios.delete(`http://localhost:3085/post/${payload.postId}`, { withCredentials: true })
        .then(() => {
            commit('removeMainPost', payload);
        })
        .catch((error) => {
            console.error(error);
        })
    },

    addComment({ commit }, payload) {
        this.$axios.post(`http://localhost:3085/post/${payload.postId}/comment`, {
            contnet: payload.content,
        }, { withCredentials: true })
        .then(({ data }) => {
            commit('addComment', data);
        })
        .catch((error) => {
            console.error(error);
        })
    },

    loadComment({ commit, state }, payload) {
        this.$axios.get(`http://localhost:3085/post/${payload.postId}/comments`)
        .then(({ data }) => {
            commit('loadComments', data);
        })
        .catch((error) => {
            console.error(error);
        })
    },

    loadPosts({ commit, state }) {
        if(state.hasMorePost) {
            this.$axios.get(
                `http://localhost:3085/posts?offset=${state.mainPosts.length}&limit=10`
            )
            .then(({ data }) => {
                commit('loadPosts', data);
            })
            .catch((error) => {
                console.error(error);
            });
        }
    },

    uploadImages({ commit }, payload) {
        this.$axios.post('http://localhost:3085/post/images', payload, { withCredentials: true })
        .then((res) => {
            commit('concatImagePaths', res.data);
        })
        .catch((error) => {
            console.log(error);
        })
    },

    
}