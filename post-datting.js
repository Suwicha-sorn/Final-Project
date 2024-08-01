const BASE_URL = 'http://localhost:8000'

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

    try {
        let post_datting_data = {
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

        const response = await axios.post(`${BASE_URL}/post-datting`, post_datting_data //, {
            // headers: {
            //     'Content-Type': 'multipart/form-data; charset=utf-8', // เพิ่ม charset=utf-8 เพื่อให้รองรับอักขระภาษาอื่น
            //     'Content-Disposition': `form-data; name="test"; filename="${encodedFileName}"`
            // }
        //}
        )
        console.log('Server response:', response.data)
        messageDOM.innerText = 'โพสต์สำเร็จ'
        messageDOM.className = 'message success'
    } catch (error) {
        console.log('error: ', error)
        messageDOM.innerText = error.message
        messageDOM.className = 'message danger'
    }
}