const vehicleList = {
  state: {
    carTree: [],
    carList: []
  },
  mutations: {
    SET_CAR_TREE: (state, carTree) => {
      state.carTree = carTree
    },
    SET_CAR_LIST: (state, carList) => {
      state.carList = carList
    }
  },
  actions: {
    ChangeCarTree({ commit }, carTree) {
      commit('SET_CAR_TREE', carTree)
    },
    ChangeCarList({ commit }, carList) {
      commit('SET_CAR_LIST', carList)
    }
  }
}

export default vehicleList
