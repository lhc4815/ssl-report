import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        // Create connection
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        
        // Query to get student list without duplicates
        const query = `
            SELECT DISTINCT
                user_code, 
                MAX(user_name) as user_name, 
                MAX(school) as school, 
                MAX(grade) as grade
            FROM report_v1 
            GROUP BY user_code
            ORDER BY user_code
            LIMIT 100
        `;
        
        const [rows] = await connection.execute(query);
        await connection.end();
        
        console.log(`✅ 학생 목록 조회 성공: ${rows.length}명`);
        res.status(200).json(rows);
        
    } catch (error) {
        console.error('❌ DB 쿼리 오류:', error);
        res.status(500).json({ 
            error: 'Database error', 
            message: error.message 
        });
    }
}
