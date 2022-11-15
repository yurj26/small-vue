const queue: any[] = []
const activePreFlushCbs: any = []

const p = Promise.resolve()
let isFlushPending = false

export function nextTick(fn?) {
  return fn ? p.then(fn) : p
}

export function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job)
    queueFlush()
  }
}

function queueFlush() {
  if (isFlushPending) return
  isFlushPending = true
  nextTick(flushJobs)
}

export function queuePreFlushCb(cb) {
  queueCb(cb, activePreFlushCbs)
}

function queueCb(cb, activeQueue) {
  activeQueue.push(cb)

  queueFlush()
}

function flushJobs() {
  isFlushPending = false

  flushPreFlushCbs()
  let job
  while ((job = queue.shift())) {
    job && job()
  }
}

function flushPreFlushCbs() {
  for (let i = 0; i < activePreFlushCbs.length; i++) {
    activePreFlushCbs[i]()
  }
}
