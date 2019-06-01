const vehicleList = {
  state: {
    carList: []
  },
  mutations: {
    SET_CAR_LIST: (state, carList) => {
      state.carList = carList
    }
  },
  actions: {
    ChangeCarList({ commit }, carList) {
      commit('SET_CAR_LIST', carList)
    }
  }
}

export default vehicleList
