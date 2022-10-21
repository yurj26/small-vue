let queue: any[] = []
let isFlushing = false
const reslovePromise = Promise.resolve()

export function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job)
  }

  if (!isFlushing) {
    isFlushing = true
    reslovePromise.then(() => {
      isFlushing = false
      let copy = queue.slice(0)
      queue.length = 0
      for (let i = 0; i < copy.length; i++) {
        let job = copy[i]
        job()
      }
      copy.length = 0
    })
  }
}
