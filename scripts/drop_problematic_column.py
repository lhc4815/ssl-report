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
    # '화학,생명공학형' 컬럼 삭제
    print("🔄 '화학,생명공학형' 컬럼 삭제 중...")
    cursor.execute("ALTER TABLE report_v1 DROP COLUMN `화학,생명공학형`")
    print("✅ '화학,생명공학형' 컬럼 삭제 완료.")
    connection.commit()
    print("✅ report_v1 테이블 수정 완료.")

except mysql.connector.Error as err:
    print(f"❌ 테이블 수정 중 오류 발생: {err}")
    connection.rollback() # 오류 발생 시 롤백

finally:
    # 연결 종료
    cursor.close()
    connection.close()
    print("✅ DB 연결 종료.")
