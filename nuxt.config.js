// import i18n from "./i18n";
import pkg from "./package";
import path from "path";
import fs from "fs";

export default {
  ssr: false,
  target: "static",
  components: true,
  /*
   ** Headers of the page
   */
  server: {
    port: process.env.DEPLOY == "DEV" ? process.env.D_PORT : process.env.DEPLOY == "STAGE" ? process.env.S_PORT : process.env.PORT,
  },
  head: {
    title: "NFT world",
    meta: [
      {charset: "utf-8"},
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, user-scalable=no",
      },
      {
        hid: "description",
        name: "description",
        content: "Own a piece of the next-gen metaverse!", // process.env.APP_DESC || pkg.description,
      },
      {
        property: "og:title",
        content: "NFTworld", // process.env.APP_NAME || pkg.name,
      },
      {
        property: "og:description",
        content: "Own a piece of the next-gen metaverse!", // process.env.APP_DESC || pkg.description,
      },
      {
        property: "og:image",
        content: "/socials-preview.png",
      },
      {
        property: "og:url",
        content: "https://nftworld.com/",
      },
      {
        property: "og:type",
        content: "website",
      },
    ],

    script: [],

    link: [
      {
        rel: "shortcut icon",
        type: "image/x-icon",
        href: `/favicon.ico?v=${pkg.version}`,
      },
      {
        rel: "apple-touch-icon",
        href: `/apple-touch-icon.png?v=${pkg.version}`,
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        href: `/android-icon-192x192.png?v=${pkg.version}`,
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        href: `/android-icon-512x512.png?v=${pkg.version}`,
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: `/favicon-32x32.png?v=${pkg.version}`,
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: `/favicon-16x16.png?v=${pkg.version}`,
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Poppins&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300&display=swap",
      },
    ],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: false,

  /*
   ** Global CSS
   */
  css: ["@/assets/scss/app.scss", "swiper/css/swiper.min.css"],
  styleResources: {
    scss: ["@/node_modules/bootstrap/scss/_functions.scss", "@/node_modules/bootstrap/scss/_mixins.scss", "@/assets/scss/_variables.scss"],
  },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "@/plugins/identicon",
    "@/plugins/web3",
    "@/plugins/perfect-scroll",
    "@/plugins/vue-countup",
    "@/plugins/vClickOutside",
    "@/plugins/vueintersect",
    "@/plugins/searchSelect",
    "@/plugins/gtag",
    "@/plugins/axios",
    {src: "@/plugins/vue-swiper", ssr: false},
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    "@nuxtjs/eslint-module",
    "@nuxtjs/svg",
    "@nuxtjs/style-resources",
    "@nuxtjs/localforage",
    "@nuxtjs/axios",
    "@nuxtjs/dotenv",
    "@nuxtjs/device",
    // "nuxt-purgecss",
  ],
  purgeCSS: {
    whitelist: () => ["html", "body", "#__nuxt", "#__layout"],
    whitelistPatterns: () => [/navbar/, /alert/, /bg/, /dropdown/],
  },
  /*
   ** Nuxt.js modules
   */
  modules: ["nuxt-socket-io", "@nuxtjs/axios", ["vue-scrollto/nuxt", {duration: 700}]],

  /*
   ** nuxt-socket-io Options
   */

  io: {
    // Options
    sockets: [{name: "connect", url: "https://www.game.api.nftworld.com/"}],
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */

  privateRuntimeConfig: {
    axios: {
      baseURL: "https://millionpieces.io/",
    },
  },

  /*
   ** Build configuration
   */
  build: {
    extractCSS: true,
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/,
          options: {
            fix: true,
          },
        });
      }
    },
  },
  env: {
    DEPLOY: process.env.DEPLOY,
    INFURA_KEY: process.env.INFURA_KEY,
    GAME_ATTACK_PRICE: process.env.GAME_ATTACK_PRICE,
    GAME_FEND_PRICE: process.env.GAME_FEND_PRICE,
    GAME_BUY_PRICE: process.env.GAME_BUY_PRICE,
    GAME_INCOME: process.env.GAME_INCOME,
    VAULT_ADDRESS:
      process.env.DEPLOY == "DEV"
        ? process.env.D_VAULT_ADDRESS
        : process.env.DEPLOY == "STAGE"
        ? process.env.S_VAULT_ADDRESS
        : process.env.VAULT_ADDRESS,
    FORTMATICS_KEY: process.env.FORTMATICS_KEY,
    SEGMENT_PRICE:
      process.env.DEPLOY == "DEV"
        ? process.env.D_SEGMENT_PRICE
        : process.env.DEPLOY == "STAGE"
        ? process.env.S_SEGMENT_PRICE
        : process.env.SEGMENT_PRICE,
    NETWORK:
      process.env.DEPLOY == "DEV" ? process.env.D_NETWORK : process.env.DEPLOY == "STAGE" ? process.env.S_NETWORK : process.env.NETWORK,
    NETWORK_GAME:
      process.env.DEPLOY == "DEV"
        ? process.env.D_NETWORK_GAME
        : process.env.DEPLOY == "STAGE"
        ? process.env.S_NETWORK_GAME
        : process.env.NETWORK_GAME,
    NETWORK_CHAIN_ID:
      process.env.DEPLOY == "DEV"
        ? process.env.D_NETWORK_CHAIN_ID
        : process.env.DEPLOY == "STAGE"
        ? process.env.S_NETWORK_CHAIN_ID
        : process.env.NETWORK_CHAIN_ID,
    NETWORK_GAME_CHAIN_ID:
      process.env.DEPLOY == "DEV"
        ? process.env.D_NETWORK_GAME_CHAIN_ID
        : process.env.DEPLOY == "STAGE"
        ? process.env.S_NETWORK_GAME_CHAIN_ID
        : process.env.NETWORK_GAME_CHAIN_ID,
    OWNER_ADDRESS:
      process.env.DEPLOY == "DEV"
        ? process.env.D_OWNER_ADDRESS
        : process.env.DEPLOY == "STAGE"
        ? process.env.S_OWNER_ADDRESS
        : process.env.OWNER_ADDRESS,
    TOKEN_ADDRESS:
      process.env.DEPLOY == "DEV"
        ? process.env.D_TOKEN_ADDRESS
        : process.env.DEPLOY == "STAGE"
        ? process.env.S_TOKEN_ADDRESS
        : process.env.TOKEN_ADDRESS,
    NODE_ENV: process.env.NODE_ENV || "development",
    SERVER_URL:
      process.env.DEPLOY == "DEV"
        ? process.env.D_SERVER_URL
        : process.env.DEPLOY == "STAGE"
        ? process.env.S_SERVER_URL
        : process.env.SERVER_URL,

    SERVER_GAME_URL:
      process.env.DEPLOY == "DEV"
        ? process.env.D_SERVER_GAME_URL
        : process.env.DEPLOY == "STAGE"
        ? process.env.S_SERVER_GAME_URL
        : process.env.SERVER_GAME_URL,

    PORT: process.env.DEPLOY == "DEV" ? process.env.D_PORT : process.env.DEPLOY == "STAGE" ? process.env.S_PORT : process.env.PORT,
    GRAPH: process.env.DEPLOY == "DEV" ? process.env.D_GRAPH : process.env.DEPLOY == "STAGE" ? process.env.S_GRAPH : process.env.GRAPH,
    AUCTION_ADDRESS:
      process.env.DEPLOY == "DEV"
        ? process.env.D_AUCTION_ADDRESS
        : process.env.DEPLOY == "STAGE"
        ? process.env.S_AUCTION_ADDRESS
        : process.env.AUCTION_ADDRESS,
    AIRDROP_ADDRESS:
      process.env.DEPLOY == "DEV"
        ? process.env.D_AIRDROP_ADDRESS
        : process.env.DEPLOY == "STAGE"
        ? process.env.S_AIRDROP_ADDRESS
        : process.env.AIRDROP_ADDRESS,
    PIECE_BALANCE:
      process.env.DEPLOY == "DEV"
        ? process.env.D_PIECE_BALANCE
        : process.env.DEPLOY == "STAGE"
        ? process.env.S_PIECE_BALANCE
        : process.env.PIECE_BALANCE,
    MILLION_PIECES_ADDRESS:
      process.env.DEPLOY == "DEV"
        ? process.env.D_MILLION_PIECES_ADDRESS
        : process.env.DEPLOY == "STAGE"
        ? process.env.S_MILLION_PIECES_ADDRESS
        : process.env.MILLION_PIECES_ADDRESS,
    MILTI_SEND_ADDRESS:
      process.env.DEPLOY == "DEV"
        ? process.env.D_MILTI_SEND_ADDRESS
        : process.env.DEPLOY == "STAGE"
        ? process.env.S_MILTI_SEND_ADDRESS
        : process.env.MILTI_SEND_ADDRESS,
    PIECE_ADDRESS:
      process.env.DEPLOY == "DEV"
        ? process.env.D_PIECE_ADDRESS
        : process.env.DEPLOY == "STAGE"
        ? process.env.S_PIECE_ADDRESS
        : process.env.PIECE_ADDRESS,
    SEGMENTS_AIRDROP:
      process.env.DEPLOY == "DEV"
        ? process.env.D_SEGMENT_PRICE
        : process.env.DEPLOY == "STAGE"
        ? process.env.S_SEGMENTS_AIRDROP
        : process.env.SEGMENTS_AIRDROP,
    MIN_IMG:
      process.env.DEPLOY == "DEV" ? process.env.D_MIN_IMG : process.env.DEPLOY == "STAGE" ? process.env.S_MIN_IMG : process.env.MIN_IMG,
    LARGE_IMG:
      process.env.DEPLOY == "DEV"
        ? process.env.D_LARGE_IMG
        : process.env.DEPLOY == "STAGE"
        ? process.env.S_LARGE_IMG
        : process.env.LARGE_IMG,
  },
  generate: {
    fallback: true,
  },
};
