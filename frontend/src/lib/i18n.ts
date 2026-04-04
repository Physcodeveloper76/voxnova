// ─── Types ────────────────────────────────────────────────────────────────────
export type Language = "en" | "hi" | "mr";

// ─── Translation Dictionary ───────────────────────────────────────────────────
const dict = {
  en: {
    // Navbar
    nav_home: "Home",
    nav_deaf_mode: "Deaf Mode",
    nav_mute_mode: "Mute Mode",
    nav_both_mode: "Both Mode",
    nav_more: "More",
    nav_more_features: "More Features",
    nav_video: "Video",
    nav_learning: "Learning",
    nav_sign_up: "Sign Up",
    nav_log_out: "Log Out",
    nav_appearance: "Appearance",
    nav_language: "Language",
    nav_more_options: "More Options",

    // Home page — hero
    home_badge: "AI-Powered Accessibility",
    home_hero_pre: "Break every",
    home_hero_highlight: "communication",
    home_hero_post: "barrier",
    home_hero_desc:
      "VoxNova bridges the gap between sign language, speech, and text — making communication accessible to everyone, everywhere.",
    home_get_started: "Get Started",
    home_learn_more: "Learn More",

    // Home page — mode cards
    home_choose_mode: "Choose Your Mode",
    home_choose_mode_sub: "Select the accessibility tool that fits your needs",
    home_deaf_mode_title: "Deaf Mode",
    home_deaf_mode_desc:
      "Speech-to-text transcription and text-to-speech conversion with multi-language support.",
    home_mute_mode_title: "Mute Mode",
    home_mute_mode_desc:
      "Real-time sign language recognition using your camera powered by AI.",
    home_both_mode_title: "Both Mode",
    home_both_mode_desc:
      "Combined deaf and mute tools in a unified interface for complete accessibility.",

    // Home page — features strip
    home_why: "Why VoxNova?",
    home_realtime: "Real-Time",
    home_realtime_desc: "Instant recognition and translation",
    home_private: "Private",
    home_private_desc: "All processing is secure and safe",
    home_multilang: "Multi-Language",
    home_multilang_desc: "English, Hindi, and Marathi support",
    home_ai: "AI-Powered",
    home_ai_desc: "Advanced ML models for accuracy",
    home_footer: "© {year} VoxNova. Making communication accessible for all.",

    // Deaf mode page
    deaf_title: "Deaf Mode",
    deaf_stt_title: "Speech to Text",
    deaf_stt_unsupported: "Speech recognition is not supported in this browser.",
    deaf_stt_placeholder: "Start speaking to see transcription…",
    deaf_stt_stop: "Stop",
    deaf_stt_listen: "Listen",
    deaf_stt_clear: "Clear",
    deaf_stt_use_input: "Use as TTS Input",
    deaf_tts_title: "Text to Speech",
    deaf_tts_placeholder: "Type text to convert to speech…",
    deaf_translated: "Translated:",
    deaf_convert: "Convert to Speech",

    // Mute mode page
    mute_title: "Mute Mode",
    mute_model_offline: "Model is not loaded. Sign recognition is disabled.",
    mute_sign_title: "Sign Language Recognition",
    mute_recognized_label: "Recognized Sign",

    // Both mode page
    both_title: "Both Mode",
    both_stt_unsupported: "Speech recognition not supported.",
    both_stt_placeholder: "Speak to transcribe…",
    both_stop: "Stop",
    both_listen: "Listen",
    both_clear: "Clear",
    both_to_tts: "→ TTS",
    both_tts_placeholder: "Type text…",
    both_translated: "Translated:",
    both_convert: "Convert",
    both_sign_title: "Sign Recognition",
    both_model_offline: "Model not loaded — camera disabled.",
    both_recognized_label: "Recognized",

    // More features page
    more_title: "More Features",
    feat_ai_title: "AI Sign Detection",
    feat_ai_desc:
      "Deep learning models recognize sign language in real-time from your webcam.",
    feat_lang_title: "Multi-Language TTS",
    feat_lang_desc:
      "Convert text to speech in English, Hindi, and Marathi with natural voices.",
    feat_video_title: "Live Camera Feed",
    feat_video_desc:
      "Seamless webcam integration with frame-by-frame analysis.",
    feat_speech_title: "Speech Recognition",
    feat_speech_desc:
      "Browser-native speech-to-text for instant transcription.",
    feat_offline_title: "Offline Ready",
    feat_offline_desc:
      "Core features work with minimal connectivity requirements.",
    feat_access_title: "Fully Accessible",
    feat_access_desc:
      "Keyboard navigation, high contrast, and screen reader support.",

    // Video page
    video_title: "Video Resources",
    video_live_title: "Live Streaming",
    video_live_desc:
      "Access high-quality sign language translation video streams in real-time.",
    video_tutorial_title: "Tutorial Libraries",
    video_tutorial_desc:
      "Watch guided videos designed to teach sign language effectively.",
    video_player_title: "Interactive Player",
    video_player_desc:
      "Control playback speed and loop specific signs for better comprehension.",
    video_player_heading: "Interactive Video Player",
    video_placeholder_desc:
      "This space is reserved for the upcoming interactive sign language video player.",

    // Learning page
    learning_title: "Learning Center",
    learning_hero_title: "Master Sign Language",
    learning_hero_desc:
      "Embark on a comprehensive learning journey with our interactive curriculum designed for all skill levels.",
    learning_start: "Start Learning Now",
    learning_modules: "Available Modules",
    learning_beginner_title: "Beginner Course",
    learning_beginner_desc:
      "Start from the basics and learn the alphabet alongside common greetings.",
    learning_grammar_title: "Grammar & Structure",
    learning_grammar_desc:
      "Understand the visual and grammatical rules of sign language syntax.",
    learning_advanced_title: "Advanced Vocabulary",
    learning_advanced_desc:
      "Expand your communication skills with specialized vocabulary lessons.",

    // Register / Login page
    register_title: "Register",
    login_title: "Sign In",
    register_email: "Email",
    register_password: "Password",
    register_create_btn: "Create Account",
    register_signin_btn: "Sign In",
    register_no_account: "Don't have an account? ",
    register_have_account: "Already have an account? ",
    register_sign_up_link: "Sign Up",
    register_sign_in_link: "Sign In",

    // 404 page
    notfound_message: "Oops! Page not found",
    notfound_return: "Return to Home",

    // Dataset panel
    dataset_loading: "Loading dataset info…",
    dataset_error: "Failed to load dataset. Backend may be offline.",
    dataset_title: "Dataset",
    dataset_signs: "supported signs",

    // Camera capture
    camera_off: "Camera off",
    camera_error: "Camera permission denied or unavailable",
    camera_stop: "Stop Camera",
    camera_start: "Start Camera",

    // Audio player
    audio_output: "Audio Output",
    audio_autoplay_blocked: "Autoplay blocked — press play",
    audio_no_audio: "No audio yet",

    // Error banner
    error_dismiss: "Dismiss",

    // ISL Signer embed
    isl_title: "ISL 3D Signer",
    isl_open_full: "Open Full View",
    isl_hint:
      "Type or copy text in the signer and click Sign (A-Z letters). If model is missing, place `ybot.glb` in `ISL model/signing-portable/models/`.",

    // Status badge
    status_loaded: "Model Loaded",
    status_not_loaded: "Model Not Loaded",

    // Speech recognition errors
    stt_err_permission: "Microphone permission denied.",
    stt_err_service: "Speech service is blocked.",
    stt_err_network:
      "Speech service network error. Try Chrome/Edge, keep internet on, and retry.",
    stt_err_generic: "Speech error:",
  },

  // ─── Hindi ────────────────────────────────────────────────────────────────
  hi: {
    nav_home: "होम",
    nav_deaf_mode: "बधिर मोड",
    nav_mute_mode: "मूक मोड",
    nav_both_mode: "दोनों मोड",
    nav_more: "अधिक",
    nav_more_features: "अधिक सुविधाएं",
    nav_video: "वीडियो",
    nav_learning: "सीखें",
    nav_sign_up: "साइन अप",
    nav_log_out: "लॉग आउट",
    nav_appearance: "दिखावट",
    nav_language: "भाषा",
    nav_more_options: "अधिक विकल्प",

    home_badge: "AI-संचालित पहुँच",
    home_hero_pre: "हर",
    home_hero_highlight: "संचार",
    home_hero_post: "बाधा तोड़ें",
    home_hero_desc:
      "VoxNova सांकेतिक भाषा, वाणी और पाठ के बीच की खाई को पाटता है — संचार को सभी के लिए, हर जगह सुलभ बनाता है।",
    home_get_started: "शुरू करें",
    home_learn_more: "अधिक जानें",

    home_choose_mode: "अपना मोड चुनें",
    home_choose_mode_sub: "अपनी ज़रूरत के अनुसार पहुँच उपकरण चुनें",
    home_deaf_mode_title: "बधिर मोड",
    home_deaf_mode_desc:
      "बहुभाषी समर्थन के साथ वाक्-से-पाठ और पाठ-से-वाक् रूपांतरण।",
    home_mute_mode_title: "मूक मोड",
    home_mute_mode_desc:
      "AI द्वारा संचालित कैमरे का उपयोग करके वास्तविक समय में सांकेतिक भाषा पहचान।",
    home_both_mode_title: "दोनों मोड",
    home_both_mode_desc:
      "पूर्ण पहुँच के लिए एकीकृत इंटरफ़ेस में बधिर और मूक उपकरण।",

    home_why: "VoxNova क्यों?",
    home_realtime: "वास्तविक समय",
    home_realtime_desc: "त्वरित पहचान और अनुवाद",
    home_private: "निजी",
    home_private_desc: "सारी प्रक्रिया सुरक्षित",
    home_multilang: "बहुभाषी",
    home_multilang_desc: "अंग्रेजी, हिंदी और मराठी समर्थन",
    home_ai: "AI-संचालित",
    home_ai_desc: "सटीकता के लिए उन्नत ML मॉडल",
    home_footer: "© {year} VoxNova. संचार को सभी के लिए सुलभ बनाना।",

    deaf_title: "बधिर मोड",
    deaf_stt_title: "वाक् से पाठ",
    deaf_stt_unsupported: "इस ब्राउज़र में वाक् पहचान समर्थित नहीं है।",
    deaf_stt_placeholder: "लिप्यंतरण देखने के लिए बोलना शुरू करें…",
    deaf_stt_stop: "रोकें",
    deaf_stt_listen: "सुनें",
    deaf_stt_clear: "साफ़ करें",
    deaf_stt_use_input: "TTS इनपुट के रूप में उपयोग करें",
    deaf_tts_title: "पाठ से वाक्",
    deaf_tts_placeholder: "वाक् में बदलने के लिए पाठ टाइप करें…",
    deaf_translated: "अनुवादित:",
    deaf_convert: "वाक् में बदलें",

    mute_title: "मूक मोड",
    mute_model_offline: "मॉडल लोड नहीं है। सांकेतिक पहचान अक्षम है।",
    mute_sign_title: "सांकेतिक भाषा पहचान",
    mute_recognized_label: "पहचाना गया संकेत",

    both_title: "दोनों मोड",
    both_stt_unsupported: "वाक् पहचान समर्थित नहीं।",
    both_stt_placeholder: "लिप्यंतरण के लिए बोलें…",
    both_stop: "रोकें",
    both_listen: "सुनें",
    both_clear: "साफ़",
    both_to_tts: "→ TTS",
    both_tts_placeholder: "पाठ टाइप करें…",
    both_translated: "अनुवादित:",
    both_convert: "बदलें",
    both_sign_title: "संकेत पहचान",
    both_model_offline: "मॉडल लोड नहीं — कैमरा अक्षम।",
    both_recognized_label: "पहचाना गया",

    more_title: "अधिक सुविधाएं",
    feat_ai_title: "AI संकेत पहचान",
    feat_ai_desc:
      "डीप लर्निंग मॉडल वेबकैम से वास्तविक समय में सांकेतिक भाषा पहचानते हैं।",
    feat_lang_title: "बहुभाषी TTS",
    feat_lang_desc:
      "प्राकृतिक आवाज़ों के साथ अंग्रेजी, हिंदी और मराठी में टेक्स्ट से वाक् बनाएं।",
    feat_video_title: "लाइव कैमरा फ़ीड",
    feat_video_desc:
      "फ्रेम-दर-फ्रेम विश्लेषण के साथ निर्बाध वेबकैम एकीकरण।",
    feat_speech_title: "वाक् पहचान",
    feat_speech_desc:
      "तत्काल लिप्यंतरण के लिए ब्राउज़र-मूल वाक्-से-पाठ।",
    feat_offline_title: "ऑफलाइन तैयार",
    feat_offline_desc: "मुख्य सुविधाएं न्यूनतम कनेक्टिविटी के साथ काम करती हैं।",
    feat_access_title: "पूरी तरह सुलभ",
    feat_access_desc:
      "कीबोर्ड नेविगेशन, उच्च कंट्रास्ट और स्क्रीन रीडर समर्थन।",

    video_title: "वीडियो संसाधन",
    video_live_title: "लाइव स्ट्रीमिंग",
    video_live_desc:
      "वास्तविक समय में उच्च-गुणवत्ता वाले सांकेतिक भाषा अनुवाद वीडियो स्ट्रीम एक्सेस करें।",
    video_tutorial_title: "ट्यूटोरियल लाइब्रेरी",
    video_tutorial_desc:
      "सांकेतिक भाषा प्रभावी ढंग से सिखाने के लिए निर्देशित वीडियो देखें।",
    video_player_title: "इंटरेक्टिव प्लेयर",
    video_player_desc:
      "बेहतर समझ के लिए प्लेबैक गति नियंत्रित करें और विशिष्ट संकेतों को लूप करें।",
    video_player_heading: "इंटरेक्टिव वीडियो प्लेयर",
    video_placeholder_desc:
      "यह स्थान आगामी इंटरेक्टिव सांकेतिक भाषा वीडियो प्लेयर के लिए आरक्षित है।",

    learning_title: "सीखने का केंद्र",
    learning_hero_title: "सांकेतिक भाषा में महारत हासिल करें",
    learning_hero_desc:
      "सभी कौशल स्तरों के लिए डिज़ाइन किए गए हमारे इंटरेक्टिव पाठ्यक्रम के साथ एक व्यापक सीखने की यात्रा शुरू करें।",
    learning_start: "अभी सीखना शुरू करें",
    learning_modules: "उपलब्ध मॉड्यूल",
    learning_beginner_title: "शुरुआती पाठ्यक्रम",
    learning_beginner_desc:
      "मूल बातों से शुरू करें और वर्णमाला के साथ सामान्य अभिवादन सीखें।",
    learning_grammar_title: "व्याकरण और संरचना",
    learning_grammar_desc:
      "सांकेतिक भाषा वाक्य-विन्यास के दृश्य और व्याकरणिक नियमों को समझें।",
    learning_advanced_title: "उन्नत शब्दावली",
    learning_advanced_desc:
      "विशेष शब्दावली पाठों के साथ अपने संचार कौशल का विस्तार करें।",

    register_title: "पंजीकरण",
    login_title: "साइन इन",
    register_email: "ईमेल",
    register_password: "पासवर्ड",
    register_create_btn: "खाता बनाएं",
    register_signin_btn: "साइन इन",
    register_no_account: "खाता नहीं है? ",
    register_have_account: "पहले से खाता है? ",
    register_sign_up_link: "साइन अप",
    register_sign_in_link: "साइन इन",

    notfound_message: "माफ़ करें! पृष्ठ नहीं मिला",
    notfound_return: "होम पर वापस जाएं",

    dataset_loading: "डेटासेट जानकारी लोड हो रही है…",
    dataset_error: "डेटासेट लोड करने में विफल। बैकएंड ऑफ़लाइन हो सकता है।",
    dataset_title: "डेटासेट",
    dataset_signs: "समर्थित संकेत",

    camera_off: "कैमरा बंद",
    camera_error: "कैमरा अनुमति अस्वीकृत या अनुपलब्ध",
    camera_stop: "कैमरा बंद करें",
    camera_start: "कैमरा शुरू करें",

    audio_output: "ऑडियो आउटपुट",
    audio_autoplay_blocked: "ऑटोप्ले अवरुद्ध — प्ले दबाएं",
    audio_no_audio: "अभी तक कोई ऑडियो नहीं",

    error_dismiss: "बंद करें",

    isl_title: "ISL 3D साइनर",
    isl_open_full: "पूर्ण दृश्य खोलें",
    isl_hint:
      "साइनर में पाठ टाइप करें और Sign पर क्लिक करें (A-Z अक्षर)। यदि मॉडल अनुपलब्ध है, तो `ybot.glb` को `ISL model/signing-portable/models/` में रखें।",

    status_loaded: "मॉडल लोड हुआ",
    status_not_loaded: "मॉडल लोड नहीं हुआ",

    stt_err_permission: "माइक्रोफ़ोन अनुमति अस्वीकृत।",
    stt_err_service: "वाक् सेवा अवरुद्ध है।",
    stt_err_network:
      "वाक् सेवा नेटवर्क त्रुटि। Chrome/Edge आज़माएं, इंटरनेट चालू रखें और पुनः प्रयास करें।",
    stt_err_generic: "वाक् त्रुटि:",
  },

  // ─── Marathi ──────────────────────────────────────────────────────────────
  mr: {
    nav_home: "मुख्यपृष्ठ",
    nav_deaf_mode: "बधिर मोड",
    nav_mute_mode: "मूकबधिर मोड",
    nav_both_mode: "दोन्ही मोड",
    nav_more: "अधिक",
    nav_more_features: "अधिक वैशिष्ट्ये",
    nav_video: "व्हिडिओ",
    nav_learning: "शिका",
    nav_sign_up: "साइन अप",
    nav_log_out: "लॉग आउट",
    nav_appearance: "स्वरूप",
    nav_language: "भाषा",
    nav_more_options: "अधिक पर्याय",

    home_badge: "AI-चलित प्रवेशयोग्यता",
    home_hero_pre: "प्रत्येक",
    home_hero_highlight: "संवाद",
    home_hero_post: "अडथळा दूर करा",
    home_hero_desc:
      "VoxNova सांकेतिक भाषा, भाषण आणि मजकूर यांच्यातील अंतर कमी करतो — संवाद सर्वांसाठी, सर्वत्र सुलभ बनवतो।",
    home_get_started: "सुरुवात करा",
    home_learn_more: "अधिक जाणून घ्या",

    home_choose_mode: "आपला मोड निवडा",
    home_choose_mode_sub: "आपल्या गरजेनुसार प्रवेशयोग्यता साधन निवडा",
    home_deaf_mode_title: "बधिर मोड",
    home_deaf_mode_desc:
      "बहुभाषी समर्थनासह भाषण-ते-मजकूर आणि मजकूर-ते-भाषण रूपांतरण।",
    home_mute_mode_title: "मूकबधिर मोड",
    home_mute_mode_desc:
      "AI वापरून कॅमेऱ्याद्वारे रिअल-टाइम सांकेतिक भाषा ओळख।",
    home_both_mode_title: "दोन्ही मोड",
    home_both_mode_desc:
      "संपूर्ण प्रवेशयोग्यतेसाठी एकत्रित इंटरफेसमध्ये बधिर आणि मूक साधने।",

    home_why: "VoxNova का?",
    home_realtime: "रिअल-टाइम",
    home_realtime_desc: "त्वरित ओळख आणि भाषांतर",
    home_private: "खासगी",
    home_private_desc: "सर्व प्रक्रिया सुरक्षित",
    home_multilang: "बहुभाषी",
    home_multilang_desc: "इंग्रजी, हिंदी आणि मराठी समर्थन",
    home_ai: "AI-चलित",
    home_ai_desc: "अचूकतेसाठी प्रगत ML मॉडेल",
    home_footer: "© {year} VoxNova. संवाद सर्वांसाठी सुलभ बनवणे।",

    deaf_title: "बधिर मोड",
    deaf_stt_title: "भाषण ते मजकूर",
    deaf_stt_unsupported: "या ब्राउझरमध्ये भाषण ओळख समर्थित नाही।",
    deaf_stt_placeholder: "लिप्यंतरण पाहण्यासाठी बोलणे सुरू करा…",
    deaf_stt_stop: "थांबा",
    deaf_stt_listen: "ऐका",
    deaf_stt_clear: "साफ करा",
    deaf_stt_use_input: "TTS इनपुट म्हणून वापरा",
    deaf_tts_title: "मजकूर ते भाषण",
    deaf_tts_placeholder: "भाषणात रूपांतरित करण्यासाठी मजकूर टाइप करा…",
    deaf_translated: "भाषांतर:",
    deaf_convert: "भाषणात रूपांतरित करा",

    mute_title: "मूकबधिर मोड",
    mute_model_offline: "मॉडेल लोड नाही. संकेत ओळख अक्षम आहे।",
    mute_sign_title: "सांकेतिक भाषा ओळख",
    mute_recognized_label: "ओळखलेले संकेत",

    both_title: "दोन्ही मोड",
    both_stt_unsupported: "भाषण ओळख समर्थित नाही।",
    both_stt_placeholder: "लिप्यंतरणासाठी बोला…",
    both_stop: "थांबा",
    both_listen: "ऐका",
    both_clear: "साफ",
    both_to_tts: "→ TTS",
    both_tts_placeholder: "मजकूर टाइप करा…",
    both_translated: "भाषांतर:",
    both_convert: "रूपांतरित करा",
    both_sign_title: "संकेत ओळख",
    both_model_offline: "मॉडेल लोड नाही — कॅमेरा अक्षम।",
    both_recognized_label: "ओळखले",

    more_title: "अधिक वैशिष्ट्ये",
    feat_ai_title: "AI संकेत ओळख",
    feat_ai_desc:
      "डीप लर्निंग मॉडेल वेबकॅमवरून रिअल-टाइममध्ये सांकेतिक भाषा ओळखतात।",
    feat_lang_title: "बहुभाषी TTS",
    feat_lang_desc:
      "नैसर्गिक आवाजांसह इंग्रजी, हिंदी आणि मराठीमध्ये मजकूर भाषणात बदला।",
    feat_video_title: "थेट कॅमेरा फीड",
    feat_video_desc:
      "फ्रेम-दर-फ्रेम विश्लेषणासह अखंड वेबकॅम एकत्रीकरण।",
    feat_speech_title: "भाषण ओळख",
    feat_speech_desc:
      "त्वरित लिप्यंतरणासाठी ब्राउझर-मूळ भाषण-ते-मजकूर।",
    feat_offline_title: "ऑफलाइन तयार",
    feat_offline_desc:
      "मुख्य वैशिष्ट्ये किमान कनेक्टिव्हिटीसह कार्य करतात।",
    feat_access_title: "पूर्णतः सुलभ",
    feat_access_desc:
      "कीबोर्ड नेव्हिगेशन, उच्च कॉन्ट्रास्ट आणि स्क्रीन रीडर समर्थन।",

    video_title: "व्हिडिओ संसाधने",
    video_live_title: "थेट प्रवाह",
    video_live_desc:
      "रिअल-टाइममध्ये उच्च-गुणवत्तेचे सांकेतिक भाषा भाषांतर व्हिडिओ प्रवाह प्रवेश करा।",
    video_tutorial_title: "ट्यूटोरियल लायब्ररी",
    video_tutorial_desc:
      "सांकेतिक भाषा प्रभावीपणे शिकवण्यासाठी मार्गदर्शित व्हिडिओ पाहा।",
    video_player_title: "इंटरेक्टिव्ह प्लेयर",
    video_player_desc:
      "चांगल्या समजासाठी प्लेबॅक गती नियंत्रित करा आणि विशिष्ट संकेत लूप करा।",
    video_player_heading: "इंटरेक्टिव्ह व्हिडिओ प्लेयर",
    video_placeholder_desc:
      "हे स्थान येणाऱ्या इंटरेक्टिव्ह सांकेतिक भाषा व्हिडिओ प्लेयरसाठी राखून ठेवले आहे।",

    learning_title: "शिकण्याचे केंद्र",
    learning_hero_title: "सांकेतिक भाषेत प्रभुत्व मिळवा",
    learning_hero_desc:
      "सर्व कौशल्य स्तरांसाठी डिझाइन केलेल्या आमच्या इंटरेक्टिव्ह अभ्यासक्रमासह सर्वसमावेशक शिकण्याच्या प्रवासावर निघा।",
    learning_start: "आता शिकणे सुरू करा",
    learning_modules: "उपलब्ध मॉड्युल",
    learning_beginner_title: "नवशिक्या अभ्यासक्रम",
    learning_beginner_desc:
      "मूळ गोष्टींपासून सुरुवात करा आणि सामान्य अभिवादनासह वर्णमाला शिका।",
    learning_grammar_title: "व्याकरण आणि रचना",
    learning_grammar_desc:
      "सांकेतिक भाषा वाक्यरचनेचे दृश्य आणि व्याकरणिक नियम समजून घ्या।",
    learning_advanced_title: "प्रगत शब्दसंग्रह",
    learning_advanced_desc:
      "विशेष शब्दसंग्रह धड्यांसह आपले संवाद कौशल्य विस्तारित करा।",

    register_title: "नोंदणी",
    login_title: "साइन इन",
    register_email: "ईमेल",
    register_password: "संकेतशब्द",
    register_create_btn: "खाते तयार करा",
    register_signin_btn: "साइन इन",
    register_no_account: "खाते नाही? ",
    register_have_account: "आधीपासून खाते आहे? ",
    register_sign_up_link: "साइन अप",
    register_sign_in_link: "साइन इन",

    notfound_message: "माफ करा! पृष्ठ आढळले नाही",
    notfound_return: "मुख्यपृष्ठावर परत जा",

    dataset_loading: "डेटासेट माहिती लोड होत आहे…",
    dataset_error: "डेटासेट लोड करण्यात अयशस्वी. बॅकएंड ऑफलाइन असू शकते।",
    dataset_title: "डेटासेट",
    dataset_signs: "समर्थित संकेत",

    camera_off: "कॅमेरा बंद",
    camera_error: "कॅमेरा परवानगी नाकारली किंवा अनुपलब्ध",
    camera_stop: "कॅमेरा बंद करा",
    camera_start: "कॅमेरा सुरू करा",

    audio_output: "ऑडिओ आउटपुट",
    audio_autoplay_blocked: "ऑटोप्ले अवरोधित — प्ले दाबा",
    audio_no_audio: "अद्याप ऑडिओ नाही",

    error_dismiss: "बंद करा",

    isl_title: "ISL 3D साइनर",
    isl_open_full: "पूर्ण दृश्य उघडा",
    isl_hint:
      "साइनरमध्ये मजकूर टाइप करा आणि Sign वर क्लिक करा (A-Z अक्षरे)। मॉडेल नसल्यास `ybot.glb` हे `ISL model/signing-portable/models/` मध्ये ठेवा।",

    status_loaded: "मॉडेल लोड झाले",
    status_not_loaded: "मॉडेल लोड होणे बाकी",

    stt_err_permission: "मायक्रोफोन परवानगी नाकारली।",
    stt_err_service: "भाषण सेवा अवरोधित आहे।",
    stt_err_network:
      "भाषण सेवा नेटवर्क त्रुटी. Chrome/Edge वापरा, इंटरनेट चालू ठेवा आणि पुन्हा प्रयत्न करा।",
    stt_err_generic: "भाषण त्रुटी:",
  },
} as const;

// ─── Exports ──────────────────────────────────────────────────────────────────
export type TranslationKey = keyof typeof dict.en;
export type Translations = typeof dict.en;
export { dict as translations };
