<template>
  <section class="hero">
    <div class="container full-height">
      <h1 class="text-h2 text-weight-bolder q-ma-none">
        <span class="text-primary">Nostr</span> POAP
      </h1>
      <h3 class="q-ma-none">Flex your digital collectibles</h3>
      <div class="q-mt-sm text-caption">
        Powered by <span class="text-bold text-secondary">LNbits</span>
      </div>
    </div>
  </section>
  <q-page class="container">
    <FeatureFull
      title="What is POAP"
      description="POAP, which stands for Proof of Attendance Protocol, transforms your event attendance into a captivating collection of digital stories. Envision it as a series of badges that commemorate the places you've visited, events you've attended, and cherished experiences you've gathered along the way. Beyond mere badges, POAP serves as your digital journey keepsake, enabling you to collect memories rather than just tokens. It empowers you to create a distinctive and personalized celebration of your life's adventures."
      image="/images/02.svg"
      imgside="right"
    />
    <section class="row q-mt-lg">
      <Feature
        title="Collectible Moments"
        description='Just like you collect physical souvenirs to remember special moments, POAP lets you collect digital badges for each event you attend. These badges are your digital flex, your way of saying, "I was there, I experienced it!"'
        icon="military_tech"
      />
      <Feature
        title="No Blockchain Hassle"
        description="No need for complex blockchain setups. With POAP, your digital fridge magnet collection is effortlessly created through the Nostr protocol. It's simple, transparent, and adds a touch of joy to your digital journey."
        icon="link_off"
      />
      <Feature
        title="Flex Your Digital Journey"
        description="Your POAP collection is a visual representation of the places you've been, the people you've met, and the memories you've made. It's your unique digital flex, proudly displayed for all to see."
        icon="thumb_up"
      />
    </section>
    <section class="justify-center padded">
      <div
        class="text-h3 text-bold text-center text-uppercase text-primary padded"
      >
        How does it work?
      </div>
      <div class="row q-mt-lg">
        <Feature
          title="Mint on Nostr"
          description="Mint your POAP (Nostr badge) by scanning a QR code at an event, landmark or wherever an issuer intends with this app. It's a simple and quick process that adds a touch of magic to your digital journey."
          icon="center_focus_strong"
        />
        <Feature
          title="Receive Your POAP"
          description="Once you've minted your POAP, it's yours to keep. It's soul bound to your Nostr account, and you can choose to 'wear' it on your profile or display it in your collection."
          icon="mobile_friendly"
        />
        <Feature
          title="Revel in Your Collection"
          description="Your POAP collection is a visual representation of the places you've been, the people you've met, and the memories you've made. It's your unique digital flex, proudly displayed for all to see."
          icon="verified"
        />
      </div>
    </section>
    <FeatureFull
      title="How to be an issuer?"
      description="Ready to revolutionize community engagement? Become a POAP issuer with a user-friendly LNbits extension and unleash the potential of digital collectibles! Engage your community uniquely - POAP lets advertisers and marketers connect meaningfully through exclusive digital collectibles. Promote your space by driving foot traffic and boosting engagement; entice your audience with location-based badges, encouraging visitors to explore, participate, and collect badges, turning every interaction into a memorable experience."
      image="/images/01.svg"
      imgside="left"
      cta
      cta-name="Visit LNbits"
      cta-url="https://lnbits.com/"
    />
  </q-page>
</template>

<script setup>
import Feature from '../components/FeatureHome.vue'
import FeatureFull from '../components/FeatureFull.vue'
</script>

<style lang="scss">
.hero {
  display: flex;
  align-items: center;
  min-height: 50vh;
}
</style>
