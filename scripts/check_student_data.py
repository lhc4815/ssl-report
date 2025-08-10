import mysql.connector
import os
from dotenv import load_dotenv

# .env 파일에서 환경 변수 로드
load_dotenv()

def check_student_data(user_code):
    """특정 학생의 데이터를 DB에서 확인합니다."""
    try:
        # DB 연결 정보
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST", "223.130.156.107"),
            port=int(os.getenv("DB_PORT", 3306)),
            user=os.getenv("DB_USER", "twt_crawling"),
            password=os.getenv("DB_PASSWORD", "twt_crawling"),
            database=os.getenv("DB_NAME", "SSL-survey-v1")
        )
        cursor = conn.cursor(dictionary=True)
        print("✅ DB 연결 성공!")

        query = "SELECT user_code, user_name, school FROM report_v1 WHERE user_code = %s"
        cursor.execute(query, (user_code,))
        result = cursor.fetchone()

        if result:
            print("\n--- 학생 데이터 확인 ---")
            print(f"User Code: {result['user_code']}")
            print(f"User Name: {result['user_name']}")
            print(f"School: {result['school']}")
            print("----------------------")
            print(f"✅ '{user_code}' 학생 데이터가 DB에 존재합니다.")
        else:
            print(f"❌ '{user_code}' 학생 데이터를 DB에서 찾을 수 없습니다.")

    except mysql.connector.Error as err:
        print(f"❌ DB 오류 발생: {err}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()
            print("✅ DB 연결 종료.")

if __name__ == "__main__":
    student_code_to_check = "STU0001"
    check_student_data(student_code_to_check)
