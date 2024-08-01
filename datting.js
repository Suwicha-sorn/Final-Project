const BASE_URL = 'http://localhost:8000'


function phonecall() {
    alert("0935987444")
  }

// Import Axios library
// คุณจะต้องแน่ใจว่าคุณได้เพิ่ม Axios เข้าไปในโปรเจกต์ของคุณก่อนใช้งาน
// ในกรณีนี้เราจะสมมติว่า Axios ได้ถูกนำเข้าแล้ว
// หากยังไม่ได้นำเข้า Axios คุณสามารถใช้ <script> ใน HTML เพื่อเรียกใช้ได้
// <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
// หรือใช้ npm/yarn เพื่อติดตั้ง Axios แล้วนำเข้าใช้งานในโค้ดของคุณ
// const axios = require('axios'); // for Node.js environment

// สร้างฟังก์ชั่นสำหรับดึงข้อมูลจาก API POST ด้วย Axios
async function fetchBuysell() {
  try {
      const response = await axios.get(`${BASE_URL}/posts-datting`); // เปลี่ยน URL API เป็น URL ที่ถูกต้อง
      const products = response.data

      // เรียกฟังก์ชั่นสำหรับแสดงข้อมูลใน HTML
      displayBuysell(products)
  } catch (error) {
      console.error('Error fetching products:', error)
  }
}

// ฟังก์ชั่นสำหรับแสดงข้อมูลใน HTML
function displayBuysell(products) {
  const productsContainer = document.querySelector('.products-con')

  // เคลียร์ข้อมูลเก่าทั้งหมด
  productsContainer.innerHTML = ''

  // วนลูปเพื่อสร้าง HTML สำหรับแต่ละสินค้าและแสดงข้อมูล
  products.forEach(product => {
      const productItem = document.createElement('div')
      productItem.classList.add('products-item')

      // สร้าง HTML สำหรับแต่ละส่วนของข้อมูลสินค้า เช่น ชื่อสายพันธุ์ ราคา ที่อยู่ เป็นต้น
      const productHTML = `
          <a href="info-datting.html?id=${product.id}">
          <div class="products-farvor">
              <i class="fa-regular fa-heart fa-product fa-2xl"></i>
          </div>
          <img class="products-img" src="${product.img}" alt="แมว.png">
          </img>
          <div class="products-breed">${product.breed}</div>
          <div class="products-address">${product.address}</div>
          <div class="products-price">${product.price} บาท</div>
          <div class="products-button">
              <a><button class="chat-seller space-main">แชท</button></a>
              <a><button class="call space-main" onclick="phonecall()">โทร</button></a>
          </div>
          </a>
      `

      // ใส่ HTML ของสินค้าลงใน productItem
      productItem.innerHTML = productHTML

      // เพิ่ม productItem ลงใน container
      productsContainer.appendChild(productItem)
  })
}

// เรียกใช้งานฟังก์ชั่นเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', () => {
  fetchBuysell();
})
