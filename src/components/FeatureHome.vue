<template>
  <q-card
    class="col-12 col-sm text-grey-10 text-center"
    flat
  >
    <q-card-section class="q-pa-none">
      <q-icon
        v-if="icon"
        :name="icon"
        size="lg"
        color="primary"
      />
    </q-card-section>
    <q-card-section>
      <div class="text-h6">{{ title }}</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      {{ description }}
    </q-card-section>
  </q-card>
</template>

<script setup>
// import {defineProps} from 'vue'

const props = defineProps({
  title: String,
  description: String,
  icon: String
})
</script>
