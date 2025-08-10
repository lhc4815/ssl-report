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
    # report_v1 테이블 구조 조회
    print("\n--- report_v1 테이블 구조 ---")
    cursor.execute("DESCRIBE report_v1")
    columns = cursor.fetchall()

    if columns:
        for col in columns:
            print(f"컬럼명: {col[0]}, 타입: {col[1]}, Null 허용: {col[2]}, 키: {col[3]}, 기본값: {col[4]}, Extra: {col[5]}")
    else:
        print("report_v1 테이블이 존재하지 않거나 컬럼이 없습니다.")

except mysql.connector.Error as err:
    print(f"❌ 테이블 구조 조회 중 오류 발생: {err}")

finally:
    # 연결 종료
    cursor.close()
    connection.close()
    print("✅ DB 연결 종료.")
