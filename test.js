const BASE = process.env.API_URL || 'http://localhost:3000';

// pid ngau nhien moi lan chay de khong bi trung
const pid = 'CI' + Date.now();

// Ham kiem tra response, neu loi thi in ro noi dung API tra ve
async function check(res, name) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${name} fail: ${res.status} - ${text}`);
  }
  console.log('   OK', res.status);
}

async function main() {
  console.log('1. Health check');
  let res = await fetch(`${BASE}/health`);
  await check(res, 'Health');

  console.log('2. Them san pham (POST)');
  res = await fetch(`${BASE}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pid, pname: 'CI Test', price: 100, quantity: 5 }),
  });
  await check(res, 'Create');

  console.log('3. Xem danh sach (GET)');
  res = await fetch(`${BASE}/api/products`);
  await check(res, 'List');

  console.log('4. Sua san pham (PUT)');
  res = await fetch(`${BASE}/api/products/${pid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pid, pname: 'CI Test', price: 50, quantity: 5 }),
  });
  await check(res, 'Update');

  console.log('5. Kiem tra gia da doi thanh 50');
  res = await fetch(`${BASE}/api/products/${pid}`);
  await check(res, 'Get one');
  const data = await res.json();
  const price = data.price ?? data.product?.price;
  if (price !== 50) throw new Error(`Gia sai: mong doi 50, nhan ${price}`);
  console.log('   OK, price =', price);

  console.log('6. Xoa san pham (DELETE)');
  res = await fetch(`${BASE}/api/products/${pid}`, { method: 'DELETE' });
  await check(res, 'Delete');

  console.log('ALL TESTS PASSED');
}

main().catch((err) => {
  console.error('TEST FAILED:', err.message);
  process.exit(1);
});