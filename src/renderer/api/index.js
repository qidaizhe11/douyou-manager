import Qs from 'qs'
import axois from 'axios'
import { doubanApi } from '@/utils/config'
import Util from './util'

export default {
  fetchGetChatList({ start, count, token }) {
    const params = Qs.stringify({
      start: start,
      count: count,
      apikey: '0dad551ec0f84ed02907ff5c42e8ec70',
      os_rom: 'miui6',
      channel: 'Xiaomi_Market',
      udid: '8a2a02080cd222dfd017d22833736a7ee3a9bae5'
        // _sig: 'uzi16lcNw1VnY/aoq4t0SmK7Qno%3D',
        // _ts: '1496901875'
    })
    const url = doubanApi.getChatListUrl + `?${params}`
    return Util.fetchData(url, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
  },
  fetchGetChatMessages({ chatId, start, count, token }) {
    const params = Qs.stringify({
      // start: start,
      type: 'private',
      cid: chatId,
      max_id: 0,
      count: count,
      apikey: '0dad551ec0f84ed02907ff5c42e8ec70',
      os_rom: 'miui6',
      channel: 'Xiaomi_Market',
      udid: '8a2a02080cd222dfd017d22833736a7ee3a9bae5'
    })
    const url = doubanApi.getChatMessagesUrl + `?${params}`
    return Util.fetchData(url, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
  },
  fetchGetFollowing({ userId, count, token }) {
    const params = Qs.stringify({
      count: count,
      apikey: '0dad551ec0f84ed02907ff5c42e8ec70',
      os_rom: 'miui6',
      channel: 'Xiaomi_Market',
      udid: '8a2a02080cd222dfd017d22833736a7ee3a9bae5'
        // _sig: 'uzi16lcNw1VnY/aoq4t0SmK7Qno%3D',
        // _ts: '1496901875'
    })
    const url = doubanApi.getFollowingUrl(userId) + `?${params}`
    return Util.fetchData(url, {
      method: 'get'
        // headers: {
        //   'Authorization': 'Bearer ' + token
        // }
    })
  },
  fetchGetHomeTimeline({ token }) {
    const params = Qs.stringify({
      count: 15,
      last_visit_id: '1998734305',
      apikey: '0dad551ec0f84ed02907ff5c42e8ec70',
      os_rom: 'miui6',
      channel: 'Xiaomi_Market',
      udid: '8a2a02080cd222dfd017d22833736a7ee3a9bae5'
        // _sig: 'uzi16lcNw1VnY/aoq4t0SmK7Qno%3D',
        // _ts: '1496901875'
    })
    const url = doubanApi.getHomeTimelineUrl + `?${params}`
    return Util.fetchData(url, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
  },
  fetchGetHasNewRecs({ token }) {
    const params = Qs.stringify({
      // count: 15,
      // last_visit_id: '1998734305',
      apikey: '0dad551ec0f84ed02907ff5c42e8ec70',
      os_rom: 'miui6',
      channel: 'Xiaomi_Market',
      udid: '8a2a02080cd222dfd017d22833736a7ee3a9bae5'
        // _sig: 'uzi16lcNw1VnY/aoq4t0SmK7Qno%3D',
        // _ts: '1496901875'
    })
    const url = doubanApi.getHasNewRecsUrl + `?${params}`
      // return Util.fetchData(url, {
      //   method: 'get',
      //   headers: {
      //     'Authorization': 'Bearer ' + token
      //   }
      // })
    return axois.get(url, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
  }
}
