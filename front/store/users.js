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
        const index = state.followingList.findIndex(v => v.id === payload.id);
        state.followingList.splice(index, 1);
    },

    addFollower(state, payload) {
        state.followerList.push(payload);
    },

    removeFollower(state, payload) {
        const index = state.followerList.findIndex(v => v.id === payload.id);
        console.log(index);
        state.followerList.splice(index, 1);
    },

    loadFollowings(state) {
        const diff = totalFollowing - state.followingList.length;
        const fakUsers = Array(diff > limit ? limit : diff).fill().map(v => ({
            id: Math.random().toString(),
            nickname: Math.floor(Math.random() * 1000),
        }));

        state.followingList = state.followingList.concat(fakUsers);
        state.hasMoreFollowing = fakUsers.length === limit;
    },

    loadFollowers(state) {
        const diff = totalFollower - state.followerList.length;
        const fakUsers = Array(diff > limit ? limit : diff).fill().map(v => ({
            id: Math.random().toString(),
            nickname: Math.floor(Math.random() * 1000),
        }));

        state.followerList = state.followerList.concat(fakUsers);
        state.hasMoreFollowing = fakUsers.length === limit;
    },

};

export const actions = {
    signUp({ commit }, signUpInfo) {
        // 서버에 회원가입 요청을 보내는 부분
        this.$axios.post('http://localhost:3085/user', {
            email: signUpInfo.email,
            password: signUpInfo.password,
            nickname: signUpInfo.nickname
        }, { withCredentials: true })
        .then(({ data }) => {
            console.log('회원가입::', data);
            commit('setMe', signUpInfo);
        })
        .catch((error) => {
            console.log(error)
        })
    },

    async logIn({ commit }, loginInfo) {
        console.log(loginInfo);
        try {
            const result = await this.$axios.post(
                'http://localhost:3085/user/login', 
                loginInfo, 
                { withCredentials: true }   // 쿠키를 심어 주기 위해 사용함.
            );                              // 이후 CORS 에러가 발생
            console.log(result);

            commit('setMe', loginInfo);

            return result;
        }catch(error) {
            alert('로그인 통신 에러::', error);
        }
    },

    logOut({ commit }, payload) {
        commit('setMe', null);
    },

    changeNickname({ commit }, payload) {
        commit('changeNickname', payload);
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
        if(state.hasMoreFollower) {
            commit('loadFollowers')
        }
    },

    loadFollowings({ commit, state }, payload) {
        if(state.hasMoreFollower) {
            commit('loadFollowings')
        }
    },

};