<template>
  <router-view />
</template>

<script setup>
import {useQuasar} from 'quasar'

const myIcons = {
  'app:nostr': 'img:icons/nostr_icon.svg'
}

const $q = useQuasar()

$q.iconMapFn = iconName => {
  const icon = myIcons[iconName]
  if (icon !== void 0) {
    return {icon: icon}
  }
}
</script>
