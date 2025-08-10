// 차트 생성 함수들 (기존 ssl-result 프로젝트에서 가져옴)

// 방사형 차트 생성 함수
function createRadarChart(studentData) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    // 5점 만점 점수 사용
    const averageScores = SCALES.map(scale => studentData.scaleScores5[scale.key]);
    
    // 파스텔톤 색상 정의
    const pastelBlue = 'rgba(116, 185, 255, 0.5)';
    const pastelColors = [
        'rgba(116, 185, 255, 1)',    // 파스텔 블루
        'rgba(162, 222, 208, 1)',    // 파스텔 민트
        'rgba(153, 102, 255, 1)',    // 파스텔 퍼플
        'rgba(255, 205, 86, 1)',     // 파스텔 옐로우
        'rgba(255, 159, 64, 1)',     // 파스텔 오렌지
        'rgba(201, 203, 207, 1)'     // 파스텔 그레이
    ];
    
    // 모바일인지 확인
    const isMobile = window.innerWidth <= 768;
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: SCALES.map(scale => scale.name),
            datasets: [{
                label: '5점 만점 평균',
                data: averageScores,
                backgroundColor: pastelBlue,
                borderColor: 'rgb(85, 165, 240)',
                pointBackgroundColor: pastelColors,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(54, 162, 235)',
                borderWidth: 1.5,
                pointRadius: isMobile ? 4 : 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    min: 0,
                    max: 5,
                    ticks: { 
                        stepSize: 1,
                        color: 'rgba(0, 0, 0, 0.5)'
                    },
                    angleLines: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    pointLabels: {
                        color: '#333333',
                        font: {
                            size: isMobile ? 12 : 16,
                            weight: 'bold'
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: '6척도 절대점수 프로파일',
                    color: '#333333',
                    font: { size: isMobile ? 14 : 18, weight: 'bold' }
                },
                legend: {
                    display: false
                },
                datalabels: {
                    color: '#333333',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: 4,
                    formatter: (value) => value.toFixed(1),
                    font: { weight: 'bold', size: isMobile ? 10 : 12 }
                }
            }
        }
    });
}

// 정규분포 차트 생성 (Z-Score 기준)
function createNormalDistCharts(studentData) {
    SCALES.forEach(scale => {
        const chartId = scale.key + 'Chart';
        const ctx = document.getElementById(chartId).getContext('2d');
        const zScore = studentData.scaleZScores[scale.key];
        const percentile = calculatePercentile(zScore);
        
        // Z-Score 기반으로 표준 정규분포 데이터 생성 (-3 ~ 3)
        const normalDistData = generateStandardNormalDistributionData(-3, 3, 100);
        // 학생의 Z-Score보다 작은 영역 (상위 영역)
        const studentAreaData = normalDistData.filter(point => point.x <= zScore);
        
        // 학생 위치 y값 계산 (표준정규분포 함수)
        const studentY = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-(Math.pow(zScore, 2) / 2));
        
        // 척도별 커스텀 색상 설정
        let borderColor = scale.color;
        let backgroundColor = scale.color.replace('0.7', '0.3');
        let pointColor = scale.color;
        
        // 공학적 사고력의 경우 빨간색 계열로 변경
        if (scale.key === 'engineeringThinking') {
            borderColor = 'rgba(220, 53, 69, 0.7)';
            backgroundColor = 'rgba(220, 53, 69, 0.3)';
            pointColor = 'rgba(220, 53, 69, 1)';
        }
        // 의약학적성의 경우 파란색 계열로 변경
        else if (scale.key === 'medicalAptitude') {
            borderColor = 'rgba(0, 123, 255, 0.7)';
            backgroundColor = 'rgba(0, 123, 255, 0.3)';
            pointColor = 'rgba(0, 123, 255, 1)';
        }
        
        new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: '정규분포',
                        data: normalDistData,
                        borderColor: 'rgba(100, 100, 100, 0.5)',
                        backgroundColor: 'rgba(100, 100, 100, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: '상위 영역',
                        data: studentAreaData,
                        borderColor: borderColor,
                        backgroundColor: backgroundColor,
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: '학생 위치',
                        data: [{ x: zScore, y: studentY }],
                        backgroundColor: scale.color,
                        borderColor: scale.color,
                        pointRadius: 8,
                        pointHoverRadius: 10,
                        showLine: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        min: -3,
                        max: 3,
                        title: { display: true, text: 'Z-Score', font: { weight: 'bold' } }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { display: false },
                        title: { display: true, text: '빈도', font: { weight: 'bold' } }
                    }
                },
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: scale.name,
                        font: { size: window.innerWidth <= 768 ? 14 : 16, weight: 'bold' }
                    },
                    subtitle: {
                        display: true,
                        text: `Z점수: ${zScore.toFixed(2)}, 백분위: ${percentile}%`,
                        font: { size: window.innerWidth <= 768 ? 10 : 12 }
                    },
                    datalabels: {
                        display: ctx => ctx.datasetIndex === 2,
                        color: '#000000',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: 4,
                        padding: window.innerWidth <= 768 ? 2 : 4,
                        font: { weight: 'bold', size: window.innerWidth <= 768 ? 9 : 11 },
                        formatter: () => `상위 ${(100 - percentile).toFixed(1)}%`
                    }
                }
            }
        });
    });
}

// 점수 테이블 업데이트
function updateScaleTable(studentData) {
    const tableBody = document.getElementById('scaleTableBody');
    tableBody.innerHTML = '';
    
    SCALES.forEach(scale => {
        const score = studentData.scaleScores[scale.key];
        const averageScore = studentData.scaleScores5[scale.key];
        const zScore = studentData.scaleZScores[scale.key];
        const percentile = calculatePercentile(zScore);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${scale.name}</td>
            <td>${score}</td>
            <td>${averageScore.toFixed(1)}</td>
            <td>${zScore.toFixed(2)}</td>
            <td>${percentile}%</td>
            <td>상위 ${(100 - percentile).toFixed(1)}%</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// 사분면 차트 생성
function createQuadrantChart(studentData) {
    const ctx = document.getElementById('quadrantChart').getContext('2d');
    
    // 좌표값 및 백분위 계산
    const xCoord = studentData.quadrantData.x;
    const yCoord = studentData.quadrantData.y;
    
    // 백분위 계산 (임시로 -25~25 범위로 가정)
    const xPercentile = Math.min(99, Math.max(1, Math.round(((xCoord + 25) / 50 * 100))));
    const subjectPercentile = Math.min(99, Math.max(1, Math.round(((25 - xCoord) / 50 * 100))));
    const yPercentile = Math.min(99, Math.max(1, Math.round(((yCoord + 25) / 50 * 100))));
    const interviewPercentile = Math.min(99, Math.max(1, Math.round(((25 - yCoord) / 50 * 100))));
    
    // 해석 생성
    const xInterpretation = xCoord >= 0 ? '종합형 성향 강함' : '교과형 성향 강함';
    const yInterpretation = yCoord >= 0 ? '서류형 성향 강함' : '면접형 성향 강함';
    
    // 결과를 테이블에 표시
    document.getElementById('xCoordValue').textContent = xCoord.toFixed(1);
    document.getElementById('xPercentileValue').textContent = `종합형 ${xPercentile}%, 교과형 ${subjectPercentile}%`;
    document.getElementById('xInterpretation').textContent = xInterpretation;
    
    document.getElementById('yCoordValue').textContent = yCoord.toFixed(1);
    document.getElementById('yPercentileValue').textContent = `서류형 ${yPercentile}%, 면접형 ${interviewPercentile}%`;
    document.getElementById('yInterpretation').textContent = yInterpretation;
    
    // 차트 생성
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: '학생 위치',
                    data: [{ x: xCoord, y: yCoord }],
                    backgroundColor: 'rgba(255, 99, 132, 1)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    pointRadius: 10,
                    pointHoverRadius: 12
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    min: -25,
                    max: 25,
                    title: { 
                        display: true, 
                        text: '교과형(-) ⟷ 종합형(+)', 
                        font: { weight: 'bold' } 
                    },
                    grid: {
                        color: context => context.tick.value === 0 ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)',
                        lineWidth: context => context.tick.value === 0 ? 2 : 1
                    }
                },
                y: {
                    min: -25,
                    max: 25,
                    title: { 
                        display: true, 
                        text: '면접형(-) ⟷ 서류형(+)', 
                        font: { weight: 'bold' } 
                    },
                    grid: {
                        color: context => context.tick.value === 0 ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)',
                        lineWidth: context => context.tick.value === 0 ? 2 : 1
                    }
                }
            },
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: '교과형-종합형 / 면접형-서류형 분석',
                    font: { size: 16, weight: 'bold' }
                },
                datalabels: {
                    display: true,
                    formatter: () => studentData.name,
                    font: { weight: 'bold' },
                    offset: 10,
                    anchor: 'center',
                    align: 'top'
                }
            }
        }
    });
}

// 학업성취도 차트 생성
function createAcademicChart(studentData) {
    const ctx = document.getElementById('academicChart').getContext('2d');
    
    // 평균 점수 설정 (Z-score 계산 기준과 동일하게)
    const averageScores = {
        english: 25, // Type B 평균
        math: 20     // Type C 평균
    };
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['영어', '수학'],
            datasets: [
                {
                    label: '점수',
                    data: [
                        studentData.academicData.english.score,
                        studentData.academicData.math.score
                    ],
                    backgroundColor: [
                        'rgba(25, 62, 115, 0.7)',
                        'rgba(25, 62, 115, 0.7)'
                    ],
                    borderColor: [
                        'rgb(25, 62, 115)',
                        'rgb(25, 62, 115)'
                    ],
                    borderWidth: 1
                },
                {
                    label: '전체평균',
                    data: [
                        averageScores.english,
                        averageScores.math
                    ],
                    backgroundColor: [
                        'rgba(201, 203, 207, 0.5)',
                        'rgba(201, 203, 207, 0.5)'
                    ],
                    borderColor: [
                        'rgb(201, 203, 207)',
                        'rgb(201, 203, 207)'
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 50,
                    title: { 
                        display: true, 
                        text: '점수', 
                        font: { weight: 'bold' } 
                    }
                },
                x: {
                    title: { 
                        display: true, 
                        text: '교과목', 
                        font: { weight: 'bold' } 
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: '학업성취도 분석',
                    font: { size: 16, weight: 'bold' }
                },
                datalabels: {
                    display: (context) => context.datasetIndex === 0,
                    anchor: 'end',
                    align: 'top',
                    formatter: (value, context) => {
                        const zScore = context.dataIndex === 0 ? 
                            studentData.academicData.english.zScore : 
                            studentData.academicData.math.zScore;
                        const percentile = calculatePercentile(zScore);
                        return `${value}점\n상위 ${(100 - percentile).toFixed(1)}%`;
                    },
                    font: { weight: 'bold', size: 12 }
                }
            }
        }
    });
}
