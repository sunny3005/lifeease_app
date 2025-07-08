const rateLimitStore = new Map();

export const createRateLimit = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  return (req, res, next) => {
    const clientId = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    for (const [key, data] of rateLimitStore.entries()) {
      if (data.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }

    // Get or create client data
    let clientData = rateLimitStore.get(clientId);
    if (!clientData || clientData.resetTime < now) {
      clientData = {
        count: 0,
        resetTime: now + windowMs
      };
      rateLimitStore.set(clientId, clientData);
    }

    // Check if limit exceeded
    if (clientData.count >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
      });
    }

    // Increment counter
    clientData.count++;

    // Add headers
    res.set({
      'X-RateLimit-Limit': maxRequests,
      'X-RateLimit-Remaining': Math.max(0, maxRequests - clientData.count),
      'X-RateLimit-Reset': new Date(clientData.resetTime).toISOString()
    });

    next();
  };
};

// Specific rate limiters
export const authRateLimit = createRateLimit(15 * 60 * 1000, 5); // 5 requests per 15 minutes
export const apiRateLimit = createRateLimit(15 * 60 * 1000, 100); // 100 requests per 15 minutes
export const uploadRateLimit = createRateLimit(60 * 1000, 10); // 10 uploads per minute