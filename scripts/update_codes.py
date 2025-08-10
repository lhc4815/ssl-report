import mysql.connector

# DB 연결 정보
DB_CONFIG = {
    'host': '223.130.156.107',
    'port': 3306,
    'database': 'SSL-survey-v1',
    'user': 'twt_crawling',
    'password': 'twt_crawling'
}

def update_codes():
    connection = None
    try:
        # DB 연결
        connection = mysql.connector.connect(**DB_CONFIG)
        cursor = connection.cursor()
        print("✅ DB 연결 성공!")

        # UPDATE 쿼리 실행
        # 'PTJ'로 시작하는 code_value 값을 'DCJ'로 변경
        sql = "UPDATE Code SET code_value = REPLACE(code_value, 'PTJ', 'DCJ') WHERE code_value LIKE 'PTJ%'"
        cursor.execute(sql)
        connection.commit()

        print(f"✅ {cursor.rowcount}개의 레코드가 업데이트되었습니다.")

    except mysql.connector.Error as err:
        print(f"❌ DB 오류 발생: {err}")
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
    finally:
        if connection and connection.is_connected():
            connection.close()
            print("✅ DB 연결 종료.")

if __name__ == "__main__":
    update_codes()
