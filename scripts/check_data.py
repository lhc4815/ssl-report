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
print('✅ DB 연결 성공!')

# report_v1 테이블의 데이터 수 확인
cursor.execute('SELECT COUNT(*) FROM report_v1')
count = cursor.fetchone()[0]
print(f'📊 report_v1 테이블 총 레코드 수: {count}')

# 상위 5개 레코드 확인
cursor.execute('SELECT user_code, user_name, school FROM report_v1 LIMIT 5')
records = cursor.fetchall()
print('\n--- 상위 5개 학생 데이터 ---')
for record in records:
    print(f'코드: {record[0]}, 이름: {record[1]}, 학교: {record[2]}')

connection.close()
print('\n✅ DB 연결 종료.')
