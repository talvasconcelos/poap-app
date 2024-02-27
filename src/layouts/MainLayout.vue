<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      bordered
      class="bg-white text-grey-10"
    >
      <q-toolbar class="container">
        <q-btn
          flat
          dense
          round
          icon="qr_code_scanner"
          v-if="$q.screen.gt.xs"
          to="/claim"
        />
        <q-toolbar-title
          class="text-center"
          @click="goHome"
        >
          Nostr POAP
        </q-toolbar-title>
        <q-btn
          flat
          round
          icon="account_circle"
          v-if="$q.screen.gt.xs"
          to="/account"
        />
      </q-toolbar>
    </q-header>

    <q-footer
      bordered
      class="bg-white text-grey-10 xs"
    >
      <q-tabs active-color="primary">
        <q-route-tab
          icon="home"
          to="/"
        />
        <q-route-tab
          icon="qr_code_scanner"
          to="/claim"
        />
        <q-route-tab
          icon="account_circle"
          to="/account"
        />
      </q-tabs>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import {useRouter} from 'vue-router'
import {useAccount} from '../stores/store'
import {ref, onMounted} from 'vue'
import {queryRelays, subscribeToRelays} from '../utils/nostr'

const $router = useRouter()
const $account = useAccount()

const goHome = () => {
  $router.push('/')
}

const loggedIn = ref(false)

onMounted(async () => {
  if ($account.pubkey) {
    loggedIn.value = true
    await queryRelays($account.pubkey)
    subscribeToRelays($account.pubkey)
  }
})
</script>
