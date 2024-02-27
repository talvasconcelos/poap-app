import {SimplePool, nip19} from 'nostr-tools'
import {useNostr} from '../stores/store'

const pool = new SimplePool()
const $nostr = useNostr()

const defaultRelays = [
  'wss://relay.damus.io',
  'wss://relay.snort.social',
  // 'wss://nostr-pub.wellorder.net',
  'wss://relay.nostr.band',
  'wss://nos.lol',
  'wss://purplepag.es'
]

// kind: 8 badge award by issuer
// kind: 30009 badge creation by issuer
// kind: 30008 wear badge by user

export function subscribeToRelays(author) {
  const relaysSet = new Set([...$nostr.relays, ...defaultRelays])
  const since =
    $nostr.events.sort((a, b) => b.created_at - a.created_at)[0].created_at || 0
  pool.subscribeMany(
    Array.from(relaysSet),
    [
      {
        authors: [author],
        kinds: [0, 3, 30008, 10002],
        since
      },
      {
        kinds: [8],
        '#p': [author],
        since
      },
      {
        kinds: [10002, 3],
        authors: $nostr.getIssuers,
        since
      }
    ],
    {
      async onevent(event) {
        if (event.kind == 8) {
          await getBadgeById(event)
        }
        if (event.kind == 3) {
          $nostr.updateRelays(event)
        }
        $nostr.updateEvent(event)
      }
    }
  )
}

export async function queryRelays(author) {
  const relaysSet = new Set([...$nostr.relays, ...defaultRelays])
  const events = await pool.querySync([...relaysSet], {
    kinds: [0, 8],
    '#p': [author]
  })
  $nostr.updateEvents(events)
  let badgeIds = new Set()
  let issuers = new Set()
  events.forEach(event => {
    let aTag = event.tags.find(tag => tag[0] == 'a')
    if (aTag) {
      let [kind, issuer, badgeId] = aTag[1].split(':')
      badgeIds.add(badgeId)
      issuers.add(issuer)
    }
  })

  await queryBadges([...badgeIds], [...issuers])
}

export async function queryBadges(ids = [], authors = []) {
  const relaysSet = new Set([...$nostr.relays, ...defaultRelays])
  const events = await pool.querySync([...relaysSet], {
    authors: authors,
    '#d': [...ids],
    kinds: [30009]
  })
  $nostr.updateEvents(events)
}

async function getBadgeById(event) {
  const relaysSet = new Set([...$nostr.relays, ...defaultRelays])
  let aTag = event.tags.find(tag => tag[0] == 'a')
  if (aTag) {
    let [kind, issuer, badgeId] = aTag[1].split(':')
    let badge = await pool.get([...relaysSet], {
      '#d': [badgeId],
      kinds: [30009],
      authors: [issuer]
    })
    $nostr.updateEvent(badge)
  }
}

export async function getBadge(naddr) {
  const relaysSet = new Set([...$nostr.relays, ...defaultRelays])
  let {_, data} = nip19.decode(naddr)
  let event = await pool.get([...relaysSet], {
    '#d': [data.identifier],
    kinds: [30009],
    authors: [data.pubkey]
  })
  return event
}

export async function publishToRelays(event, relays = []) {
  const relaysSet = new Set([...$nostr.relays, ...defaultRelays])
  await Promise.any(pool.publish([...relaysSet], event))
}
