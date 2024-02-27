import {nip19} from 'nostr-tools'
import {hexToBytes, bytesToHex} from '@noble/hashes/utils'

export function uint8ArrayToHexString(uint8Array) {
  return bytesToHex(uint8Array)
}

export function hexStringToUint8Array(hexString) {
  return hexToBytes(hexString)
}

export function isValidKey(key, prefix = 'n') {
  try {
    if (key && key.startsWith(prefix)) {
      let {_, data} = nip19.decode(key)
      key = uint8ArrayToHexString(data)
    }
    return isValidKeyHex(key)
  } catch (error) {
    return false
  }
}

export function isValidKeyHex(key) {
  return !!key?.toLowerCase()?.match(/^[0-9a-f]{64}$/)
}

export async function hash(string) {
  const utf8 = new TextEncoder().encode(string)
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray
    .map(bytes => bytes.toString(16).padStart(2, '0'))
    .join('')
  return hashHex
}

export function isJson(str) {
  if (typeof str !== 'string') {
    return false
  }
  try {
    JSON.parse(str)
    return true
  } catch (error) {
    return false
  }
}

export function createBadgeObj(event) {
  let badge = {
    id: event.id,
    issuer: event.pubkey,
    created_at: event.created_at
  }

  event.tags.forEach(([k, v]) => {
    if (badge[k] === undefined) {
      badge[k] = v
    } else {
      if (!Array.isArray(badge[k])) {
        badge[k] = [badge[k]]
      }
      badge[k].push(v)
    }
  })

  return badge
}

export function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // Success function
        position => {
          const {latitude, longitude} = position.coords
          resolve([latitude, longitude])
        },
        // Error function
        async () => {
          const [lat, lon] = await positionIP()
          resolve([lat, lon])
        },
        // Options. See MDN for details.
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      )
    } else {
      console.log('Geolocation is not supported by this browser.')
      positionIP().then(resolve).catch(reject)
    }
  })
}

function positionIP() {
  return fetch('http://ip-api.com/json/')
    .then(response => response.json())
    .then(({lat, lon}) => [lat, lon])
}

export function getTagValue(event, tag) {
  return event.tags.find(([k, v]) => k == tag)?.[1]
}
