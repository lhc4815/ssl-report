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

# 테이블 목록 조회
cursor.execute("SHOW TABLES")
tables = cursor.fetchall()

print("\n--- 테이블 목록 ---")
for table in tables:
    print(table[0])

# 연결 종료
cursor.close()
connection.close()
print("✅ DB 연결 종료.")
