/**
 * Concurrent queue with optional maximum length
 * @param concurrency {number} maximum number of tasks that are beeing executed in parallel
 * @param size {number} maximum length. Default is infinity
 */
function Queue ({concurrency, size}) {
  this.concurrency = concurrency || 1
  this.size = size || Number.POSITIVE_INFINITY
  this.q = []
}

Queue.prototype = {
  /**
   * @returns {number} number of queued tasks (including those in execution)
   */
  get length () {
    return this.q.length
  }
}

/**
 * Add new task
 * If the task was added successfully and beneath the concurrency threshold, it's executed right away.
 * @param task
 * @returns {boolean} true if task was queued or false if not (max queue length exceeded).
 */
Queue.prototype.push = function (task) {
  if (this.q.length >= this.size) {
    return false
  }

  this.q.push(task)
  if (this.q.length <= this.concurrency) {
    executeTask(this, task)
  }
  return true
}

/**
 * Removes a task from the queue after completion
 * executes next task
 * @param queue {object}
 * @param task {function} must return Promise
 */
function onComplete (queue, task) {
  const {q, concurrency} = queue

  // remove completed task
  q.splice(q.indexOf(task), 1)

  // execute task next in queue
  if (q.length >= concurrency) {
    executeTask(queue, q[concurrency - 1])
  }
}

// executes task and binds auto removal
function executeTask (queue, task) {
  task() // execute
    .then(result => {
      // console.log('complete')
      onComplete(queue, task) // remove task + execute next task
      return result
    })
}

module.exports = (options = {}) => new Queue(options)
