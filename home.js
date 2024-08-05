

  const BASE_URL = 'http://localhost:8000'

function phonecall() {
  window.location.href = 'login.html'
}

// สร้างฟังก์ชั่นสำหรับดึงข้อมูลจาก API POST ด้วย Axios
async function fetchBuysell() {
  try {
      const response = await axios.get(`${BASE_URL}/posts-buysell`); // เปลี่ยน URL API เป็น URL ที่ถูกต้อง
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
          <div class="products-farvor">
              </button><i class="fa-regular fa-heart fa-product fa-2xl" ></i>
          </div>
          <a href="Login.html">
          <img class="products-img" src="${product.img}" alt="แมว.png">
          </img>
          <div class="products-breed">${product.breed}</div>
          <div class="products-address">${product.address}</div>
          <div class="products-price">${product.price} บาท</div>
          <div class="products-button">
              <a><button class="call space-main" onclick="phonecall('${product.username}')">โทร</button></a>
          </div>
          </a>
      `

      // ใส่ HTML ของสินค้าลงใน productItem
      productItem.innerHTML = productHTML

      // เพิ่ม productItem ลงใน container
      productsContainer.appendChild(productItem)
  })
}

//เบอร์โทรผู้ขาย
async function phonecall(username) {
  // /user/:id
  try {
    console.log(username)
    const response = await axios.get(`${BASE_URL}/user/${username}`); 
    const phone = response.data.data[0].phone
    console.log(response.data.data[0].phone)
    
    // เรียกฟังก์ชั่นสำหรับแสดงข้อมูลใน HTML
    alert(`เบอร์ผู้ขาย: ${phone}`)
  } catch (error) {
      console.error('Error fetching products:', error)
  }
  
}

// เรียกใช้งานฟังก์ชั่นเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', () => {
  fetchBuysell();
})
