const DOUBAN_API_ROOT = 'https://frodo.douban.com'
  // const DOUBAN_API_ROOT = '/api'

export const doubanApi = {
  loginUrl: DOUBAN_API_ROOT + '/service/auth2/token',
  getChatListUrl: DOUBAN_API_ROOT + '/api/v2/chat_list',
  // getChatListUrl: DOUBAN_API_ROOT + '/api/v2/user/78709139/following'
  getFollowingUrl(userId) {
    return DOUBAN_API_ROOT + `/api/v2/user/${userId}/following`
  },
  getHomeTimelineUrl: DOUBAN_API_ROOT + '/api/v2/status/home_timeline',
  getHasNewRecsUrl: DOUBAN_API_ROOT + '/api/v2/user/recommended_users/has_new_recs'
}
