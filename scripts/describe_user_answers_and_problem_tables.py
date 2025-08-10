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
    # user_answers 테이블 구조 조회
    print("\n--- user_answers 테이블 구조 ---")
    cursor.execute("DESCRIBE user_answers")
    user_answers_columns = cursor.fetchall()
    if user_answers_columns:
        for col in user_answers_columns:
            print(f"컬럼명: {col[0]}, 타입: {col[1]}, Null 허용: {col[2]}, 키: {col[3]}, 기본값: {col[4]}, Extra: {col[5]}")
    else:
        print("user_answers 테이블이 존재하지 않거나 컬럼이 없습니다.")

    # problem_v1_type_a 테이블 구조 조회
    print("\n--- problem_v1_type_a 테이블 구조 ---")
    cursor.execute("DESCRIBE problem_v1_type_a")
    problem_a_columns = cursor.fetchall()
    if problem_a_columns:
        for col in problem_a_columns:
            print(f"컬럼명: {col[0]}, 타입: {col[1]}, Null 허용: {col[2]}, 키: {col[3]}, 기본값: {col[4]}, Extra: {col[5]}")
    else:
        print("problem_v1_type_a 테이블이 존재하지 않거나 컬럼이 없습니다.")

    # problem_v1_type_b 테이블 구조 조회
    print("\n--- problem_v1_type_b 테이블 구조 ---")
    cursor.execute("DESCRIBE problem_v1_type_b")
    problem_b_columns = cursor.fetchall()
    if problem_b_columns:
        for col in problem_b_columns:
            print(f"컬럼명: {col[0]}, 타입: {col[1]}, Null 허용: {col[2]}, 키: {col[3]}, 기본값: {col[4]}, Extra: {col[5]}")
    else:
        print("problem_v1_type_b 테이블이 존재하지 않거나 컬럼이 없습니다.")

    # problem_v1_type_c 테이블 구조 조회
    print("\n--- problem_v1_type_c 테이블 구조 ---")
    cursor.execute("DESCRIBE problem_v1_type_c")
    problem_c_columns = cursor.fetchall()
    if problem_c_columns:
        for col in problem_c_columns:
            print(f"컬럼명: {col[0]}, 타입: {col[1]}, Null 허용: {col[2]}, 키: {col[3]}, 기본값: {col[4]}, Extra: {col[5]}")
    else:
        print("problem_v1_type_c 테이블이 존재하지 않거나 컬럼이 없습니다.")

except mysql.connector.Error as err:
    print(f"❌ 테이블 구조 조회 중 오류 발생: {err}")

finally:
    # 연결 종료
    cursor.close()
    connection.close()
    print("✅ DB 연결 종료.")
