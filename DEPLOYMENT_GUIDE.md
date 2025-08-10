# 🚀 Vercel 배포 가이드

## ✅ 배포 준비 완료!

프로젝트가 Vercel 배포를 위해 준비되었습니다. 다음 단계를 따라 배포하세요.

## 📋 배포 전 체크리스트

- [x] Vercel Functions 생성 완료 (`/api` 폴더)
- [x] 환경 변수 템플릿 생성 (`.env.example`)
- [x] `.gitignore` 파일 설정
- [x] `vercel.json` 설정 파일 생성
- [x] `package.json` 업데이트
- [x] README 문서 작성
- [x] Python 스크립트 정리 (`/scripts` 폴더)
- [x] 로컬 서버 파일 정리 (`/local-server` 폴더)

## 🔧 배포 단계

### 1단계: GitHub에 업로드

```bash
# Git 초기화 (처음인 경우)
git init

# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit - SSL Report System for Vercel"

# GitHub 저장소 연결 (your-username과 your-repo를 실제 값으로 변경)
git remote add origin https://github.com/your-username/your-repo.git

# 푸시
git push -u origin main
```

### 2단계: Vercel 배포

#### 방법 1: Vercel 웹사이트 사용 (추천)
1. [vercel.com](https://vercel.com) 접속
2. GitHub 계정으로 로그인
3. "New Project" 클릭
4. GitHub 저장소 선택
5. "Import" 클릭
6. 환경 변수 설정 (아래 참조)
7. "Deploy" 클릭

#### 방법 2: Vercel CLI 사용
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 프롬프트 따라가기
```

### 3단계: 환경 변수 설정

Vercel 대시보드에서 Settings → Environment Variables 에서 다음 추가:

| 변수명 | 값 | 설명 |
|--------|-----|------|
| DB_HOST | 223.130.156.107 | MySQL 호스트 |
| DB_PORT | 3306 | MySQL 포트 |
| DB_USER | twt_crawling | DB 사용자명 |
| DB_PASSWORD | twt_crawling | DB 비밀번호 |
| DB_NAME | SSL-survey-v1 | 데이터베이스명 |

⚠️ **중요**: Production 환경에서는 실제 보안이 강화된 자격 증명을 사용하세요!

## 🔍 배포 확인

배포 후 다음을 확인하세요:

1. **메인 페이지**: `https://your-app.vercel.app/`
2. **API 테스트**: 
   - 학생 목록: `https://your-app.vercel.app/api/students`
   - 개별 학생: `https://your-app.vercel.app/api/student/TEST001`

## ⚠️ 주의사항

1. **데이터베이스 접근**: MySQL 서버가 외부 접속을 허용하는지 확인
2. **CORS**: 이미 설정되어 있지만, 필요시 `vercel.json`에서 수정
3. **보안**: Production에서는 반드시 새로운 DB 자격 증명 사용

## 🛠️ 문제 해결

### Build 실패
- `package.json`의 dependencies 확인
- Vercel 로그 확인

### API 500 에러
- 환경 변수가 올바르게 설정되었는지 확인
- DB 연결 정보 확인

### CORS 에러
- `vercel.json`의 headers 설정 확인

## 📝 배포 후 작업

1. **도메인 연결** (선택사항)
   - Vercel 대시보드 → Settings → Domains

2. **모니터링**
   - Vercel 대시보드에서 Functions 로그 확인

3. **업데이트**
   - GitHub에 push하면 자동 재배포

## 🎉 완료!

배포가 완료되면 학생들이 언제 어디서나 리포트를 확인할 수 있습니다!

---

문제가 있으면 README.md의 문제 해결 섹션을 참조하세요.
