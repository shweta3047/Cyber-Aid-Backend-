const express = require('express');
const router = express.Router();
const Message = require('../../models/Messages');

router.get('/:id', async (req, res) => {
  try {
    //const { id } = req.body;
    const messages = await Message.find({ user: req.params.id });

    res.json(messages);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/', async (req, res) => {
  const { id, address, body, child_id, parent_id } = req.body;

  try {
    const messages = await Message.find({ message_id: id });
    if (messages.length > 0) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Message already saved' }] });
    }

    const message = new Message({
      message_id: id,
      user: parent_id,
      child: child_id,
      message: body,
      recipient: address
    });

    await message.save();

    return res.json({ msg: 'Saved successfully' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
