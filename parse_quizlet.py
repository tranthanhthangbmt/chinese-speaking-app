import json
import sys

def parse_quizlet_export(input_file, output_file, lesson_num, lesson_title):
    """
    Chuyển đổi dữ liệu export từ Quizlet thành định dạng JSON cho Web App.
    Định dạng Quizlet mong đợi: 
    Chữ Hán [Tab] Pinyin - Nghĩa (hoặc bất kỳ định dạng nào có thể tách được bằng Tab)
    """
    vocabulary = []
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        for i, line in enumerate(lines):
            line = line.strip()
            if not line:
                continue
                
            # Cố gắng tách dòng dựa trên dấu Tab (mặc định của Quizlet)
            parts = line.split('\t')
            if len(parts) >= 2:
                hanzi = parts[0].strip()
                # Tách Pinyin và Nghĩa từ phần còn lại
                definition = parts[1].strip()
                
                # Cố gắng tách Pinyin và Nghĩa nếu có dấu gạch ngang hoặc xuống dòng
                # Giả định Pinyin nằm trước, Nghĩa nằm sau
                pinyin = ""
                meaning = definition
                
                if '-' in definition:
                    def_parts = definition.split('-', 1)
                    pinyin = def_parts[0].strip()
                    meaning = def_parts[1].strip()
                
                word = {
                    "id": i + 1,
                    "hanzi": hanzi,
                    "pinyin": pinyin,
                    "meaning": meaning,
                    "type": "" # Bạn có thể thêm thủ công sau
                }
                vocabulary.append(word)
                
        # Tạo object JSON
        lesson_data = {
            "lesson": int(lesson_num),
            "title": lesson_title,
            "vocabulary": vocabulary
        }
        
        # Ghi ra file JSON
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(lesson_data, f, ensure_ascii=False, indent=2)
            
        print(f"✅ Đã chuyển đổi thành công {len(vocabulary)} từ vựng!")
        print(f"📁 File kết quả: {output_file}")
        
    except Exception as e:
        print(f"❌ Có lỗi xảy ra: {e}")

if __name__ == "__main__":
    print("=== CÔNG CỤ CHUYỂN ĐỔI QUIZLET SANG JSON ===")
    print("1. Hãy vào trang Quizlet có chứa bộ từ vựng")
    print("2. Bấm vào nút '...' dưới bộ thẻ, chọn 'Export' (Xuất)")
    print("3. Giữ nguyên mặc định (Tab và Newline), copy toàn bộ chữ")
    print("4. Lưu vào một file text (ví dụ: raw.txt)\n")
    
    if len(sys.argv) < 5:
        print("Cách dùng: python parse_quizlet.py <file_text_dau_vao> <file_json_dau_ra> <so_thu_tu_bai> <tieu_de_bai>")
        print("Ví dụ: python parse_quizlet.py raw.txt lesson_3.json 3 'Tên bài học'")
    else:
        parse_quizlet_export(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
