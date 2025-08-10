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

// MySQL 연결 풀 설정 (안정성 향상)
const pool = mysql.createPool({
    host: '223.130.156.107',
    port: 3306,
    user: 'twt_crawling',
    password: 'twt_crawling',
    database: 'SSL-survey-v1',
    connectionLimit: 10,      // 최대 연결 수
    queueLimit: 0,           // 대기열 제한 없음
    acquireTimeout: 60000,   // 연결 획득 타임아웃 (60초)
    timeout: 60000,          // 쿼리 타임아웃 (60초)
    reconnect: true,         // 자동 재연결
    idleTimeout: 300000,     // 유휴 연결 타임아웃 (5분)
    retry: {
        max: 3,              // 최대 재시도 횟수
        timeout: 2000        // 재시도 간격 (2초)
    }
});

// 연결 풀 이벤트 핸들러
pool.on('connection', (connection) => {
    console.log('✅ 새 MySQL 연결 생성:', connection.threadId);
});

pool.on('error', (err) => {
    console.error('❌ MySQL 풀 오류:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('🔄 MySQL 연결이 끊어졌습니다. 자동 재연결 시도 중...');
    }
});

// 초기 연결 테스트
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ MySQL 연결 풀 초기화 실패:', err);
    } else {
        console.log('✅ MySQL 연결 풀 초기화 성공!');
        connection.release();
    }
});

// API 엔드포인트: 학생 정보 조회 (에러 핸들링 강화)
app.get('/api/student/:userCode', (req, res) => {
    const { userCode } = req.params;
    
    console.log(`📋 학생 데이터 요청: ${userCode}`);
    
    // 입력 검증
    if (!userCode || userCode.trim() === '') {
        console.log('❌ 잘못된 학생 코드:', userCode);
        return res.status(400).json({ error: 'Invalid user code' });
    }
    
    // report_v1 테이블과 user_answers 테이블 조인하여 학생 정보 조회
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
    
    // 연결 풀을 사용한 쿼리 실행
    pool.query(query, [userCode], (err, results) => {
        if (err) {
            console.error('❌ DB 쿼리 오류:', err);
            console.error('❌ 쿼리:', query);
            console.error('❌ 파라미터:', [userCode]);
            return res.status(500).json({ 
                error: 'Database error', 
                message: err.message 
            });
        }
        
        if (!results || results.length === 0) {
            console.log(`❌ 학생을 찾을 수 없음: ${userCode}`);
            return res.status(404).json({ 
                error: 'Student not found', 
                userCode: userCode 
            });
        }
        
        console.log(`✅ 학생 데이터 조회 성공: ${results[0].user_name}`);
        res.json(results[0]);
    });
});

// API 엔드포인트: 전체 학생 목록 조회 (에러 핸들링 강화)
app.get('/api/students', (req, res) => {
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
    
    pool.query(query, (err, results) => {
        if (err) {
            console.error('❌ DB 쿼리 오류:', err);
            return res.status(500).json({ 
                error: 'Database error', 
                message: err.message 
            });
        }
        
        console.log(`✅ 학생 목록 조회 성공: ${results.length}명`);
        res.json(results);
    });
});

// 헬스체크 엔드포인트
app.get('/api/health', (req, res) => {
    pool.query('SELECT 1', (err, results) => {
        if (err) {
            console.error('❌ 헬스체크 실패:', err);
            return res.status(500).json({ 
                status: 'error', 
                database: 'disconnected',
                error: err.message 
            });
        }
        
        res.json({ 
            status: 'ok', 
            database: 'connected',
            timestamp: new Date().toISOString() 
        });
    });
});

// 메인 페이지 서빙
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 핸들러
app.use((req, res) => {
    res.status(404).json({ error: 'Not found', path: req.path });
});

// 전역 에러 핸들러
app.use((err, req, res, next) => {
    console.error('❌ 서버 오류:', err);
    res.status(500).json({ 
        error: 'Internal server error', 
        message: err.message 
    });
});

// 서버 시작
const server = app.listen(PORT, () => {
    console.log(`🚀 SSL Report 서버가 http://localhost:${PORT}에서 실행 중입니다.`);
    console.log(`📊 헬스체크: http://localhost:${PORT}/api/health`);
});

// 서버 타임아웃 설정
server.timeout = 30000; // 30초

// 프로세스 종료 시 연결 풀 해제
process.on('SIGINT', () => {
    console.log('\n🔄 서버 종료 중...');
    pool.end(() => {
        console.log('✅ MySQL 연결 풀 해제 완료');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🔄 서버 종료 중...');
    pool.end(() => {
        console.log('✅ MySQL 연결 풀 해제 완료');
        process.exit(0);
    });
});
