// function phonecall() {
//     alert("0935987444");
// }

// let selectedid = ''
// const urlParams = new URLSearchParams(window.location.search)
// const id = urlParams.get('id')
// console.log('id', id)
// selectedid = id

// const response = await axios.get(`${BASE_URL}/posts-buysell/${id}`)

//   console.log(response.data)

//   const productsDOM = document.querySelector('.main')

//   let htmlData = ''
//   // 2. นำ user ทีโหลดมาใส่กลับเข้าไปใน html
//   for (let i = 0; i < response.data.length; i++) {
//       let product = response.data[i]
//       htmlData += `<h1 class="space-main organize-space">${product.breed}</h1>
//       <h1 class="space-main">8,000 บาท</h1>
//       <span>ลงขายโดย iceza </span><br>
//       <a><button class="chat-seller space-main">แชทกับผู้ขาย</button></a>
//       <a><button class="call space-main" onclick="phonecall()">โทร</button></a>
//       <h3 class="space-main">สายพันธุ์</h3>
//       <h4 class="font-style">Munchkin</h4>
//       <hr style="width: 40%; float: left; background-color: black;"><br>
//       <h3 class="inline-text space-main">อายุ </h3>
//       <p class="inline-text space-main">4 เดือน</p><br>
//       <h3 class="inline-text space-main">วัคซีน</h3>
//       <p class="inline-text space-main">1 เข็ม</p>
//       <h3 class="space-main">รายระเอียด</h3>
//       <p>อเมริกันช็อตแฮร์<br>
//          -เด็กชาย<br>
//          -สีบราน์ 3900<br>
//          -ปทุมธานี<br>
//          -วัคซีนรวมไข้หัด (มีสมุดให้)<br>
//          -ถ่ายพยาธิ<br>
//         ไม่รวมส่งต่างจังหวัด ต่างจังหวัดส่งได้ทุกจังหวัด ขอคลิปวีดีโอเพิ่มหรือรูปน้องเพิ่มพร้อมรูปพ่อแม่น้องแอด กดเพื่อดู Line: xxxxx</p><br>

//       <h3 class="space-main">ที่อยู่</h3>
//       <p class="space-main">ปทุมธานี สามโคก</p>
//       <h3 class="space-main">ลงขายเมื่อ</h3>
//       <p>01 ก.ย. 2566 12:00น.</p>`
// }

    

// productsDOM.innerHTML = htmlData


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
  const response = await axios.get(`${BASE_URL}/posts-buysell/${id}`)

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

  htmlDataImg += `<h3 class="head font what-page"> Meow Meow/ชื้อขาย</h3>
  <img class="img-left" src="${product.img}" alt="image-cat">`

  htmlData += `<h1 class="space-main organize-space">${product.breed}</h1>
      <h1 class="space-main">${product.price} บาท</h1>
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
