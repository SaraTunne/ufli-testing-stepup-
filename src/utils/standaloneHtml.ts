import { WORD_SETS, PHONETIC_MAP } from '../data/wordSets';

export function generateStandaloneHtml(): string {
  const jsonSets = JSON.stringify(WORD_SETS);
  const jsonPhonetics = JSON.stringify(PHONETIC_MAP);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Foundational Reading Placement Test (Sets 1-11)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Lexend:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --font-display: 'Fredoka', cursive, sans-serif;
      --font-body: 'Lexend', system-ui, sans-serif;
      --primary: #0284c7;
      --primary-hover: #0369a1;
      --accent: #f59e0b;
      --success: #10b981;
      --danger: #ef4444;
      --card-bg: #ffffff;
      --bg: #f8fafc;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
    }

    body {
      font-family: var(--font-body);
      background: radial-gradient(circle at 50% 0%, #e0f2fe 0%, #f0fdf4 40%, #fef3c7 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      color: #1e293b;
      overflow-x: hidden;
    }

    header {
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 2px solid #e2e8f0;
      box-shadow: 0 4px 15px rgba(0,0,0,0.03);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-icon {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #0284c7, #38bdf8);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
      box-shadow: 0 4px 10px rgba(2, 132, 199, 0.25);
    }

    .brand-title {
      font-family: var(--font-display);
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.2;
    }

    .brand-subtitle {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .btn {
      font-family: var(--font-body);
      font-weight: 600;
      font-size: 14px;
      padding: 8px 16px;
      border-radius: 12px;
      border: 1px solid #cbd5e1;
      background: white;
      color: #334155;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }

    .btn:hover {
      background: #f8fafc;
      border-color: #94a3b8;
      transform: translateY(-1px);
    }

    .btn-primary {
      background: linear-gradient(135deg, #0284c7, #0369a1);
      color: white;
      border: none;
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #0369a1, #075985);
      color: white;
    }

    .btn-tutor {
      background: #f1f5f9;
      color: #475569;
    }
    .btn-tutor.active {
      background: #e0e7ff;
      border-color: #6366f1;
      color: #4338ca;
    }

    /* Main Area */
    main {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
      max-width: 960px;
      width: 100%;
      margin: 0 auto;
    }

    /* Set Selector Ribbon */
    .set-ribbon {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding: 8px 4px 16px 4px;
      width: 100%;
      justify-content: flex-start;
      scrollbar-width: thin;
    }

    .set-pill {
      flex: 0 0 auto;
      padding: 8px 16px;
      border-radius: 12px;
      background: white;
      border: 2px solid #e2e8f0;
      color: #475569;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .set-pill:hover {
      border-color: #38bdf8;
      color: #0284c7;
    }

    .set-pill.active {
      background: #0284c7;
      color: white;
      border-color: #0284c7;
      box-shadow: 0 4px 10px rgba(2, 132, 199, 0.3);
    }

    /* Word Card Container */
    .card-stage {
      width: 100%;
      max-width: 720px;
      background: white;
      border-radius: 32px;
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0,0,0,0.04);
      padding: 40px 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      position: relative;
      overflow: hidden;
      border: 4px solid #f1f5f9;
      margin-bottom: 24px;
      transition: transform 0.2s ease;
    }

    .stage-top-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 24px;
      font-size: 14px;
      font-weight: 600;
      color: #64748b;
    }

    .set-badge-tag {
      font-family: var(--font-display);
      font-size: 15px;
      color: #0284c7;
      background: #e0f2fe;
      padding: 4px 12px;
      border-radius: 20px;
    }

    .progress-tag {
      color: #64748b;
    }

    /* Word Display: Never reveal whether real or fake */
    .word-display {
      font-family: var(--font-body);
      font-size: 80px;
      font-weight: 800;
      letter-spacing: 0.05em;
      color: #0f172a;
      line-height: 1.1;
      margin: 30px 0 40px 0;
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .word-display.pulse {
      transform: scale(1.08);
      color: #0284c7;
    }

    /* Audio Speaker Button */
    .listen-button {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      border: none;
      padding: 16px 36px;
      border-radius: 9999px;
      font-size: 18px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.35);
      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .listen-button:hover {
      transform: translateY(-2px) scale(1.03);
      box-shadow: 0 14px 30px rgba(16, 185, 129, 0.45);
    }

    .listen-button:active {
      transform: scale(0.97);
    }

    .listen-button.speaking {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      box-shadow: 0 10px 25px rgba(245, 158, 11, 0.4);
      animation: pulse-ring 1s infinite;
    }

    @keyframes pulse-ring {
      0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.6); }
      70% { box-shadow: 0 0 0 15px rgba(245, 158, 11, 0); }
      100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
    }

    /* Navigation Row */
    .nav-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 720px;
      gap: 16px;
      margin-bottom: 24px;
    }

    .nav-arrow-btn {
      flex: 1;
      padding: 14px 20px;
      border-radius: 16px;
      font-size: 16px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: white;
      border: 2px solid #e2e8f0;
      color: #334155;
      cursor: pointer;
      transition: all 0.15s ease;
      box-shadow: 0 4px 6px rgba(0,0,0,0.02);
    }

    .nav-arrow-btn:hover:not(:disabled) {
      border-color: #0284c7;
      color: #0284c7;
      background: #f0f9ff;
    }

    .nav-arrow-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .nav-arrow-btn.primary {
      background: #0284c7;
      border-color: #0284c7;
      color: white;
      box-shadow: 0 8px 20px rgba(2, 132, 199, 0.3);
    }

    .nav-arrow-btn.primary:hover:not(:disabled) {
      background: #0369a1;
      border-color: #0369a1;
      color: white;
    }

    /* Tutor Mode Floating Panel */
    .tutor-panel {
      width: 100%;
      max-width: 720px;
      background: #f8fafc;
      border: 2px dashed #cbd5e1;
      border-radius: 20px;
      padding: 16px 20px;
      display: none;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 24px;
    }

    .tutor-panel.visible {
      display: flex;
    }

    .tutor-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
      font-weight: 600;
      color: #475569;
    }

    .tutor-buttons {
      display: flex;
      gap: 12px;
    }

    .tutor-score-btn {
      flex: 1;
      padding: 12px;
      border-radius: 14px;
      border: none;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: transform 0.1s ease;
    }

    .tutor-score-btn:active {
      transform: scale(0.98);
    }

    .btn-correct {
      background: #10b981;
      color: white;
    }

    .btn-incorrect {
      background: #ef4444;
      color: white;
    }

    /* Keyboard Shortcuts Footer */
    .keyboard-hint {
      font-size: 13px;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 8px;
    }

    .kbd {
      background: white;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 2px 6px;
      font-size: 11px;
      font-family: monospace;
      font-weight: bold;
      color: #334155;
      box-shadow: 0 1px 1px rgba(0,0,0,0.1);
    }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 16px;
      z-index: 100;
    }

    .modal-backdrop.open {
      display: flex;
    }

    .modal-card {
      background: white;
      border-radius: 24px;
      max-width: 560px;
      width: 100%;
      padding: 28px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-title {
      font-family: var(--font-display);
      font-size: 24px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 12px;
    }

    .modal-body {
      color: #475569;
      line-height: 1.6;
      font-size: 15px;
    }

    .script-quote {
      background: #f0fdf4;
      border-left: 4px solid #10b981;
      padding: 14px 18px;
      border-radius: 0 12px 12px 0;
      font-style: italic;
      color: #166534;
      margin: 16px 0;
    }

    @media (max-width: 640px) {
      .word-display {
        font-size: 54px;
      }
      .card-stage {
        padding: 30px 20px;
      }
    }
  </style>
</head>
<body>

  <header>
    <div class="brand">
      <div class="brand-icon">📖</div>
      <div>
        <div class="brand-title">Reading Placement Test</div>
        <div class="brand-subtitle">K-8 Foundational Literacy Assessment</div>
      </div>
    </div>
    <div class="header-actions">
      <button class="btn" id="btnScript" title="View Teacher Assessment Script">📋 Teacher Script</button>
      <button class="btn btn-tutor" id="btnToggleTutor" title="Toggle scoring buttons">⭐ Tutor Scoring: OFF</button>
      <button class="btn" id="btnVoiceRate" title="Toggle Speech Rate">⚡ 0.85x Speed</button>
    </div>
  </header>

  <main>
    <!-- Set selector tabs -->
    <div class="set-ribbon" id="setRibbon"></div>

    <!-- Student Word Stage (No 'real' or 'fake' labels shown!) -->
    <div class="card-stage">
      <div class="stage-top-meta">
        <span class="set-badge-tag" id="currentSetLabel">Set 1</span>
        <span class="progress-tag" id="currentProgressLabel">Word 1 of 20</span>
      </div>

      <div class="word-display" id="wordDisplay">mat</div>

      <button class="listen-button" id="btnListen" aria-label="Listen to word">
        <span id="speakerIcon">🔊</span>
        <span id="listenText">Say Word</span>
      </button>
    </div>

    <!-- Navigation arrows -->
    <div class="nav-controls">
      <button class="nav-arrow-btn" id="btnPrev">← Previous</button>
      <button class="nav-arrow-btn primary" id="btnNext">Next Word →</button>
    </div>

    <!-- Tutor Scoring Mode (Optional) -->
    <div class="tutor-panel" id="tutorPanel">
      <div class="tutor-header">
        <span>Tutor Score Tracker (Set Score: <b id="tutorScoreTally">0 / 0</b>)</span>
        <span id="tutorWordTypeHint" style="color:#6366f1;"></span>
      </div>
      <div class="tutor-buttons">
        <button class="tutor-score-btn btn-correct" id="btnMarkCorrect">✓ Correct (+1)</button>
        <button class="tutor-score-btn btn-incorrect" id="btnMarkIncorrect">✗ Missed (0)</button>
      </div>
    </div>

    <div class="keyboard-hint">
      <span><span class="kbd">Space</span> Listen</span>
      <span><span class="kbd">→</span> Next</span>
      <span><span class="kbd">←</span> Back</span>
      <span id="kbdTutorHint" style="display:none;"><span class="kbd">C</span> Correct <span class="kbd">X</span> Missed</span>
    </div>
  </main>

  <!-- Script Modal -->
  <div class="modal-backdrop" id="modalScript">
    <div class="modal-card">
      <h2 class="modal-title">Administration Script & Procedure</h2>
      <div class="modal-body">
        <p><strong>Before showing your student the material, say:</strong></p>
        <div class="script-quote">
          “Today, we are going to take a test to see where you are at in reading.<br><br>
          I’m going to show you some words to read. Some are real words and some are made-up words that may or may not be tricky to read, but please try your best. Remember that some are made-up words, so do not try to make them sound like real words. Ready?”
        </div>
        <p><strong>Directions:</strong></p>
        <ul style="padding-left: 20px; margin-top: 8px;">
          <li>Ask the student to read aloud each word displayed.</li>
          <li>Each real and made-up word read accurately is worth 1 point.</li>
          <li>Use the <strong>Tutor Scoring</strong> button in the top bar to track scores live.</li>
          <li>When finished with a set, record the student's tally on your score sheet.</li>
        </ul>
        <button class="btn btn-primary" style="margin-top: 24px; width: 100%; justify-content: center;" id="btnCloseScript">Got It, Let's Begin!</button>
      </div>
    </div>
  </div>

  <script>
    const WORD_SETS = ${jsonSets};
    const PHONETIC_MAP = ${jsonPhonetics};

    let currentSetIndex = 0;
    let currentWordIndex = 0;
    let speechRate = 0.85;
    let isTutorMode = false;
    let scores = {}; // key: wordId -> boolean

    const wordDisplay = document.getElementById('wordDisplay');
    const btnListen = document.getElementById('btnListen');
    const listenText = document.getElementById('listenText');
    const speakerIcon = document.getElementById('speakerIcon');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const currentSetLabel = document.getElementById('currentSetLabel');
    const currentProgressLabel = document.getElementById('currentProgressLabel');
    const setRibbon = document.getElementById('setRibbon');
    const tutorPanel = document.getElementById('tutorPanel');
    const btnToggleTutor = document.getElementById('btnToggleTutor');
    const tutorScoreTally = document.getElementById('tutorScoreTally');
    const tutorWordTypeHint = document.getElementById('tutorWordTypeHint');
    const btnMarkCorrect = document.getElementById('btnMarkCorrect');
    const btnMarkIncorrect = document.getElementById('btnMarkIncorrect');
    const kbdTutorHint = document.getElementById('kbdTutorHint');
    const modalScript = document.getElementById('modalScript');
    const btnScript = document.getElementById('btnScript');
    const btnCloseScript = document.getElementById('btnCloseScript');
    const btnVoiceRate = document.getElementById('btnVoiceRate');

    // Build Set Ribbon
    function renderSetRibbon() {
      setRibbon.innerHTML = '';
      WORD_SETS.forEach((s, idx) => {
        const pill = document.createElement('button');
        pill.className = 'set-pill' + (idx === currentSetIndex ? ' active' : '');
        pill.textContent = 'Set ' + s.id;
        pill.onclick = () => {
          currentSetIndex = idx;
          currentWordIndex = 0;
          renderSetRibbon();
          updateCard();
        };
        setRibbon.appendChild(pill);
      });
    }

    function getCurrentSet() {
      return WORD_SETS[currentSetIndex];
    }

    function getCurrentWord() {
      return getCurrentSet().words[currentWordIndex];
    }

    function updateCard() {
      const set = getCurrentSet();
      const word = getCurrentWord();

      wordDisplay.textContent = word.text;
      wordDisplay.classList.remove('pulse');

      currentSetLabel.textContent = 'Set ' + set.id;
      currentProgressLabel.textContent = 'Word ' + (currentWordIndex + 1) + ' of ' + set.words.length;

      btnPrev.disabled = currentWordIndex === 0 && currentSetIndex === 0;

      // Update Tutor Display
      if (isTutorMode) {
        let setCorrect = 0;
        let setAnswered = 0;
        set.words.forEach(w => {
          if (scores[w.id] !== undefined) {
            setAnswered++;
            if (scores[w.id]) setCorrect++;
          }
        });
        tutorScoreTally.textContent = setCorrect + ' / ' + set.words.length;
        tutorWordTypeHint.textContent = 'Target: ' + word.type.toUpperCase() + ' word' + (scores[word.id] !== undefined ? (scores[word.id] ? ' (✓ Marked)' : ' (✗ Marked)') : '');
      }
    }

    function speakCurrentWord() {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();

      const word = getCurrentWord();
      const phoneticText = word.phonetic || PHONETIC_MAP[word.text.toLowerCase()] || word.text;

      const utter = new SpeechSynthesisUtterance(phoneticText);
      utter.lang = 'en-US';
      utter.rate = speechRate;
      utter.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const bestVoice = voices.find(v => v.lang.startsWith('en-US')) || voices.find(v => v.lang.startsWith('en'));
      if (bestVoice) utter.voice = bestVoice;

      btnListen.classList.add('speaking');
      speakerIcon.textContent = '🔊';
      listenText.textContent = 'Listening...';
      wordDisplay.classList.add('pulse');

      utter.onend = () => {
        btnListen.classList.remove('speaking');
        speakerIcon.textContent = '🔊';
        listenText.textContent = 'Listen Again';
        wordDisplay.classList.remove('pulse');
      };

      utter.onerror = () => {
        btnListen.classList.remove('speaking');
        listenText.textContent = 'Say Word';
        wordDisplay.classList.remove('pulse');
      };

      window.speechSynthesis.speak(utter);
    }

    function nextWord() {
      const set = getCurrentSet();
      if (currentWordIndex < set.words.length - 1) {
        currentWordIndex++;
        updateCard();
      } else if (currentSetIndex < WORD_SETS.length - 1) {
        currentSetIndex++;
        currentWordIndex = 0;
        renderSetRibbon();
        updateCard();
      }
    }

    function prevWord() {
      if (currentWordIndex > 0) {
        currentWordIndex--;
        updateCard();
      } else if (currentSetIndex > 0) {
        currentSetIndex--;
        currentWordIndex = WORD_SETS[currentSetIndex].words.length - 1;
        renderSetRibbon();
        updateCard();
      }
    }

    function recordScore(isCorrect) {
      const word = getCurrentWord();
      scores[word.id] = isCorrect;
      nextWord();
    }

    // Event Listeners
    btnListen.addEventListener('click', speakCurrentWord);
    btnNext.addEventListener('click', nextWord);
    btnPrev.addEventListener('click', prevWord);

    btnToggleTutor.addEventListener('click', () => {
      isTutorMode = !isTutorMode;
      tutorPanel.classList.toggle('visible', isTutorMode);
      btnToggleTutor.classList.toggle('active', isTutorMode);
      btnToggleTutor.textContent = '⭐ Tutor Scoring: ' + (isTutorMode ? 'ON' : 'OFF');
      kbdTutorHint.style.display = isTutorMode ? 'inline' : 'none';
      updateCard();
    });

    btnMarkCorrect.addEventListener('click', () => recordScore(true));
    btnMarkIncorrect.addEventListener('click', () => recordScore(false));

    btnVoiceRate.addEventListener('click', () => {
      if (speechRate === 0.85) {
        speechRate = 0.7;
        btnVoiceRate.textContent = '🐢 0.70x Speed';
      } else if (speechRate === 0.7) {
        speechRate = 1.0;
        btnVoiceRate.textContent = '🐇 1.00x Speed';
      } else {
        speechRate = 0.85;
        btnVoiceRate.textContent = '⚡ 0.85x Speed';
      }
    });

    btnScript.addEventListener('click', () => modalScript.classList.add('open'));
    btnCloseScript.addEventListener('click', () => modalScript.classList.remove('open'));

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (modalScript.classList.contains('open')) return;
      if (e.code === 'Space') {
        e.preventDefault();
        speakCurrentWord();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        nextWord();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        prevWord();
      } else if (isTutorMode) {
        if (e.key.toLowerCase() === 'c') {
          recordScore(true);
        } else if (e.key.toLowerCase() === 'x') {
          recordScore(false);
        }
      }
    });

    // Init
    renderSetRibbon();
    updateCard();
  </script>
</body>
</html>`;
}
