const test = require('tape')
const queue = require('../index.js')

const createTask = (cb) => () => new Promise(resolve => setTimeout(resolve, 100)).then(cb)
const okOnComplete = (t) => () => t.ok(true, 'task complete')
const pushMultiple = (n, q, t) => {
  while (n-- > 0) q.push(createTask(okOnComplete(t)))
}

test('push on task', function (t) {
  t.plan(1)
  const q = queue()
  pushMultiple(1, q, t)
})

test('push multiple tasks', function (t) {
  t.plan(3)
  const q = queue()
  pushMultiple(3, q, t)
})

test('push (5) tasks at concurrency (3)', function (t) {
  t.plan(5)
  const q = queue({concurrency: 3})
  pushMultiple(5, q, t)
})

test('push (5) tasks that resolve synchronously at concurrency (3)', function (t) {
  t.plan(5)
  const q = queue({concurrency: 3})
  for (let i = 5; i > 0; i--) {
    q.push(() => Promise.resolve(okOnComplete(t)()))
  }
})

test('push (3) tasks at concurrency (5)', function (t) {
  t.plan(3)
  const q = queue({concurrency: 5})
  pushMultiple(3, q, t)
})

test('push (3) tasks at length (1)', function (t) {
  t.plan(4)
  const q = queue({size: 1})
  t.ok(q.push(createTask(okOnComplete(t))), 'task pushed')
  t.notOk(q.push(createTask(okOnComplete(t))), 'task push declined')
  t.notOk(q.push(createTask(okOnComplete(t))), 'task push declined')
})
