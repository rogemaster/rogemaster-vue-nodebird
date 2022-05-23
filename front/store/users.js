// 유저정보
export const state = () => ({
    me: null,
    followerList: [],
    followingList: [],

    hasMoreFollowing: true,
    hasMoreFollower: true,
});

const totalFollower = 8;
const totalFollowing = 6;
const limit = 3;

export const mutations = {
    setMe(state, payload) {
        state.me = payload;
    },

    changeNickname(state, payload) {
        state.me.nickname = payload.nickname;
    },

    addFollowing(state, payload) {
        state.followingList.push(payload);
    },

    removeFollowing(state, payload) {
        const index = state.Followings.findIndex(v => v.id === payload.userId);
        state.me.Followings.splice(index, 1);
    },

    addFollower(state, payload) {
        state.followerList.push(payload);
    },

    removeFollower(state, payload) {
        const index = state.followerList.findIndex(v => v.id === payload.id);
        console.log(index);
        state.followerList.splice(index, 1);
    },

    loadFollowings(state, payload) {
        if(payload.offset === 0) {
            state.followingList = payload.data;
        }else {
            state.followingList = state.followingList.concat(payload.data);
        }
        state.hasMoreFollowing = payload.data.length === limit;
    },

    loadFollowers(state, payload) {
        if(payload.offset === 0) {
            state.addFollower = payload.data;
        }else {
            state.followerList = state.followerList.concat(payload.data);
        }
        state.hasMoreFollowing = payload.data.length === limit;
    },

    following(state, payload) {
        state.me.Followings.push({ id: payload.userId });
    },

};

export const actions = {
    // 유저정보 가져오기
    async loadUser({ commit }) {
        try {
            const { data } = await this.$axios.get('/user', { withCredentials: true });
            commit('setMe', data);
        } catch (error) {
            console.error(error);
        }
    },

    signUp({ commit }, signUpInfo) {
        // 서버에 회원가입 요청을 보내는 부분
        this.$axios.post('/user', {
            email: signUpInfo.email,
            password: signUpInfo.password,
            nickname: signUpInfo.nickname
        }, { withCredentials: true })
        .then(({ data }) => {
            commit('setMe', data);
        })
        .catch((error) => {
            console.log(error)
        })
    },

    async logIn({ commit }, loginInfo) {
        console.log(loginInfo);
        try {
            const { data } = await this.$axios.post(
                '/user/login', {
                    email: loginInfo.email,
                    password: loginInfo.password,
                },
                { withCredentials: true }   // 쿠키를 심어 주기 위해 사용함.
            );                              // 이후 CORS 에러가 발생
            commit('setMe', data);
            return true;
        }catch(error) {
            return false;
        }
    },

    logOut({ commit }) {
        this.$axios.post('/user/logout', {}, { withCredentials: true })
        .then(() => {
            commit('setMe', null);
        })
        .catch((error) => {
            console.log(error)
        })
    },

    changeNickname({ commit }, payload) {
        this.$axios.post(
            '/user/nickname', 
            { nickname: payload.nickname}, 
            { withCredentials: true }
        )
        .then((res) => {
            commit('changeNickname', payload);
        })
        .catch((error) => {
            console.error(error);
        });
    },

    addFollowing({ commit }, payload) {
        commit('addFollowing', payload);
    },

    removeFollowing({ commit }, payload) {
        commit('removeFollowing', payload);
    },

    addFollower({ commit }, payload) {
        commit('addFollower', payload);
    },

    removeFollower({ commit }, payload) {
        commit('removeFollower', payload);
    },

    loadFollowers({ commit, state }, payload) {
        if(!(payload && payload.offset === 0) && !state.hasMoreFollower) {
            return;
        }
        
        let offset = state.followerList.length;
        if(payload && payload.offset === 0) {
            offset = 0;
        }
        return this.$axios.get(
            `/user/${state.me.id}/followers?limit=3&offset=${offset}`,
            { withCredentials: true }
        )
        .then((res) => {
            commit('loadFollowers', {
                data: res.data,
                offset,
            })
        })
        .catch((error) => {
            console.error(error);
        });
    },

    loadFollowings({ commit, state }, payload) {
        if(!(payload && payload.offset === 0) && !state.hasMoreFollowing) {
            return;
        }
        
        let offset = state.followingList.length;
        if(payload && payload.offset === 0) {
            offset = 0;
        }
        return this.$axios.get(
            `/user/${state.me.id}/followings?limit=3&offset=${offset}`, 
            { withCredentials: true }
        )
        .then((res) => {
            commit('loadFollowings', {
                data: res.data,
                offset,
            })
        })
        .catch((error) => {
            console.error(error);
        });
    },

    follow({ commit }, payload) {
        this.$axios.post(
            `/user/${payload.userId}/follow}`, 
            {}, 
            { withCredentials: true }
        )
        .then((response) => {
            commit('following', { userId: payload.userId });
        })
        .catch((error) => {
            console.error(error);
        })
    },

    unfollow({ commit }, payload) {
        this.$axios.post(
            `/user/${payload.userId}/unfollow}`, 
            { withCredentials: true }
        )
        .then((response) => {
            commit('removeFollowing', { userId: payload.userId });
        })
        .catch((error) => {
            console.error(error);
        })
    },

};