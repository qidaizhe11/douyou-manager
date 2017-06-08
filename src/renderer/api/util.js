export default {
  fetchData(url, fetchOptions) {
    return new Promise((resolve, reject) => {
      fetch(url, fetchOptions).then(response => {
        if (!response.ok) {
          console.log('!!!fetch', url, 'response not ok. response:', response)

          const errorMsg = `${response.status} ${response.statusText}`
          reject(errorMsg)

          return
        }

        response.json().then(json => {
          console.log('fetch', url, 'get json data:', json)

          resolve(json)
        }).catch(error => {
          reject(error.message)
        })
      }).catch(error => {
        console.log('fetch', url, 'error:', error.message)
        reject(error.message)
      })
    })
  }
}
