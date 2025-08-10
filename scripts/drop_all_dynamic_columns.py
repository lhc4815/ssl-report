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
    columns_to_drop = [
        "자기조절능력", "서류형인재_성향", "면접형_인재_성향", "내면학업수행능력",
        "언어_이해_활용능력", "인문형_인재", "사회과학형_인재", "경영경제형_인재",
        "과학적_추론과_문제_해결력", "수리논리능력", "화학_생명공학형", "컴퓨터공학형",
        "기계공학형", "전자전기공학형", "산업공학형", "의약학적성",
        "typeB_score", "typeC_score"
    ]

    # 기존에 score 컬럼이 삭제되었으므로, 이 스크립트에서는 제외
    # 혹시 모를 잘못된 이름의 컬럼도 삭제 시도
    problematic_columns = [
        "자기조절능력", "서류형인재_성향", "면접형_인재_성향_", "내면학업수행능력",
        "언어_이해_활용능력", "인문형_인재", "사회과학형_인재", "경영경제형_인재",
        "과학적_추론과_문제_해결력", "수리논리능력", "화학_생명공학형", "컴퓨터공학형",
        "기계공학형", "전자전기공학형", "산업공학형", "의약학적성",
        "typeB_score", "typeC_score",
        "화학,생명공학형" # 이전에 시도했던 잘못된 이름
    ]

    # 현재 테이블의 컬럼 목록을 가져와서 존재하는 컬럼만 삭제 시도
    cursor.execute("SHOW COLUMNS FROM report_v1")
    existing_columns = [col[0] for col in cursor.fetchall()]

    for col_name in set(columns_to_drop + problematic_columns):
        if col_name in existing_columns:
            print(f"🔄 '{col_name}' 컬럼 삭제 중...")
            try:
                cursor.execute(f"ALTER TABLE report_v1 DROP COLUMN `{col_name}`")
                print(f"✅ '{col_name}' 컬럼 삭제 완료.")
            except mysql.connector.Error as err:
                print(f"❌ '{col_name}' 컬럼 삭제 중 오류 발생: {err}")
        else:
            print(f"ℹ️ '{col_name}' 컬럼이 존재하지 않아 삭제를 건너뜁니다.")

    connection.commit()
    print("✅ report_v1 테이블의 동적 컬럼 삭제 시도 완료.")

except mysql.connector.Error as err:
    print(f"❌ 테이블 수정 중 오류 발생: {err}")
    connection.rollback() # 오류 발생 시 롤백

finally:
    # 연결 종료
    cursor.close()
    connection.close()
    print("✅ DB 연결 종료.")
