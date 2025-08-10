// 고교 추천 로직 (기존 ssl-result에서 가져옴)

// 새로운 고교 선택지 정의
const SCHOOL_TIERS = {
    TOP_NATIONWIDE: '전국단위 자사고(외대부고, 상산고, 민사고)',
    HIGH_NATIONWIDE: '전국단위 자사고(포항제철고, 광양제철고, 김천고)',
    SEOUL_PRIVATE: '서울형 자사고(하나고)',
    METROPOLITAN_PRIVATE: '광역단위 자사고',
    FOREIGN_LANG: '외국어고',
    SCIENCE: '과학고',
    GIFTED: '영재고',
    INTERNATIONAL: '국제고',
    GENERAL: '일반고'
};

// 엄격한 기준이 적용되는 학교 목록
const STRICT_SCHOOLS = [SCHOOL_TIERS.TOP_NATIONWIDE, SCHOOL_TIERS.SEOUL_PRIVATE];

// 기존 학교명을 새로운 엄격한 기준에 맞게 확인하는 헬퍼 함수
function isStrictSchool(schoolName) {
    if (!schoolName) return false;
    
    // 새로운 엄격한 학교 유형 이름 확인
    if (STRICT_SCHOOLS.some(strictSchool => schoolName.includes(strictSchool.split('(')[0]))) {
        return true;
    }
    
    // 기존 데이터에 있을 수 있는 구버전 학교 이름 확인
    const oldStrictNames = ['전국단위 자율형사립고', '서울 자율형사립고'];
    if (oldStrictNames.some(oldName => schoolName.includes(oldName))) {
        return true;
    }
    
    return false;
}

// Z-점수로부터 백분위 계산 함수 (dataProcessor.js에서 복사)
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

// 고교 추천 함수 (v6, 최종 규칙 기반)
function getHighSchoolRecommendations(studentData) {
    console.log('🏫 고교 추천 분석 시작 (v6):', studentData.name);

    const { bGradeCount = 0, desiredSchool = '' } = studentData;
    const recommendations = {};
    const isStrictConditionMet = bGradeCount === 0;

    // --- 1지망 결정 ---
    let firstChoice = desiredSchool || ''; // 기본값은 학생의 희망

    if (desiredSchool) {
        const isDesiredStrict = isStrictSchool(desiredSchool);
        if (isDesiredStrict && !isStrictConditionMet) {
            // 희망이 엄격한데 조건 미달 -> 상위권으로 변경
            firstChoice = SCHOOL_TIERS.HIGH_NATIONWIDE;
        } else if (desiredSchool.includes('전국단위자사고')) {
             // 조건 만족 시, 이름 통일
            firstChoice = isStrictConditionMet ? SCHOOL_TIERS.TOP_NATIONWIDE : SCHOOL_TIERS.HIGH_NATIONWIDE;
        }
    } else {
        // 희망 고교가 없는 경우, 임시로 일반고 설정 후 2지망 로직에서 재평가
        firstChoice = SCHOOL_TIERS.GENERAL;
    }
    recommendations[1] = firstChoice;

    // --- 2지망 결정 ---
    let secondChoice = '';
    const firstChoiceKey = Object.keys(SCHOOL_TIERS).find(key => SCHOOL_TIERS[key] === firstChoice) || 'GENERAL';

    switch (firstChoiceKey) {
        case 'TOP_NATIONWIDE':
            secondChoice = SCHOOL_TIERS.HIGH_NATIONWIDE;
            break;
        case 'HIGH_NATIONWIDE':
            secondChoice = SCHOOL_TIERS.METROPOLITAN_PRIVATE;
            break;
        case 'SEOUL_PRIVATE':
            secondChoice = SCHOOL_TIERS.METROPOLITAN_PRIVATE;
            break;
        case 'METROPOLITAN_PRIVATE':
            secondChoice = SCHOOL_TIERS.GENERAL;
            break;
        case 'FOREIGN_LANG':
            secondChoice = SCHOOL_TIERS.GENERAL;
            break;
        case 'SCIENCE':
            secondChoice = SCHOOL_TIERS.GENERAL;
            break;
        case 'GIFTED':
            secondChoice = SCHOOL_TIERS.SCIENCE;
            break;
        case 'INTERNATIONAL':
            secondChoice = SCHOOL_TIERS.FOREIGN_LANG;
            break;
        case 'GENERAL':
            secondChoice = SCHOOL_TIERS.METROPOLITAN_PRIVATE;
            break;
        default:
            // 1지망이 목록에 없는 custom 문자열일 경우
            secondChoice = SCHOOL_TIERS.GENERAL;
            break;
    }
    
    recommendations[2] = secondChoice;
    
    console.log('✅ 고교 추천 완료 (v6):', recommendations);
    return recommendations;
}

// 추가 평가 정보 생성
function getAdmissionEvaluation(studentData) {
    const bGradeCount = studentData.bGradeCount || 0;
    const academicData = studentData.academicData;
    const quadrantData = studentData.quadrantData;
    
    // 합격가능성 평가
    let admissionPossibility = '';
    if (bGradeCount === 0) {
        admissionPossibility = `내신 성적 중 B등급과목 ${bGradeCount}개로 지망 학교 지원 시 충분한 합격가능성이 있습니다.`;
    } else {
        admissionPossibility = `내신 성적 중 B등급과목 ${bGradeCount}개로 전략적인 지망 학교 선정 필요성이 있습니다.`;
    }
    
    // 학업성취도 평가
    const englishPercentile = calculatePercentile(academicData.english.zScore);
    const mathPercentile = calculatePercentile(academicData.math.zScore);
    const englishRank = Math.min(99, Math.max(1, Math.round(100-englishPercentile)));
    const mathRank = Math.min(99, Math.max(1, Math.round(100-mathPercentile)));
    
    const isEnglishGood = englishRank <= 30;
    const isMathGood = mathRank <= 30;
    
    let academicEvaluation = '';
    let evaluationText = '';
    if (isEnglishGood && isMathGood) {
        evaluationText = "지망 고등학교 진학 후에도 우수한 성적 관리가 가능할 것으로 예상됩니다.";
    } else if (!isEnglishGood && isMathGood) {
        evaluationText = "지망 고등학교 진학 후에도 성적 관리를 위해 영어교과 보충심화가 필요합니다.";
    } else if (isEnglishGood && !isMathGood) {
        evaluationText = "지망 고등학교 진학 후에도 성적 관리를 위해 수학교과 보충심화가 필요합니다.";
    } else {
        evaluationText = "지망 고등학교 진학 후에도 성적 관리를 위해 영어 및 수학 교과 보충심화가 필요합니다.";
    }
    
    academicEvaluation = `학업성취도가 영어, 수학 각각 전체 응시자 중 상위 ${englishRank}%, 상위 ${mathRank}%로, ${evaluationText}`;
    
    // 대입전형 평가
    const comprehensiveX = quadrantData.x;
    const comprehensivePercentile = Math.min(99, Math.max(1, Math.round(((comprehensiveX + 25) / 50 * 100))));
    const subjectPercentile = Math.min(99, Math.max(1, Math.round(((25 - comprehensiveX) / 50 * 100))));
    
    const recommendationText = comprehensivePercentile > subjectPercentile 
        ? '비교과활동을 적극적으로 공략하는 것이 유리합니다.'
        : '교과활동을 적극적으로 공략하는 것이 유리합니다.';
    
    const admissionTypeEvaluation = `학생부종합전형 적합도 ${comprehensivePercentile}%, 학생부교과전형 적합도 ${subjectPercentile}%로, ${recommendationText}`;
    
    return {
        admissionPossibility,
        academicEvaluation,
        admissionTypeEvaluation
    };
}
