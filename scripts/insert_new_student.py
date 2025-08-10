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
    # 새 학생 데이터 삽입
    print("\n--- 새 학생 데이터 삽입 ---")
    
    # 제공된 데이터를 기반으로 INSERT 쿼리 작성
    insert_query = """
    INSERT INTO report_v1 (
        user_name,
        user_code,
        school,
        grade,
        gender,
        region,
        b_grade_subjects_count,
        내면학업수행능력,
        언어_이해_활용능력,
        의약학적성,
        typeB_score,
        typeC_score
    ) VALUES (
        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
    )
    """
    
    # 데이터 값들 (float 값들은 적절히 정수로 변환하거나 스케일링)
    student_data = (
        '이인호',           # user_name
        'STU0001',          # user_code
        '강남중학교',        # school
        3,                  # grade (중학교 3학년으로 추정)
        '남',               # gender (0을 남으로 변환)
        '서울',             # region (8을 서울로 변환)
        0,                  # b_grade_subjects_count
        35,                 # 내면학업수행능력 (3.525 * 10으로 스케일링)
        39,                 # 언어_이해_활용능력 (3.9 * 10으로 스케일링)
        36,                 # 의약학적성 (3.55 * 10으로 스케일링)
        33,                 # typeB_score (3.325 * 10으로 스케일링)
        32                  # typeC_score (3.15 * 10으로 스케일링)
    )
    
    # 데이터 삽입 실행
    cursor.execute(insert_query, student_data)
    connection.commit()
    
    print(f"✅ 새 학생 데이터 삽입 완료!")
    print(f"   - 학생명: {student_data[0]}")
    print(f"   - 학생코드: {student_data[1]}")
    print(f"   - 출신학교: {student_data[2]}")
    print(f"   - 삽입된 레코드 수: {cursor.rowcount}")
    
    # 삽입된 데이터 확인
    print("\n--- 삽입된 데이터 확인 ---")
    cursor.execute("SELECT * FROM report_v1 WHERE user_code = 'STU0001'")
    result = cursor.fetchone()
    
    if result:
        print("삽입된 데이터:")
        print(f"  - report_id: {result[0]}")
        print(f"  - user_name: {result[1]}")
        print(f"  - user_code: {result[2]}")
        print(f"  - school: {result[3]}")
        print(f"  - grade: {result[4]}")
        print(f"  - gender: {result[5]}")
        print(f"  - region: {result[6]}")
        print(f"  - b_grade_subjects_count: {result[7]}")
    else:
        print("❌ 삽입된 데이터를 찾을 수 없습니다.")

except mysql.connector.Error as err:
    print(f"❌ 데이터 삽입 중 오류 발생: {err}")
    connection.rollback()

except Exception as e:
    print(f"❌ 예상치 못한 오류 발생: {e}")
    connection.rollback()

finally:
    # 연결 종료
    cursor.close()
    connection.close()
    print("\n✅ DB 연결 종료.")
