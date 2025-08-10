import mysql.connector
import os
from dotenv import load_dotenv

# .env 파일에서 환경 변수 로드
load_dotenv()

def update_test_student_data():
    """TEST001 학생의 데이터를 테스트를 위해 임시로 수정합니다."""
    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST", "223.130.156.107"),
            port=int(os.getenv("DB_PORT", 3306)),
            user=os.getenv("DB_USER", "twt_crawling"),
            password=os.getenv("DB_PASSWORD", "twt_crawling"),
            database=os.getenv("DB_NAME", "SSL-survey-v1")
        )
        cursor = conn.cursor()
        print("✅ DB 연결 성공!")

        # TEST001 학생의 b_grade_subjects_count를 1로, desired_high_school을 '전국단위 자율형사립고'로 설정
        query = """
            UPDATE report_v1 
            SET 
                b_grade_subjects_count = 1, 
                desired_high_school = '전국단위 자율형사립고' 
            WHERE 
                user_code = 'TEST001'
        """
        cursor.execute(query)
        conn.commit()

        if cursor.rowcount > 0:
            print("✅ 'TEST001' 학생 데이터가 테스트를 위해 업데이트되었습니다.")
            print("   - B등급 과목 수: 1")
            print("   - 희망 고교: 전국단위 자율형사립고")
        else:
            print("❌ 'TEST001' 학생 데이터를 찾을 수 없거나 업데이트할 내용이 없습니다.")

    except mysql.connector.Error as err:
        print(f"❌ DB 오류 발생: {err}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()
            print("✅ DB 연결 종료.")

if __name__ == "__main__":
    update_test_student_data()
