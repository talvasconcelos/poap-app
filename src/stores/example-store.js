import { defineStore } from 'pinia';

export const useAccount = defineStore('account', {
  state: () => ({
    account: localStorage.getItem('account') || null,
  }),
  actions: {
    update(account){
      this.$state = {...account}
    }
  }
})

export const useCounterStore = defineStore('counter', {
  state: () => ({
    counter: 0,
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    increment() {
      this.counter++;
    },
  },
});
