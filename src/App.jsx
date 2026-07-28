import React, { useState, useEffect } from 'react';
import { lessons } from './data';
import { QuizViewer, MatchGame } from './QuizletComponents';
import './index.css';

// Component hiển thị thẻ từ vựng
const FlashcardViewer = ({ words }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [displayWords, setDisplayWords] = useState(words);

  // Reset khi đổi bài học
  useEffect(() => {
    setIsShuffled(false);
    setDisplayWords(words);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [words]);

  const toggleShuffle = () => {
    if (!isShuffled) {
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setDisplayWords(shuffled);
      setIsShuffled(true);
    } else {
      setDisplayWords(words);
      setIsShuffled(false);
    }
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const currentWord = displayWords[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => Math.min(prev + 1, displayWords.length - 1));
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

  if (!currentWord) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="flashcard-toolbar" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button 
          className={`nav-btn ${isShuffled ? 'active' : ''}`}
          style={{ background: isShuffled ? 'var(--primary-color)' : 'var(--bg-color)', color: isShuffled ? 'white' : 'var(--text-main)', border: '1px solid var(--border-color)', padding: '0.4rem 0.8rem', borderRadius: '20px' }}
          onClick={toggleShuffle}
        >
          🔀 Trộn thẻ {isShuffled ? '(Đang bật)' : ''}
        </button>
      </div>
      <div className="flashcard-container">
        <div 
          className={`flashcard ${isFlipped ? 'flipped' : ''}`}
          onClick={() => {
            setIsFlipped(!isFlipped);
            if (!isFlipped && 'speechSynthesis' in window) {
               // Auto-play khi lật sang mặt sau? Thường quizlet autoplay khi next.
            }
          }}
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
          {currentIndex + 1} / {displayWords.length}
        </span>
        <button className="nav-btn" onClick={handleNext} disabled={currentIndex === displayWords.length - 1}>
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
  // Mặc định: Chỉ hiển thị Câu gốc (Chữ Hán) để tối ưu luyện tập khẩu ngữ, tránh bị phụ thuộc vào Pinyin/Dịch nghĩa
  const [showHanzi, setShowHanzi] = useState(true);
  const [showPinyin, setShowPinyin] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  
  // Trạng thái mở hiển thị lẻ cho từng câu (khi chế độ chung đang ẩn)
  const [revealedLines, setRevealedLines] = useState({});

  const toggleLineReveal = (lineKey) => {
    setRevealedLines(prev => ({ ...prev, [lineKey]: !prev[lineKey] }));
  };

  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8; // Đọc chậm một chút
      window.speechSynthesis.speak(utterance);
    }
  };

  const setMode = (mode) => {
    setRevealedLines({}); // reset gợi ý lẻ
    if (mode === 'hanzi-only') {
      setShowHanzi(true); setShowPinyin(false); setShowTranslation(false);
    } else if (mode === 'listening') {
      setShowHanzi(false); setShowPinyin(false); setShowTranslation(false);
    } else if (mode === 'translation-only') {
      setShowHanzi(false); setShowPinyin(false); setShowTranslation(true);
    } else if (mode === 'full') {
      setShowHanzi(true); setShowPinyin(true); setShowTranslation(true);
    }
  };

  const currentMode = () => {
    if (showHanzi && !showPinyin && !showTranslation) return 'hanzi-only';
    if (!showHanzi && !showPinyin && !showTranslation) return 'listening';
    if (!showHanzi && !showPinyin && showTranslation) return 'translation-only';
    if (showHanzi && showPinyin && showTranslation) return 'full';
    return 'custom';
  };

  if (!dialogues || dialogues.length === 0) {
    return <div className="empty-state">Chưa có dữ liệu bài khóa cho bài học này.</div>;
  }

  return (
    <div className="dialogue-container">
      {/* Thanh điều khiển hiển thị chuyên nghiệp */}
      <div className="dialogue-toolbar">
        <div className="toolbar-section">
          <span className="toolbar-label">🎯 Chế độ luyện tập:</span>
          <div className="preset-modes">
            <button 
              className={`preset-btn ${currentMode() === 'hanzi-only' ? 'active' : ''}`}
              onClick={() => setMode('hanzi-only')}
              title="Chỉ hiện Câu gốc (Chữ Hán) - Tốt nhất để luyện đọc và nói"
            >
              🇨🇳 Đọc Hán tự
            </button>
            <button 
              className={`preset-btn ${currentMode() === 'listening' ? 'active' : ''}`}
              onClick={() => setMode('listening')}
              title="Ẩn toàn bộ chữ, chỉ bấm loa nghe để luyện phản xạ"
            >
              🎧 Luyện nghe
            </button>
            <button 
              className={`preset-btn ${currentMode() === 'translation-only' ? 'active' : ''}`}
              onClick={() => setMode('translation-only')}
              title="Chỉ hiện tiếng Việt để luyện dịch ngược sang tiếng Trung"
            >
              📖 Luyện dịch ngược
            </button>
            <button 
              className={`preset-btn ${currentMode() === 'full' ? 'active' : ''}`}
              onClick={() => setMode('full')}
              title="Hiển thị đầy đủ tất cả các thành phần"
            >
              👁️ Hiện tất cả
            </button>
          </div>
        </div>

        <div className="toolbar-section custom-section">
          <span className="toolbar-label">🔧 Tùy chỉnh:</span>
          <div className="custom-toggles">
            <label className={`toggle-pill ${showHanzi ? 'active' : ''}`}>
              <input type="checkbox" checked={showHanzi} onChange={(e) => setShowHanzi(e.target.checked)} hidden />
              <span>{showHanzi ? '✓' : ''} Câu gốc</span>
            </label>
            <label className={`toggle-pill ${showPinyin ? 'active' : ''}`}>
              <input type="checkbox" checked={showPinyin} onChange={(e) => setShowPinyin(e.target.checked)} hidden />
              <span>{showPinyin ? '✓' : ''} Phiên âm</span>
            </label>
            <label className={`toggle-pill ${showTranslation ? 'active' : ''}`}>
              <input type="checkbox" checked={showTranslation} onChange={(e) => setShowTranslation(e.target.checked)} hidden />
              <span>{showTranslation ? '✓' : ''} Dịch nghĩa</span>
            </label>
          </div>
        </div>
      </div>

      {dialogues.map((dialogue, dIdx) => (
        <div key={dialogue.id} className="dialogue-section">
          <div className="dialogue-header">
            <h3>{dialogue.title}</h3>
            {dialogue.context && <span className="dialogue-context">({dialogue.context})</span>}
          </div>
          
          <div className="dialogue-body">
            {dialogue.lines.map((line, idx) => {
              const lineKey = `${dIdx}-${idx}`;
              const isRevealed = revealedLines[lineKey];
              const lineShowHanzi = showHanzi || isRevealed;
              const lineShowPinyin = showPinyin || isRevealed;
              const lineShowTranslation = showTranslation || isRevealed;
              const isFullyHiddenGlobally = !showHanzi && !showPinyin && !showTranslation;

              return (
                <div key={idx} className={`dialogue-line ${isFullyHiddenGlobally && !isRevealed ? 'listening-mode' : ''}`}>
                  <div className="dialogue-speaker">{line.speaker}:</div>
                  <div 
                    className="dialogue-content" 
                    onClick={() => toggleLineReveal(lineKey)}
                    title={(!showHanzi || !showPinyin || !showTranslation) && !isRevealed ? "Bấm để mở xem chi tiết câu này" : ""}
                  >
                    {lineShowHanzi && <div className="dialogue-hanzi">{line.hanzi}</div>}
                    {lineShowPinyin && <div className="dialogue-pinyin">{line.pinyin}</div>}
                    {lineShowTranslation && <div className="dialogue-translation">{line.translation}</div>}
                  </div>
                  <button className="dialogue-audio" onClick={() => playAudio(line.hanzi)} title="Nghe câu này">
                    🔊
                  </button>
                </div>
              );
            })}
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


// Component hiển thị từng mẫu câu chức năng với hiệu ứng ẩn/hiện nghĩa
const GrammarLine = ({ text }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  // Phân tách tiếng Trung và tiếng Việt (trong ngoặc)
  const match = text.match(/^(.*?)\(([^)]+)\)$/);
  const hanzi = match ? match[1].trim() : text;
  const translation = match ? match[2].trim() : '';

  const playAudio = (e) => {
    e.stopPropagation(); // Tránh bị click vào line
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(hanzi);
      utterance.lang = 'zh-CN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <li 
      className={`grammar-line ${isRevealed ? 'revealed' : ''}`}
      onClick={() => setIsRevealed(!isRevealed)}
      title="Bấm để xem/ẩn dịch nghĩa tiếng Việt"
    >
      <span className="grammar-icon">📌</span>
      <div className="grammar-content">
        <div className="grammar-hanzi">{hanzi}</div>
        {translation && (
          <div className="grammar-translation">
            {translation}
          </div>
        )}
      </div>
      <button className="grammar-audio-btn" onClick={playAudio} title="Nghe mẫu câu này">
        🔊
      </button>
    </li>
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
              <GrammarLine key={i} text={example} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

// Component bài tập điền từ tương tác
const FillBlankQuestion = ({ q }) => {
  const parts = q.context.split(/_{3,}/);
  const correctAnswers = q.answer ? q.answer.split('/').map(s => s.trim()) : [];
  
  const [inputs, setInputs] = useState(Array(parts.length > 1 ? parts.length - 1 : 0).fill(''));
  const [isChecking, setIsChecking] = useState(false);

  const handleInputChange = (idx, value) => {
    const newInputs = [...inputs];
    newInputs[idx] = value;
    setInputs(newInputs);
    setIsChecking(false);
  };

  const handleCheck = () => setIsChecking(true);

  return (
    <div className="question-block">
      <div className="question-context-interactive">
        {parts.map((part, idx) => {
          if (idx === parts.length - 1) {
            return <span key={idx}>{part}</span>;
          }
          
          const userAnswer = (inputs[idx] || '').trim();
          const expectedAnswer = correctAnswers[idx] || '';
          const isCorrect = isChecking && userAnswer.toLowerCase() === expectedAnswer.toLowerCase();
          const isWrong = isChecking && userAnswer !== '' && userAnswer.toLowerCase() !== expectedAnswer.toLowerCase();
          
          return (
            <React.Fragment key={idx}>
              <span>{part}</span>
              <input
                type="text"
                className={`blank-input ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
                value={inputs[idx] || ''}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                placeholder="..."
              />
            </React.Fragment>
          );
        })}
      </div>
      {q.hint && <div className="question-hint" style={{ marginTop: '1rem' }}>{q.hint}</div>}
      
      <div className="question-actions" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button className="nav-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', background: 'var(--primary-color)', color: 'white' }} onClick={handleCheck}>
          ✅ Kiểm tra
        </button>
        {isChecking && (
          <button className="nav-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={() => { setInputs(Array(parts.length - 1).fill('')); setIsChecking(false); }}>
            🔄 Làm lại
          </button>
        )}
      </div>
      
      {isChecking && inputs.some((val, idx) => (val || '').trim().toLowerCase() !== (correctAnswers[idx] || '').toLowerCase()) && (
        <div className="answer-text" style={{ marginTop: '1rem', color: 'var(--text-main)', background: 'var(--bg-color)', padding: '1rem', borderRadius: '0.5rem', borderLeft: '4px solid var(--primary-color)' }}>
          💡 <strong>Đáp án đúng:</strong> {q.answer}
        </div>
      )}
    </div>
  );
};

const SubstituteItem = ({ q, sub }) => {
  const [input, setInput] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const getValidAnswers = (baseSentence, subString) => {
    const cleanSubs = subString.split('/').map(s => s.replace(/\([^)]*\)/g, '').trim());
    let expected = baseSentence;
    if (expected.includes('【')) {
      cleanSubs.forEach(s => {
        expected = expected.replace(/【[^】]+】/, s);
      });
      const fullAnswer = expected;
      const lines = expected.split('\n');
      const changedLine = lines.find(l => cleanSubs.some(sub => l.includes(sub)));
      return { fullAnswer, changedLine, cleanSubs };
    } else {
      return { fullAnswer: cleanSubs.join(' '), changedLine: null, cleanSubs };
    }
  };

  const normalizeText = (text) => {
    return text.replace(/[A-Za-z]+:|\s+|[，。！？、：；（）""''.,!?:;()]/g, '').toLowerCase();
  };

  const handleCheck = () => setIsChecking(true);
  
  const answers = getValidAnswers(q.sentence, sub);
  const normalizedUser = normalizeText(input);
  const normalizedFull = normalizeText(answers.fullAnswer);
  const normalizedChanged = answers.changedLine ? normalizeText(answers.changedLine) : null;
  
  const isCorrect = isChecking && normalizedUser !== '' && (normalizedUser === normalizedFull || (normalizedChanged && normalizedUser === normalizedChanged));
  const isWrong = isChecking && normalizedUser !== '' && !isCorrect;

  const targetAnswer = (!answers.changedLine || Math.abs(input.length - answers.fullAnswer.length) < Math.abs(input.length - answers.changedLine.length)) 
    ? answers.fullAnswer 
    : answers.changedLine;

  const computeDiff = (userStr, expectedStr) => {
    const n = userStr.length;
    const m = expectedStr.length;
    const dp = Array(n + 1).fill(0).map(() => Array(m + 1).fill(0));
    
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        if (userStr[i - 1] === expectedStr[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }
    
    let i = n, j = m;
    const result = [];
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && userStr[i - 1] === expectedStr[j - 1]) {
        result.unshift({ char: userStr[i - 1], type: 'correct' });
        i--; j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        j--; // missing character, ignore in user's view
      } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
        result.unshift({ char: userStr[i - 1], type: 'wrong' });
        i--;
      }
    }
    return result;
  };

  return (
    <div className="substitute-item-interactive">
      <div className="sub-label">🔄 {sub}</div>
      {isChecking ? (
        <div className={`sub-input ${isCorrect ? 'correct' : 'wrong'}`} style={{ whiteSpace: 'pre-wrap' }}>
          {computeDiff(input, targetAnswer).map((item, idx) => (
            <span key={idx} style={{ 
              color: item.type === 'correct' ? 'var(--success-color)' : '#ef4444',
              fontWeight: item.type === 'wrong' ? 'bold' : 'normal',
              textDecoration: item.type === 'wrong' ? 'underline' : 'none'
            }}>
              {item.char}
            </span>
          ))}
        </div>
      ) : (
        <textarea
          className="sub-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập lại câu hoàn chỉnh sau khi thay thế..."
          rows={q.sentence.includes('\n') ? 2 : 1}
        />
      )}
      <div className="sub-item-actions" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
        <button className="nav-btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: 'var(--primary-color)', color: 'white' }} onClick={handleCheck}>
          ✅ Kiểm tra
        </button>
        {isChecking && (
          <button className="nav-btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => { setIsChecking(false); }}>
            🔄 Làm lại
          </button>
        )}
      </div>

      {isWrong && (
        <div className="sub-answer-hint">
          💡 Đáp án đúng:
          {answers.fullAnswer.split('\n').map((line, k) => (
            <div key={k}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
};

// Component bài tập thay thế từ tương tác
const SubstitutionQuestion = ({ q }) => {
  return (
    <div className="question-block">
      <div className="question-context" style={{ fontWeight: 'bold' }}>{q.sentence}</div>
      <div style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Thay thế bằng các từ sau:</div>
      
      <div className="substitute-list">
        {q.substitutes.map((sub, j) => (
          <SubstituteItem key={j} q={q} sub={sub} />
        ))}
      </div>
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
          
          {exercise.type === 'fill-in-the-blank' && exercise.questions.map((q, i) => (
            <FillBlankQuestion key={i} q={q} />
          ))}

          {exercise.type === 'substitution' && exercise.questions.map((q, i) => (
            <SubstitutionQuestion key={i} q={q} />
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
                  <button 
                    className={`view-btn ${vocabView === 'quiz' ? 'active' : ''}`}
                    onClick={() => setVocabView('quiz')}
                  >
                    📝 Trắc nghiệm
                  </button>
                  <button 
                    className={`view-btn ${vocabView === 'match' ? 'active' : ''}`}
                    onClick={() => setVocabView('match')}
                  >
                    🎮 Ghép thẻ
                  </button>
                </div>

                {vocabView === 'flashcard' && <FlashcardViewer words={currentLessonData.vocabulary} />}
                {vocabView === 'list' && <ListViewer words={currentLessonData.vocabulary} />}
                {vocabView === 'quiz' && <QuizViewer words={currentLessonData.vocabulary} />}
                {vocabView === 'match' && <MatchGame words={currentLessonData.vocabulary} />}
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
