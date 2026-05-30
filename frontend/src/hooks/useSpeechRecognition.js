import { useCallback, useEffect, useRef } from "react";

/*
 * Sets up the Web Speech Recognition API (webkitSpeechRecognition).
 * Exposes startMic and stopMic controls.
 * Appends recognised transcript to the provided setter.
 *
 * @param {(transcript: string) => void} onTranscript
 * @param {React.MutableRefObject<boolean>} isAIPlayingRef
 * @returns {{ startMic, stopMic, isSupported }}
 */
const useSpeechRecognition = (onTranscript, isAIPlayingRef) => {
  const recognitionRef = useRef(null);
  const isSupported = "webkitSpeechRecognition" in window;

  // Initialise recognition once on mount
  useEffect(() => {
    if (!isSupported) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      onTranscript((prev) => prev + " " + transcript);
    };

    recognition.onerror = (event) => {
      // Ignore "no-speech" — it fires naturally when user is silent
      if (event.error !== "no-speech") {
        console.error("Speech recognition error:", event.error);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [isSupported, onTranscript]);

  /*
   * Starts mic only if AI is not currently speaking.
   * Guards against double-start errors with try/catch.
   */
  const startMic = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isAIPlayingRef.current) return; // never start while AI speaks

    try {
      recognitionRef.current.start();
    } catch (error) {
      // Already started — safe to ignore
      if (error.name !== "InvalidStateError") {
        console.error("startMic error:", error);
      }
    }
  }, [isAIPlayingRef]);

  const stopMic = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error("stopMic error:", error);
    }
  }, []);

  return { startMic, stopMic, isSupported };
};

export default useSpeechRecognition;
