# Quy trình Xử lý & Tích hợp Dữ liệu cho các Bài học tiếp theo
Dự án: **Chinese Speaking App - Phát triển Hán ngữ Khẩu ngữ sơ cấp 2**

Tài liệu này lưu trữ lại toàn bộ luồng công việc (Workflow) và cấu trúc dữ liệu đã thống nhất để AI có thể tự động hiểu và tiếp tục làm việc cho các Bài 3, 4, 5... về sau.

## 1. Chuẩn bị Dữ liệu (Người dùng thực hiện)
- **Tách PDF:** Đảm bảo có file PDF riêng của bài học đặt tại thư mục `public/LessonPDF/Lesson_XX.pdf` (VD: `Lesson_03.pdf`).
- **Trích xuất Text (OCR):** Dùng công cụ OCR để quét chữ trong PDF của bài đó và lưu thành định dạng Markdown (VD: `lessonMD/lesson_03.md`). Không cần quá trau chuốt format, chỉ cần text chính xác.

## 2. Nhiệm vụ của AI (Prompt để giao việc)
Khi có file `.md` OCR mới, bạn chỉ cần nạp vào và ra lệnh cho AI như sau:
> *"Tôi đã đưa file OCR của Bài X vào thư mục lessonMD/lesson_XX.md và file PDF vào thư mục public/LessonPDF. Hãy phân tích và tạo dữ liệu JSON cho Bài X dựa trên chuẩn cấu trúc đã làm ở Bài 1 và 2, sau đó cập nhật vào Web App."*

## 3. Quy trình thực thi của AI (AI Checklist)
1. **Phân tích file OCR:** Đọc file `lesson_XX.md`.
2. **Chuyển đổi sang JSON:** Chuyển đổi text thô thành cấu trúc chuẩn xác và lưu vào `src/data/lesson_X.json`.
3. **Cập nhật Router:** Mở file `src/data/index.js`, thêm lệnh `import lessonX from './lesson_X.json';` và đẩy `lessonX` vào mảng `export const lessons`.
4. **Kiểm tra UI:** (Tùy chọn) Chỉnh sửa `App.jsx` nếu số lượng bài học "ảo" cần được giảm xuống.

## 4. Cấu trúc chuẩn của file JSON (Template)
Mọi file `lesson_X.json` PHẢI tuân thủ chặt chẽ cấu trúc object dưới đây:

```json
{
  "lesson": 3,
  "title": "Tên bài học tiếng Trung (Dịch tiếng Anh/Việt)",
  "vocabulary": [
    { "id": 1, "hanzi": "Từ Hán", "pinyin": "Pinyin", "meaning": "Nghĩa", "type": "Loại từ" }
  ],
  "dialogues": [
    {
      "id": 1,
      "title": "课文 (一)",
      "context": "Bối cảnh hội thoại",
      "lines": [
        { "speaker": "Nhân vật A", "hanzi": "Chữ Hán", "pinyin": "Pinyin", "translation": "Dịch nghĩa" }
      ],
      "questions": [
        { "q": "Câu hỏi đọc hiểu?", "a": "Đáp án" }
      ]
    }
  ],
  "functional_sentences": [
    {
      "category": "Tên nhóm chức năng (VD: Đề nghị, Hỏi thăm)",
      "examples": [
        "Mẫu câu 1 (Nghĩa tiếng Việt)",
        "Mẫu câu 2 (Nghĩa tiếng Việt)"
      ]
    }
  ],
  "exercises": [
    {
      "type": "fill-in-the-blank",
      "instruction": "Hoàn thành hội thoại sau:",
      "questions": [
        {
          "context": "A: Câu hỏi?\nB: _______________.",
          "hint": "(Gợi ý: ...)",
          "answer": "Đáp án điền vào chỗ trống"
        }
      ]
    },
    {
      "type": "substitution",
      "instruction": "Luyện tập thay thế từ:",
      "questions": [
        {
          "sentence": "Câu gốc cần thay thế",
          "substitutes": [
            "Lựa chọn thay thế 1",
            "Lựa chọn thay thế 2"
          ]
        }
      ]
    }
  ]
}
```

## 5. Cấu trúc Thư mục Dự án (Tham khảo)
```text
chinese-speaking-app/
├── public/
│   └── LessonPDF/
│       ├── Lesson_01.pdf
│       └── Lesson_02.pdf
├── src/
│   ├── data/
│   │   ├── index.js
│   │   ├── lesson_1.json
│   │   └── lesson_2.json
│   ├── App.jsx
│   └── index.css
├── lessonMD/
│   ├── lesson_01.md
│   └── lesson_02.md
└── depPlan/
    └── process_lessons.md (File này)
```
