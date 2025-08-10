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
    # 추가 데이터 업데이트
    print("\n--- 추가 데이터 업데이트 ---")
    
    # 제공된 원본 데이터에서 추가로 매칭 가능한 항목들:
    # - 자기조절능력: 2 (진학희망고자기조절능력)
    # - 과학적_추론과_문제_해결력: 39 (공학적사고력 3.9 * 10)
    # - 기타 스케일링된 값들
    
    update_query = """
    UPDATE report_v1 SET
        자기조절능력 = %s,
        과학적_추론과_문제_해결력 = %s,
        desired_high_school = %s
    WHERE user_code = 'STU0001'
    """
    
    additional_data = (
        2,                  # 자기조절능력 (원본 데이터의 "진학희망고자기조절능력")
        39,                 # 과학적_추론과_문제_해결력 (공학적사고력 3.9 * 10)
        '미정'              # 희망 고등학교
    )
    
    cursor.execute(update_query, additional_data)
    connection.commit()
    
    print(f"✅ 추가 데이터 업데이트 완료!")
    print(f"   - 자기조절능력: {additional_data[0]}")
    print(f"   - 과학적_추론과_문제_해결력: {additional_data[1]}")
    print(f"   - 희망고교: {additional_data[2]}")
    print(f"   - 업데이트된 레코드 수: {cursor.rowcount}")
    
    # 전체 데이터 확인
    print("\n--- 최종 데이터 확인 ---")
    cursor.execute("""
        SELECT user_name, user_code, school, grade, gender, region, 
               자기조절능력, 내면학업수행능력, 언어_이해_활용능력, 
               과학적_추론과_문제_해결력, 의약학적성, typeB_score, typeC_score
        FROM report_v1 WHERE user_code = 'STU0001'
    """)
    result = cursor.fetchone()
    
    if result:
        print("최종 삽입된 데이터:")
        print(f"  - 학생명: {result[0]}")
        print(f"  - 학생코드: {result[1]}")
        print(f"  - 출신학교: {result[2]}")
        print(f"  - 학년: {result[3]}")
        print(f"  - 성별: {result[4]}")
        print(f"  - 지역: {result[5]}")
        print(f"  - 자기조절능력: {result[6]}")
        print(f"  - 내면학업수행능력: {result[7]}")
        print(f"  - 언어_이해_활용능력: {result[8]}")
        print(f"  - 과학적_추론과_문제_해결력: {result[9]}")
        print(f"  - 의약학적성: {result[10]}")
        print(f"  - TypeB 점수: {result[11]}")
        print(f"  - TypeC 점수: {result[12]}")
    else:
        print("❌ 데이터를 찾을 수 없습니다.")

except mysql.connector.Error as err:
    print(f"❌ 데이터 업데이트 중 오류 발생: {err}")
    connection.rollback()

except Exception as e:
    print(f"❌ 예상치 못한 오류 발생: {e}")
    connection.rollback()

finally:
    # 연결 종료
    cursor.close()
    connection.close()
    print("\n✅ DB 연결 종료.")
