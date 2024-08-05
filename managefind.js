// $('.nav-link').on('click', function() {
// 	$('.active-link').removeClass('active-link');
// 	$(this).addClass('active-link');
// });

const BASE_URL = 'http://localhost:8000'


function phonecall() {
    alert("0935987444")
}

async function fetchfindhouse() {
	try {
		const username = await fetchLoggedInUserData();
		const response = await axios.get(`${BASE_URL}/posts-findhouse-logged`, {
			params: { username: username } });  
		const products = response.data
  
		// เรียกฟังก์ชั่นสำหรับแสดงข้อมูลใน HTML
		displayfindhouse(products)
	} catch (error) {
		console.error('Error fetching products:', error)
	}
}

// ฟังก์ชั่นสำหรับดึงข้อมูลผู้ใช้ที่ล็อกอินเข้ามา
async function fetchLoggedInUserData() {
	try {
	  const authToken = localStorage.getItem('token')
		const response = await axios.get(`${BASE_URL}/loginuser`, {
		  headers: {
			'authorization': `Bearer ${authToken}`
		  }
		});
	
		console.log(response.data[0])
		const loggedInUserElement = document.getElementById('loggedInUser');
		loggedInUserElement.innerHTML = response.data[0].username
		username = response.data[0].username
		return username

	} catch (error) {
		console.error('Error fetching logged in user data:', error);
	}
} 

function displayfindhouse(products) { 
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
              </button><i class="fa-regular fa-heart fa-product fa-2xl" data-id="${product.id}" onclick="saveFavorite('${product.id}','${username}')"></i>
          </div>
			<a href="info-findhouse.html?id=${product.id}">
			<img class="products-img" src="${product.img}" alt="แมว.png">
			</img>
			<div class="products-breed">${product.breed}</div>
			<div class="products-address">${product.address}</div>
			<div class="products-button">
				<a href="post-findhome.html?id=${product.id}"><button class="chat-seller space-main">แก้ไข</button></a>
				<a><button class="call space-main data-id="${product.id}" onclick="delete_post_buysell(${product.id})">ลบ</button></a>
			</div>
			</a>
		`
  
		// ใส่ HTML ของสินค้าลงใน productItem
		productItem.innerHTML = productHTML
  
		// เพิ่ม productItem ลงใน container
		productsContainer.appendChild(productItem)
	})
}

// save favorite
async function saveFavorite(productId, username) {
	console.log('productid: ',productId)
	console.log('username: ',username)
	try {
	  const response = await axios.post(`${BASE_URL}/favorite-datting`, 
			   { username: username,
		  product_id: productId,
		  type: 'datting'
		  } ); 
		  
	  alert(response.data.message)
	} catch (error) {
	  if (error.response && error.response.status === 400) {
		alert('ลบสินค้าจากรายการโปรดแล้ว');
	  } else {
		console.error('เพิ่มหรือลบสินค้าในรายการโปรดไม่สำเร็จ', error);
	  }
	}
}
  
  // เรียกใช้งานฟังก์ชั่นเมื่อหน้าเว็บโหลดเสร็จ
  document.addEventListener('DOMContentLoaded', () => {
	fetchLoggedInUserData()
	fetchfindhouse()
  })

    // ลบโพส
async function delete_post_buysell(id){
	
	console.log('id', id)
	const confirmDelete = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบโพสต์นี้?')
	if (confirmDelete) {
		try{
			await axios.delete(`${BASE_URL}/post-findhouse/${id}`) 
			fetchfindhouse() // recursive function = เรียก function ตัวเอง
	  } catch (error) {
			console.log('error', error)
		 }
	}
  }