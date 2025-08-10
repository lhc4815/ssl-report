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
    # problem_v1_type_a 테이블에서 category_sub 컬럼의 고유 값 조회
    cursor.execute("SELECT DISTINCT category_sub FROM problem_v1_type_a")
    categories = cursor.fetchall()

    print("\n--- problem_v1_type_a 테이블의 category_sub 고유 값 ---")
    if categories:
        for category in categories:
            print(category[0])
    else:
        print("problem_v1_type_a 테이블에 category_sub 데이터가 없습니다.")

except mysql.connector.Error as err:
    print(f"❌ 데이터 조회 중 오류 발생: {err}")

finally:
    # 연결 종료
    cursor.close()
    connection.close()
    print("✅ DB 연결 종료.")
