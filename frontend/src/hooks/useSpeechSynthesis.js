import { useCallback, useEffect, useRef, useState } from "react";

/*
 * Handles Web Speech API synthesis — voice loading, speaking,
 * subtitle display, video avatar control, and AI playing state.
 *
 * @param {React.RefObject} videoRef - ref attached to the AI avatar <video>
 * @returns {{ speakText, isAIPlaying, subtitle, voiceGender }}
 */
const useSpeechSynthesis = (videoRef) => {
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voiceGender, setVoiceGender] = useState("female");
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [subtitle, setSubtitle] = useState("");

  // Ref so speakText.onend always reads the latest isAIPlaying
  // without needing it as a closure dependency
  const isAIPlayingRef = useRef(false);

  // Keep ref in sync with state
  useEffect(() => {
    isAIPlayingRef.current = isAIPlaying;
  }, [isAIPlaying]);

  // Load available voices and pick female → male → first available
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      const femaleVoice = voices.find((v) =>
        ["zara", "samantha", "female"].some((kw) =>
          v.name.toLowerCase().includes(kw),
        ),
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      const maleVoice = voices.find((v) =>
        ["david", "mark", "male"].some((kw) =>
          v.name.toLowerCase().includes(kw),
        ),
      );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  /*
   * Speaks the given text using the Web Speech API.
   * Pauses mic automatically while speaking.
   * Returns a Promise that resolves when speech ends.
   *
   * @param {string} text
   * @param {() => void} onSpeechEnd - called when utterance finishes
   */
  const speakText = useCallback(
    (text, onSpeechEnd) => {
      return new Promise((resolve) => {
        if (!window.speechSynthesis || !selectedVoice) {
          resolve();
          return;
        }

        window.speechSynthesis.cancel();

        // Add natural pauses
        const humanText = text.replace(/,/g, ", ...").replace(/\./g, ". ... ");

        const utterance = new SpeechSynthesisUtterance(humanText);
        utterance.voice = selectedVoice;
        utterance.rate = 0.92;
        utterance.pitch = 1.05;
        utterance.volume = 1;

        utterance.onstart = () => {
          setIsAIPlaying(true);
          isAIPlayingRef.current = true;
          setSubtitle(text);
          videoRef.current?.play();
        };

        utterance.onend = () => {
          setIsAIPlaying(false);
          isAIPlayingRef.current = false;
          videoRef.current?.pause();
          if (videoRef.current) videoRef.current.currentTime = 0;

          // Notify Interview component to restart mic if needed
          onSpeechEnd?.();

          setTimeout(() => {
            setSubtitle("");
            resolve();
          }, 300);
        };

        utterance.onerror = () => {
          setIsAIPlaying(false);
          isAIPlayingRef.current = false;
          resolve();
        };

        window.speechSynthesis.speak(utterance);
      });
    },
    [selectedVoice, videoRef],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return {
    speakText,
    isAIPlaying,
    isAIPlayingRef,
    subtitle,
    voiceGender,
    isVoiceReady: !!selectedVoice,
  };
};

export default useSpeechSynthesis;
