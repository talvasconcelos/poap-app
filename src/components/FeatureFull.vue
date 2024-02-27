<template>
  <div class="row padded">
    <div
      class="col-12 text-grey-10"
      flat
    >
      <div class="grid">
        <div class="grid-col q-pa-md">
          <div class="text-h3 text-weight-bold q-mb-md text-primary">
            {{ title }}
          </div>
          <p class="text-body1">{{ description }}</p>
          <div v-if="cta">
            <q-btn
              :label="ctaName"
              :href="ctaUrl"
              target="_blank"
              color="primary"
            />
          </div>
        </div>

        <div
          class="grid-col image"
          :class="orderOverride"
        >
          <q-img
            style="max-height: 350px"
            :style="orderOverride"
            :src="props.image"
            fit="cover"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import {useQuasar} from 'quasar'

const props = defineProps({
  title: String,
  description: String,
  image: String,
  imgside: {type: String, default: 'left'},
  cta: {type: Boolean, default: false},
  ctaName: String,
  ctaUrl: String
})

const $q = useQuasar()

const orderOverride = computed(() => {
  if ($q.screen.gt.sm && props.imgside == 'right') {
    return 'right'
  }
  return ''
})
</script>

<style lang="scss">
.grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  justify-items: center;

  @media (min-width: $breakpoint-md-min) {
    grid-template-columns: repeat(2, 1fr);
  }

  .grid-col {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 100%;

    @media (min-width: $breakpoint-md-min) {
      max-width: 500px;
    }

    &.image {
      order: -1;
    }
    &.right {
      order: 2;
    }
    img {
      width: 100%;
      max-width: 100%;
      height: auto;
      object-fit: cover;
    }
  }
}
</style>
