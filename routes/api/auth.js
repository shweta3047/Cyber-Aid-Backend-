const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    return res.json(user);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send('Server Error');
  }
});

router.post(
  '/login',
  [
    check('email', 'Valid email is required')
      .not()
      .isEmpty(),
    check(
      'password',
      'Password should contain the length of atleast 6 chars'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      const isPassMatch = await bcrypt.compare(password, user.password);
      if (!isPassMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      return res.json(user);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.post(
  '/signup',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Valid email is required').isEmail(),
    check('password', 'Password should be be minimum of length 6').isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exsist' }] });
      }
      const users = new User({
        name,
        email,
        password
      });

      //Password encryption
      const salt = await bcrypt.genSalt(10);
      users.password = await bcrypt.hash(password, salt);
      await users.save();

      //console.log(user);
      return res.json({ user: users });
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
