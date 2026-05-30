// import { motion } from "motion/react";
// import { useEffect, useRef, useState } from "react";
// import { BsArrowRight } from "react-icons/bs";
// import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
// import { useDispatch, useSelector } from "react-redux";
// import femaleVideo from "../assets/Videos/female-ai.mp4";
// import maleVideo from "../assets/Videos/male-ai.mp4";
// import {
//   finishInterview,
//   submitAnswer,
// } from "../redux/reducers/interviewReducer";
// import Timer from "./Timer";

// const Interview = () => {
//   const dispatch = useDispatch();

//   const { interviewId, questions } = useSelector(
//     (state) => state.interviewReducer,
//   );

//   const { userInfo } = useSelector((state) => state.userReducer);
//   const userName = userInfo?.name ?? "there";

//   const [isIntroPhase, setIsIntroPhase] = useState(true);
//   const [isMicOn, setIsMicOn] = useState(true);
//   const recognitionRef = useRef(null);
//   const [isAIPlaying, setIsAIPlaying] = useState(false);

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [answer, setAnswer] = useState("");
//   const [feedback, setFeedback] = useState("");
//   const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);
//   const [selectedVoice, setSelectedVoice] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [voiceGender, setVoiceGender] = useState("female");
//   const [subtitle, setSubtitle] = useState("");

//   const videoRef = useRef(null);
//   const currentQuestion = questions[currentIndex];

//   useEffect(() => {
//     const loadVoices = () => {
//       const voices = window.speechSynthesis.getVoices();
//       if (!voices.length) return;

//       const femaleVoice = voices.find(
//         (v) =>
//           v.name.toLowerCase().includes("zara") ||
//           v.name.toLowerCase().includes("samantha") ||
//           v.name.toLowerCase().includes("female"),
//       );

//       if (femaleVoice) {
//         setSelectedVoice(femaleVoice);
//         setVoiceGender("female");
//         return;
//       }

//       const maleVoice = voices.find(
//         (v) =>
//           v.name.toLowerCase().includes("david") ||
//           v.name.toLowerCase().includes("mark") ||
//           v.name.toLowerCase().includes("male"),
//       );

//       if (maleVoice) {
//         setSelectedVoice(maleVoice);
//         setVoiceGender("male");
//         return;
//       }

//       setSelectedVoice(voices[0]);
//       setVoiceGender("female");
//     };

//     loadVoices();
//     window.speechSynthesis.onvoiceschanged = loadVoices;
//   }, []);

//   const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

//   /* -------------------- SPEAK FUNCTION ------------------- */

//   const startMic = () => {
//     if (recognitionRef.current && !isAIPlaying) {
//       try {
//         recognitionRef.current.start();
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   };

//   const stopMic = () => {
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//     }
//   };

//   const speakText = (text) => {
//     return new Promise((resolve) => {
//       if (!window.speechSynthesis || !selectedVoice) {
//         resolve();
//         return;
//       }

//       window.speechSynthesis.cancel();

//       const humanText = text.replace(/,/g, ", ...").replace(/\./g, ". ... ");
//       const utterance = new SpeechSynthesisUtterance(humanText);

//       utterance.voice = selectedVoice;
//       utterance.rate = 0.92;
//       utterance.pitch = 1.05;
//       utterance.volume = 1;

//       utterance.onstart = () => {
//         setIsAIPlaying(true);
//         stopMic();
//         videoRef.current?.play();
//       };

//       utterance.onend = () => {
//         videoRef.current?.pause();
//         videoRef.current.currentTime = 0;
//         setIsAIPlaying(false);

//         if (isMicOn) startMic();

//         setTimeout(() => {
//           setSubtitle("");
//           resolve();
//         }, 300);
//       };

//       setSubtitle(text);
//       window.speechSynthesis.speak(utterance);
//     });
//   };

//   useEffect(() => {
//     if (!selectedVoice) return;

//     const runIntro = async () => {
//       if (isIntroPhase) {
//         await speakText(
//           `Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`,
//         );
//         await speakText(
//           "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin",
//         );
//         setIsIntroPhase(false);
//       } else if (currentQuestion) {
//         await new Promise((r) => setTimeout(r, 800));

//         if (currentIndex === questions.length - 1) {
//           await speakText("Alright, this one might be a bit more challenging.");
//         }

//         await speakText(currentQuestion.question);

//         if (isMicOn) startMic();
//       }
//     };

//     runIntro();
//   }, [selectedVoice, isIntroPhase, currentIndex]);

//   useEffect(() => {
//     if (isIntroPhase) return;
//     if (!currentQuestion) return;

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [isIntroPhase, currentIndex]);

//   useEffect(() => {
//     if (!isIntroPhase && currentQuestion) {
//       setTimeLeft(currentQuestion.timeLimit || 60);
//     }
//   }, [currentIndex]);

//   useEffect(() => {
//     if (!("webkitSpeechRecognition" in window)) return;

//     const recognition = new window.webkitSpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.continuous = true;
//     recognition.interimResults = false;

//     recognition.onresult = (event) => {
//       const transcript = event.results[event.results.length - 1][0].transcript;
//       setAnswer((prev) => prev + " " + transcript);
//     };

//     recognitionRef.current = recognition;
//   }, []);

//   const toggleMic = () => {
//     if (isMicOn) stopMic();
//     else startMic();
//     setIsMicOn(!isMicOn);
//   };

//   const handleSubmitAnswer = async () => {
//     if (isSubmitting) return;
//     stopMic();
//     setIsSubmitting(true);

//     const result = await dispatch(
//       submitAnswer({
//         interviewId,
//         questionIndex: currentIndex,
//         answer,
//         timeTaken: currentQuestion.timeLimit - timeLeft,
//       }),
//     );

//     if (submitAnswer.fulfilled.match(result)) {
//       const feedbackText = result.payload.feedback;
//       setFeedback(feedbackText);
//       speakText(feedbackText);
//     }

//     setIsSubmitting(false);
//   };

//   const handleNext = async () => {
//     setAnswer("");
//     setFeedback("");

//     if (currentIndex + 1 >= questions.length) {
//       handleFinishInterview();
//       return;
//     }

//     await speakText("Alright, let's move to the next question.");
//     setCurrentIndex(currentIndex + 1);

//     setTimeout(() => {
//       if (isMicOn) startMic();
//     }, 500);
//   };

//   const handleFinishInterview = async () => {
//     stopMic();
//     setIsMicOn(false);

//     dispatch(finishInterview({ interviewId }));
//     // InterviewPage's useEffect watches store.report and moves to step 3 automatically
//   };

//   useEffect(() => {
//     if (isIntroPhase) return;
//     if (!currentQuestion) return;

//     if (timeLeft === 0 && !isSubmitting && !feedback) {
//       handleSubmitAnswer();
//     }
//   }, [timeLeft]);

//   useEffect(() => {
//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//         recognitionRef.current.abort();
//       }
//       window.speechSynthesis.cancel();
//     };
//   }, []);

//   return (
//     <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-red-500 flex items-center justify-center p-4 sm:p-6">
//       <div className="w-full max-w-350 min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-auto">
//         {/* VIDEO SECTION */}
//         <div className="w-full lg:w-[35%] bg-white flex flex-col items-center p-6 space-y-6 border-r border-gray-200">
//           <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl">
//             <video
//               src={videoSource}
//               key={videoSource}
//               ref={videoRef}
//               muted
//               playsInline
//               preload="auto"
//               className="w-full h-auto object-cover"
//             />
//           </div>

//           {subtitle && (
//             <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
//               <p className="text-gray-700 text-sm sm:text-base font-medium text-center leading-relaxed">
//                 {subtitle}
//               </p>
//             </div>
//           )}

//           <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5">
//             <div className="flex justify-around items-center">
//               <span className="text-sm text-gray-500">Interview Status</span>
//               {isAIPlaying && (
//                 <span className="text-sm font-semibold text-red-600">
//                   AI Speaking
//                 </span>
//               )}
//             </div>

//             <div className="h-px bg-gray-200"></div>

//             <div className="flex justify-center">
//               <Timer
//                 timeLeft={timeLeft}
//                 totalTime={currentQuestion?.timeLimit || 60}
//               />
//             </div>

//             <div className="h-px bg-gray-200"></div>

//             <div className="grid grid-cols-2 gap-6 text-center">
//               <div>
//                 <span className="text-2xl font-bold text-red-600">
//                   {currentIndex + 1}
//                 </span>
//                 <span className="text-xs text-gray-400">Current Question</span>
//               </div>
//               <div>
//                 <span className="text-2xl font-bold text-red-600">
//                   {questions.length}
//                 </span>
//                 <span className="text-xs text-gray-400">Total Questions</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* TEXT SECTION */}
//         <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative">
//           <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-6">
//             AI Smart Interview
//           </h2>

//           {!isIntroPhase && (
//             <div className="relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
//               <p className="text-xs sm:text-sm text-gray-400 mb-2">
//                 Question {currentIndex + 1} of {questions.length}
//               </p>
//               <div className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed">
//                 {currentQuestion?.question}
//               </div>
//             </div>
//           )}

//           <textarea
//             placeholder="Type your answer here..."
//             onChange={(e) => setAnswer(e.target.value)}
//             value={answer}
//             className="flex-1 bg-gray-100 p-4 sm:p-6 rounded-2xl resize-none outline-none border border-gray-200 focus:ring-2 focus:ring-red-500 transition text-gray-800"
//           />

//           {!feedback ? (
//             <div className="flex items-center gap-4 mt-6">
//               <motion.button
//                 onClick={toggleMic}
//                 whileTap={{ scale: 0.9 }}
//                 className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black text-white shadow-lg"
//               >
//                 {isMicOn ? (
//                   <FaMicrophone size={20} />
//                 ) : (
//                   <FaMicrophoneSlash size={20} />
//                 )}
//               </motion.button>

//               <motion.button
//                 onClick={handleSubmitAnswer}
//                 disabled={isSubmitting}
//                 whileTap={{ scale: 0.95 }}
//                 className="flex-1 bg-linear-to-r from-red-600 to-red-500 text-white py-3 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 transition font-semibold disabled:bg-gray-500"
//               >
//                 {isSubmitting ? "Submitting..." : "Submit Answer"}
//               </motion.button>
//             </div>
//           ) : (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="mt-6 bg-red-50 border border-red-200 p-5 rounded-2xl shadow-sm"
//             >
//               <p className="text-red-700 font-medium mb-4">{feedback}</p>

//               <button
//                 onClick={handleNext}
//                 className="w-full bg-linear-to-r from-red-600 to-red-500 text-white py-3 rounded-xl shadow-md hover:opacity-90 transition flex items-center justify-center gap-1"
//               >
//                 Next Question <BsArrowRight size={18} />
//               </button>
//             </motion.div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Interview;

import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import femaleVideo from "../assets/Videos/female-ai.mp4";
import maleVideo from "../assets/Videos/male-ai.mp4";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import useSpeechSynthesis from "../hooks/useSpeechSynthesis";
import {
  finishInterview,
  submitAnswer,
} from "../redux/reducers/interviewReducer";
import Timer from "./Timer";

const Interview = () => {
  const dispatch = useDispatch();

  const { interviewId, questions } = useSelector(
    (state) => state.interviewReducer,
  );

  // Pull userName from the correct slice
  const { userInfo } = useSelector((state) => state.userReducer);
  const userName = userInfo?.name ?? "there";

  // ── Question flow state ──────────────────────────────────────
  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Mic toggle state + ref (ref avoids stale closures in callbacks) ──
  const [isMicOn, setIsMicOn] = useState(true);
  const isMicOnRef = useRef(true);
  useEffect(() => {
    isMicOnRef.current = isMicOn;
  }, [isMicOn]);

  // ── Video ref passed into speech synthesis hook ───────────────
  const videoRef = useRef(null);

  // ── Speech synthesis ──────────────────────────────────────────
  const {
    speakText,
    isAIPlaying,
    isAIPlayingRef,
    subtitle,
    voiceGender,
    isVoiceReady,
  } = useSpeechSynthesis(videoRef);

  // ── Speech recognition ────────────────────────────────────────
  // onSpeechEnd is passed to speakText so mic restarts after AI finishes
  const handleTranscript = useCallback((updater) => setAnswer(updater), []);
  const { startMic, stopMic, isSupported } = useSpeechRecognition(
    handleTranscript,
    isAIPlayingRef,
  );

  // Callback passed to speakText — runs after each utterance ends
  const onSpeechEnd = useCallback(() => {
    if (isMicOnRef.current) startMic();
  }, [startMic]);

  const currentQuestion = questions[currentIndex];
  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  // ── Timer — single effect handles both reset and countdown ───
  const [timeLeft, setTimeLeft] = useState(currentQuestion?.timeLimit || 60);

  useEffect(() => {
    if (isIntroPhase || !currentQuestion) return;

    // Reset first, then start counting
    setTimeLeft(currentQuestion.timeLimit || 60);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex, currentQuestion]);

  // ── Intro + question narration ────────────────────────────────
  useEffect(() => {
    if (!isVoiceReady) return;

    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`,
          onSpeechEnd,
        );
        await speakText(
          "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin",
          onSpeechEnd,
        );
        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise((r) => setTimeout(r, 800));

        if (currentIndex === questions.length - 1) {
          await speakText(
            "Alright, this one might be a bit more challenging.",
            onSpeechEnd,
          );
        }

        await speakText(currentQuestion.question, onSpeechEnd);

        if (isMicOnRef.current) startMic();
      }
    };

    runIntro();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVoiceReady, isIntroPhase, currentIndex]);

  // ── Auto-submit when timer hits 0 ────────────────────────────
  useEffect(() => {
    if (isIntroPhase || !currentQuestion) return;
    if (timeLeft === 0 && !isSubmitting && !feedback) {
      handleSubmitAnswer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // ── Cleanup on unmount ────────────────────────────────────────
  useEffect(() => {
    return () => stopMic();
  }, [stopMic]);

  // ── Handlers ─────────────────────────────────────────────────
  const toggleMic = () => {
    if (isMicOn) stopMic();
    else startMic();
    setIsMicOn((prev) => !prev);
  };

  const handleSubmitAnswer = async () => {
    if (isSubmitting) return;
    stopMic();
    setIsSubmitting(true);

    const result = await dispatch(
      submitAnswer({
        interviewId,
        questionIndex: currentIndex,
        answer,
        timeTaken: currentQuestion.timeLimit - timeLeft,
      }),
    );

    if (submitAnswer.fulfilled.match(result)) {
      const feedbackText = result.payload.feedback;
      setFeedback(feedbackText);
      await speakText(feedbackText, onSpeechEnd);
    }

    setIsSubmitting(false);
  };

  const handleNext = async () => {
    setAnswer("");
    setFeedback("");

    if (currentIndex + 1 >= questions.length) {
      handleFinishInterview();
      return;
    }

    await speakText("Alright, let's move to the next question.", onSpeechEnd);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleFinishInterview = async () => {
    stopMic();
    setIsMicOn(false);

    await speakText(
      "Thank you for taking this session. You did a great job. Here is your final performance report.",
      null,
    );

    // Optional: give user 1s to read the subtitle before redirect
    await new Promise((r) => setTimeout(r, 1000));
    dispatch(finishInterview({ interviewId }));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-red-500 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-350 min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-auto">
        {/* VIDEO SECTION */}
        <div className="w-full lg:w-[35%] bg-white flex flex-col items-center p-6 space-y-6 border-r border-gray-200">
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl">
            <video
              src={videoSource}
              key={videoSource}
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              aria-label="AI interviewer avatar"
              className="w-full h-auto object-cover"
            />
          </div>

          {subtitle && (
            <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-gray-700 text-sm sm:text-base font-medium text-center leading-relaxed">
                {subtitle}
              </p>
            </div>
          )}

          <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5">
            <div className="flex justify-center items-center gap-2">
              <span className="text-sm text-gray-500">Interview Status</span>
              {isAIPlaying && (
                <span className="text-sm font-semibold text-red-600">
                  AI Speaking
                </span>
              )}
            </div>

            <div className="h-px bg-gray-200" />

            <div className="flex justify-center">
              <Timer
                timeLeft={timeLeft}
                totalTime={currentQuestion?.timeLimit || 60}
              />
            </div>

            <div className="h-px bg-gray-200" />

            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-red-600">
                  {currentIndex + 1}
                </span>
                <span className="text-xs text-gray-400">Current Question</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-red-600">
                  {questions.length}
                </span>
                <span className="text-xs text-gray-400">Total Questions</span>
              </div>
            </div>
          </div>
        </div>

        {/* TEXT SECTION */}
        <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative">
          <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-6">
            AI Smart Interview
          </h2>

          {!isIntroPhase && currentQuestion && (
            <div className="flex-1 flex flex-col gap-6">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-sm">
                <p className="text-gray-800 text-base sm:text-lg font-medium leading-relaxed">
                  {currentQuestion.question}
                </p>
              </div>

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Your answer will appear here as you speak, or type manually..."
                rows={6}
                className="w-full border border-gray-200 rounded-2xl p-4 text-gray-700 text-sm sm:text-base resize-none focus:ring-2 focus:ring-red-400 outline-none transition"
              />

              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 rounded-2xl p-5 shadow-sm"
                >
                  <p className="text-green-800 text-sm sm:text-base leading-relaxed">
                    {feedback}
                  </p>
                </motion.div>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-auto">
                {/* Mic toggle */}
                {isSupported && (
                  <button
                    onClick={toggleMic}
                    aria-label={
                      isMicOn ? "Turn microphone off" : "Turn microphone on"
                    }
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                      isMicOn
                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {isMicOn ? (
                      <FaMicrophone size={14} />
                    ) : (
                      <FaMicrophoneSlash size={14} />
                    )}
                    {isMicOn ? "Mic On" : "Mic Off"}
                  </button>
                )}

                {/* Submit */}
                {!feedback && (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={isSubmitting || !answer.trim()}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-5 py-2 rounded-full text-sm font-semibold transition"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Answer"}
                  </button>
                )}

                {/* Next / Finish */}
                {feedback && (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition"
                  >
                    {currentIndex + 1 >= questions.length
                      ? "Finish Interview"
                      : "Next Question"}
                    <BsArrowRight />
                  </button>
                )}
              </div>
            </div>
          )}

          {isIntroPhase && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400 text-base animate-pulse">
                AI is introducing the session...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interview;
