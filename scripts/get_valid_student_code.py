import mysql.connector
import os
from dotenv import load_dotenv

# .env 파일에서 환경 변수 로드
load_dotenv()

def get_one_student_code():
    """DB에서 유효한 학생 코드 하나를 가져옵니다."""
    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST", "223.130.156.107"),
            port=int(os.getenv("DB_PORT", 3306)),
            user=os.getenv("DB_USER", "twt_crawling"),
            password=os.getenv("DB_PASSWORD", "twt_crawling"),
            database=os.getenv("DB_NAME", "SSL-survey-v1")
        )
        cursor = conn.cursor()
        
        query = "SELECT user_code FROM report_v1 LIMIT 1"
        cursor.execute(query)
        result = cursor.fetchone()

        if result:
            print(f"VALID_USER_CODE:{result[0]}")
        else:
            print("ERROR:No student found in the database.")

    except mysql.connector.Error as err:
        print(f"ERROR:Database connection failed: {err}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    get_one_student_code()
