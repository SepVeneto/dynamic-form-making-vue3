import { InjectionKey } from 'vue-demi';
import { createStore, Store, useStore as baseStore } from 'vuex'
interface State {
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
  // return false;
  // list.forEach(item => {
  //   if (item.prop === key) {
  //     res = list;
  //     return res;
  //   }
  //   if (item.elements && item.elements.length > 0) {
  //     res = findParent(item.elements, key);
  //     return res;
  //   }
  // })
  // return res;
}

const store = createStore<State>({
  state: {
    config: {
      config: {},
      data: [],
    },
    current: {} as RenderCell,
  },
  mutations: {
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
      console.log(parent)
      if (!parent) {
        return;
      }
      parent.push({
        ...data,
        prop: `${data.prop}-${Date.now()}`,
      })
    },
    UPDATE_CONFIG(state, config) {
      state.config = config;
    },
    UPDATE_SELECT(state, data) {
      state.current = data;
    }
  }
})

export default store;
