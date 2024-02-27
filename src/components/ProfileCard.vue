<template>
  <q-card class="full-width">
    <q-item>
      <q-item-section avatar>
        <q-avatar icon="app:nostr" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{
          `${profile.pubkey.slice(0, 6)}...${profile.pubkey.slice(-6)}`
        }}</q-item-label>
      </q-item-section>
      <q-item-section
        side
        top
      >
        <q-btn
          color="grey"
          round
          flat
          dense
          :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="expanded = !expanded"
        />
      </q-item-section>
    </q-item>
    <q-slide-transition>
      <div v-show="expanded">
        <q-separator />
        <q-card-section>
          <div class="row">
            <div class="col-10">
              <q-input
                :model-value="profile.npub"
                readonly
                disbled
                outlined
                :hint="profile.pubkey"
                type="text"
                label="Public Key"
                class="q-mb-md"
              >
                <template v-slot:append>
                  <q-btn
                    @click="copyText(profile.npub)"
                    icon="content_copy"
                    label="Npub"
                    flat
                    color="gray float-right q-mt-sm"
                  ></q-btn>
                </template>
              </q-input>
            </div>

            <div class="col-2 auto-width">
              <q-btn
                @click="copyText(profile.pubkey)"
                icon="content_copy"
                label="Hex"
                flat
                color="gray float-right q-mt-sm"
              ></q-btn>
            </div>
          </div>

          <div
            class="row"
            v-if="profile.privkey"
          >
            <div class="col-10">
              <q-input
                :model-value="profile.nsec"
                readonly
                disbled
                outlined
                type="password"
                label="Private Key"
                class="q-mb-md"
              >
                <template v-slot:append>
                  <q-btn
                    @click="copyText(profile.nsec)"
                    icon="content_copy"
                    label="Nsec"
                    flat
                    color="gray"
                    class="float-right q-mt-sm"
                  ></q-btn>
                </template>
              </q-input>
            </div>

            <div class="col-2 auto-width">
              <q-btn
                @click="copyText(profile.privkey)"
                icon="content_copy"
                label="Hex"
                flat
                color="gray"
                class="float-right q-mt-sm"
              ></q-btn>
            </div>
          </div>
        </q-card-section>
      </div>
    </q-slide-transition>
    <q-separator />
    <q-card-actions class="justify-end">
      <q-btn
        @click="clearData"
        flat
        label="Clear All Data"
        icon="delete"
        class="q-ml-lg"
        color="negative"
      ></q-btn>
      <q-btn
        @click="logout"
        flat
        label="Logout"
        icon="logout"
        class="q-ml-lg"
        color="primary"
      ></q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import {ref} from 'vue'

defineProps({
  profile: Object
})

const emit = defineEmits(['copy-text', 'logout', 'clear-data'])

const expanded = ref(false)

const copyText = text => {
  emit('copy-text', text)
}

const logout = () => {
  emit('logout')
}

const clearData = () => {
  emit('clear-data')
}
</script>
