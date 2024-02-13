const express = require('express')
const bodyparser = require('body-parser')
const app = express()

app.use(bodyparser.json())

const port = 8000

// สำหรับเก็บ users
let users = []
let counter = 1

// path = /
app.get('/test', (req, res) => {
  let user = {
    fistname: 'test',
    lastname: 'นามสกุล',
    age: 14
  }
  res.json(user)
})

//path = GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
app.get('/users', (req, res) => {
  const filterUser = users.map(user => {
    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      fullname: user.firstname + ' ' + user.lastname
    }
  })
  res.json(filterUser)
})

// path = POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
app.post('/user', (req, res) => {
  let user = req.body
  user.id = counter
  counter += 1

  users.push(user)
  res.json({
    message: 'add ok',
    user: user
  })
})

// path = GET /users/:id สำหรับการดึง users รายคนออกมา
app.get('/users/:id', (req, res) => {
  let id =req.params.id

  // หา index 
  let selectedIndex = users.findIndex(user => user.id == id)


  res.json(users[selectedIndex])
})

// path = PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
app.put('/users/:id', (req, res) =>{
  let id = req.params.id
  let updateUser = req.body

  // หา users จาก  id ที่ส่งมา

  // update user นั้น

  // users ที่ update  กลับเข้าไปที่ users  ตัวเดิม

  // ค้นหาข้อมูล users
  let selectedIndex = users.findIndex(user => user.id == id)

  // update ข้อมูล user (null || 'ทดสอบ')

  users[selectedIndex].firstname = updateUser.firstname || users[selectedIndex].firstname
  users[selectedIndex].lastname = updateUser.lastname || users[selectedIndex].lastname
  users[selectedIndex].age = updateUser.age || users[selectedIndex].age
  users[selectedIndex].gender = updateUser.gender || users[selectedIndex].gender
  


  res.json({
    message: 'update user complete!',
    data: {
      user: updateUser,
      indexUpdate: selectedIndex
    }
  })
})

// path DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
app.delete('/users/:id', (req, res) =>{
  let id = req.params.id
  // หาก่อนว่า index ของ user ที่จะลบคือ index ไหน 
  let selectedIndex = users.findIndex(user => user.id == id)

  // ลบ 
  users.splice(selectedIndex, 1)

  res.json({
    message: 'delete complete!',
    indexDeleted: selectedIndex
  })
})

app.listen(port,(req, res ) => {
  console.log('http server run at ' + port)
})