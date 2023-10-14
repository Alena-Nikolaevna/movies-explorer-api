const rateLimit = require('express-rate-limit');

// чтобы использовать его на сервере только для API,
// где ограничитель скорости должен применяться ко всем запросам
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // // Ограничение каждого IP до 100 запросов на «окно» (здесь за 15 минут)
  standardHeaders: true, // // Ограничение скорости возврата информация в заголовках `RateLimit-*`
  legacyHeaders: false, // Отключить заголовки `X-RateLimit-*` (headers)
});

module.exports = limiter;
