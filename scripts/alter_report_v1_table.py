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
    # 1. score 컬럼 삭제 (이미 삭제되었을 수 있으므로, 존재 여부 확인 후 삭제)
    try:
        print("🔄 'score' 컬럼 삭제 중...")
        cursor.execute("ALTER TABLE report_v1 DROP COLUMN score")
        print("✅ 'score' 컬럼 삭제 완료.")
    except mysql.connector.Error as err:
        if err.errno == 1091: # ER_CANT_DROP_FIELD_OR_KEY
            print("ℹ️ 'score' 컬럼이 이미 존재하지 않아 삭제를 건너뜁니다.")
        else:
            raise # 다른 오류는 다시 발생

    # 2. problem_v1_type_a의 category_sub 값들을 기반으로 컬럼 추가
    category_sub_columns = [
        "자기조절능력", "서류형인재_성향", "면접형_인재_성향", "내면학업수행능력",
        "언어_이해_활용능력", "인문형_인재", "사회과학형_인재", "경영경제형_인재",
        "과학적_추론과_문제_해결력", "수리논리능력", "화학_생명공학형", "컴퓨터공학형",
        "기계공학형", "전자전기공학형", "산업공학형", "의약학적성"
    ]

    for col_name_original in category_sub_columns:
        col_name_formatted = col_name_original.replace(' ', '_').replace(',', '_') # 공백과 쉼표를 언더스코어로 변경
        print(f"🔄 '{col_name_original}' (-> '{col_name_formatted}') 컬럼 추가 중...")
        cursor.execute(f"ALTER TABLE report_v1 ADD COLUMN `{col_name_formatted}` INT")
        print(f"✅ '{col_name_formatted}' 컬럼 추가 완료.")

    # 3. typeB_score, typeC_score 컬럼 추가
    print("🔄 'typeB_score' 컬럼 추가 중...")
    cursor.execute("ALTER TABLE report_v1 ADD COLUMN typeB_score INT")
    print("✅ 'typeB_score' 컬럼 추가 완료.")

    print("🔄 'typeC_score' 컬럼 추가 중...")
    cursor.execute("ALTER TABLE report_v1 ADD COLUMN typeC_score INT")
    print("✅ 'typeC_score' 컬럼 추가 완료.")

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
