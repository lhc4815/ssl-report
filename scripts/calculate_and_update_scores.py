import mysql.connector
import json # Assuming type_a_answers might be JSON or comma-separated string

# DB 연결
connection = mysql.connector.connect(
    host='223.130.156.107',
    port=3306,
    database='SSL-survey-v1',
    user='twt_crawling',
    password='twt_crawling'
)

cursor = connection.cursor(dictionary=True) # 결과를 딕셔너리 형태로 받기 위해 dictionary=True 설정
print("✅ DB 연결 성공!")

try:
    # 1. problem_v1_type_a 테이블에서 category_sub 정보 가져오기
    problem_a_categories = {}
    cursor.execute("SELECT problem_number, category_sub FROM problem_v1_type_a ORDER BY problem_number ASC")
    for row in cursor.fetchall():
        # category_sub 값을 로드할 때 공백과 쉼표를 언더스코어로 변경하고, 양쪽 공백 제거
        problem_a_categories[row['problem_number']] = row['category_sub'].strip().replace(' ', '_').replace(',', '_')
    print("✅ problem_v1_type_a 카테고리 정보 로드 완료.")

    # 2. user_answers 테이블에서 사용자 답변 가져오기
    cursor.execute("SELECT user_code, type_a_answers, type_b_answers, type_c_answers FROM user_answers")
    user_data = cursor.fetchall()
    print(f"✅ {len(user_data)}명의 사용자 답변 로드 완료.")

    # 3. 각 사용자의 점수를 계산하고 report_v1 테이블 업데이트
    for user_answer in user_data:
        user_code = user_answer['user_code']
        type_a_answers_str = user_answer['type_a_answers']
        type_b_answers_str = user_answer['type_b_answers']
        type_c_answers_str = user_answer['type_c_answers']

        # category_sub별 점수 합산을 위한 딕셔너리 초기화
        category_sub_scores = {cat: 0 for cat in set(problem_a_categories.values())}

        # type_a_answers 처리 (쉼표로 구분된 문자열 가정)
        if type_a_answers_str:
            # 문제 번호와 답변 인덱스를 매핑하기 위해 problem_number를 기준으로 정렬된 리스트를 사용
            # user_answers의 type_a_answers가 문항 순서대로 기록되어 있다고 가정
            answers_list = [int(s.strip()) for s in type_a_answers_str.split(',') if s.strip().isdigit()]
            
            for i, score in enumerate(answers_list):
                problem_num = i + 1 # 문제 번호가 1부터 시작한다고 가정
                if problem_num in problem_a_categories:
                    category = problem_a_categories[problem_num] # 이 시점에서 category는 이미 언더스코어 포함
                    category_sub_scores[category] += score
        
        # typeB_score 계산 (쉼표로 구분된 문자열 가정)
        typeB_score = 0
        if type_b_answers_str:
            typeB_score = sum([int(s.strip()) for s in type_b_answers_str.split(',') if s.strip().isdigit()])

        # typeC_score 계산 (쉼표로 구분된 문자열 가정)
        typeC_score = 0
        if type_c_answers_str:
            typeC_score = sum([int(s.strip()) for s in type_c_answers_str.split(',') if s.strip().isdigit()])

        # report_v1 테이블 업데이트를 위한 SQL 쿼리 생성
        update_sql_parts = []
        update_values = []

        # category_sub 컬럼 업데이트
        for category, score in category_sub_scores.items():
            # 컬럼 이름에 특수문자가 있을 수 있으므로 백틱으로 감싸기
            # 이미 딕셔너리 키를 생성할 때 공백을 언더스코어로 변경했으므로, 여기서는 그대로 사용
            update_sql_parts.append(f"`{category}` = %s")
            update_values.append(score)
        
        # typeB_score, typeC_score 컬럼 업데이트
        update_sql_parts.append("typeB_score = %s")
        update_values.append(typeB_score)
        update_sql_parts.append("typeC_score = %s")
        update_values.append(typeC_score)

        update_sql = f"UPDATE report_v1 SET {', '.join(update_sql_parts)} WHERE user_code = %s"
        update_values.append(user_code)

        cursor.execute(update_sql, tuple(update_values))
        print(f"✅ 사용자 {user_code}의 report_v1 데이터 업데이트 완료.")

    connection.commit()
    print("✅ 모든 report_v1 테이블 업데이트 완료.")

except mysql.connector.Error as err:
    print(f"❌ 데이터 처리 및 업데이트 중 오류 발생: {err}")
    connection.rollback() # 오류 발생 시 롤백

finally:
    # 연결 종료
    cursor.close()
    connection.close()
    print("✅ DB 연결 종료.")
