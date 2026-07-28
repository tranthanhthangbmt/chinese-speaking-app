import React, { useState, useEffect } from 'react';

// === QUIZ VIEWER (Trắc nghiệm) ===
export const QuizViewer = ({ words }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    // Generate questions: For each word, create a question
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    const qs = shuffledWords.map(word => {
      // Pick 3 random wrong answers
      const others = words.filter(w => w.hanzi !== word.hanzi).sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [word, ...others].sort(() => Math.random() - 0.5);
      return {
        word: word,
        options: options
      };
    });
    setQuestions(qs);
    setCurrentIdx(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
  }, [words]);

  const handleAnswer = (option) => {
    if (selectedAnswer) return; // Prevent double click
    setSelectedAnswer(option);
    
    if (option.hanzi === questions[currentIdx].word.hanzi) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(c => c + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const resetQuiz = () => {
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    const qs = shuffledWords.map(word => {
      const others = words.filter(w => w.hanzi !== word.hanzi).sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [word, ...others].sort(() => Math.random() - 0.5);
      return { word, options };
    });
    setQuestions(qs);
    setCurrentIdx(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  if (questions.length === 0) return null;

  if (showResult) {
    return (
      <div className="quiz-result" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>Hoàn thành!</h2>
        <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>
          {score === questions.length ? '🏆' : (score > questions.length / 2 ? '⭐' : '💪')}
        </div>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          Điểm của bạn: <strong>{score} / {questions.length}</strong>
        </p>
        <button className="nav-btn" onClick={resetQuiz} style={{ background: 'var(--primary-color)', color: 'white', padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
          🔄 Chơi lại
        </button>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="quiz-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      <div className="quiz-progress" style={{ marginBottom: '2rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
        <span>Câu {currentIdx + 1} / {questions.length}</span>
        <span>Điểm: {score}</span>
      </div>
      
      <div className="quiz-question" style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', textAlign: 'center', marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
        {q.word.meaning}
      </div>

      <div className="quiz-options" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {q.options.map((opt, i) => {
          let btnClass = 'quiz-btn';
          let btnStyle = { 
            padding: '1.5rem 1rem', 
            borderRadius: '0.75rem', 
            border: '2px solid var(--border-color)', 
            background: 'var(--bg-color)', 
            cursor: 'pointer', 
            fontSize: '1.2rem',
            transition: 'all 0.2s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          };

          if (selectedAnswer) {
            if (opt.hanzi === q.word.hanzi) {
              btnStyle.background = 'rgba(16, 185, 129, 0.1)';
              btnStyle.borderColor = 'var(--success-color)';
            } else if (opt.hanzi === selectedAnswer.hanzi) {
              btnStyle.background = 'rgba(239, 68, 68, 0.1)';
              btnStyle.borderColor = '#ef4444';
            }
          }

          return (
            <button 
              key={i} 
              style={btnStyle}
              onClick={() => handleAnswer(opt)}
              disabled={!!selectedAnswer}
              onMouseOver={(e) => { if (!selectedAnswer) e.currentTarget.style.borderColor = 'var(--primary-color)'; }}
              onMouseOut={(e) => { if (!selectedAnswer) e.currentTarget.style.borderColor = 'var(--border-color)'; }}
            >
              <span style={{ fontSize: '1.5rem', color: 'var(--text-main)', fontWeight: 'bold' }}>{opt.hanzi}</span>
              <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>{opt.pinyin}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};


// === MATCH GAME (Nối thẻ) ===
export const MatchGame = ({ words }) => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState(new Set());
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimer(t => t + 0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const initGame = () => {
    // Pick 6 random words (or all if < 6)
    const gameWords = [...words].sort(() => Math.random() - 0.5).slice(0, 6);
    
    const deck = [];
    gameWords.forEach(w => {
      deck.push({ id: w.hanzi + '-h', type: 'hanzi', content: w.hanzi, pinyin: w.pinyin, matchId: w.hanzi });
      deck.push({ id: w.hanzi + '-m', type: 'meaning', content: w.meaning, matchId: w.hanzi });
    });
    
    setCards(deck.sort(() => Math.random() - 0.5));
    setMatchedPairs(new Set());
    setSelectedCard(null);
    setTimer(0);
    setIsPlaying(true);
  };

  const handleCardClick = (card) => {
    if (!isPlaying) return;
    if (matchedPairs.has(card.matchId)) return; // Already matched
    if (selectedCard?.id === card.id) {
      setSelectedCard(null); // Deselect
      return;
    }

    if (!selectedCard) {
      setSelectedCard(card);
    } else {
      // Check match
      if (selectedCard.matchId === card.matchId && selectedCard.type !== card.type) {
        // Match!
        const newMatched = new Set(matchedPairs);
        newMatched.add(card.matchId);
        setMatchedPairs(newMatched);
        setSelectedCard(null);
        
        if (newMatched.size === cards.length / 2) {
          setIsPlaying(false); // Game won
        }
      } else {
        // Wrong match
        const btn1 = document.getElementById(`match-card-${selectedCard.id}`);
        const btn2 = document.getElementById(`match-card-${card.id}`);
        if(btn1) btn1.style.animation = 'shake 0.5s';
        if(btn2) btn2.style.animation = 'shake 0.5s';
        
        setTimeout(() => {
          if(btn1) btn1.style.animation = '';
          if(btn2) btn2.style.animation = '';
          setSelectedCard(null);
        }, 500);
      }
    }
  };

  if (!isPlaying && timer === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Trò chơi Nối Thẻ</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Nối chữ Hán với Nghĩa tiếng Việt tương ứng nhanh nhất có thể!</p>
        <button className="nav-btn" onClick={initGame} style={{ background: 'var(--primary-color)', color: 'white', padding: '1rem 3rem', fontSize: '1.2rem' }}>
          ▶️ Bắt đầu
        </button>
      </div>
    );
  }

  const isWon = matchedPairs.size > 0 && matchedPairs.size === cards.length / 2;

  return (
    <div className="match-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ margin: 0, color: 'var(--primary-color)' }}>⏱️ {timer.toFixed(1)}s</h3>
        {isWon && <strong style={{ color: 'var(--success-color)' }}>Tuyệt vời!</strong>}
        <button onClick={initGame} style={{ background: 'none', border: '1px solid var(--border-color)', padding: '0.4rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', color: 'var(--text-main)' }}>
          🔄 Chơi lại
        </button>
      </div>

      <div className="match-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {cards.map(card => {
          const isMatched = matchedPairs.has(card.matchId);
          const isSelected = selectedCard?.id === card.id;
          
          let bg = 'var(--card-bg)';
          let border = '2px solid var(--border-color)';
          let opacity = 1;
          
          if (isMatched) {
            bg = 'rgba(16, 185, 129, 0.1)';
            border = '2px solid var(--success-color)';
            opacity = 0; // Ẩn thẻ khi đã nối
          } else if (isSelected) {
            bg = 'rgba(99, 102, 241, 0.1)';
            border = '2px solid var(--primary-color)';
          }

          return (
            <button
              id={`match-card-${card.id}`}
              key={card.id}
              onClick={() => handleCardClick(card)}
              style={{
                background: bg,
                border: border,
                borderRadius: '0.75rem',
                padding: '1.5rem 1rem',
                fontSize: card.type === 'hanzi' ? '1.8rem' : '1.1rem',
                fontWeight: 'bold',
                color: 'var(--text-main)',
                cursor: isMatched ? 'default' : 'pointer',
                opacity: opacity,
                transition: 'all 0.3s ease',
                pointerEvents: isMatched ? 'none' : 'auto',
                boxShadow: isSelected ? '0 4px 12px rgba(99, 102, 241, 0.2)' : '0 2px 4px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100px'
              }}
            >
              {card.content}
              {card.type === 'hanzi' && <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 'normal' }}>{card.pinyin}</span>}
            </button>
          );
        })}
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px) rotate(-2deg); }
          75% { transform: translateX(5px) rotate(2deg); }
        }
      `}</style>
    </div>
  );
};
