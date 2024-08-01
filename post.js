const BASE_URL = 'http://localhost:8000'

const validateData = (post_buysell_data) => {
    let errors = []

    if (!post_buysell_data.breed){
        errors.push('กรุณากรอกพันธุ์แมว')
    }

    if (!post_buysell_data.price){
        errors.push('กรุณากรอกราคา')
    }

    if (!post_buysell_data.gender){
        errors.push('กรุณากรอกเพศ')
    }

    if (!post_buysell_data.age){
        errors.push('กรุณากรอกอายุ')
    }
    
    if (!post_buysell_data.vaccine){
        errors.push('กรุณากรอกวัคซีน')
    }
    
    if (!post_buysell_data.address){
        errors.push('กรุณากรอกที่อยู่')
    }
    
    if (!post_buysell_data.img){
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
        let post_buysell_data = {
            breed: breedDOM.value,
            price: priceDOM.value,
            gender: genderDOM.value,
            age: ageDOM.value,
            vaccine: vaccineDOM.value,
            address: addressDOM.value,
            details: detailsDOM.value,
            img: fileUpload.value
            
        }

        const errors = validateData(post_buysell_data)
        if (errors.length > 0) {
            throw {
                message: 'กรอกข้อมูลไม่ครบ',
                errors: errors
            }
        }

        const response = await axios.post(`${BASE_URL}/post-buysell`, post_buysell_data)
        console.log('Server response:', response.data)
        messageDOM.innerText = 'โพสต์สำเร็จ'
        messageDOM.className = 'message success'
    } catch (error) {
        console.log('error message: ', error.message)
        console.log('error: ', error.errors)
        messageDOM.innerText = error.message
        messageDOM.className = 'message danger'
    }
}