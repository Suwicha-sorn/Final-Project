const BASE_URL = 'http://localhost:8000'


// สร้างฟังก์ชั่นสำหรับดึงข้อมูลจาก API POST ด้วย Axios

window.onload = async () => {
  await loadData()
}

const loadData = async () => {
    console.log('on load')
    // 1. load user ทั้งหมดออกมาจาก API
    const response = await axios.get(`${BASE_URL}/posts-buysell`)

    console.log(response.data)

    const productsDOM = document.querySelector('.products-con')

    let htmlData = ''
    // 2. นำ user ทีโหลดมาใส่กลับเข้าไปใน html
    for (let i = 0; i < response.data.length; i++) {
        let product = response.data[i]
        htmlData += `<a href="info-buysell.html?id=${product.id}">
        <div class="products-item">
        <img class="products-img" src="${product.img}" alt="แมว.png">
    </img>
    <div class="products-breed">${product.breed}</div>
    <div class="products-address">${product.address}</div>
    <div class="products-price">${product.price} บาท</div>
    <div class="products-button">
      <button class="approve space-main">อนุมัติ</button>
      <button class="reject space-main"  data-id='${product.id}'>ไม่อนุมัติ</button>
    </div>
    </div>
    </a>`
    }

    

    productsDOM.innerHTML = htmlData
 // button class='delete' 
const rejectDOM = document.getElementsByClassName('reject')

for (let i = 0; i <rejectDOM.length; i++) {
  rejectDOM[i].addEventListener('click', async (event) => {
         // ดึง id ออกมา 
        const id = event.target.dataset.id
        console.log('event.target: ', event.target.dataset)
        console.log('Clicked reject button with id:', id)
        try{
            await axios.delete(`${BASE_URL}/post-buysell/${id}`) 
            console.log('Response:', response)
            fetchBuysell() // recursive function = เรียก function ตัวเอง
      } catch (error) {
            console.log('error', error)
         }
     })
  }
}
