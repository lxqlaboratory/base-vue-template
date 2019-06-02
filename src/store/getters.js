const getters = {
  sidebar: state => state.app.sidebar,
  navbar: state => state.app.navbar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  carTree: state => state.vehicleList.carTree,
  carList: state => state.vehicleList.carList
}
export default getters
