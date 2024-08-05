const express = require('express')
const bodyparser = require('body-parser')
const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const session = require("express-session")
const multer = require('multer')

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads')
//   },
//   filename: function (req, file, cb) {
//     const fileName = `${Date.now()}-${file.originalname}`
//     cb(null, fileName)
//   }
// })

// const upload = multer({ 
//   storage
// })

const app = express()
app.use(bodyparser.json())
app.use(cors()) 
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}))

const port = 8000
const secret = 'mysecret'


let conn = null 

// ต่อ database
const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'meowmeow',
    port: 3306
  })
}

// valiData register
const validateData = (userData) => {
  let errors = []

  if (!userData.email) {
      errors.push('กรุณากรอกอีเมล')
  }
  if (!userData.password) {
      errors.push('กรุณากรอกรหัสผ่าน')
  }
  if (!userData.phone) {
      errors.push('กรุณากรอกเบอร์โทรศัพท์')
  }

  if (userData.phone.length !== 10){
    errors.push('ความยาวเบอร์โทรศัพท์ต้องมี 10 ตัวอักษร')
}

  return errors
}

// API Register
app.post('/register', async (req,res) => {
  try{
    const {username, email, password, phone} = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const userData = {
      username,
      email,
      password: hashedPassword,
      phone
    }

    const errors = validateData(userData)
    // ตรวจสอบว่า email หรือ username ซ้ำกับข้อมูลที่มีอยู่แล้วหรือไม่
    const [repeatemail] = await conn.query('SELECT * FROM users WHERE email = ?', email)
    const [repeatusername] = await conn.query('SELECT * FROM users WHERE username = ?', username)
    // ตรวจสอบว่า errors มีข้อความ 'ความยาวเบอร์โทรศัพท์ต้องมี 10 ตัวอักษร' หรือไม่
    // const hasLengthError = errors.indexOf('ความยาวเบอร์โทรศัพท์ต้องมี 10 ตัวอักษร')
    if (errors.length > 0) {
      throw {
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        errors: errors
        }
    }
    if (repeatemail.length > 0) {
      throw {
        message: 'อีเมลนี้ถูกใช้ไปแล้ว',
        errors: errors
        }
    }

    if (repeatusername.length > 0) {
      throw {
        message: 'ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว',
        errors: errors
        }
    }
  //   if (errors.includes('ความยาวเบอร์โทรศัพท์ต้องมี 10 ตัวอักษร')) {
  //     console.log('ความยาวเบอร์ไม่ครบ 10')
  //     throw {
  //         message: 'ความยาวเบอร์โทรศัพท์ต้องมี 10 ตัวอักษร',
  //         errors: errors
  //     }
  // }
    // if (hasLengthError !==1) {
    //   console.log('ความยายเบอร์ไม่ครบ10')
    //   throw {
    //       message: 'ความยาวเบอร์โทรศัพท์ต้องมี 10 ตัวอักษร',
    //       errors: errors
    //   }
    // }


    const [results] = await conn.query('INSERT INTO users SET ?', userData)
    res.json({
      message: 'insert ok'
    })
  } catch (error) {
    console.log('error', error)
    console.log('error messsage: ', error.message)
    const errorMessage = error.message || 'กรอกข้อมูลไม่ครบ'
    const errors = error.errors || []
    res.status(500).json({
      message: errorMessage,
      errors: errors // เพื่อส่งข้อความผิดพลาดกลับไปหน้าเว็บ
    })
  }
})

// API Login
app.post('/login', async (req,res) => {
  try{
    const {email, password} = req.body
    const [results] = await conn.query('SELECT * from users where email = ?', email)
    const userData = results[0]
    const isMatch = await bcrypt.compare(password, userData.password)
    if (!isMatch) {
      res.status(400).json({
        message: 'Invalid email or password'
      })
      return false
    }
    //สร้าง token
    const token = jwt.sign({email, username: userData.username}, secret, { expiresIn: '5h'})
    // console.log("get session", req.sessionID)
    req.session.userId = userData.id
    req.session.user = userData
    console.log('req session',req.session)
    console.log('login session', req.session.userId)
    // console.log(req.session.userId)
    // console.log("get userid", userData.id)
    // console.log("get user", userData)
    
    res.json({
      message: 'login success',
      token
    })
  } catch (error) {
    console.log('error', error)
    res.json({
      message: 'login fail',
      error: error
    })
  }
})

//API get user inlogin
app.get('/loginuser', async (req, res) => {
  try {
    const authHeader = req.headers['authorization']
    let authToken = ''
    if (authHeader) {
      authToken = authHeader.split(' ')[1]
    }
    console.log('authToken', authToken)
    const user = jwt.verify(authToken, secret)
    console.log('user', user)
    const results = await conn.query('SELECT * FROM users WHERE email = ?', user.email)
    res.json(results[0])
  }catch (error){
    console.log('error', error)
    res.status(403).json({
      message: 'authentication fail',
      error: error
    })
  }
})

// API select user id
app.get('/user/:username', async (req, res) => {
  try {
    let username = req.params.username
    const results = await conn.query('SELECT * FROM users WHERE username = ?', [username])
    
    res.json({
      message: 'find user',
      data: results[0]
    })
  } catch (error) {
    console.log('error', error)
    res.status(500).json({
          message: 'something wrong',
    })
  }
})

// API update user
app.patch('/updateuser/:id', async (req, res) => {
  try {
    let id = req.params.id
    let updateUser = req.body
    const results = await conn.query('UPDATE users SET ? WHERE id = ?', [updateUser, id])
    res.json({
      message: 'update ok',
      data: results[0]
    })
  } catch (error) {
    console.log('error', error)
    res.status(500).json({
          message: 'something wrong',
    })
  }
})

// API Get users for admin
app.get('/users', async (req, res) => {

  const results = await conn.query('SELECT * FROM users')
  res.json(results[0])
})
// API delete users                                                                            
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

// //API get post admin
// app.get('/post', upload.single('test'), async (req, res) => {

//   const results = await conn.query('SELECT * FROM product_buysell')
//   res.json(results[0])
// })


// // API Get Post buy sell
app.get('/posts-buysell', async (req, res) => {
  const results = await conn.query('SELECT * FROM product_buysell ORDER BY time_post DESC')
  res.json(results[0])
})

// // API Get Post/:ID buy sell
app.get('/posts-buysell/:id', async (req,res) => {
  try{
    let id = req.params.id
    const results = await conn.query('SELECT * from product_buysell WHERE id = ?', id)
    if (results[0].length > 0 ){
      res.json(results[0][0])
      } else {
        res.status(404).json({
           message: 'หาไม่เจอ'
            })
          }
  } catch (error){
    console.error('error message', error.message)
    res.status(500).json({
      message: 'something wrong',
    })
  }
})

// API to get buy sell posts for the logged-in user
app.get('/posts-buysell-logged', async (req, res) => {
  try {
    let user = req.query.username
    const results = await conn.query('SELECT * FROM product_buysell WHERE username = ? ORDER BY time_post DESC', [user]);
    res.json(results[0]);
  } catch (error) {
    console.error('error', error);
    res.status(500).json({ message: 'something wrong', error });
  }
});

// API POST favorite buy sell
app.post('/favorite-buysell', async (req, res) => {
  try {
    let {username, product_id, type} = req.body

    // ตรวจสอบก่อนว่ามีสินค้านี้ในรายการโปรดอยู่แล้วหรือไม่
    const checkResults = await conn.query('SELECT * FROM favorite WHERE product_id = ? AND username = ? AND type = ?', [product_id, username, type])

    if (checkResults[0].length > 0) {
      await conn.query('DELETE FROM favorite WHERE product_id = ? AND username = ? AND type = ?', [product_id, username, type])
      return res.status(400).json({ message: 'ลบสินค้าจากรายการโปรดแล้ว'})
    }

    const results = await conn.query('INSERT INTO favorite (product_id, username, type) VALUES (?, ?, ?)', [product_id, username, type]);
    res.json({ message: 'เพิ่มสินค้านี้ลงในรายการโปรดแล้ว' })
  } catch (error) {
    console.error('error', error);
    res.status(500).json({ message: 'something wrong', error });
  }
})

// API GET favorite buy sell
app.get('/favorite-buysell', async (req, res) => {
  try {
    let user = req.query.username
    let type = 'buysell'
    const results = await conn.query('SELECT * FROM product_buysell WHERE id IN (SELECT product_id FROM favorite WHERE username = ? AND type = ?) ORDER BY time_post DESC', [user, type]);
    res.json(results[0]);
  } catch (error) {
    console.error('error', error);
    res.status(500).json({ message: 'something wrong', error });
  }
});


// API update post buy sell
app.patch('/posts-buysell/:id', async (req, res) => {
  try {
    let id = req.params.id
    let updatePost = req.body
    const results = await conn.query('UPDATE product_buysell SET ? WHERE id = ?', [updatePost, id])
    res.json({
      message: 'update ok',
      data: results[0]
    })
  } catch (error) {
    console.log('error', error)
    res.status(500).json({
          message: 'something wrong',
    })
  }
})

// // API manage post /:username buy sell
// app.get('/posts-buysell/:username', async (req,res) => {
//   try{
//     let username = req.params.username
//     const results = await conn.query('SELECT * from product_buysell WHERE username = ?', username)
//     if (results[0].length > 0 ){
//       res.json(results[0][0])
//       } else {
//         res.status(404).json({
//            message: 'หาไม่เจอ'
//             })
//           }
//   } catch (error){
//     console.error('error message', error.message)
//     res.status(500).json({
//       message: 'something wrong',
//     })
//   }
// })

// API Post buy sell
app.post('/post-buysell', async (req, res) =>{
  try {
    const {username, breed, price, gender, age, vaccine, address, details, img} = req.body
    const post_buysell_data = {
      username,
      breed,
      price,
      gender,
      age,
      vaccine,
      address,
      details,
      img
    }

    const [results] = await conn.query('INSERT INTO product_buysell SET ?', post_buysell_data)
    res.json({
      message: 'post buysell success'
    })
  } catch (error) {
    console.error('error message', error.message)
    res.status(500).json({
      message: 'post buysell fall',
    })
  }
})


// // API Delete Post buy sell
app.delete('/post-buysell/:id', async (req, res) =>{
  try{
    let id = req.params.id
    const results = await conn.query('Delete from product_buysell WHERE id = ?', id)
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

// // API Get Post datting
app.get('/posts-datting', async (req, res) => {
  const results = await conn.query('SELECT * FROM product_datting ORDER BY time_post DESC')
  res.json(results[0])
})

// // API Get Post/:ID datting
app.get('/posts-datting/:id', async (req,res) => {
  try{
    let id = req.params.id
    const results = await conn.query('SELECT * from product_datting WHERE id = ?', id)
    if (results[0].length > 0 ){
      res.json(results[0][0])
      } else {
        res.status(404).json({
           message: 'หาไม่เจอ'
            })
          }
  } catch (error){
    console.error('error message', error.message)
    res.status(500).json({
      message: 'something wrong',
    })
  }
})

// API to get datting posts for the logged-in user
app.get('/posts-datting-logged', async (req, res) => {
  try {
    let user = req.query.username
    const results = await conn.query('SELECT * FROM product_datting WHERE username = ? ORDER BY time_post DESC', [user]);
    res.json(results[0]);
  } catch (error) {
    console.error('error', error);
    res.status(500).json({ message: 'something wrong', error });
  }
});

// API update post datting
app.patch('/posts-datting/:id', async (req, res) => {
  try {
    let id = req.params.id
    let updatePost = req.body
    const results = await conn.query('UPDATE product_datting SET ? WHERE id = ?', [updatePost, id])
    res.json({
      message: 'update ok',
      data: results[0]
    })
  } catch (error) {
    console.log('error', error)
    res.status(500).json({
          message: 'something wrong',
    })
  }
})


// API POST favorite datting
app.post('/favorite-datting', async (req, res) => {
  try {
    let {username, product_id,type} = req.body

    // ตรวจสอบก่อนว่ามีสินค้านี้ในรายการโปรดอยู่แล้วหรือไม่
    const checkResults = await conn.query('SELECT * FROM favorite WHERE product_id = ? AND username = ? AND type = ?', [product_id, username, type])

    if (checkResults[0].length > 0) {
      await conn.query('DELETE FROM favorite WHERE product_id = ? AND username = ? AND type = ?', [product_id, username, type])
      return res.status(400).json({ message: 'ลบสินค้าจากรายการโปรดแล้ว'})
    }

    const results = await conn.query('INSERT INTO favorite (product_id, username,type) VALUES (?, ?, ?)', [product_id, username, type]);
    res.json({ message: 'เพิ่มสินค้านี้ลงในรายการโปรดแล้ว' })
  } catch (error) {
    console.error('error', error);
    res.status(500).json({ message: 'something wrong', error });
  }
})

// API GET favorite datting
app.get('/favorite-datting', async (req, res) => {
  try {
    let user = req.query.username
    let type = 'datting'
    const results = await conn.query('SELECT * FROM product_datting WHERE id IN (SELECT product_id FROM favorite WHERE username = ? AND type = ?) ORDER BY time_post DESC', [user, type]);
    res.json(results[0]);
  } catch (error) {
    console.error('error', error);
    res.status(500).json({ message: 'something wrong', error });
  }
});


// API Post datting
app.post('/post-datting', async (req, res) =>{
  try {
    const {username, breed, price, gender, age, vaccine, address, details, img} = req.body
    const post_datting_data = {
      username,
      breed,
      price,
      gender,
      age,
      vaccine,
      address,
      details,
      img
    }

    const [results] = await conn.query('INSERT INTO product_datting SET ?', post_datting_data)
    res.json({
      message: 'post datting success'
    })
  } catch (error) {
    console.error('error message', error.message)
    res.status(500).json({
      message: 'post datting fall',
    })
  }
})

// // API Delete Post datting
app.delete('/post-datting/:id', async (req, res) =>{
  try{
    let id = req.params.id
    const results = await conn.query('Delete from product_datting WHERE id = ?', id)
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

// // API Get Post findhouse
app.get('/posts-findhouse', async (req, res) => {
  const results = await conn.query('SELECT * FROM product_findhouse ORDER BY time_post DESC')
  res.json(results[0])
})

// // API Get Post/:ID findhouse
app.get('/posts-findhouse/:id', async (req,res) => {
  try{
    let id = req.params.id
    const results = await conn.query('SELECT * from product_findhouse WHERE id = ?', id)
    if (results[0].length > 0 ){
      res.json(results[0][0])
      } else {
        res.status(404).json({
           message: 'หาไม่เจอ'
            })
          }
  } catch (error){
    console.error('error message', error.message)
    res.status(500).json({
      message: 'something wrong',
    })
  }
})

// API to get findhouse posts for the logged-in user
app.get('/posts-findhouse-logged', async (req, res) => {
  try {
    let user = req.query.username
    const results = await conn.query('SELECT * FROM product_findhouse WHERE username = ? ORDER BY time_post DESC', [user]);
    res.json(results[0]);
  } catch (error) {
    console.error('error', error);
    res.status(500).json({ message: 'something wrong', error });
  }
});

// API POST favorite findhouse
app.post('/favorite-findhouse', async (req, res) => {
  try {
    let {username, product_id, type} = req.body
    // ตรวจสอบก่อนว่ามีสินค้านี้ในรายการโปรดอยู่แล้วหรือไม่
    const checkResults = await conn.query('SELECT * FROM favorite WHERE product_id = ? AND username = ? AND type = ?', [product_id, username, type])

    if (checkResults[0].length > 0) {
      await conn.query('DELETE FROM favorite WHERE product_id = ? AND username = ? AND type = ?', [product_id, username, type])
      return res.status(400).json({ message: 'ลบสินค้าจากรายการโปรดแล้ว'})
    }

    const results = await conn.query('INSERT INTO favorite (product_id, username, type) VALUES (?, ?, ?)', [product_id, username, type]);
    res.json({ message: 'เพิ่มสินค้านี้ลงในรายการโปรดแล้ว' })
  } catch (error) {
    console.error('error', error);
    res.status(500).json({ message: 'something wrong', error });
  }
})

// API GET favorite findhouse
app.get('/favorite-findhouse', async (req, res) => {
  try {
    let user = req.query.username
    let type = 'findhouse'
    const results = await conn.query('SELECT * FROM product_findhouse WHERE id IN (SELECT product_id FROM favorite WHERE username = ? AND type = ?) ORDER BY time_post DESC', [user, type]);
    res.json(results[0]);
  } catch (error) {
    console.error('error', error);
    res.status(500).json({ message: 'something wrong', error });
  }
});

// API update post findhouse
app.patch('/posts-findhouse/:id', async (req, res) => {
  try {
    let id = req.params.id
    let updatePost = req.body
    const results = await conn.query('UPDATE product_findhouse SET ? WHERE id = ?', [updatePost, id])
    res.json({
      message: 'update ok',
      data: results[0]
    })
  } catch (error) {
    console.log('error', error)
    res.status(500).json({
          message: 'something wrong',
    })
  }
})

// API Post findhouse
app.post('/post-findhouse', async (req, res) =>{
  try {
    const {username, breed, gender, age, vaccine, address, details, img} = req.body
    const post_findhouse_data = {
      username,
      breed,
      gender,
      age,
      vaccine,
      address,
      details,
      img
    }

    const [results] = await conn.query('INSERT INTO product_findhouse SET ?', post_findhouse_data)
    res.json({
      message: 'post findhouse success'
    })
  } catch (error) {
    console.error('error message', error.message)
    res.status(500).json({
      message: 'post findhouse fall',
    })
  }
})

// // API Delete Post findhouse
app.delete('/post-findhouse/:id', async (req, res) =>{
  try{
    let id = req.params.id
    const results = await conn.query('Delete from product_findhouse WHERE id = ?', id)
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


// Profile


// app.get('/userprofile', (req, res) => {
//   // เช็คว่ามีผู้ใช้ล็อกอินอยู่หรือไม่
//   if (req.session.userId) {
//     // ถ้ามีผู้ใช้ล็อกอิน สามารถเรียกใช้ข้อมูลต่างๆ ที่เกี่ยวข้องกับผู้ใช้ได้
//     const userId = req.session.userId;
//     // ทำสิ่งที่ต้องการด้วย userId
//     res.send(`User ID: ${userId}`);
//   } else {
//     // หากไม่มีผู้ใช้ล็อกอิน ส่งข้อความแจ้งเตือนกลับไปยังผู้ใช้
//     res.send('ไม่พบผู้ใช้ที่ล็อกอินอยู่');
//   }
// });

// // ออกจากระบบ (ลบ session)
// app.post('/logout', (req, res) => {
//   req.session.destroy();
//   res.json({ message: 'Logout success' });
// });



// app.post('/upload', (req, res) => {
//   upload.single('test') (req, res, (err) => {
//     if (err) {
//       console.log('error', err.message)
//       res.status(400).json({ message: err.message})
//       return res.req.destroy()
//     }
//     res.json({ message: 'upload success'})
//   })
// })

// // path = PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
// app.put('/users/:id', async (req, res) =>{  
//   try{
//     let id = req.params.id
//     let updateUser = req.body
//     const results = await conn.query('UPDATE users SET ? WHERE id = ?', [updateUser, id])
//     res.json({
//       message: 'update ok',
//       data: results[0]
//     })
//   } catch (error){
//     console.error('error message', error.message)
//     res.status(500).json({
//       message: 'something wrong',
//     })
//   }
// })


app.listen(port, async (req, res ) => {
  await initMySQL()
  console.log('http server run at ' + port)
})