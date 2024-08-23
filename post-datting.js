const BASE_URL = 'http://localhost:8000'

let mode = 'CREATE' // default mode
let selectedid = '' 

const validateData = (post_datting_data) => {
    let errors = []

    if (!post_datting_data.breed){
        errors.push('กรุณากรอกพันธุ์แมว')
    }

    if (!post_datting_data.price){
        errors.push('กรุณากรอกราคา')
    }

    if (!post_datting_data.gender){
        errors.push('กรุณากรอกเพศ')
    } 

    if (!post_datting_data.age){
        errors.push('กรุณากรอกอายุ')
    }
    
    if (!post_datting_data.vaccine){
        errors.push('กรุณากรอกวัคซีน')
    }
    
    if (!post_datting_data.address){
        errors.push('กรุณากรอกที่อยู่')
    }
    
    if (!post_datting_data.img){
        errors.push('กรุณากรอกลิงค์รูป')
    }

    return errors
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

  
  // เรียกใช้งานฟังก์ชั่นเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', () => {
	fetchLoggedInUserData()
})


//แก้ไขโพส
window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    console.log('id',id)
    // ดึงข้อมูลโพสออกมา
    if (id) {
        mode = 'EDIT'
        selectedid = id
        try{
            const response = await axios.get(`${BASE_URL}/posts-datting/${id}`)
            const post = response.data
            console.log('post: ',post)

            let breedDOM = document.querySelector('input[name=breed]')
            let priceDOM = document.querySelector('input[name=price]')
            let ageDOM  = document.querySelector('input[name=age]')
            let vaccineDOM  = document.querySelector('input[name=vaccine]')
            let addressDOM  = document.querySelector('textarea[name=address]')
            let detailsDOM  = document.querySelector('textarea[name=details]')
            let fileUpload = document.getElementById('fileUpload')
            let postDOM = document.getElementById('post-edit')

            postDOM.innerHTML = 'แก้ไขโพสต์'
            breedDOM.value = post.breed
            priceDOM.value = post.price
            ageDOM.value = post.age
            vaccineDOM.value = post.vaccine
            addressDOM.value = post.address
            detailsDOM.value = post.details
            fileUpload.value = post.img

            let genderDOM = document.querySelectorAll('input[name=gender]') || {}

            for (let i = 0 ; i < genderDOM.length; i++) {
                if (genderDOM[i].value == post.gender) {
                    genderDOM[i].checked = true
                }
            }

        } catch (error) {
            console.log('error',error)
        }
    }
}


// submit
const post_buysell = async () => {
    let breedDOM = document.querySelector('input[name=breed]')
    let priceDOM = document.querySelector('input[name=price]')
    let genderDOM = document.querySelector('input[name=gender]:checked') || {}
    let ageDOM  = document.querySelector('input[name=age]')
    let vaccineDOM  = document.querySelector('input[name=vaccine]')
    let addressDOM  = document.querySelector('textarea[name=address]')
    let detailsDOM  = document.querySelector('textarea[name=details]')
    let fileUpload = document.getElementById('fileUpload')
    let messageDOM = document.getElementById('message')
        // const selectedFile = fileUpload.files[0]
        // if (selectedFile.size > 1024 * 1024 * 5) {
        //     alert('ไฟล์มีขนาดเกิน 5 MB')
        // }
        // if (selectedFile.type !== 'image/png' ){
        //     alert('ไม่อนุญาติให้อัพโหลดไฟล์อื่นนอกจาก png และ jpg')
        //     return false
        // }
        // const formData = new FormData()
        // formData.append('test', selectedFile)

        const username = await fetchLoggedInUserData()
    try {
        let post_datting_data = {
            username: username,
            breed: breedDOM.value,
            price: priceDOM.value,
            gender: genderDOM.value,
            age: ageDOM.value,
            vaccine: vaccineDOM.value,
            address: addressDOM.value,
            details: detailsDOM.value,
            img: fileUpload.value
        }

        const errors = validateData(post_datting_data)
        if (errors.length > 0) {
            throw {
                message: 'กรอกข้อมูลไม่ครบ',
                errors: errors
            }
        }

        let message = 'โพสสำเร็จ'

        if (mode == 'CREATE') {
            const response = await axios.post(`${BASE_URL}/post-datting`, post_datting_data)
            console.log('resopnse', response.data)
        } else {
            const response = await axios.patch(`${BASE_URL}/posts-datting/${selectedid}`, post_datting_data)
            message = 'แก้ไขโพสเรียบร้อย'
            console.log('resopnse', response.data)
        }
        breedDOM.value = ''
        priceDOM.value = ''
        genderDOM.value = genderDOM.checked = false
        ageDOM.value = ''
        vaccineDOM.value = ''
        addressDOM.value = ''
        detailsDOM.value = ''
        fileUpload.value = ''

        
        messageDOM.innerText = message
        messageDOM.className = 'message success'
    } catch (error) {
        console.log('error message: ', error.message)
        console.log('error: ', error.errors)
        messageDOM.innerText = error.message
        messageDOM.className = 'message danger'
    }
}