// function phonecall() {
//   alert("0935987444");
// }

const BASE_URL = 'http://localhost:8000'

let selectedid = ''

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
		
	} catch (error) {
		console.error('Error fetching logged in user data:', error);
	}
} 


// สร้างฟังก์ชั่นสำหรับดึงข้อมูลจาก API POST ด้วย Axios

window.onload = async () => {
  fetchLoggedInUserData()
  await loadData()
}

const loadData = async () => {
console.log('on load')
const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get('id')
console.log('id', id)
selectedid = id
// 1. load user ทั้งหมดออกมาจาก API
const response = await axios.get(`${BASE_URL}/posts-findhouse/${id}`)

console.log(response.data)

const productsDOM = document.querySelector('.main')
const productsImgDOM = document.querySelector('.leftber')
let htmlDataImg = ''
let htmlData = ''
// 2. นำ user ทีโหลดมาใส่กลับเข้าไปใน html
let product = response.data
// แปลง timestamp ให้เป็น Date object
const postTime = new Date(product.time_post)
const formattedTime = postTime.toLocaleString()

htmlDataImg += `<h3 class="head font what-page"> Meow Meow/หาบ้าน</h3>
<img class="img-left" src="${product.img}" alt="image-cat">`

htmlData += `<h1 class="space-main organize-space">${product.breed}</h1>
    <p>ลงขายโดย <span>${product.username}</span></p><br>
    <a><button class="call space-main" onclick="phonecall('${product.username}')">โทร</button></a>
    <h3 class="space-main">สายพันธุ์</h3>
    <h4 class="font-style">${product.breed}</h4>
    <hr style="width: 40%; float: left; background-color: black;"><br>
    <h3 class="inline-text space-main">เพศ </h3>
    <p class="inline-text space-main">${product.gender}</p><br>
    <h3 class="inline-text space-main">อายุ </h3>
    <p class="inline-text space-main">${product.age}</p><br>
    <h3 class="inline-text space-main">วัคซีน</h3>
    <p class="inline-text space-main">${product.vaccine}</p>
    <h3 class="space-main">รายระเอียด</h3>
    <p class="detail">${product.details}</p><br>

    <h3 class="space-main">ที่อยู่</h3>
    <p class="space-main">${product.address}</p>
    <h3 class="space-main">ลงขายเมื่อ</h3>
    <p>${formattedTime}</p>`


  

productsDOM.innerHTML = htmlData
productsImgDOM.innerHTML = htmlDataImg
}

//เบอร์โทรผู้ขาย
async function phonecall(username) {
  // /user/:id
  try {
    console.log(username)
    const response = await axios.get(`${BASE_URL}/user/${username}`); 
    // const phone = response.data.data[0].phone
    // console.log(response.data.data[0].phone)
    const phone = response.data.data[0].phone
    console.log('response',response)
    // เรียกฟังก์ชั่นสำหรับแสดงข้อมูลใน HTML
    alert(`เบอร์ผู้ขาย: ${phone}`)
  } catch (error) {
      console.error('Error fetching products:', error)
  }
  
}
