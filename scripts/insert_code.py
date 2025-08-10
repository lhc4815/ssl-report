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
    # 데이터 삽입
    sql = "INSERT INTO Code (code_value) VALUES (%s)"
    val = ("TEST0011",)
    cursor.execute(sql, val)

    # 변경사항 커밋
    connection.commit()
    print(f"✅ 'TEST0011' 값이 Code 테이블에 성공적으로 추가되었습니다. (삽입된 행 수: {cursor.rowcount})")

except mysql.connector.Error as err:
    print(f"❌ 데이터 삽입 중 오류 발생: {err}")
    connection.rollback() # 오류 발생 시 롤백

finally:
    # 연결 종료
    cursor.close()
    connection.close()
    print("✅ DB 연결 종료.")
