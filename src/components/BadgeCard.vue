<template>
  <q-card v-if="loading">
    <q-skeleton
      height="200px"
      square
    />
    <q-item>
      <q-item-section>
        <q-item-label>
          <q-skeleton type="text" />
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-card-actions
      align="right"
      class="q-gutter-md"
    >
      <q-skeleton type="QBtn" />
      <q-skeleton type="QBtn" />
    </q-card-actions>
  </q-card>
  <q-card
    v-else
    flat
    bordered
  >
    <q-img :src="event.image" />

    <q-card-section>
      <div class="q-mt-sm q-mb-xs">
        <span class="text-h5 ellipsis">{{ event.name }}</span>
        <q-btn
          class="float-right"
          color="grey"
          round
          flat
          dense
          :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="expanded = !expanded"
        />
      </div>
    </q-card-section>

    <q-slide-transition>
      <div v-show="expanded">
        <q-separator />
        <q-card-section class="text-subtitle2">
          {{ event.description }}
        </q-card-section>
      </div>
    </q-slide-transition>

    <q-card-actions v-if="claim">
      <q-btn
        :disable="btnDisabled"
        flat
        color="primary"
        label="Claim"
        @click="claimBadge"
      />
      <!-- <q-btn
        v-else
        flat
        color="secondary"
        label="Wear"
      /> -->
    </q-card-actions>
  </q-card>
</template>

<script setup>
import {ref} from 'vue'

const emit = defineEmits(['claim'])

defineProps({
  event: Object,
  loading: {
    type: Boolean,
    default: false
  },
  claim: {
    type: Boolean,
    default: false
  },
  wearing: Boolean
})
const expanded = ref(false)
const btnDisabled = ref(false)

const claimBadge = () => {
  btnDisabled.value = true
  emit('claim')
}
</script>

<style></style>
