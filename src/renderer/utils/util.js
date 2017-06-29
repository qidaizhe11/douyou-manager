
import moment from 'moment'

export function formatMessageTime(messageTime) {
  const timeWrapper = moment(messageTime)

  const today = moment().startOf('day')
  if (timeWrapper.isAfter(today)) {
    return timeWrapper.format('H:mm')
  }

  const yesterday = today.subtract(1, 'days')
  if (timeWrapper.isAfter(yesterday)) {
    return '昨天 ' + timeWrapper.format('H:mm')
  }

  const startOfWeek = moment().startOf('week')
  if (timeWrapper.isAfter(startOfWeek)) {
    return timeWrapper.format('dddd H:mm')
  }

  return timeWrapper.format('lll')
}
