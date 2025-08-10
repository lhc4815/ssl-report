import mysql.connector
import random
import string

def generate_random_code(prefix, length):
    characters = string.ascii_uppercase + string.digits
    random_suffix = ''.join(random.choice(characters) for i in range(length))
    return prefix + random_suffix

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
    codes_to_insert = []
    for _ in range(30):
        code = generate_random_code("PTJ", 4)
        codes_to_insert.append((code,))

    sql = "INSERT INTO Code (code_value) VALUES (%s)"
    cursor.executemany(sql, codes_to_insert)

    # 변경사항 커밋
    connection.commit()
    print(f"✅ {cursor.rowcount}개의 코드가 Code 테이블에 성공적으로 추가되었습니다.")

except mysql.connector.Error as err:
    print(f"❌ 데이터 삽입 중 오류 발생: {err}")
    connection.rollback() # 오류 발생 시 롤백

finally:
    # 연결 종료
    cursor.close()
    connection.close()
    print("✅ DB 연결 종료.")
