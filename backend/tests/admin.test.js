
const test = require('node:test')
const assert = require('node:assert/strict')

const API_URL = process.env.TEST_API_URL || 'http://localhost:5000'

async function login(email, password) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  assert.equal(response.status, 200, 'Giris basarili olmali')

  const cookie = response.headers.get('set-cookie')
  assert.ok(cookie, 'Oturum cerez bilgisi bulunamadi')

  return cookie.split(';')[0]
}

test('AUTH-01: Giris yapmayan kullanici 401 almali', async () => {
  const response = await fetch(`${API_URL}/api/admin/users`)

  assert.equal(response.status, 401)
})

test('AUTH-02: Normal kullanici 403 almali', async () => {
  const cookie = await login(
    process.env.TEST_USER_EMAIL,
    process.env.TEST_USER_PASSWORD
  )

  const response = await fetch(`${API_URL}/api/admin/users`, {
    headers: { Cookie: cookie },
  })

  assert.equal(response.status, 403)
})

test('AUTH-03: Admin kullanici 200 almali', async () => {
  const cookie = await login(
    process.env.TEST_ADMIN_EMAIL,
    process.env.TEST_ADMIN_PASSWORD
  )

  const response = await fetch(`${API_URL}/api/admin/users`, {
    headers: { Cookie: cookie },
  })

  assert.equal(response.status, 200)

  const data = await response.json()

  assert.ok(Array.isArray(data.users))
})

test('AUTH-04: Admin kullanici listesinde roller bulunmali', async () => {
  const cookie = await login(
    process.env.TEST_ADMIN_EMAIL,
    process.env.TEST_ADMIN_PASSWORD
  )

  const response = await fetch(`${API_URL}/api/admin/users`, {
    headers: { Cookie: cookie },
  })

  assert.equal(response.status, 200)

  const data = await response.json()

  for (const user of data.users) {
    assert.ok(user.id)
    assert.ok(user.name)
    assert.ok(user.email)
    assert.ok(['ADMIN', 'USER'].includes(user.role))
  }
})
