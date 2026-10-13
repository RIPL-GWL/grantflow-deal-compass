export const languages = [
  {
    code: "hi",
    name: "हिन्दी",
    greeting: "नमस्ते! मैं RIPL का सहायक हूँ। आज आपकी किस तरह मदद कर सकता हूँ?",
    placeholder: "अपना सवाल लिखें…",
  },
  {
    code: "en",
    name: "English",
    greeting: "Hello! I'm your RIPL assistant. How can I help you today?",
    placeholder: "Ask your question…",
  },
  {
    code: "hinglish",
    name: "Hinglish",
    greeting: "Namaste! Main RIPL ka assistant hoon. Aaj aapki kaise madad kar sakta hoon?",
    placeholder: "Apna sawal likhein…",
  },
  {
    code: "mr",
    name: "मराठी",
    greeting: "नमस्कार! मी RIPL चा सहाय्यक आहे. मी तुम्हाला कशी मदत करू शकतो?",
    placeholder: "तुमचा प्रश्न लिहा…",
  },
  {
    code: "bn",
    name: "বাংলা",
    greeting: "নমস্কার! আমি RIPL-এর সহায়ক। আপনাকে কীভাবে সাহায্য করতে পারি?",
    placeholder: "আপনার প্রশ্ন লিখুন…",
  },
  {
    code: "gu",
    name: "ગુજરાતી",
    greeting: "નમસ્તે! હું RIPL નો સહાયક છું. હું તમને કેવી રીતે મદદ કરી શકું?",
    placeholder: "તમારો પ્રશ્ન લખો…",
  },
  {
    code: "ta",
    name: "தமிழ்",
    greeting: "வணக்கம்! நான் RIPL உதவியாளர். உங்களுக்கு எப்படி உதவ முடியும்?",
    placeholder: "உங்கள் கேள்வியை எழுதுங்கள்…",
  },
  {
    code: "te",
    name: "తెలుగు",
    greeting: "నమస్కారం! నేను RIPL సహాయకుడిని. మీకు ఎలా సహాయం చేయగలను?",
    placeholder: "మీ ప్రశ్న రాయండి…",
  },
  {
    code: "kn",
    name: "ಕನ್ನಡ",
    greeting: "ನಮಸ್ಕಾರ! ನಾನು RIPL ಸಹಾಯಕ. ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    placeholder: "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಬರೆಯಿರಿ…",
  },
  {
    code: "ml",
    name: "മലയാളം",
    greeting: "നമസ്കാരം! ഞാൻ RIPL സഹായിയാണ്. നിങ്ങളെ എങ്ങനെ സഹായിക്കാം?",
    placeholder: "നിങ്ങളുടെ ചോദ്യം എഴുതൂ…",
  },
  {
    code: "pa",
    name: "ਪੰਜਾਬੀ",
    greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ RIPL ਸਹਾਇਕ ਹਾਂ। ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
    placeholder: "ਆਪਣਾ ਸਵਾਲ ਲਿਖੋ…",
  },
  {
    code: "or",
    name: "ଓଡ଼ିଆ",
    greeting: "ନମସ୍କାର! ମୁଁ RIPL ସହାୟକ। ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?",
    placeholder: "ଆପଣଙ୍କ ପ୍ରଶ୍ନ ଲେଖନ୍ତୁ…",
  },
  {
    code: "as",
    name: "অসমীয়া",
    greeting: "নমস্কাৰ! মই RIPL সহায়ক। আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?",
    placeholder: "আপোনাৰ প্ৰশ্ন লিখক…",
  },
  {
    code: "ur",
    name: "اردو",
    greeting: "السلام علیکم! میں RIPL کا معاون ہوں۔ آپ کی کیسے مدد کر سکتا ہوں؟",
    placeholder: "اپنا سوال لکھیں…",
  },
  {
    code: "bho",
    name: "भोजपुरी",
    greeting: "प्रणाम! हम RIPL के सहायक हईं। रउआ के कइसे मदद कर सकीं?",
    placeholder: "आपन सवाल लिखीं…",
  },
] as const;
export const getLanguage = (code: string) => languages.find((l) => l.code === code);
