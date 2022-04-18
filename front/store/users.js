// 유저정보
export const state = () => ({
    me: null,
    followerList: [
        {
            id: 1,
            nickname: 'Masqurade',
            email: '11@11'
        },
        {
            id: 2,
            nickname: 'rogemaster',
            email: '22@22'
        },
        {
            id: 3,
            nickname: 'rlaaudwn000',
            email: '33@33'
        }
    ],
    followingList: [
        {
            id: 1,
            nickname: 'Masqurade',
            email: '11@11'
        },
        {
            id: 2,
            nickname: 'rogemaster',
            email: '22@22'
        },
        {
            id: 3,
            nickname: 'rlaaudwn000',
            email: '33@33'
        }
    ]
});

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
    }
};