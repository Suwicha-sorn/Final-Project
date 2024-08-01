function phonecall() {
  alert("0935987444");
}

const BASE_URL = 'http://localhost:8000'

let selectedid = ''
// สร้างฟังก์ชั่นสำหรับดึงข้อมูลจาก API POST ด้วย Axios

window.onload = async () => {
await loadData()
}

const loadData = async () => {
console.log('on load')
const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get('id')
console.log('id', id)
selectedid = id
// 1. load user ทั้งหมดออกมาจาก API
const response = await axios.get(`${BASE_URL}/posts-datting/${id}`)

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
    <h1 class="space-main">${product.price}</h1>
    <p>ลงขายโดย <span>${product.username}</span></p><br>
    <a><button class="chat-seller space-main">แชทกับผู้ขาย</button></a>
    <a><button class="call space-main" onclick="phonecall()">โทร</button></a>
    <h3 class="space-main">สายพันธุ์</h3>
    <h4 class="font-style">${product.breed}</h4>
    <hr style="width: 40%; float: left; background-color: black;"><br>
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