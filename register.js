
// const validateData = (userData) => {
//     let errors = []

//     if (!userData.email) {
//         errors.push('กรุณากรอกอีเมล')
//     }
//     if (!userData.password) {
//         errors.push('กรุณากรอกรหัสผ่าน')
//     }
//     if (!userData.phone) {
//         errors.push('กรุณากรอกเบอร์โทรศัพท์                                                                                                ')
//     }

//     return errors
// }

const register = async () => {
    let usernameDOM = document.querySelector('input[name=username]')
    let emailDOM = document.querySelector('input[name=email]')
    let passwordDOM = document.querySelector('input[name=password]')
    let phoneDOM = document.querySelector('input[name=phone]')
    let messageDOM = document.getElementById('message') 
    console.log(usernameDOM.value,emailDOM.value, passwordDOM.value, phoneDOM.value)
    try {

        let userData = {
            username: usernameDOM.value,
            email: emailDOM.value,
            password: passwordDOM.value,
            phone: phoneDOM.value
        }
        
        
        // const errors = validateData(userData)
        // if (errors.length > 0) {
        //     throw {
        //         message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        //         errors: errors
        //     }
        // }

        

        const response = await axios.post('http://localhost:8000/register', userData)
        console.log(response.data)
        if (response.data.message === 'insert ok'){
            messageDOM.innerText = 'สมัครสมาชิกเรียบร้อย'
            messageDOM.className = 'message success'
            usernameDOM.value = ''
            emailDOM.value = ''
            passwordDOM.value = ''
            phoneDOM.value = ''
        } 
    } catch (error) {
        console.log('error message: ', error.message)
        console.log('error :', error.errors)
        console.log('response message', error.response.data.message)
        console.log('response errors', error.response.data.errors)
        if (error.response) {
            error.message = error.response.data.message
            error.errors = error.response.data.errors
        }
        // if (error.response) {
        //     if (error.response.status === 500 && error.response.data.errors) {
        //         error.message = 'username หรือ email ซ้ำ'
        //     } else {
        //         error.message = error.response.data.message
        //     }
        // }

        messageDOM.innerText = error.message
        messageDOM.className = 'message danger'
    }

}