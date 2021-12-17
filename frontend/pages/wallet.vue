<template>
  <v-app>
    <v-app-bar color="white" dense flat>
      <v-app-bar-nav-icon>
        <v-icon large>mdi-arrow-left-bold</v-icon>
      </v-app-bar-nav-icon>
      <p style="margin-bottom:0px; font-weight: bold;">지갑</p>
    </v-app-bar>

    <v-row dense>
      <v-col
        v-for="(item, i) in cards"
        :key="i"
        cols="8"
        class="cardInfo"
      >
        <v-card
          :color="item.color"
        >
          <div class="d-flex flex-no-wrap justify-space-between align-content-center">
            <div class="d-flex">
              <v-avatar
                class="ma-3"
                size="50"
                tile
              >
                <v-img :src="item.src" />
              </v-avatar>
              <v-card-title
                class="text-h5 moneyValue"
                v-text="`${item.money}개`"
              />

              <!-- <v-card-actions>
                <v-btn
                  v-if="item.artist === 'Ellie Goulding'"
                  class="ml-2 mt-3"
                  fab
                  icon
                  height="40px"
                  right
                  width="40px"
                >
                  <v-icon>mdi-play</v-icon>
                </v-btn>

                <v-btn
                  v-else
                  class="ml-2 mt-5"
                  outlined
                  rounded
                  small
                >
                  START RADIO
                </v-btn>
              </v-card-actions> -->
            </div>
            <div class="conten">
              <v-btn
                elevation="2"
                rounded
              >
                {{ item.title }}
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <!-- <template #activator="{ on, attrs }">
          <v-btn
            icon
            color="yellow"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template> -->
    <v-main>
      <Wallet />
    </v-main>
    <v-footer>
      <v-toolbar>
        <v-tabs
          background-color="white"
          grow
        >
          <v-tab>
            <v-icon large>mdi-home</v-icon>
          </v-tab>

          <v-tab>
            <v-badge
              color="green"
              content="6"
            >
              <v-icon large>mdi-forum</v-icon>
            </v-badge>
          </v-tab>

          <v-tab>
            <v-icon large>mdi-folder-open</v-icon>
          </v-tab>
        </v-tabs>
      </v-toolbar>
    </v-footer>
  </v-app>
</template>

<script>
import Wallet from '~/components/Home/MainContent/Wallet';

export default {
  components: {
    Wallet
  },
  layout: 'Home',
  middleware: ['authenticated'],
  data () {
    return {
      items: [
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me 2' }
      ],
      cards: [
        {
          color: '#FFF9C4',
          src: 'https://verticalplatform.kr/wp-content/uploads/2017/12/bitcoinlogo.jpg',
          title: '캐시충전',
          money: '123123123',
          artist: 'Foster the People'
        },
        {
          color: '#FCE4EC',
          src: 'https://png.pngtree.com/png-clipart/20201226/ourmid/pngtree-ruby-diamond-png-image_2653684.jpg',
          title: '보석충전',
          money: '456745674',
          artist: 'Ellie Goulding'
        }
      ]
    };
  }
};
</script>

<style scoped>
  .cardInfo {
    margin: 0 auto;
  }
  .moneyValue{
    padding-left: 0px;
  }
  .conten{
    margin: auto 0;
    margin-right:5px;
  }
</style>
