const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// MySQL 연결 설정
const dbConfig = {
    host: '223.130.156.107',
    port: 3306,
    user: 'twt_crawling',
    password: 'twt_crawling',
    database: 'SSL-survey-v1'
};

const connection = mysql.createConnection(dbConfig);

// MySQL 연결 테스트
connection.connect((err) => {
    if (err) {
        console.error('❌ MySQL 연결 실패:', err);
    } else {
        console.log('✅ MySQL 연결 성공!');
    }
});

// API 엔드포인트: 학생 정보 조회
app.get('/api/student/:userCode', (req, res) => {
    const { userCode } = req.params;
    
    console.log(`📋 학생 데이터 요청: ${userCode}`);
    
    // report_v1 테이블에서 학생 정보 조회
    const query = `
        SELECT 
            user_code,
            user_name,
            school,
            grade,
            gender,
            region,
            b_grade_subjects_count,
            desired_high_school,
            student_phone,
            parent_phone,
            자기조절능력,
            서류형인재_성향,
            면접형_인재_성향,
            내면학업수행능력,
            언어_이해_활용능력,
            인문형_인재,
            사회과학형_인재,
            경영경제형_인재,
            과학적_추론과_문제_해결력,
            수리논리능력,
            화학_생명공학형,
            컴퓨터공학형,
            기계공학형,
            전자전기공학형,
            산업공학형,
            의약학적성,
            typeB_score,
            typeC_score
        FROM report_v1 
        WHERE user_code = ?
    `;
    
    connection.query(query, [userCode], (err, results) => {
        if (err) {
            console.error('❌ DB 쿼리 오류:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        
        if (results.length === 0) {
            console.log(`❌ 학생을 찾을 수 없음: ${userCode}`);
            res.status(404).json({ error: 'Student not found' });
            return;
        }
        
        console.log(`✅ 학생 데이터 조회 성공: ${results[0].user_name}`);
        res.json(results[0]);
    });
});

// API 엔드포인트: 전체 학생 목록 조회
app.get('/api/students', (req, res) => {
    const query = `
        SELECT user_code, user_name, school, grade
        FROM report_v1 
        ORDER BY user_code
    `;
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error('❌ DB 쿼리 오류:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        
        console.log(`✅ 학생 목록 조회 성공: ${results.length}명`);
        res.json(results);
    });
});

// 메인 페이지 서빙
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 SSL Report 서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});

// 프로세스 종료 시 DB 연결 해제
process.on('SIGINT', () => {
    console.log('\n🔄 서버 종료 중...');
    connection.end(() => {
        console.log('✅ MySQL 연결 해제 완료');
        process.exit(0);
    });
});
