export default {
  // mongoURI: 'mongodb://mongo:27017/bidcart',
  // mongoURI: 'mongodb://localhost:27017/bidcart',
  mongoURI: 'mongodb://mongo:27017/popcart',
  "jwt": {
    "secretOrKey": "secret",
    "expiresIn": 36000000
  },
  "host": {
    "url": "<server-url>",
    "port": "3000"
},
  "mail":{
    "host": "smtp.example.com",
    "port": 587,
    "secure": false,
    "user": "arunlajayan@example.com",
    "pass": "your-email-password"
}
};
