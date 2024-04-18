
const validateData = (userData) => {
    let errors = []

    if (!emailDOM.value) {
        errors.push('กรุณากรอกอีเมล')
    }
    if (!passwordDOM.value) {
        errors.push('กรุณากรอกรหัสผ่าน')
    }
    if (!passwordDOM.value) {
        errors.push('กรุณากรอกเบอร์โทรศัพท์                                                                                                ')
    }

    return errors
}

const register = () => {
    let emailDOM = document.querySelector('input[name=email]')
    let passwordDOM = document.querySelector('input[name=password]')
    let phoneDOM = document.querySelector('input[name=phone]')
    console.log(emailDOM, passwordDOM, phoneDOM)

    let userData = {
        email: emailDOM.value,
        password: passwordDOM.value,
        phone: phoneDOM.value

    }
}



