const express = require('express')
const bodyparser = require('body-parser')
const mysql = require('mysql2/promise')
const app = express()

app.use(bodyparser.json())

const port = 8000


let conn = null 

const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'tutorial',
    port: 3306
  })
}

app.get('/testdb-new', async (req, res) => {
  try{
    const results = await conn.query('SELECT * FROM users')
        res.json(results[0])
  } catch (error) {
    console.error('Error fetching users:', error.message)
    res.status(500).json({ error: 'Error fetching users' })
  }
   
})

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
app.get('/users', async (req, res) => {

  const results = await conn.query('SELECT * FROM users')
  res.json(results[0])
})

// path = POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
app.post('/user', async (req, res) => {
  try{
    let user = req.body
    const results = await conn.query('INSERT INTO user SET ?', user)
    res.json({
      message: 'insert ok',
      data: results[0]
    })
  } catch (error){
    console.error('error message', error.message)
    res.status(500).json({
      message: 'something wrong',
    })
  }
})

// path = GET /users/:id สำหรับการดึง users รายคนออกมา
app.get('/users/:id', async (req, res) => {
  try{
    let id = req.params.id
    const results = await conn.query('SELECT * FROM users WHERE id = ?', id)
    if (results[0].lenght > 0 ){
      res.json(results[0][0])
    } else {
      res.status(404).json({
        message: 'หาไม่เจอ'
      })
    }
    
  } catch (error) {
    console.error('error message', error.message)
    res.status(500).json({
      message: 'something wrong',
    })
  }
  

})

// path = PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
app.put('/users/:id', async (req, res) =>{  
  try{
    let id = req.params.id
    let updateUser = req.body
    const results = await conn.query('UPDATE users SET ? WHERE id = ?', [updateUser, id])
    res.json({
      message: 'update ok',
      data: results[0]
    })
  } catch (error){
    console.error('error message', error.message)
    res.status(500).json({
      message: 'something wrong',
    })
  }
})

// path DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
app.delete('/users/:id', async (req, res) =>{
  try{
    let id = req.params.id
    const results = await conn.query('Delete from users WHERE id = ?', id)
    res.json({
      message: 'delete ok',
      data: results[0]
    })
  } catch (error){
    console.error('error message', error.message)
    res.status(500).json({
      message: 'something wrong',
    })
  }
})

app.listen(port, async (req, res ) => {
  await initMySQL()
  console.log('http server run at ' + port)
})