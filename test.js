const { application } = require("express");

const  BASE = process.env.API_URL || 'http://localhost:3000';

const pid = 'CI' + Date.now();

async function main()
{
  console.log('1. Health check');
  let res = await fetch(`${BASE}/health`);

  if(!res.ok){
    throw new Error('Health check failed');
  }

  //Thêm sản phẩm
  console.log('2. Thêm sản phẩm');
  res = await fetch(`${BASE}/api/products`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      pid: pid,
      pname: 'CI test',
      price: 100,
      quantity: 10
    })
  });

  if(!res.ok){
    throw new Error('Thêm sản phẩm thất bại');
  }

  //Lấy danh sách sản phẩm
  console.log('3. Lấy sản phẩm');
  res = await fetch(`${BASE}/api/products`);

  if(!res.ok){
    throw new Error('Không thể lấy danh sách sản phẩm');
  }

  //Cập nhật sản phẩm
  console.log('4. Cập nhật sản phẩm');
  res = await fetch(`${BASE}/api/products/${pid}`, {
    method: 'PUT',
    headers: {'content-Type': 'application/JSON'},
    body: JSON.stringify({
      pid: pid,
      pname: 'CT test',
      price: 50,
      quantity: 10
    })
  });
  if(!res.ok){
    throw new Error('Không thể cập nhật sản phẩm');
  }

  //Kiểm tra sau khi cập nhật
  console.log('5. Kiểm tra lại sản phẩm');
  res = await fetch(`${BASE}/api/products/${pid}`);
  if(!res.ok){
    throw new Error('Không xem được sản phẩm');
  }
  const data = await res.json();
  const price = data.price ?? data.product?.price;

  if(price != 50){
    throw new Error('Giá sản phẩm không đúng');
  }

  //Xóa sản phẩm
  console.log('6. Xóa sản phẩm');
  res = await fetch(`${BASE}/api/products/${pid}`, {
    method: 'DELETE'
  });
  if(!res.ok){
    throw new Error('Xóa sản phẩm thất bại');
  }

  console.log('Hoàn tất');
}

main().catch((err) => {
  console.error('Test failed: ', err.message);
  process.exit(1);
})