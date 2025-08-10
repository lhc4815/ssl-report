import mysql.connector

# DB 연결 정보
DB_CONFIG = {
    'host': '223.130.156.107',
    'port': 3306,
    'database': 'SSL-survey-v1',
    'user': 'twt_crawling',
    'password': 'twt_crawling'
}

def describe_table(table_name):
    connection = None
    try:
        # DB 연결
        connection = mysql.connector.connect(**DB_CONFIG)
        cursor = connection.cursor()
        print("✅ DB 연결 성공!")

        # DESCRIBE 쿼리 실행
        sql = f"DESCRIBE {table_name}"
        cursor.execute(sql)
        
        print(f"\n--- {table_name} 테이블 스키마 ---")
        print("{:<15} {:<10} {:<10} {:<5} {:<10} {:<10}".format("Field", "Type", "Null", "Key", "Default", "Extra"))
        print("-" * 70)
        for row in cursor:
            print("{:<15} {:<10} {:<10} {:<5} {:<10} {:<10}".format(
                row[0], row[1], row[2], row[3], str(row[4]), row[5]
            ))

    except mysql.connector.Error as err:
        print(f"❌ DB 오류 발생: {err}")
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
    finally:
        if connection and connection.is_connected():
            connection.close()
            print("✅ DB 연결 종료.")

if __name__ == "__main__":
    describe_table("Code")
