$('.nav-link').on('click', function() {
	$('.active-link').removeClass('active-link');
	$(this).addClass('active-link');
});

const BASE_URL = 'http://localhost:8000'


function phonecall() {
    alert("0935987444")
}

async function fetchBuysell() {
	try {
		const response = await axios.get(`${BASE_URL}/posts-buysell`); // แก้ api 
		const products = response.data
  
		// เรียกฟังก์ชั่นสำหรับแสดงข้อมูลใน HTML
		displayBuysell(products)
	} catch (error) {
		console.error('Error fetching products:', error)
	}
}

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
			<a href="info-buysell.html?id=${product.id}">
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
	fetchLoggedInUserData()
	fetchBuysell()
  })