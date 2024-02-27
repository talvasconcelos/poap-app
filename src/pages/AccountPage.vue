<template>
  <q-page
    v-if="!loggedIn"
    class="row justify-center items-center"
  >
    <div class="column login-card">
      <div class="row">
        <q-card
          square
          bordered
          class="q-pa-lg shadow-1 full-width"
        >
          <h5 class="text-h5 text-grey-10 q-my-md">Login</h5>
          <q-card-section>
            <div class="text-h6">Nostr Extension</div>
            <div class="text-subtitle2">Use a Nostr extension to login</div>
            <q-btn
              unelevated
              color="primary"
              size="lg"
              class="full-width q-mt-md"
              label="Use Extension"
              :disabled="!hasExtension"
              @click="useExtensionFn"
            />
          </q-card-section>
          <q-separator spaced />
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input
                square
                filled
                clearable
                v-model.trim="inputKey"
                type="text"
                label="nsec or hex"
                hint="Enter your private key"
              />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn
              unelevated
              color="primary"
              size="lg"
              class="full-width"
              label="Login"
              :disabled="!inputKey"
              @click="createAccount"
            />
          </q-card-actions>
          <q-separator spaced />
          <q-card-section>
            <div class="text-h6">Don't have Nostr keys?</div>
            <div class="text-subtitle2">Generate a keypair</div>
            <q-btn
              unelevated
              color="primary"
              size="lg"
              class="full-width q-mt-md"
              label="Generate keys"
              @click="generateKeys"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
  <q-page v-else>
    <div class="container">
      <q-toolbar class="text-primary padded">
        <ProfileCard
          :profile="$account"
          @copy-text="copyText"
          @logout="logout"
          @clear-data="deleteAllData"
        />
      </q-toolbar>
      <div class="row q-col-gutter-lg q-mb-lg">
        <div
          class="col-12 col-md-6 col-lg-4"
          v-for="event in $nostr.getBadges"
          :key="event.id"
        >
          <BadgeCard :event="event" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import {useQuasar, copyToClipboard} from 'quasar'
import {ref, onMounted} from 'vue'
import {useAccount, useNostr} from '../stores/store'
import {
  isValidKey,
  uint8ArrayToHexString,
  hexStringToUint8Array
} from '../utils/utils'

import {queryRelays} from '../utils/nostr'

import {nip19, generateSecretKey, getPublicKey} from 'nostr-tools'
import BadgeCard from '../components/BadgeCard.vue'
import ProfileCard from '../components/ProfileCard.vue'

const nostr = window.nostr

const $q = useQuasar()

const $account = useAccount()
const $nostr = useNostr()
const hasExtension = Boolean(nostr)
const loggedIn = ref(false)
const inputKey = ref('')

onMounted(async () => {
  if ($account.pubkey) {
    loggedIn.value = true
  }
})
function generateKeys() {
  const sk = generateSecretKey()
  inputKey.value = nip19.nsecEncode(sk)
}
function useExtensionFn() {
  let pubkey = getPublicKey()
  $account.update({
    privkey: null,
    pubkey: pubkey,
    nsec: null,
    npub: nip19.npubEncode(pubkey),
    useExtension: true
  })
  loggedIn.value = true
}
async function createAccount() {
  if (isValidKey(inputKey.value, 'nsec')) {
    let key = inputKey.value
    let privkey, pubkey, nsec, npub
    if (key.startsWith('nsec')) {
      let {type, data} = nip19.decode(key)
      privkey = uint8ArrayToHexString(data)
      pubkey = getPublicKey(data)
      nsec = key
      npub = nip19.npubEncode(pubkey)
    } else {
      privkey = key
      pubkey = getPublicKey(privkey)
      nsec = nip19.nsecEncode(hexStringToUint8Array(key))
      npub = nip19.npubEncode(pubkey)
    }
    const setAccount = {
      privkey,
      pubkey,
      nsec,
      npub,
      useExtension: false
    }
    $account.update(setAccount)
    inputKey.value = null
    loggedIn.value = true
    await getFromNostr()
  } else {
    $q.notify({
      type: 'negative',
      message: 'Invalid key'
    })
  }
}
function logout() {
  $q.dialog({
    title: 'Logout',
    message:
      'Please make sure you save your private key! You will not be able to recover it later!',
    cancel: true,
    persistent: true
  }).onOk(() => {
    $account.$reset()
    loggedIn.value = false
  })
}
function deleteAllData() {
  $q.dialog({
    title: 'Delete All Data',
    message:
      'This will remove all information about merchants, products, relays and others.\nYou will NOT be logged out. Do you want to proceed',
    cancel: true,
    persistent: true
  }).onOk(() => {
    $nostr.$reset()
  })
}

// NOSTR
async function getFromNostr() {
  try {
    await queryRelays($account.pubkey)
  } catch (e) {
    console.error(e)
  }
}

// UTILS
function copyText(text) {
  copyToClipboard(text).then(() => {
    $q.notify({
      message: 'Copied to clipboard',
      color: 'positive',
      position: 'top'
    })
  })
}
</script>

<style>
.login-card {
  width: 85%;
  max-width: 500px;
}
</style>
