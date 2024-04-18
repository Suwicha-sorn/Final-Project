const validateData = (userData) => {
    let errors = []

    if (!userData.email) {
        errors.push('กรุณากรอกอีเมล')
    }
    if (!userData.password) {
        errors.push('กรุณากรอกรหัสผ่าน')
    }
    
    return errors
}

const login = async () => {
    let messageDOM = document.getElementById('message') 
    try {
        let emailDOM = document.querySelector('input[name=email]') 
        let passwordDOM = document.querySelector('input[name=password]') 
        

        let userData = {
            email: emailDOM.value,
            password: passwordDOM.value
        }
        console.log('userdata', userData)
        const errors = validateData(userData)
        console.log('errors', errors)
        if (errors.length > 0) {
            throw {
                message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                errors: errors
            }
            return errors
        }

        const response = await axios.post('http://localhost:8000/login', userData)
        console.log(response.data)
        if (response.data.message === 'login success') {
            messageDOM.innerText = 'เข้าสู่ระบบเรียบร้อย'
            messageDOM.className = 'message success'
            window.location.href = 'buysell.html'
        } else {
            messageDOM.innerText = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
            messageDOM.className = 'message danger'
        }
    } catch (error) {
        console.log('error: ', error)
        messageDOM.innerText = error.message
        messageDOM.className = 'message danger'
    }
}
