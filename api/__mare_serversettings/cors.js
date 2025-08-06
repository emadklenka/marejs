import cors from 'cors';
export   function getMarecors()
{   // Secure CORS: use environment variable for allowed origins
    const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map(o => o.trim()).filter(Boolean);
    return cors({
        origin: function(origin, callback) {
            // Allow requests with no origin (like mobile apps, curl, etc.)
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: process.env.CORS_CREDENTIALS === 'true'
    });
}