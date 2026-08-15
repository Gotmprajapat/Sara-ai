// js/voice.js

let selectedVoice = null;

let availableVoices = [];


// ==========================================
// LOAD VOICES
// ==========================================

function loadVoices() {

  availableVoices =
    window.speechSynthesis.getVoices();

  if (!availableVoices.length) {
    return;
  }

  // Female / natural sounding Hindi voices ko
  // preference dene ki koshish
  const preferred =
    availableVoices.find(
      voice =>
        /female|zira|heera|google.*hindi|hindi/i
          .test(voice.name + " " + voice.lang)
    );

  selectedVoice =
    preferred || availableVoices[0];

}


// Browser voices late load kar sakta hai
window.speechSynthesis.onvoiceschanged =
  loadVoices;

loadVoices();


// ==========================================
// GET AVAILABLE VOICES
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
// RESTORE SAVED VOICE
// ==========================================

function restoreVoice() {

  const saved =
    localStorage.getItem("saraVoice");

  if (!saved) {
    return;
  }

  const voice =
    availableVoices.find(
      item => item.name === saved
    );

  if (voice) {
    selectedVoice = voice;
  }

}

setTimeout(
  restoreVoice,
  500
);


// ==========================================
// SPEAK
// ==========================================

export function speak(text) {

  return new Promise(
    resolve => {

      if (!text) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const utterance =
        new SpeechSynthesisUtterance(text);

      if (selectedVoice) {
        utterance.voice =
          selectedVoice;
      }

      // Hindi
      utterance.lang =
        selectedVoice?.lang || "hi-IN";

      // Natural speed
      utterance.rate = 0.95;

      // Female-like pitch
      utterance.pitch = 1.08;

      utterance.volume = 1;

      utterance.onend =
        () => resolve();

      utterance.onerror =
        () => resolve();

      window.speechSynthesis.speak(
        utterance
      );

    }
  );

}


// ==========================================
// STOP SPEAKING
// ==========================================

export function stopSpeaking() {

  window.speechSynthesis.cancel();

}


// ==========================================
// PREVIEW VOICE
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

  preview.lang =
    voice.lang || "hi-IN";

  preview.rate = 0.95;

  preview.pitch = 1.08;

  window.speechSynthesis.cancel();

  window.speechSynthesis.speak(
    preview
  );

}


// ==========================================
// CURRENT VOICE
// ==========================================

export function getSelectedVoice() {

  return selectedVoice;

}
