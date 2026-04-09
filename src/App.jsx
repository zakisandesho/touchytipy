import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

const sentences = [
  "The quick brown fox jumps over the lazy dog near the river bank.",
  "Practice makes perfect when you type every single day without fail.",
  "A journey of a thousand miles begins with a single step forward.",
  "She sells seashells by the seashore during the warm summer months.",
  "To be or not to be that is the question we must all answer.",
  "All that glitters is not gold but sometimes it is worth keeping.",
  "The rain in Spain falls mainly on the plain during autumn season.",
  "Every great developer was once a beginner who never gave up trying.",
  "Code is like humor; when you have to explain it, it is bad code.",
  "Simplicity is the ultimate sophistication in design and in daily life.",
  "The best way to predict the future is to invent it with your hands.",
  "Programming is thinking, not typing, but fast typing sure does help.",
]

function getRandomSentence(exclude) {
  const filtered = sentences.filter((s) => s !== exclude)
  return filtered[Math.floor(Math.random() * filtered.length)]
}

const STORAGE_KEY = 'touchytipy_pb'

function loadPB() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function savePB(pb) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pb))
  } catch {
    // storage full or unavailable — silently ignore
  }
}

function App() {
  const [text, setText] = useState(() => getRandomSentence())
  const [typed, setTyped] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [errors, setErrors] = useState(0)
  const [finished, setFinished] = useState(false)
  const [now, setNow] = useState(null)
  const [pb, setPb] = useState(() => loadPB())
  const [isNewPB, setIsNewPB] = useState(false)
  const displayRef = useRef(null)

  const reset = useCallback(() => {
    setText((prev) => getRandomSentence(prev))
    setTyped('')
    setStartTime(null)
    setNow(null)
    setErrors(0)
    setFinished(false)
    setIsNewPB(false)
    displayRef.current?.focus()
  }, [])

  // Tick every second while typing so WPM updates live
  useEffect(() => {
    if (!startTime || finished) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [startTime, finished])

  const elapsed = startTime ? ((now || Date.now()) - startTime) / 1000 / 60 : 0
  const wordCount = typed.trim().split(/\s+/).filter(Boolean).length
  const wpm = elapsed > 0 ? Math.round(wordCount / elapsed) : 0
  const accuracy =
    typed.length > 0
      ? Math.round(((typed.length - errors) / typed.length) * 100)
      : 100

  // Check for new PB when finished
  useEffect(() => {
    if (!finished) return
    const newRecord = !pb || wpm > pb.wpm || (wpm === pb.wpm && accuracy > pb.accuracy)
    if (newRecord && wpm > 0) {
      const newPB = { wpm, accuracy, date: new Date().toLocaleDateString() }
      setPb(newPB)
      savePB(newPB)
      setIsNewPB(true)
    }
  }, [finished]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    displayRef.current?.focus()
  }, [])

  const handleKeyDown = useCallback(
    (e) => {
      if (finished) return

      if (e.key === 'Tab' || e.key === 'Escape') {
        e.preventDefault()
        reset()
        return
      }

      // Ignore modifier keys, function keys, etc.
      if (
        e.ctrlKey ||
        e.altKey ||
        e.metaKey ||
        e.key.length > 1 && e.key !== 'Backspace'
      ) {
        return
      }

      e.preventDefault()

      if (e.key === 'Backspace') {
        setTyped((prev) => prev.slice(0, -1))
        return
      }

      const nextTyped = typed + e.key
      if (!startTime) {
        setStartTime(Date.now())
      }

      if (e.key !== text[typed.length]) {
        setErrors((prev) => prev + 1)
      }

      setTyped(nextTyped)

      if (nextTyped.length === text.length) {
        setFinished(true)
      }
    },
    [typed, text, startTime, finished, reset]
  )

  const chars = text.split('').map((char, i) => {
    let className = 'char '
    if (i < typed.length) {
      className += typed[i] === char ? 'correct' : 'incorrect'
    } else if (i === typed.length) {
      className += 'current'
    } else {
      className += 'untyped'
    }
    return (
      <span key={i} className={className}>
        {char}
      </span>
    )
  })

  return (
    <div className="app">
      <h1>touchytipy</h1>

      <div className="stats">
        <div className="stat">
          <span className="stat-value">{wpm}</span>
          <span className="stat-label">WPM</span>
        </div>
        <div className="stat">
          <span className="stat-value">{accuracy}%</span>
          <span className="stat-label">Accuracy</span>
        </div>
        <div className="stat">
          <span className="stat-value">
            {typed.length}/{text.length}
          </span>
          <span className="stat-label">Progress</span>
        </div>
        {pb && (
          <div className="stat pb">
            <span className="stat-value">{pb.wpm}</span>
            <span className="stat-label">PB WPM</span>
          </div>
        )}
      </div>

      {!finished ? (
        <>
          <div
            ref={displayRef}
            className="text-display"
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            {chars}
          </div>
          <p className="hint">Click the text area and start typing. Press Tab or Esc to reset.</p>
        </>
      ) : (
        <div className="results">
          {isNewPB ? <h2 className="new-pb">New Personal Best!</h2> : <h2>Complete!</h2>}
          <div className="results-stats">
            <div className="stat">
              <span className="stat-value">{wpm}</span>
              <span className="stat-label">WPM</span>
            </div>
            <div className="stat">
              <span className="stat-value">{accuracy}%</span>
              <span className="stat-label">Accuracy</span>
            </div>
            <div className="stat">
              <span className="stat-value">{errors}</span>
              <span className="stat-label">Errors</span>
            </div>
          </div>
          {pb && !isNewPB && (
            <p className="pb-reminder">Your PB: {pb.wpm} WPM ({pb.accuracy}% accuracy)</p>
          )}
          <button className="btn" onClick={reset}>
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}

export default App
