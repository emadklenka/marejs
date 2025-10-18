import cors from 'cors';

/**
 * MareJS CORS Configuration
 * 
 * By default, allows all origins.
 * To restrict access, uncomment and modify the code below.
 */
export function getMarecors() {
    return cors({
        origin: true, // Allow all origins
        credentials: true
    });
    
    /* 
    // To restrict to specific origins, use this instead:
    return cors({
        origin: ['https://yourdomain.com', 'https://app.yourdomain.com'],
        credentials: true
    });
    */
}