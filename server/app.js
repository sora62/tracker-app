require('dotenv').config();
const app = require('./index');

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Listening at http://localhost:${PORT}`);
// });
app.set('port', (process.env.PORT || 8080));

// Start node server
app.listen(app.get('port'), () => {
  console.log(`Node server is running on port${app.get('port')}`);
});
