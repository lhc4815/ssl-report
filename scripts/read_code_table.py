import mysql.connector

# DB 연결
connection = mysql.connector.connect(
    host='223.130.156.107',
    port=3306,
    database='SSL-survey-v1',
    user='twt_crawling',
    password='twt_crawling'
)

cursor = connection.cursor()
print("✅ DB 연결 성공!")

try:
    # Code 테이블의 모든 데이터 조회
    cursor.execute("SELECT * FROM Code")
    records = cursor.fetchall()

    print("\n--- Code 테이블 데이터 ---")
    if records:
        for row in records:
            print(row)
    else:
        print("Code 테이블에 데이터가 없습니다.")

except mysql.connector.Error as err:
    print(f"❌ 데이터 조회 중 오류 발생: {err}")

finally:
    # 연결 종료
    cursor.close()
    connection.close()
    print("✅ DB 연결 종료.")
