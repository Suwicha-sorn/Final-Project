// ตัวอย่าง

const BASE_URL = 'http://localhost:8000'

let mode = 'CREATE' // default
let selectedid = ''

window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get('id')
  console.log('id', id)
  if (id) {
    mode = 'EDIT'
    selectedid = id

    // 1. ดึงข้อมูล user เก่าออกมาก่อน
    try {
      const response = await axios.get(`${BASE_URL}/users/${id}`)
      const user = response.data

      let firstNameDOM = document.querySelector('input[name=firstname]')
      let lastNameDOM = document.querySelector('input[name=lastname]')
      let ageDOM = document.querySelector('input[name=age]')
      let descriptionDOM = document.querySelector('textarea[name=description]')

      firstNameDOM.value = user.firstname
      lastNameDOM.value = user.lastname
      ageDOM.value = user.age
      descriptionDOM.value = user.description

      let genderDOMs = document.querySelectorAll('input[name=gender]') || {}
      let interestDOMs = document.querySelectorAll('input[name=interest]') ||{} 
      
      for (let i = 0 ; i < genderDOMs.length; i++) {
        if (genderDOMs[i].value == user.gender){
          genderDOMs[i].checked = true
        }
      }

      for (let i = 0 ; i < interestDOMs.length; i++) {
        if (user.interests.includes(interestDOMs[i].value)){
          interestDOMs[i].checked = true
        }
      }
      
    } catch (error) {
      console.log('error', error)

    }

  }
}

const validateData = (userData) => {
  let errors = []

  if(!userData.firstname){
    errors.push('กรุณาใส่ชื่อจริง')
  }

  if(!userData.lastname){
    errors.push('กรุณาใส่นามสกุล')
  }

  if(!userData.age){
    errors.push('กรุณาใส่อายุ')
  }

  if(!userData.gender){
    errors.push('กรุณาใส่เพศ')
  }

  if(!userData.interests){
    errors.push('กรุณาใส่ความสนใน')
  }

  if(!userData.description){
    errors.push('กรุณาใส่รายละเอียดของคุณ')
  }
    

  return errors
}

const submitData = async () => {
    let firstNameDOM = document.querySelector('input[name=firstname]')
    let lastNameDOM = document.querySelector('input[name=lastname]')
    let ageDOM = document.querySelector('input[name=age]')

    let genderDOM = document.querySelector('input[name=gender]:checked') || {}
    let interestDOMs = document.querySelectorAll('input[name=interest]:checked') ||{} 
  
    let descriptionDOM = document.querySelector('textarea[name=description]')
  
    let messageDOM = document.getElementById('message')


    try{
      let interest = ''
    
      for (let i = 0; i < interestDOMs.length; i++) {
        interest += interestDOMs[i].value
        if (i != interestDOMs.length - 1) {
          interest += ', '
        }
      }
    
      let userData = {
        firstname: firstNameDOM.value,
        lastname: lastNameDOM.value,
        age: ageDOM.value,
        gender: genderDOM.value,
        description: descriptionDOM.value,
        interests: interest
      }

      console.log('submit data', userData)

      // const errors = validateData(userData)

      // if(errors.length > 0){
      //   // มี errors เกิดขึ้น
      //   throw {
      //     message: 'กรอกข้อมูลไม่ครบ',
      //     errors: errors
      //   }
      // }

      let message = 'บันทึกข้อมูลเรียบร้อย'
      
      if (mode == 'CREATE') {
        const response = await axios.post(`${BASE_URL}/users`, userData)
        console.log('response', response.data)
      } else {
        const response = await axios.put(`${BASE_URL}/users/${selectedid}`, userData)
        message = 'แก้ไขข้อมูลเรียบร้อย'
        console.log('response', response.data)
      }

      

      messageDOM.innerText = message
      messageDOM.className = 'message success'

    } catch (error) {
      console.log('message', error.message)
      console.log('error', error.errors)
      if (error.response) {
        console.log(error.response)
        error.message = error.response.data.message
        error.errors = error.response.data.errors
      }

      let htmlData = '<div>'
      htmlData += `<div>${error.message}</div>`
      htmlData += `<ul>`
      for (let i = 0; i < error.errors.length; i++) {
        htmlData += `<li>${error.errors[i]}</li>`
      }
      htmlData += `</ul>`
      htmlData += '</div>'

      // messageDOM.innerText = 'บันทึกข้อมูลมีปัญหา'
      messageDOM.innerHTML = htmlData
      messageDOM.className = 'message danger'
      }
}
