//1. Importar los paquetes necesarios
const express = require('express');
const chalk = require('chalk')
const app = express();
const PORT = process.env.PORT || 5000
const bcrypt = require('bcrypt');
const database = require('./conf')

//2. Configurar hbs como el motor de vistas
app.set('view engine', 'hbs');

//3. Activar el urlencoded para poder enviar body al post
app.use(express.urlencoded({extended: false}))

//4. Ruta GET para el home page
app.get('/', (req, res)=> res.render('home'))

//5. Ruta GET para la pagina de login
app.get('/login', (req, res)=> res.render('login'))

//6. Ruta GET para la pagina de register
app.get('/register', (req, res)=> res.render('register'))

//7. Ruta POST para registrar un nuevo usuario
app.post('/register', async (req, res)=>{

  const password = req.body.password
  const name = req.body.name
  const confirmPassword = req.body.confirmPassword
  const email = req.body.email

  let errors = []

  if(!name || !email || !password || !confirmPassword){
    errors.push({msg: 'Por favor rellene todos los campos'})
  }

  if(req.body.password.length < 6){
    errors.push({msg: 'La contraseña tiene que tener al menos 6 caracteres'})
  }

  if(password !== confirmPassword){
    errors.push({msg: 'Las contraseñas no son iguales'})
  }

  if(!email.includes('@')){
    errors.push({msg: 'El email introducido no es correcto'})
  }

  if(errors.length > 0){
    res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  } else {
    const hashedPassword = await bcrypt.hash(req.body.password, 5)
    const validatedBody = {
      name: name, 
      password: hashedPassword, 
      email: email
    }
    database.query("INSERT INTO user SET ?", validatedBody, (error, results)=>{
      if(!error){
        res.send('Usuario creado con exito')
      } else {
        res.send(error)
      }
    })
  }
})

app.listen(PORT, ()=>{
  console.log(`Server started on port ${PORT}`)
})