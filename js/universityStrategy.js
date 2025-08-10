// 대입전략 로직 (기존 ssl-result에서 가져옴)

// 대입계열추천 함수
function getUniversityStrategies(studentData) {
    console.log('🎓 대입전략 분석 시작:', studentData.name);
    
    const strategies = {};
    
    // 6척도 점수에서 계열별 적성 점수 추출
    const scaleScores = studentData.scaleScores;
    const scaleZScores = studentData.scaleZScores;
    
    const languageScore = scaleScores.languageProcessing || 0;
    const engineeringScore = scaleScores.engineeringThinking || 0;
    const medicalScore = scaleScores.medicalAptitude || 0;
    
    const languageZ = scaleZScores.languageProcessing || 0;
    const engineeringZ = scaleZScores.engineeringThinking || 0;
    const medicalZ = scaleZScores.medicalAptitude || 0;
    
    // 계열별 점수 데이터 생성
    const fieldData = [
        {
            name: 'SKY인문사회계열',
            score: languageScore,
            zScore: languageZ,
            field: 'languageProcessing',
            description: '언어정보처리능력'
        },
        {
            name: 'SKY이공계열',
            score: engineeringScore,
            zScore: engineeringZ,
            field: 'engineeringThinking',
            description: '공학적사고력'
        },
        {
            name: '의치한약수계열',
            score: medicalScore,
            zScore: medicalZ,
            field: 'medicalAptitude',
            description: '의약학적성'
        }
    ];
    
    // 점수 기준으로 정렬
    fieldData.sort((a, b) => b.score - a.score);
    
    // 1순위, 2순위 전략 결정
    strategies[1] = fieldData[0].name;
    strategies[2] = fieldData[1].name;
    
    console.log('✅ 대입전략 완료:', strategies);
    return strategies;
}

// 계열 추천 근거 및 설명 생성
function getStrategyExplanation(studentData) {
    const scaleScores = studentData.scaleScores;
    const scaleZScores = studentData.scaleZScores;
    
    const languageScore = scaleScores.languageProcessing || 0;
    const engineeringScore = scaleScores.engineeringThinking || 0;
    const medicalScore = scaleScores.medicalAptitude || 0;
    
    const languageZ = scaleZScores.languageProcessing || 0;
    const engineeringZ = scaleZScores.engineeringThinking || 0;
    const medicalZ = scaleZScores.medicalAptitude || 0;
    
    // 백분위 계산
    const languagePercentile = calculatePercentile(languageZ);
    const engineeringPercentile = calculatePercentile(engineeringZ);
    const medicalPercentile = calculatePercentile(medicalZ);
    
    const languageTopPercentile = (100 - languagePercentile).toFixed(1);
    const engineeringTopPercentile = (100 - engineeringPercentile).toFixed(1);
    const medicalTopPercentile = (100 - medicalPercentile).toFixed(1);
    
    // 점수 데이터 배열
    const scoreData = [
        { 
            name: "언어정보처리능력", 
            score: languageScore, 
            field: "SKY인문사회계열", 
            percentile: parseFloat(languageTopPercentile) 
        },
        { 
            name: "공학적사고력", 
            score: engineeringScore, 
            field: "SKY이공계열", 
            percentile: parseFloat(engineeringTopPercentile) 
        },
        { 
            name: "의약학적성", 
            score: medicalScore, 
            field: "의치한약수 계열", 
            percentile: parseFloat(medicalTopPercentile) 
        }
    ];
    
    // 점수 기준 내림차순 정렬
    scoreData.sort((a, b) => b.score - a.score);
    
    const topScore = scoreData[0];
    const secondScore = scoreData[1];
    
    // 추천 근거 설명
    const recommendationExplanation = `<strong>${topScore.name}</strong> 점수(${topScore.score}점)가 가장 높아 <strong>${topScore.field}</strong>을 1순위로, <strong>${secondScore.name}</strong> 점수(${secondScore.score}점)가 두 번째로 높아 <strong>${secondScore.field}</strong>을 2순위로 추천합니다.`;
    
    // 진학 가능성 메시지
    const above50Percent = scoreData.filter(item => item.percentile <= 50);
    let potentialMessage = '';
    
    if (above50Percent.length > 0) {
        const fields = above50Percent.map(item => `<strong>${item.field}</strong>`).join(', ');
        potentialMessage = `${fields} 적성 점수가 상위 50% 이상으로, 학생이 희망하는 경우 해당 계열로 진학이 가능합니다.`;
    } else {
        potentialMessage = `모든 계열의 적성 점수가 상위 50% 미만으로, 희망 계열 진학을 위해서는 추가적인 학습이 필요합니다.`;
    }
    
    return {
        languageScore: `${languageScore}점 (상위 ${languageTopPercentile}%)`,
        engineeringScore: `${engineeringScore}점 (상위 ${engineeringTopPercentile}%)`,
        medicalScore: `${medicalScore}점 (상위 ${medicalTopPercentile}%)`,
        recommendationExplanation,
        potentialMessage
    };
}

// 대입전형 전략 상세 내용
function getDetailedStrategy(studentData) {
    const scaleZScores = studentData.scaleZScores;
    const quadrantData = studentData.quadrantData;
    
    // 내면학업수행능력과 비교과수행능력 분석
    const academicZ = scaleZScores.internalAcademic || 0;
    const extracurricularZ = scaleZScores.extracurricular || 0;
    
    const academicPercentile = calculatePercentile(academicZ);
    const extracurricularPercentile = calculatePercentile(extracurricularZ);
    
    const academicTopPercentile = Math.round(100 - academicPercentile);
    const extracurricularTopPercentile = Math.round(100 - extracurricularPercentile);
    
    // 교과전형 전략
    const subjectStrategy = `내면학업수행능력이 상위 ${academicTopPercentile}% 수준으로, 교과전형 성공을 위해서는 학습 루틴을 체계화하고 고교 1학년 내신 관리에 특히 집중해야 합니다. 주요교과(국영수과)의 A등급 비율을 높이는 것이 가장 중요합니다. 우수 대학의 교과전형은 성적 외에도 세부능력특기사항(교과세특)을 평가하므로, 수행평가를 통해 '문제해결력', '교과내용 재구성' 등의 키워드가 기록되도록 관리해야 합니다.`;
    
    // 종합전형 전략
    const comprehensiveStrategy = `비교과수행능력이 상위 ${extracurricularTopPercentile}% 수준으로 학생부종합전형 성공을 위해서는 생기부에 "융합적 사고력"과 "문제해결력"이 드러나는 활동이 필수적입니다. 소논문 작성, 교내 학술대회 참여, 주요 교과목 발표 활동 등을 통해 학생부 기록을 체계적으로 관리하며, 진로 관련 독서활동을 통해 인성과 발전가능성 평가요소도 함께 준비해야 합니다.`;
    
    return {
        subjectStrategy,
        comprehensiveStrategy,
        academicTopPercentile,
        extracurricularTopPercentile
    };
}

// 학생부 관리 스펙트럼 위치 계산
function getStudentSpectrumPosition(studentData) {
    const scaleZScores = studentData.scaleZScores;
    const quadrantData = studentData.quadrantData;
    
    // 첫 번째 스펙트럼: 활동의 확장성 vs 안정성
    const extracurricularZ = scaleZScores.extracurricular || 0;
    const academicZ = scaleZScores.internalAcademic || 0;
    
    // -1~1 범위로 정규화 후 백분위로 변환 (50% = 중앙)
    const spectrum1Position = Math.max(0, Math.min(100, ((extracurricularZ + 2) / 4) * 100));
    
    // 두 번째 스펙트럼: 비교과 활동 중요성 vs 교과성취도 중요성
    const comprehensiveScore = quadrantData.x; // 종합형(+) vs 교과형(-)
    const spectrum2Position = Math.max(0, Math.min(100, ((comprehensiveScore + 25) / 50) * 100));
    
    return {
        spectrum1Position, // 활동 확장성(0) vs 안정성(100)
        spectrum2Position  // 비교과 중요(0) vs 교과 중요(100)
    };
}
