// SSL v2 데이터를 기존 6척도 구조로 변환하는 프로세서

// 6척도 정의 (기존 ssl-result 프로젝트와 동일)
const SCALES = [
    { 
        key: 'selfRegulation', 
        name: '자기조절능력', 
        color: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgb(54, 162, 235)',
        pointColor: 'rgb(54, 162, 235)'
    },
    { 
        key: 'extracurricular', 
        name: '비교과 수행능력', 
        color: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgb(75, 192, 192)',
        pointColor: 'rgb(75, 192, 192)'
    },
    { 
        key: 'internalAcademic', 
        name: '내면 학업수행능력', 
        color: 'rgba(153, 102, 255, 0.7)',
        borderColor: 'rgb(153, 102, 255)',
        pointColor: 'rgb(153, 102, 255)'
    },
    { 
        key: 'languageProcessing', 
        name: '언어정보처리능력', 
        color: 'rgba(255, 205, 86, 0.7)',
        borderColor: 'rgb(255, 205, 86)',
        pointColor: 'rgb(255, 205, 86)'
    },
    { 
        key: 'engineeringThinking', 
        name: '공학적 사고력', 
        color: 'rgba(255, 159, 64, 0.7)',
        borderColor: 'rgb(255, 159, 64)',
        pointColor: 'rgb(255, 159, 64)'
    },
    { 
        key: 'medicalAptitude', 
        name: '의약학적성', 
        color: 'rgba(201, 203, 207, 0.7)',
        borderColor: 'rgb(158, 106, 198)',
        pointColor: 'rgb(158, 106, 198)'
    }
];

// MySQL 16척도를 6척도로 매핑하는 규칙 (사용자 제공 정보 기반)
const SCALE_MAPPING = {
    selfRegulation: ['자기조절능력'],
    extracurricular: ['서류형인재_성향', '면접형_인재_성향'], 
    internalAcademic: ['내면학업수행능력'],
    languageProcessing: ['언어_이해_활용능력', '인문형_인재', '사회과학형_인재', '경영경제형_인재'],
    engineeringThinking: ['과학적_추론과_문제_해결력', '수리논리능력', '화학_생명공학형', '컴퓨터공학형', '기계공학형', '전자전기공학형', '산업공학형'],
    medicalAptitude: ['의약학적성']
};

// 정규분포 통계 (기존과 동일)
const NORMAL_DIST = {
    mean: 100,      // 평균 점수 (정규화된 값)
    stdDev: 20,     // 표준편차
    minScore: 40,   // 최소 점수
    maxScore: 160,  // 최대 점수
    zMin: -3,       // 최소 Z-점수 
    zMax: 3,        // 최대 Z-점수
};

// Z-점수 계산 함수
function calculateZScore(score, mean, stdDev) {
    return (score - mean) / stdDev;
}

// Z-점수로부터 백분위 계산 함수
function calculatePercentile(z) {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    
    const sign = z < 0 ? -1 : 1;
    const absZ = Math.abs(z);
    
    const t = 1.0 / (1.0 + p * absZ);
    const erf = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absZ * absZ);
    
    return Math.round(((1.0 + sign * erf) / 2.0) * 100);
}

// 정규분포 곡선 데이터 생성 함수
function generateNormalDistributionData(mean, stdDev, min, max, points = 100) {
    const data = [];
    const step = (max - min) / points;

    for (let i = 0; i <= points; i++) {
        const x = min + (step * i);
        const z = (x - mean) / stdDev;
        const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
            Math.exp(-(Math.pow(z, 2) / 2));
        data.push({ x, y });
    }

    return data;
}

// 표준 정규분포 데이터 생성 함수 (Z-Score 기준)
function generateStandardNormalDistributionData(min, max, points) {
    const data = [];
    const step = (max - min) / points;
    
    for (let i = 0; i <= points; i++) {
        const x = min + (step * i);
        const y = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-(Math.pow(x, 2) / 2));
        data.push({ x, y });
    }
    
    return data;
}

// MySQL 데이터를 기존 6척도 구조로 변환하는 메인 함수
function processMySQLData(mysqlData) {
    console.log('📊 MySQL 데이터 변환 시작:', mysqlData.user_code);
    
    // 1. 16척도를 6척도로 그룹핑하여 합산
    const scaleScores = {};
    const scaleScores5 = {};
    const scaleZScores = {};
    
    SCALES.forEach(scale => {
        const mappedFields = SCALE_MAPPING[scale.key];
        let totalScore = 0;
        
        mappedFields.forEach(field => {
            const score = mysqlData[field] || 0;
            totalScore += score;
        });
        
        // 원점수 저장
        scaleScores[scale.key] = totalScore;
        
        // 5점 만점 점수: 각 6척도 항목의 합산 점수는 최대 200점이며, 이를 5점 만점으로 스케일링합니다.
        const scaledScore = (totalScore / 200) * 5;
        scaleScores5[scale.key] = parseFloat(scaledScore.toFixed(1));
        
        // Z-점수 계산 (통계 기반 - 추후 실제 통계로 교체 필요)
        const mean = 200 * 0.6; // 평균을 최대점수의 60%로 가정
        const stdDev = 200 * 0.15; // 표준편차를 최대점수의 15%로 가정
        scaleZScores[scale.key] = calculateZScore(totalScore, mean, stdDev);
    });
    
    // 2. 사분면 분석 데이터 생성 (서류형/면접형, 교과형/종합형)
    const documentScore = mysqlData.서류형인재_성향 || 0;
    const interviewScore = mysqlData.면접형_인재_성향 || 0;
    const academicScore = mysqlData.내면학업수행능력 || 0;
    const extracurricularScore = documentScore + interviewScore; // 합산으로 변경
    
    // 사분면 좌표 계산 (스케일링 추가)
    const SCALING_FACTOR = 4; // 좌표 값을 차트 범위 (-25 ~ 25)에 맞추기 위한 스케일링 계수
    const xAxis = (extracurricularScore - academicScore) / SCALING_FACTOR; // 종합형(+) vs 교과형(-)
    const yAxis = (documentScore - interviewScore) / SCALING_FACTOR;       // 서류형(+) vs 면접형(-)
    
    // 3. 학업성취도 데이터 (typeB, typeC 점수 활용)
    const englishScore = mysqlData.typeB_score || 0;
    const mathScore = mysqlData.typeC_score || 0;
    
    // 학업성취도 Z-점수 계산 (사용자 지정 통계 적용)
    const englishZScore = calculateZScore(englishScore, 25, 8); // Type B: 평균 25, 표준편차 8
    const mathZScore = calculateZScore(mathScore, 20, 7.5);      // Type C: 평균 20, 표준편차 7.5
    
    // 4. 기존 Excel 데이터 구조와 동일한 형태로 변환
    const processedData = {
        id: mysqlData.user_code,
        name: mysqlData.user_name,
        school: mysqlData.school || '정보없음',
        testDate: mysqlData.test_completed_at ? new Date(mysqlData.test_completed_at).toLocaleDateString('ko-KR') : new Date().toLocaleDateString('ko-KR'),
        gender: mysqlData.gender || '',
        region: mysqlData.region || '',
        bGradeCount: mysqlData.b_grade_subjects_count || 0,
        desiredSchool: mysqlData.desired_high_school || '',

        // 6척도 원점수
        scaleScores: scaleScores,

        // 5점 만점 점수
        scaleScores5: scaleScores5,

        // Z-score
        scaleZScores: scaleZScores,

        // 사분면 좌표
        quadrantData: {
            x: xAxis,  // 교과형(-) vs 종합형(+)
            y: yAxis   // 면접형(-) vs 서류형(+)
        },

        // 학업성취도
        academicData: {
            english: {
                score: englishScore,
                zScore: englishZScore
            },
            math: {
                score: mathScore,
                zScore: mathZScore
            }
        }
    };
    
    console.log('✅ 데이터 변환 완료:', processedData.name);
    console.log('📈 6척도 점수:', scaleScores);
    
    return processedData;
}

// 데이터 가져오기 함수 (기존 ssl-result의 getStudentData와 호환)
async function getStudentData(userCode, userName) {
    try {
        console.log(`🔍 학생 데이터 요청: ${userCode}, ${userName}`);
        
        const response = await fetch(`/api/student/${userCode}`);
        
        if (!response.ok) {
            throw new Error(`학생을 찾을 수 없습니다: ${response.status}`);
        }
        
        const mysqlData = await response.json();
        
        // 이름 검증 (선택적)
        if (userName && mysqlData.user_name !== userName) {
            console.warn('⚠️ 이름이 일치하지 않음:', { 
                expected: userName, 
                actual: mysqlData.user_name 
            });
        }
        
        // MySQL 데이터를 기존 구조로 변환
        return processMySQLData(mysqlData);
        
    } catch (error) {
        console.error('❌ 학생 데이터 가져오기 실패:', error);
        throw error;
    }
}

// 전체 학생 목록 가져오기
async function getStudentList() {
    try {
        const response = await fetch('/api/students');
        
        if (!response.ok) {
            throw new Error(`학생 목록 조회 실패: ${response.status}`);
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('❌ 학생 목록 가져오기 실패:', error);
        throw error;
    }
}
