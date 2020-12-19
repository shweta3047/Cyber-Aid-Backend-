const express = require('express');
const connectDB = require('./config/connectDB');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json({ extended: false }));

//Connect Database
connectDB();

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', ['*']);
  next();
});

app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/child', require('./routes/api/child'));
app.use('/api/mailing', require('./routes/api/mailing'));
app.use('/api/badmessage', require('./routes/api/badmessage'));

app.listen(PORT, () => {
  console.log('Server is running on', PORT);
});
