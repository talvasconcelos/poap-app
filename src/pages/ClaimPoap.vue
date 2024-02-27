<template>
  <q-page
    v-if="badge"
    class="container padded"
  >
    <div class="badge q-mx-auto">
      <q-banner
        v-if="hasLocation"
        class="bg-primary text-white q-mb-lg"
      >
        <strong>Important Notice:</strong> To claim this POAP badge, the issuer
        has requested your location. This is solely to ensure that the badge is
        being claimed at the physical location it represents. Please be assured
        that no data gathering is done with the location information.
      </q-banner>
      <BadgeCard
        :loading="loadingPoap"
        claim
        :event="badge"
        @claim="claimBadge"
      />
    </div>
  </q-page>
  <div
    v-else
    class="container padded scanner"
  >
    <qrcode-stream
      @camera-on="onCamera"
      @detect="onDetect"
      ><q-inner-loading :showing="loading">
        <q-spinner-gears
          size="50px"
          color="primary"
        /> </q-inner-loading
    ></qrcode-stream>
  </div>
</template>

<script setup>
import {onMounted, ref, computed} from 'vue'
import {QrcodeStream} from 'vue-qrcode-reader'
import {useNostr, useAccount} from '../stores/store'
import {getBadge, publishToRelays} from '../utils/nostr'
import BadgeCard from '../components/BadgeCard.vue'
import {createBadgeObj, getLocation, getTagValue} from '../utils/utils'
import {finalizeEvent} from 'nostr-tools/pure'
import {nip04} from 'nostr-tools'
import {useQuasar} from 'quasar'

const $nostr = useNostr()
const $account = useAccount()
const $q = useQuasar()

const badge = ref(null)
const loading = ref(true)
const loadingPoap = ref(false)
const hasLocation = computed(() => {
  return (
    badge.value.subject && badge.value.subject.split(':').includes('location')
  )
})

// onMounted(async () => {
//   badge.value = false
// })

const onCamera = () => {
  loading.value = false
}

async function onDetect(result) {
  console.log('detected', result)
  try {
    badge.value = {}
    loadingPoap.value = true
    let naddr = result[0].rawValue.replace('nostr://', '')
    let badgeData = await getBadge(/*badge.value*/ naddr)
    if (
      $nostr.events
        .filter(ev => ev.kind == 30009)
        .find(e => getTagValue(e, 'd') === getTagValue(badgeData, 'd'))
    ) {
      $q.notify({
        type: 'warning',
        message: `You already have this badge!`
      })
      loadingPoap.value = false
      badge.value = false
      return
    }
    badge.value = createBadgeObj(badgeData)
    loadingPoap.value = false
  } catch (error) {
    console.error(error)
    badge.value = null
    loadingPoap.value = false
  }
}

async function claimBadge() {
  const [lat, long] = await getLocation()
  console.log('Claiming badge', lat, long)

  try {
    const event = {
      kind: 4,
      created_at: Math.floor(Date.now() / 1000),
      tags: [['p', badge.value.issuer]]
    }
    const content = {
      lat,
      long,
      badge_id: badge.value.d,
      type: 'claim_poap'
    }
    event.content = await nip04.encrypt(
      $account.privkey,
      badge.value.issuer,
      JSON.stringify(content)
    )
    console.log(content, finalizeEvent(event, $account.privkey))
    await publishToRelays(finalizeEvent(event, $account.privkey))

    // event.id = NostrTools.getEventHash(event);
    // event.sig = await NostrTools.signEvent(event, this.account.privkey);

    // await this._sendDmEvent(event);
    // event.content = dm.message;
    // this._persistDMEvent(event, dm.to);
  } catch (error) {
    $q.notify({
      type: 'warning',
      message: `Failed to send message! ${error}`
    })
  }
}
</script>

<style lang="scss">
.scanner {
  max-width: 400px;
}

.badge {
  width: 85%;
  max-width: 500px;
}
</style>
