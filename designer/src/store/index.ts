import { InjectionKey } from 'vue';
import { createStore, Store, useStore as baseStore } from 'vuex'
interface State {
  id: number,
  config: Config,
  current: RenderCell,
}

export const key: InjectionKey<Store<State>> = Symbol()

export function useStore() {
  return baseStore(key)
}

function findParent(list: RenderCell[], key: string): RenderCell[] | false {
  let res: RenderCell[] | boolean = false;
  for (let i = 0; i < list.length; ++i) {
    if (list[i].prop === key) {
      return list;
    }
    if (list[i].elements) {
      const res = findParent(list[i].elements as RenderCell[], key)
      if (res) {
        return res;
      }
    }
  }
  return false
}

const store = createStore<State>({
  state: {
    id: 0,
    config: {
      config: {},
      data: [],
    },
    current: {} as RenderCell,
  },
  mutations: {
    INCREASE_ID(state) {
      state.id += 1;
    },
    DELETE_CONFIG(state, data) {
      const parent = findParent(state.config.data, data.prop)
      if (!parent) {
        return;
      }
      const index = parent.findIndex(item => item.prop === data.prop);
      parent.splice(index, 1);
    },
    COPY_CONFIG(state, data) {
      const parent = findParent(state.config.data, data.prop)
      if (!parent) {
        return;
      }
      parent.push({
        ...data,
        id: state.id,
        prop: `${data.type}-${Date.now()}`,
      })
      store.commit('INCREASE_ID');
    },
    UPDATE_CONFIG(state, config) {
      state.config = config;
    },
    UPDATE_SELECT(state, data) {
      state.current = data;
    }
  },
})

export default store;
