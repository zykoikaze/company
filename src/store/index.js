import Vue from 'vue'
import Vuex from 'vuex'
import { getCookie,saveSessionStore } from '@/util/util'
import leave from './leave.js'
import work from './work.js'

const user=decodeURIComponent(getCookie('user'));
Vue.use(Vuex)

var store=new Vuex.Store({
    state:{
        user:JSON.parse(user)
    },
    mutations:{
        changeState(state,action){
            state[action.name]=action.value
        }
    },
    modules: {
        leave: leave,
        work: work
    }
})
export default store