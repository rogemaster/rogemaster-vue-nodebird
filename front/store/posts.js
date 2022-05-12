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
    },

    likePost(state, payload) {
        const index = state.mainPosts.findIndex(v => v.id === payload.postId);
        state.mainPosts[index].Likers.push({
            id: payload.userId,
        });
    },

    unlikePost(state, payload) {
        const index = state.mainPosts.findIndex(v => v.id === payload.postId);
        const userIndex = state.mainPosts[index].findIndex(v => v.id === payload.userId);
        state.mainPosts[index].Likers.splice(userIndex, 1);
    },
};

export const actions = {
    add({ commit, state }, payload) {
        // 서버에 게시글 등록요청
        this.$axios.post('/post', {
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
        this.$axios.delete(`/post/${payload.postId}`, { withCredentials: true })
        .then(() => {
            commit('removeMainPost', payload);
        })
        .catch((error) => {
            console.error(error);
        })
    },

    addComment({ commit }, payload) {
        this.$axios.post(`/post/${payload.postId}/comment`, {
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
        this.$axios.get(`/post/${payload.postId}/comments`)
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
                `/posts?offset=${state.mainPosts.length}&limit=10`
            )
            .then(({ data }) => {
                commit('loadPost', data);
            })
            .catch((error) => {
                console.error(error);
            });
        }
    },

    uploadImages({ commit }, payload) {
        this.$axios.post('/post/images', payload, { withCredentials: true })
        .then((res) => {
            commit('concatImagePaths', res.data);
        })
        .catch((error) => {
            console.log(error);
        })
    },

    onReteet({ commit }, payload) {
        this.$axios.post(`post/${payload.postId}/retweet`, {}, { withCredentials: true })
        .then(({ data }) => {
            commit('addMainPost', data);
        })
        .catch((error) => {
            console.error(error);
        });
    },

    likePost({ commit }, payload) {
        this.$axios.post(`post/${payload.postId}/like`, {}, { withCredentials: true })
        .then(({ data }) => {
            commit('likePost', {
                userId: data.userId,
                postId: payload.postId,
            });
        })
        .catch((error) => {
            console.error(error);
        });
    },

    unlikePost({ commit }, payload) {
        this.$axios.delete(`post/${payload.postId}/like`, { withCredentials: true })
        .then(({ data }) => {
            commit('unlikePost', {
                userId: data.userId,
                postId: payload.postId,
            });
        })
        .catch((error) => {
            console.error(error);
        });
    },
};