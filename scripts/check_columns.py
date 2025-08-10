import mysql.connector

# DB 연결
conn = mysql.connector.connect(
    host='223.130.156.107',
    port=3306,
    user='twt_crawling',
    password='twt_crawling',
    database='SSL-survey-v1'
)

cursor = conn.cursor()

# report_v1 테이블 구조 확인
cursor.execute("DESCRIBE report_v1")
columns = cursor.fetchall()

print("Columns in report_v1 table:")
print("-" * 50)

for col in columns:
    col_name = col[0]
    col_type = col[1]
    
    # test, completed, date, time 관련 컬럼 찾기
    if any(word in col_name.lower() for word in ['test', 'complete', 'date', 'time', 'created', 'updated']):
        print(f"⭐ {col_name}: {col_type}")
    else:
        print(f"   {col_name}: {col_type}")

cursor.close()
conn.close()
