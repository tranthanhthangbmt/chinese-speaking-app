import React, { useState, useEffect } from 'react';
import { lessons } from './data';
import './index.css';

// Component hiển thị thẻ từ vựng
const FlashcardViewer = ({ words }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentWord = words[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => Math.min(prev + 1, words.length - 1));
    }, 300);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }, 300);
  };

  const playAudio = (e, text) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="flashcard-container">
        <div 
          className={`flashcard ${isFlipped ? 'flipped' : ''}`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Mặt trước: Chữ Hán & Pinyin */}
          <div className="flashcard-face flashcard-front">
            <button className="audio-btn" onClick={(e) => playAudio(e, currentWord.hanzi)} title="Nghe phát âm">
              🔊
            </button>
            <div className="hanzi">{currentWord.hanzi}</div>
            <div className="pinyin">{currentWord.pinyin}</div>
          </div>
          
          {/* Mặt sau: Nghĩa & Loại từ */}
          <div className="flashcard-face flashcard-back">
            <div className="meaning">{currentWord.meaning}</div>
            {currentWord.type && (
              <div className="word-type">{currentWord.type}</div>
            )}
          </div>
        </div>
      </div>
      <div className="flashcard-nav">
        <button className="nav-btn" onClick={handlePrev} disabled={currentIndex === 0}>
          ← Trước
        </button>
        <span style={{ margin: 'auto 0', fontWeight: '500', color: 'var(--text-muted)' }}>
          {currentIndex + 1} / {words.length}
        </span>
        <button className="nav-btn" onClick={handleNext} disabled={currentIndex === words.length - 1}>
          Sau →
        </button>
      </div>
    </div>
  );
};

// Component hiển thị danh sách từ vựng
const ListViewer = ({ words }) => {
  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="list-view">
      <table className="list-table">
        <thead>
          <tr>
            <th>Phát âm</th>
            <th>Chữ Hán</th>
            <th>Pinyin</th>
            <th>Nghĩa</th>
            <th>Loại từ</th>
          </tr>
        </thead>
        <tbody>
          {words.map((word, idx) => (
            <tr key={idx}>
              <td>
                <button className="list-audio-btn" onClick={() => playAudio(word.hanzi)}>
                  🔊
                </button>
              </td>
              <td className="list-hanzi">{word.hanzi}</td>
              <td>{word.pinyin}</td>
              <td>{word.meaning}</td>
              <td>{word.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Component hiển thị Bài Khóa
const DialogueViewer = ({ dialogues }) => {
  const [showPinyin, setShowPinyin] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);

  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8; // Đọc chậm một chút
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!dialogues || dialogues.length === 0) {
    return <div className="empty-state">Chưa có dữ liệu bài khóa cho bài học này.</div>;
  }

  return (
    <div className="dialogue-container">
      <div className="dialogue-controls" style={{ marginBottom: '1rem' }}>
        <button 
          className={`toggle-btn ${showPinyin ? 'active' : ''}`}
          onClick={() => setShowPinyin(!showPinyin)}
        >
          {showPinyin ? 'Ẩn Pinyin' : 'Hiện Pinyin'}
        </button>
        <button 
          className={`toggle-btn ${showTranslation ? 'active' : ''}`}
          onClick={() => setShowTranslation(!showTranslation)}
        >
          {showTranslation ? 'Ẩn Dịch nghĩa' : 'Hiện Dịch nghĩa'}
        </button>
      </div>

      {dialogues.map((dialogue) => (
        <div key={dialogue.id} className="dialogue-section">
          <div className="dialogue-header">
            <h3>{dialogue.title}</h3>
            {dialogue.context && <span className="dialogue-context">({dialogue.context})</span>}
          </div>
          
          <div className="dialogue-body">
            {dialogue.lines.map((line, idx) => (
              <div key={idx} className="dialogue-line">
                <div className="dialogue-speaker">{line.speaker}:</div>
                <div className="dialogue-content">
                  <div className="dialogue-hanzi">{line.hanzi}</div>
                  {showPinyin && <div className="dialogue-pinyin">{line.pinyin}</div>}
                  {showTranslation && <div className="dialogue-translation">{line.translation}</div>}
                </div>
                <button className="dialogue-audio" onClick={() => playAudio(line.hanzi)} title="Nghe câu này">
                  🔊
                </button>
              </div>
            ))}
          </div>

          {dialogue.questions && dialogue.questions.length > 0 && (
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>CÂU HỎI ĐỌC HIỂU:</h4>
              <ul style={{ listStyle: 'decimal', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {dialogue.questions.map((q, idx) => (
                  <li key={idx}>
                    <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{q.q}</div>
                    <div style={{ color: 'var(--success-color)' }}>Đáp án: {q.a}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Component hiển thị Mẫu câu chức năng
const GrammarViewer = ({ sentences }) => {
  if (!sentences || sentences.length === 0) {
    return <div className="empty-state">Chưa có dữ liệu mẫu câu cho bài học này.</div>;
  }

  return (
    <div className="grammar-container">
      {sentences.map((section, idx) => (
        <div key={idx} className="grammar-card">
          <h3>{section.category}</h3>
          <ul className="grammar-examples">
            {section.examples.map((example, i) => (
              <li key={i}>📌 {example}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

// Component hiển thị Bài tập
const ExerciseViewer = ({ exercises }) => {
  if (!exercises || exercises.length === 0) {
    return <div className="empty-state">Chưa có bài tập cho bài học này.</div>;
  }

  return (
    <div className="exercise-container">
      {exercises.map((exercise, idx) => (
        <div key={idx} className="exercise-card">
          <h3>Bài {idx + 1}: {exercise.instruction}</h3>
          
          {exercise.type === 'fill-in-the-blank' && exercise.questions.map((q, i) => {
            const [showAnswer, setShowAnswer] = useState(false);
            return (
              <div key={i} className="question-block">
                <div className="question-context">{q.context}</div>
                <div className="question-hint">{q.hint}</div>
                <button className="answer-reveal-btn" onClick={() => setShowAnswer(!showAnswer)}>
                  {showAnswer ? 'Ẩn đáp án' : 'Xem đáp án gợi ý'}
                </button>
                {showAnswer && <div className="answer-text">{q.answer}</div>}
              </div>
            );
          })}

          {exercise.type === 'substitution' && exercise.questions.map((q, i) => (
            <div key={i} className="question-block">
              <div className="question-context" style={{ fontWeight: 'bold' }}>{q.sentence}</div>
              <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Thay thế bằng các từ sau:</div>
              <div className="substitute-list">
                {q.substitutes.map((sub, j) => (
                  <div key={j} className="substitute-item">🔄 {sub}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};


function App() {
  const [activeLesson, setActiveLesson] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  
  // Các Tabs chính: 'vocab', 'dialogue', 'grammar', 'exercise'
  const [activeTab, setActiveTab] = useState('vocab');
  // Sub-view cho Từ vựng: 'flashcard' hoặc 'list'
  const [vocabView, setVocabView] = useState('flashcard');

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const currentLessonData = lessons.find(l => l.lesson === activeLesson);

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Khẩu ngữ sơ cấp 2</h1>
          <button 
            className="mode-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title="Giao diện tối/sáng"
            style={{ padding: '0.25rem', border: 'none', background: 'transparent' }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
        <div className="lesson-list">
          {lessons.map((lesson) => (
            <div 
              key={lesson.lesson}
              className={`lesson-item ${activeLesson === lesson.lesson ? 'active' : ''}`}
              onClick={() => {
                setActiveLesson(lesson.lesson);
                setActiveTab('vocab');
              }}
            >
              Bài {lesson.lesson}: {lesson.title}
            </div>
          ))}
          {/* Mock empty lessons for UI demonstration */}
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i + 6} className="lesson-item" style={{ opacity: 0.5 }} title="Dữ liệu chưa cào">
              Bài {i + 6}: (Chưa có dữ liệu)
            </div>
          ))}
        </div>
      </aside>

      <main className="main-content">
        {currentLessonData ? (
          <>
            <div className="top-nav">
              <h2>Bài {currentLessonData.lesson}: {currentLessonData.title}</h2>
            </div>
            
            <div className="tabs-container">
              <button 
                className={`tab-btn ${activeTab === 'vocab' ? 'active' : ''}`}
                onClick={() => setActiveTab('vocab')}
              >
                📚 Từ vựng
              </button>
              <button 
                className={`tab-btn ${activeTab === 'dialogue' ? 'active' : ''}`}
                onClick={() => setActiveTab('dialogue')}
              >
                🗣️ Bài khóa
              </button>
              <button 
                className={`tab-btn ${activeTab === 'grammar' ? 'active' : ''}`}
                onClick={() => setActiveTab('grammar')}
              >
                💡 Mẫu câu & Ngữ pháp
              </button>
              <button 
                className={`tab-btn ${activeTab === 'exercise' ? 'active' : ''}`}
                onClick={() => setActiveTab('exercise')}
              >
                ✍️ Luyện tập
              </button>
              <button 
                className={`tab-btn ${activeTab === 'pdf' ? 'active' : ''}`}
                onClick={() => setActiveTab('pdf')}
              >
                📖 Sách giáo khoa
              </button>
            </div>

            {/* Rendering based on activeTab */}
            {activeTab === 'vocab' && (
              <>
                <div className="view-controls">
                  <button 
                    className={`view-btn ${vocabView === 'flashcard' ? 'active' : ''}`}
                    onClick={() => setVocabView('flashcard')}
                  >
                    Lật thẻ
                  </button>
                  <button 
                    className={`view-btn ${vocabView === 'list' ? 'active' : ''}`}
                    onClick={() => setVocabView('list')}
                  >
                    Danh sách
                  </button>
                </div>

                {vocabView === 'flashcard' ? (
                  <FlashcardViewer words={currentLessonData.vocabulary} />
                ) : (
                  <ListViewer words={currentLessonData.vocabulary} />
                )}
              </>
            )}

            {activeTab === 'dialogue' && (
              <DialogueViewer dialogues={currentLessonData.dialogues} />
            )}

            {activeTab === 'grammar' && (
              <GrammarViewer sentences={currentLessonData.functional_sentences} />
            )}

            {activeTab === 'exercise' && (
              <ExerciseViewer exercises={currentLessonData.exercises} />
            )}

            {activeTab === 'pdf' && (
              <div style={{ height: 'calc(100vh - 250px)', borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <iframe 
                  src={`${import.meta.env.BASE_URL}LessonPDF/Lesson_${String(currentLessonData.lesson).padStart(2, '0')}.pdf`} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 'none' }}
                  title="PDF Sách giáo khoa"
                >
                  Trình duyệt của bạn không hỗ trợ xem PDF.
                </iframe>
              </div>
            )}

          </>
        ) : (
          <div className="empty-state">
            <h3>Không tìm thấy dữ liệu bài học này</h3>
            <p>Vui lòng chọn bài học khác từ danh sách bên trái.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
