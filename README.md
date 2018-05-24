# Queue

concurrent Queue

## Usage

    const queue = require('@bcc/queue')
    const q = queue({concurrency: 2})
    q.push(fnReturningPromise)
    q.push(fnReturningPromise)
    q.push(fnReturningPromise)
    