import { PHONETIC_MAP } from '../data/wordSets';

let cachedVoices: SpeechSynthesisVoice[] = [];

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    cachedVoices = voices;
  }
  return cachedVoices;
}

// Select the best warm, child-friendly English voice
export function getBestEnglishVoice(): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  if (!voices || voices.length === 0) return null;

  // Preferred friendly voices
  const preferredNames = [
    'Samantha',
    'Victoria',
    'Karen',
    'Moira',
    'Google US English',
    'Microsoft Jenny Online (Natural) - English (United States)',
    'Microsoft Aria Online (Natural) - English (United States)',
    'Microsoft Zira',
    'Natural',
  ];

  for (const name of preferredNames) {
    const found = voices.find(
      (v) => v.name.toLowerCase().includes(name.toLowerCase()) && v.lang.startsWith('en')
    );
    if (found) return found;
  }

  // Fallback to any en-US voice
  const usVoice = voices.find((v) => v.lang === 'en-US' || v.lang.startsWith('en-US'));
  if (usVoice) return usVoice;

  // Fallback to any en voice
  const enVoice = voices.find((v) => v.lang.startsWith('en'));
  if (enVoice) return enVoice;

  return voices[0] || null;
}

/**
 * Phonetic respelling helper function to force nonsense and tricky words
 * to be read as natural, blendable English phonetic syllables, NOT spelled out.
 */
export function getPhoneticSpelling(rawWord: string): string {
  const clean = rawWord.trim().toLowerCase().replace(/[^a-z]/g, '');
  
  // 1. Direct dictionary mapping for all 11 sets
  if (PHONETIC_MAP[clean]) {
    return PHONETIC_MAP[clean];
  }

  // 2. Dynamic heuristic respelling for any other pseudo-words
  // Avoid abbreviation spelling (e.g. 3-letter CVC words like "wob", "dit")
  if (/^[bcdfghjklmnpqrstvwxyz][aeiou][bcdfghjklmnpqrstvwxyz]$/.test(clean)) {
    const c1 = clean[0];
    const v = clean[1];
    const c2 = clean[2];
    
    // Convert short vowel to explicit respelling
    if (v === 'o') return `${c1}ah${c2}`; // "tob" -> "tahb"
    if (v === 'i') return `${c1}i${c2}${c2}`; // "mip" -> "mipp"
    if (v === 'u') return `${c1}u${c2}${c2}`; // "jum" -> "jumm"
    if (v === 'a') return `${c1}a${c2}${c2}`; // "yag" -> "yagg"
    if (v === 'e') return `${c1}e${c2}${c2}`; // "fet" -> "fett"
  }

  // Silent-e heuristic
  if (/^[bcdfghjklmnpqrstvwxyz]{1,2}[aeiou][bcdfghjklmnpqrstvwxyz]e$/.test(clean)) {
    return clean;
  }

  return clean;
}

export interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceURI?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

let activeUtterance: SpeechSynthesisUtterance | null = null;

export function speakPhoneticWord(
  displayWord: string,
  phoneticOverride?: string,
  options: SpeechOptions = {}
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    options.onError?.('Speech synthesis not supported');
    return;
  }

  const {
    rate = 0.85, // Recommended rate: 0.85 (clear, warm, child-friendly)
    pitch = 1.05, // Slightly warm, upbeat
    volume = 1.0,
    voiceURI,
    onStart,
    onEnd,
    onError,
  } = options;

  // Resolve phonetic text: Never show this to student, only pass to speech synthesis
  const speechText = phoneticOverride || getPhoneticSpelling(displayWord);

  try {
    window.speechSynthesis.cancel();

    // Chrome resume quirk workaround
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    // Assign voice
    const voices = getAvailableVoices();
    if (voiceURI) {
      const matched = voices.find((v) => v.voiceURI === voiceURI);
      if (matched) utterance.voice = matched;
    } else {
      const best = getBestEnglishVoice();
      if (best) utterance.voice = best;
    }

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      activeUtterance = null;
      onEnd?.();
    };

    utterance.onerror = (e) => {
      activeUtterance = null;
      console.warn('TTS error:', e);
      onError?.(e);
      onEnd?.();
    };

    activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('TTS execution error:', err);
    onError?.(err);
    onEnd?.();
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}

// ----------------- Web Audio API Sound Effects -----------------
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playChimeSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08); // E5
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.16); // G5

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  } catch {
    // Ignore audio errors
  }
}

export function playCorrectSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const playTone = (freq: number, start: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + start);
      gain.gain.setValueAtTime(0.12, now + start);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + dur);
    };

    playTone(587.33, 0, 0.12); // D5
    playTone(880.00, 0.1, 0.22); // A5
  } catch {
    // Ignore audio errors
  }
}

export function playCelebrationFanfare(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [
      { f: 523.25, t: 0, d: 0.12 }, // C5
      { f: 659.25, t: 0.12, d: 0.12 }, // E5
      { f: 783.99, t: 0.24, d: 0.15 }, // G5
      { f: 1046.50, t: 0.40, d: 0.45 }, // C6
    ];

    notes.forEach(({ f, t, d }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + t);
      gain.gain.setValueAtTime(0.15, now + t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + t);
      osc.stop(now + t + d);
    });
  } catch {
    // Ignore audio errors
  }
}
