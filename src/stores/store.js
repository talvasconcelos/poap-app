import {defineStore} from 'pinia'
import {useStorage} from '@vueuse/core'
import {createBadgeObj} from '../utils/utils'

export const useAccount = defineStore('account', {
  state: () =>
    useStorage(
      'poap.account',
      {
        privkey: '',
        pubkey: '',
        nsec: '',
        npub: '',
        useExtension: false
      },
      localStorage,
      {
        mergeDefaults: true
      }
    ),
  actions: {
    $reset() {
      this.$state = {
        privkey: '',
        pubkey: '',
        nsec: '',
        npub: '',
        useExtension: false
      }
    },
    update(account) {
      this.$state = {...account}
      //localStorage.setItem('poap.account', JSON.stringify(account))
    }
  }
})

const nostrInitialState = {
  events: [],
  relays: [],
  profile: null
}

export const useNostr = defineStore('nostr', {
  state: () =>
    useStorage('poap.nostr', nostrInitialState, localStorage, {
      mergeDefaults: true
    }),
  getters: {
    getBadges(state) {
      let badges = state.events
        .filter(event => event.kind == 30009)
        .map(createBadgeObj)
        // remove duplicates by d tag, keep the latest by created_at, output is an array
        .reduce((acc, badge) => {
          if (acc[badge.d]) {
            if (badge.created_at > acc[badge.d].created_at) {
              acc[badge.d] = badge
            }
          } else {
            acc[badge.d] = badge
          }
          return acc
        }, {})
      return Object.values(badges)
    },
    getPoaps() {
      return this.getBadges.filter(
        badge => badge.subject && badge.subject.split(':').includes('poap')
      )
    },
    getIssuers(state) {
      return [
        ...new Set(
          state.events
            .filter(event => event.kind == 30009)
            .map(event => event.pubkey)
        )
      ]
    },
    getProfileBadges(state) {
      return state.events.filter(event => event.kind == 30008)
    }
  },
  actions: {
    $reset() {
      this.$state = nostrInitialState
    },
    updateRelays(event) {
      const data = JSON.parse(event.content)
      const relays = new Set(Object.keys(data), ...this.relays)
      this.relays = [...relays]
    },
    updateEvent(event) {
      if (!event) return
      const eventsMap = new Map(this.events.map(event => [event.id, event]))
      if (!eventsMap.has(event.id)) {
        return this.events.push(event)
      }
      if (event.created_at > eventsMap.get(event.id).created_at) {
        console.log('Updating event', event)
        this.events.splice(
          this.events.findIndex(e => e.id === event.id),
          1
        )
        return this.events.push(event)
      }
    },
    updateEvents(events) {
      const eventsMap = new Map(this.events.map(event => [event.id, event]))
      events.forEach(event => {
        if (!eventsMap.has(event.id)) {
          //this.events.push(event)
          eventsMap.set(event.id, event)
        }
        if (event.created_at > eventsMap.get(event.id).created_at) {
          // this.events.push(event)
          eventsMap.set(event.id, event)
        }
      })
      this.events = Array.from(eventsMap.values())
    }
  }
})
