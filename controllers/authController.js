const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.signUp = async (req, res) => {

  const {username, password} = req.body;
  
  try {
    const salt = bcrypt.genSaltSync(12);
    const hashPassword = bcrypt.hashSync(req.body.password, salt);

    // const newUser = await User.create({
    //   username,
    //   password: hashPassword
    // });

    const newUser = new User({ 
      ...req.body, 
      password: hashPassword 
    });
    await newUser.save();
    req.session.user = newUser

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      }
    });
  } catch (e) {
     console.log(e);
     res.status(400).json({
       status: 'fail'
     })
  } 
};

exports.login = async (req, res) => {

  const {username, password} = req.body;

    try {
      const user = await User.findOne({username});

      if (!user) {
        return res.status(201).json({
          status: 'success',
          message: 'user notfound' 
      	});
      }
      
      const isCorrect = await bcrypt.compare(password, user.password);
      
      if(isCorrect) {
        req.session.user = user;
        return res.status(200).json({
          status: 'success'
        })
      } else {
          return res.status(400).json({
            status: 'fail',
            message: 'incorrect username or password'
          });
      }

    } catch (e) {
       console.log(e);
       res.status(400).json({
         status: 'fail'
       })
    } 
};