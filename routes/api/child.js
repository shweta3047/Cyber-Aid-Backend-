const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const Child = require('../../models/Child');

router.post(
  '/signup',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Valid email is required').isEmail(),
    check('parent_email', 'Valid email is required').isEmail(),
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
    const { name, email, password, parent_email } = req.body;
    try {
      const user = await User.findOne({ email: parent_email });
      if (!user) {
        return res.status(400).json({
          errors: [
            { msg: 'Parent email id do not exist. Please create it first.' }
          ]
        });
      }
      const child = new Child({
        name,
        parent: user.id,
        email,
        parent_email,
        password
      });
      //Password encryption
      const salt = await bcrypt.genSalt(10);
      child.password = await bcrypt.hash(password, salt);
      await child.save();

      //console.log(user);
      return res.json({ child, parent: user });
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

router.post(
  '/login',
  [
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
    const { email, password } = req.body;
    try {
      const user = await Child.findOne({ email });
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

      const parent = await User.findOne({ email: user.parent_email });

      return res.json({ child: user, parent });
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
