# Kế hoạch trích xuất và tạo dữ liệu cho Bài 6 (Lesson 6)

Dựa vào file OCR `lessonMD/lesson_06.md` và cấu trúc chuẩn của các bài trước (Bài 1-5), dưới đây là kế hoạch chi tiết bóc tách dữ liệu để chuẩn bị tạo file `src/data/lesson_6.json`.

## 1. Thông tin chung
- **Lesson:** 6
- **Title:** "这个颜色挺适合你的 (This color suits you well)"
- **vocabAudioPath:** "audio/11.mp3" (Dựa theo quy luật bài N có vocab audio là số lẻ `2*N - 1`)
- **pdfPage:** Tương ứng trang 60 trong sách, trong file PDF có thể là trang số 60.

## 2. Trích xuất Từ vựng (Vocabulary)
Danh sách từ vựng gồm 12 từ:
1. 一直 (yìzhí) - phó từ - always, all along (luôn, luôn luôn)
2. 奇怪 (qíguài) - tính từ - strange, odd (kỳ lạ)
3. 一会儿……一会儿…… (yíhuìr... yíhuìr...) - phó từ - now... then... (lúc thì... lúc thì...)
4. 穿 (chuān) - động từ - wear, put on (mặc)
5. 厚 (hòu) - tính từ - thick (dày)
6. 讨厌 (tǎoyàn) - động từ - dislike, be disgusted with (ghét, đáng ghét)
7. 外衣 (wàiyī) - danh từ - coat, outer garment (áo khoác ngoài)
8. 原来 (yuánlái) - danh từ - originally, formerly (vốn dĩ, hóa ra)
9. 颜色 (yánsè) - danh từ - color (màu sắc)
10. 深 (shēn) - tính từ - dark, deep (đậm, sâu)
11. 浅 (qiǎn) - tính từ - light (nhạt, cạn)
12. 适合 (shìhé) - động từ - suit, fit (phù hợp)
13. 出租车 (chūzūchē) - danh từ - taxi (xe taxi)
14. 打车 (dǎchē) - động từ - take a taxi (gọi xe)
15. 没错 (méi cuò) - exactly, surely (không sai, đúng vậy)
16. 辆 (liàng) - lượng từ - used for vehicles (chiếc - dùng cho xe cộ)
17. 上学 (shàngxué) - động từ - go to school (đi học)
18. 比较 (bǐjiào) - phó từ - comparatively (tương đối, khá)
19. 旧 (jiù) - tính từ - old, worn (cũ)
20. 二手 (èrshǒu) - tính từ - secondhand (đồ cũ, qua tay)
21. 百 (bǎi) - số từ - hundred (trăm)
22. 商品 (shāngpǐn) - danh từ - commodity, goods (hàng hóa)
23. 市场 (shìchǎng) - danh từ - market (chợ, thị trường)
24. 网上 (wǎngshang) - online, on the Internet (trên mạng)

*(Lưu ý: Có tổng cộng 24 từ mới, gộp cả phần 1 và 2)*

## 3. Trích xuất Bài Khóa (Dialogues)
Gồm 2 bài khóa. Audio theo quy luật: `audio/12.mp3` (Bài khóa chung, hoặc phân tách tùy quy định).
**Bài khóa 1: 课文 (一)**
- **Bối cảnh:** 友美和汉娜正准备出去 (Hữu Mỹ và Hannah đang chuẩn bị ra ngoài).
- **Nhân vật:** 友美, 汉娜.
- **Nội dung:** Thảo luận về thời tiết và chọn quần áo, màu sắc.
- **Câu hỏi đọc hiểu:** 
  1. 这几天天气怎么样？ (Thời tiết mấy ngày nay thế nào?)
  2. 为什么说这里的天气奇怪？ (Tại sao nói thời tiết ở đây kỳ lạ?)
  3. 汉娜不喜欢什么？ (Hannah không thích gì?)
  4. 汉娜觉得衣服怎么样？ (Hannah thấy bộ quần áo thế nào?)
  5. 友美觉得衣服怎么样？ (Hữu Mỹ thấy bộ quần áo thế nào?)

**Bài khóa 2: 课文 (二)**
- **Bối cảnh:** 汉娜和马丁在讨论怎么去学校 (Hannah và Martin thảo luận cách đi đến trường).
- **Nhân vật:** 汉娜, 马丁.
- **Nội dung:** Thảo luận việc đi taxi đắt, mua xe đạp cũ/secondhand.
- **Câu hỏi đọc hiểu:** 
  1. 汉娜现在怎么去学校？ (Hannah hiện tại đi đến trường bằng gì?)
  2. 马丁为什么想买自行车？ (Tại sao Martin muốn mua xe đạp?)
  3. 二手车的好处是什么？ (Ưu điểm của xe cũ là gì?)
  4. 哪里能买到二手车？ (Có thể mua xe cũ ở đâu?)

## 4. Mẫu câu & Ngữ pháp (Functional Sentences)
- **【讨厌】 To express dislike (Thể hiện sự chán ghét):**
  - 我就不喜欢刮风。
  - 我最讨厌穿那么多衣服了，干什么都不方便。
- **【评价】 To make a comment (Đánh giá):**
  - 这几天天气真不好。
  - 这件衣服一点儿也不肥，你穿很合适。
  - 你穿合适极了，特别好看。
- **【同意】 To express agreement (Đồng tình):**
  - (Các ví dụ đối thoại đồng tình)
- **【纠正】 To correct something wrong (Đính chính):**
  - (Các ví dụ đối thoại đính chính)

## 5. Luyện tập (Exercises)
Dựa vào phần **替换词语说句子 (Substitution drills)** và **练一练：完成对话 (Complete the following dialogues)**:

- **Dạng 1: Thay thế từ (Substitution)**
  - Câu 1: A: 这几天天气不好，一直刮风。 / B: 我就不喜欢刮风，哪儿也不能去。 -> Thay thế: 下雨, 下雪...
  - (Và các câu 2, 3, 4, 5, 6, 7 trong tài liệu).

- **Dạng 2: Điền vào chỗ trống (Fill in the blank)**
  - Hoàn thành các đoạn hội thoại số 1-8 dựa vào từ gợi ý.

## 6. Nhiệm vụ tiếp theo
Từ file kế hoạch này, bước tiếp theo là chuyển đổi toàn bộ thông tin trên thành file `src/data/lesson_6.json` theo định dạng chuẩn, đảm bảo đúng cấu trúc của `process_lessons.md`.
