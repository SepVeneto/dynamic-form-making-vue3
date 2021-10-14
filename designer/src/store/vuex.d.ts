import { ComponentCustomProperties } from "vue";
import { Store } from 'vuex'

declare module 'vue' {
  interface State {
    config: Config,
  }
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}