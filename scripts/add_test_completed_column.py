import mysql.connector
from mysql.connector import Error

def add_test_completed_column():
    try:
        # 데이터베이스 연결
        connection = mysql.connector.connect(
            host='223.130.156.107',
            port=3306,
            database='SSL-survey-v1',
            user='twt_crawling',
            password='twt_crawling'
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # 1. test_completed 컬럼 추가 (이미 존재하는 경우 무시)
            try:
                alter_query = """
                ALTER TABLE report_v1 
                ADD COLUMN test_completed TINYINT DEFAULT 0
                """
                cursor.execute(alter_query)
                connection.commit()
                print("✅ test_completed 컬럼이 추가되었습니다.")
            except Error as e:
                if "Duplicate column name" in str(e):
                    print("ℹ️ test_completed 컬럼이 이미 존재합니다.")
                else:
                    print(f"❌ 컬럼 추가 중 오류: {e}")
                    return
            
            # 2. user_answers 테이블과 JOIN하여 test_completed 값 업데이트
            update_query = """
            UPDATE report_v1 r
            LEFT JOIN (
                SELECT user_code, 
                       MAX(test_completed_at) as test_completed_at
                FROM user_answers
                GROUP BY user_code
            ) ua ON r.user_code = ua.user_code
            SET r.test_completed = CASE 
                WHEN ua.test_completed_at IS NOT NULL THEN 1
                ELSE 0
            END
            """
            
            cursor.execute(update_query)
            affected_rows = cursor.rowcount
            connection.commit()
            
            print(f"✅ {affected_rows}개의 레코드가 업데이트되었습니다.")
            
            # 3. 통계 확인
            stats_query = """
            SELECT 
                COUNT(*) as total,
                SUM(test_completed = 1) as completed,
                SUM(test_completed = 0) as not_completed
            FROM report_v1
            """
            cursor.execute(stats_query)
            result = cursor.fetchone()
            
            print("\n📊 검사 완료 상태 통계:")
            print(f"   전체 학생: {result[0]}명")
            print(f"   검사 완료: {result[1]}명")
            print(f"   검사 미완료: {result[2]}명")
            
            # 4. 샘플 데이터 확인
            sample_query = """
            SELECT user_code, user_name, test_completed
            FROM report_v1
            LIMIT 10
            """
            cursor.execute(sample_query)
            samples = cursor.fetchall()
            
            print("\n📋 샘플 데이터 (처음 10개):")
            print("   코드       | 이름        | 완료여부")
            print("   " + "-" * 40)
            for sample in samples:
                status = "✅ 완료" if sample[2] == 1 else "❌ 미완료"
                print(f"   {sample[0]:<10} | {sample[1]:<10} | {status}")
            
    except Error as e:
        print(f"❌ 데이터베이스 오류: {e}")
        
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("\n✅ 데이터베이스 연결이 종료되었습니다.")

if __name__ == "__main__":
    print("🚀 test_completed 컬럼 추가 및 업데이트 시작...")
    add_test_completed_column()
