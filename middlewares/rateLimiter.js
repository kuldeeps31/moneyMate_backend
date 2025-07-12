
//const apiLimiter = rateLimit({
//  windowMs: 15 * 60 * 1000, // 15 minutes
//  max: 100, // limit each IP to 100 requests per windowMs
//  message: { message: "Too many requests, please try again later." },
//});

//module.exports = apiLimiter;


const rateLimit = require("express-rate-limit");

// Export limiter middleware
const exportLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // ⏱️ 10 minutes window
  max: 5,                   // ⛔ Allow only 3 requests per window per IP
  message: "❌ Too many export requests. Please wait 10 minutes.",
});
module.exports = exportLimiter;