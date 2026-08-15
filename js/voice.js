// js/voice.js

let selectedVoice = null;
let availableVoices = [];


// ==========================================
// LOAD SARA VOICES
// ==========================================

function loadVoices() {

  availableVoices =
    window.speechSynthesis.getVoices();

  if (!availableVoices.length) return;

  const saved =
    localStorage.getItem("saraVoice");

  if (saved) {

    const savedVoice =
      availableVoices.find(
        voice => voice.name === saved
      );

    if (savedVoice) {
      selectedVoice = savedVoice;
      return;
    }
  }

  // Hindi / Indian voice ko preference
  const preferred =
    availableVoices.find(
      voice =>
        /hi-IN|hindi/i.test(voice.lang)
    );

  selectedVoice =
    preferred || availableVoices[0];
}

window.speechSynthesis.onvoiceschanged =
  loadVoices;

loadVoices();


// ==========================================
// SARA SPEAK
// ==========================================

export function speak(text, mood = "normal") {

  return new Promise(resolve => {

    if (!text) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = "hi-IN";
    }

    // Mood ke hisaab se voice
    switch (mood) {

      case "happy":
        utterance.rate = 1.02;
        utterance.pitch = 1.12;
        break;

      case "sad":
        utterance.rate = 0.88;
        utterance.pitch = 0.95;
        break;

      case "annoyed":
        utterance.rate = 0.92;
        utterance.pitch = 0.98;
        break;

      case "excited":
        utterance.rate = 1.08;
        utterance.pitch = 1.15;
        break;

      default:
        utterance.rate = 0.95;
        utterance.pitch = 1.05;
    }

    utterance.volume = 1;

    utterance.onend = () => {
      resolve();
    };

    utterance.onerror = () => {
      resolve();
    };

    window.speechSynthesis.speak(
      utterance
    );

  });
}


// ==========================================
// STOP SARA
// ==========================================

export function stopSpeaking() {

  window.speechSynthesis.cancel();

}


// ==========================================
// GET VOICES
// ==========================================

export function getVoices() {

  return availableVoices;
}


// ==========================================
// SELECT VOICE
// ==========================================

export function selectVoice(index) {

  if (
    index < 0 ||
    index >= availableVoices.length
  ) {
    return false;
  }

  selectedVoice =
    availableVoices[index];

  localStorage.setItem(
    "saraVoice",
    selectedVoice.name
  );

  return true;
}


// ==========================================
// VOICE PREVIEW
// ==========================================

export function previewVoice(index) {

  if (
    index < 0 ||
    index >= availableVoices.length
  ) {
    return;
  }

  const voice =
    availableVoices[index];

  const preview =
    new SpeechSynthesisUtterance(
      "Haan, main Sara hoon. Tumse milkar accha laga."
    );

  preview.voice = voice;
  preview.lang = voice.lang || "hi-IN";
  preview.rate = 0.95;
  preview.pitch = 1.08;

  window.speechSynthesis.cancel();

  window.speechSynthesis.speak(
    preview
  );
}


// ==========================================
// LISTEN TO USER
// ==========================================

export function listen() {

  return new Promise((resolve, reject) => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

      reject(
        new Error(
          "Voice recognition is not supported."
        )
      );

      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "hi-IN";

    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.maxAlternatives = 1;


    recognition.onresult =
      event => {

        const text =
          event.results[0][0].transcript;

        resolve(text);
      };


    recognition.onerror =
      event => {

        reject(
          new Error(
            event.error || "Voice error"
          )
        );
      };


    recognition.onend =
      () => {

        // Recognition naturally ends here.
      };


    recognition.start();

  });
}
