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
    
    const { userCode } = req.query;
    
    console.log(`📋 학생 데이터 요청: ${userCode}`);
    
    // Input validation
    if (!userCode || userCode.trim() === '') {
        console.log('❌ 잘못된 학생 코드:', userCode);
        return res.status(400).json({ error: 'Invalid user code' });
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
        
        // Query to get student data
        const query = `
            SELECT 
                r.user_code,
                r.user_name,
                r.school,
                r.grade,
                r.gender,
                r.region,
                r.b_grade_subjects_count,
                r.desired_high_school,
                r.student_phone,
                r.parent_phone,
                r.test_completed,
                ua.test_completed_at,
                r.자기조절능력,
                r.서류형인재_성향,
                r.면접형_인재_성향,
                r.내면학업수행능력,
                r.언어_이해_활용능력,
                r.인문형_인재,
                r.사회과학형_인재,
                r.경영경제형_인재,
                r.과학적_추론과_문제_해결력,
                r.수리논리능력,
                r.화학_생명공학형,
                r.컴퓨터공학형,
                r.기계공학형,
                r.전자전기공학형,
                r.산업공학형,
                r.의약학적성,
                r.typeB_score,
                r.typeC_score
            FROM report_v1 r
            LEFT JOIN (
                SELECT user_code, MAX(test_completed_at) as test_completed_at
                FROM user_answers
                GROUP BY user_code
            ) ua ON r.user_code = ua.user_code
            WHERE r.user_code = ?
            LIMIT 1
        `;
        
        const [rows] = await connection.execute(query, [userCode]);
        await connection.end();
        
        if (!rows || rows.length === 0) {
            console.log(`❌ 학생을 찾을 수 없음: ${userCode}`);
            return res.status(404).json({ 
                error: 'Student not found', 
                userCode: userCode 
            });
        }
        
        // Check if test is completed
        if (rows[0].test_completed === 0) {
            console.log(`⚠️ 학생 검사 미완료: ${userCode}`);
            return res.status(403).json({ 
                error: 'Test not completed', 
                message: '아직 검사를 완료하지 않은 학생입니다.',
                userCode: userCode 
            });
        }
        
        console.log(`✅ 학생 데이터 조회 성공: ${rows[0].user_name}`);
        res.status(200).json(rows[0]);
        
    } catch (error) {
        console.error('❌ DB 쿼리 오류:', error);
        res.status(500).json({ 
            error: 'Database error', 
            message: error.message 
        });
    }
}
