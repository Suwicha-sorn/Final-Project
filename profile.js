const BASE_URL = 'http://localhost:8000'

const validateData = (updateuser) => {
    let errors = []

    if (!updateuser.phone){
        errors.push('กรุณากรอกเบอร์โทรศัพท์')
    }

    if (updateuser.phone.length !== 10){
        errors.push('ความยาวเบอร์โทรศัพท์ต้องมี 10 ตัวอักษร')
    }
    
    if (!updateuser.avatar){
        errors.push('กรุณากรอกลิงค์รูปภาพ')
    }
    
    return errors
}


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
    const loggedInUser_imageElement = document.getElementById('loggedInUser_image');
    const loggedInUser_userElement = document.getElementById('loggedInUser_user');
    const loggedInUser_emailElement = document.getElementById('loggedInUser_email');
    const loggedInUser_phoneElement = document.getElementById('loggedInUser_phone');
    const dataidDOM = document.getElementById('data_id')
    const fileuploadDOM = document.getElementById('fileUpload_avatar')
    loggedInUserElement.innerHTML = response.data[0].username
    loggedInUser_imageElement.src = response.data[0].avatar;
    loggedInUser_userElement.innerHTML = response.data[0].username
    loggedInUser_emailElement.innerHTML = response.data[0].email
    loggedInUser_phoneElement.value = response.data[0].phone
    fileuploadDOM.value = response.data[0].avatar;
    dataidDOM.dataset.id = response.data[0].id
    
    } catch (error) {
            console.error('Error fetching logged in user data:', error);
        }
} 

const submitData = async () => {
    let phoneDOM = document.getElementById('loggedInUser_phone')
    let fileUpload = document.getElementById('fileUpload_avatar')
    let submitDOM = document.getElementById('data_id')
    let messageDOM = document.getElementById('message')
   

    try  {

        let updateuser = {
            phone: phoneDOM.value,
            avatar: fileUpload.value
        }
        const errors = validateData(updateuser)
        if (errors.length > 0) {
            throw {
                message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                errors: errors
            }
            // return errors
        }
        
        console.log('phone_lenght', phoneDOM.value.length)
        console.log('phone', phoneDOM.value)
        console.log('fileupload', fileUpload.value)
        const userId = submitDOM.dataset.id
        console.log("data_id", userId)

        const response = await axios.patch(`${BASE_URL}/updateuser/${userId}`, updateuser)
        messageDOM.innerText = 'แก้ไขข้อมูลเรียบร้อย'
        messageDOM.className = 'message success'
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } catch (error) {
        console.log("error: ",error)
        console.log("errormsg: ",error.message)
        messageDOM.innerText = error.errors
        messageDOM.className = 'message danger'
        console.error('Error submitting data:', error);
    }
}   

window.onload = async () => {
    // ฟังก์ชั่นสำหรับดึงข้อมูลผู้ใช้ที่ล็อกอินเข้ามา
    fetchLoggedInUserData()
    
}


// const hasLengthError = errors.some(error => error === 'ความยาวเบอร์โทรศัพท์ต้องมี 10 ตัวอักษร');
// if (hasLengthError) {
//     throw {
//         message: 'ความยาวเบอร์โทรศัพท์ต้องมี 10 ตัวอักษร',
//         errors: errors
//     }
// }

