# SSL 고교선택적성검사 리포트 시스템

> 학생들의 고교 선택 적성검사 결과를 시각화하고 분석하는 웹 기반 리포트 시스템

## 📋 프로젝트 소개

SSL 고교선택적성검사 시스템은 학생들의 적성검사 데이터를 기반으로:
- 6척도 적성 분석 (레이더 차트)
- 정규분포 기반 상대 점수 분석
- 입시성향 사분면 분석
- 맞춤형 고등학교 추천
- 대입 계열 추천 및 전략 제시

를 제공하는 종합 진단 시스템입니다.

## 🚀 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Charts**: Chart.js
- **Backend**: Node.js (Vercel Functions)
- **Database**: MySQL
- **Deployment**: Vercel

## 📦 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/yourusername/ssl-report.git
cd ssl-report
```

### 2. 패키지 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env.example`을 복사하여 `.env.local` 파일을 생성하고 데이터베이스 정보를 입력합니다:

```env
DB_HOST=your_database_host
DB_PORT=3306
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=SSL-survey-v1
```

### 4. 로컬 개발 서버 실행
```bash
npm run dev
```

## 🌐 Vercel 배포

### 1. Vercel CLI 설치
```bash
npm i -g vercel
```

### 2. Vercel 로그인
```bash
vercel login
```

### 3. 배포
```bash
vercel
```

### 4. 환경 변수 설정
Vercel 대시보드에서 프로젝트 Settings > Environment Variables에서 다음 변수들을 설정:
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

## 📁 프로젝트 구조

```
ssl-report/
├── api/                    # Vercel Functions (API)
│   ├── students.js        # 학생 목록 조회
│   └── student/
│       └── [userCode].js  # 개별 학생 조회
├── css/                   # 스타일시트
│   └── styles.css
├── js/                    # JavaScript 모듈
│   ├── charts.js         # 차트 생성
│   ├── ssl-dataProcessor.js  # 데이터 처리
│   ├── highSchoolRecommendation.js  # 고교 추천
│   └── universityStrategy.js  # 대입 전략
├── index.html            # 메인 페이지 (로그인)
├── student_report.html   # 리포트 페이지
├── package.json
├── vercel.json          # Vercel 설정
└── README.md
```

## 🔐 보안 주의사항

- **절대 `.env` 파일을 Git에 커밋하지 마세요**
- 데이터베이스 접속 정보는 반드시 환경 변수로 관리
- Vercel 대시보드에서 환경 변수 설정 시 'Sensitive' 옵션 활성화

## 📊 데이터베이스 구조

### report_v1 테이블
- `user_code`: 학생 고유 코드
- `user_name`: 학생 이름
- `school`: 학교명
- `grade`: 학년
- 각종 적성 점수 필드들

## 🛠️ 문제 해결

### CORS 에러
Vercel Functions에 CORS 헤더가 이미 설정되어 있습니다. 추가 설정이 필요한 경우 `vercel.json`의 headers 섹션을 수정하세요.

### 데이터베이스 연결 실패
1. 환경 변수가 올바르게 설정되었는지 확인
2. MySQL 서버가 외부 접속을 허용하는지 확인
3. 방화벽 설정 확인

## 📝 라이선스

MIT License

## 👥 기여자

- SSL Team

## 📞 문의

문의사항이 있으시면 이슈를 등록해주세요.
