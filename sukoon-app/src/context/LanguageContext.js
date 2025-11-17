// src/context/LanguageContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = 'sukoon_language';

// Simple translation dictionary
const translations = {
  en: {
    // tabs
    tab_home: 'Home',
    tab_reminders: 'Reminders',
    tab_help: 'Help',
    tab_profile: 'Profile',

    // profile
    profile_title: 'Your Sukoon Profile',
    profile_edit: 'Edit Sukoon Profile',
    profile_progress: 'My Progress',
    profile_medical: 'Medical Records',
    profile_help: 'Help',
    profile_sos: 'SOS',
    profile_logout: 'Log out of Sukoon',
    profile_language_label: 'App language',
    profile_language_english: 'English',
    profile_language_hindi: 'Hindi',

    // en.js
    profile_contact: 'Contact',
    profile_emergency_contact: 'Emergency Contact',
    // profile_years: 'years',
    // profile_age_not_set: 'Age not set',
    // profile_gender_not_specified: 'Not specified',

    profile_name_not_set: "Name not set",
    profile_years: "years",
    profile_age_not_set: "Age not set",
    profile_contact_not_set: "Contact not set",
    profile_emergency_contact_not_set: "Emergency contact not set",
    profile_gender_not_specified: "Gender not specified",
    profile_logout_title: "Log out of Sukoon",
    profile_logout_message: "Are you sure you want to log out and return to the start screen?",


    // reminders
    reminders_title: 'Reminders and Logs',
    reminders_things_to_do: 'Things to do',
    reminders_add_placeholder: 'Add a new thing to do',
    reminders_empty: 'No tasks yet. Add your first “thing to do” above.',
    reminders_add_button: 'Add a reminder',

    // generic
    common_clear_completed: 'Clear completed',

    app_name: 'Sukoon',
    // app_tagline: 'Har Dil Ka Sukoon',
    app_tagline: 'हर दिल का सुकून',
    get_started_title: 'Your space for peace, care, and wellness',
    auth_login: 'Log In',
    auth_signup: 'Sign Up',

    home_greeting_prefix: 'Welcome',
    home_section_shortcuts: 'Your Sukoon shortcuts',
    home_card_reminders_title: 'Reminders & Logs',
    home_card_reminders_sub: 'Keep track of medicines, events and more',
    home_card_help_title: 'Help & Support',
    home_card_help_sub: 'Learn how Sukoon can support you',
    home_card_profile_title: 'Your Profile',
    home_card_profile_sub: 'Update personal and medical details',

    sos_title: 'Emergency SOS',
    sos_subtitle: 'Use SOS only in case of emergency.',
    sos_primary_action: 'Call emergency contact',
    sos_secondary_action: 'Call doctor / helpline',

    help_title: 'Help & Support',
    help_FAQ_heading: 'Frequently asked questions',
    help_contact_heading: 'Need more help?',
    help_contact_text: 'Ask a trusted family member or health worker to assist you with the app.',

    // Reminders modal
    reminders_select_month_year: 'Select month & year',
    reminders_month_label: 'Month',
    reminders_year_label: 'Year',

    home_greeting: 'Welcome to Sukoon',
    home_subtitle:
    'Choose what you want to do today. Your space for peace, care, and wellness.',

    home_card_connect_title: 'Sukoon Connect',
    home_card_connect_desc:
    'Talk, share, or check-in with your trusted circle and helpers.',

    home_card_reminders_title: 'Sukoon Reminders',
    home_card_reminders_desc:
    'Set medicine, water, and self-care reminders tailored to you.',

    home_card_games_title: 'Mind Games',
    home_card_games_desc:
    'Play simple games to relax, focus, and keep your mind active.',

    home_card_move_title: 'Move with Sukoon',
    home_card_move_desc:
    'Gentle stretches and movements to keep your body active.',

    home_card_profile_title: 'Your Sukoon Profile',
    home_card_profile_desc:
    'View and update your details, preferences, and emergency contact.',

    help_title: 'Help & Support',
    help_FAQ_heading: 'Frequently asked questions',

    help_FAQ_item1: 'How do I set reminders?',
    help_FAQ_item1_desc:
    'Go to the Reminders tab, choose a date in the calendar, then tap “Add a reminder”.',

    help_FAQ_item2: 'When should I use SOS?',
    help_FAQ_item2_desc:
    'Use SOS only in real emergencies, like severe chest pain, difficulty breathing, or feeling unsafe.',

    help_FAQ_item3: 'How do I change the app language?',
    help_FAQ_item3_desc:
    'Open Profile → App language → choose English or Hindi.',

    help_contact_heading: 'Need more help?',
    help_contact_text:
    'Ask a trusted family member or health worker to assist you with the app, or contact your doctor in case of health concerns.',

    help_simple_title: 'What can we help you with?',
    help_q1: 'How to set a reminder?',
    help_q2: 'How to do an SOS call?',
    help_q3: 'How to play a game?',
    help_q4: 'How to create an event?',
    help_q5: 'Other? Chat with us',
    help_video_placeholder: 'Playing instructional video for:',

    move_title: "Move and Breathe",
    move_subtitle: "Start today’s gentle movement routine.",
    move_routine_fallback: "Exercise routine",
    move_routine_stretch_flow: "Stretch & Flow",
    move_routine_balance_posture: "Balance & Posture",
    move_routine_stretch_relax: "Stretch & Relax",
    move_routine_mini_yoga: "Mini Yoga",
    exercise_no_video: "Video for this exercise will appear here.",
    exercise_instruction: "Follow this slow-paced routine with gentle breathing. Move only as far as you feel comfortable. If you feel pain or dizziness, stop and rest.",

    exercise_open_on_youtube_info: "Tap the button below to watch this routine on YouTube.",
    exercise_open_on_youtube: "Watch this routine on YouTube",
    exercise_open_error_title: "Unable to open video",
    exercise_open_error_message: "Something went wrong while opening YouTube. Please try again later.",

    // --- Exercise / Move with Sukoon ---
    exercise_open_on_youtube_info:
      'Tap the button below to watch this routine on YouTube.',
    exercise_open_on_youtube: 'Watch this routine on YouTube',
    exercise_open_error_title: 'Unable to open video',
    exercise_open_error_message:
      'Something went wrong while opening YouTube. Please try again later.',

    // --- Games menu ---
    games_title: 'Daily Mind Games',
    games_ttt: 'Tic-Tac-Toe',
    games_odd_one_out: 'Odd One Out',
    games_card_match: 'Card Match',
    games_shopping_list: 'Shopping List Game',

    // --- Tic-Tac-Toe ---
    ttt_title: 'Tic-Tac-Toe',
    ttt_your_turn: 'Your turn',
    ttt_you_win: 'Great job! You won this game.',
    ttt_computer_wins: 'The computer won this time. Try again.',
    ttt_draw: 'The game ended in a draw.',
    ttt_confirm_move: 'Confirm move',
    ttt_reset: 'Start a new game',

    // --- Odd One Out ---
    odd_title: 'Odd One Out',
    odd_subtitle: 'Tap the item that is different from the others.',
    odd_correct: 'Correct! That one is different.',
    odd_try_again: 'Not the odd one. Try again.',
    odd_next: 'Next question',

    // --- Card Match ---
    match_title: 'Card Match',
    match_subtitle: 'Remember and find the matching pairs. Moves:',
    match_success: 'Well done! You found all the pairs.',
    match_reset: 'Play again',

    // --- Shopping List Game ---
    shop_title: 'Shopping List Game',
    shop_subtitle_memorise:
      'First, calmly read and remember this list.',
    shop_subtitle_quiz:
      'Now choose the items that were on the list.',
    shop_ready: 'I am ready',
    shop_check: 'Check my answer',
    shop_restart: 'Restart',
    shop_all_correct: 'Great! You selected all items correctly.',
    shop_feedback_prefix: 'You selected correctly:',
    shop_feedback_suffix:
      ' items. You can try again.',

    // ...keep any remaining keys you already had...

    home_today_title: 'Today at Sukoon',
    home_today_reminders_label: 'Reminders',
    home_today_reminders_empty: 'No reminders for today.',
    home_today_todo_label: 'Things to do',
    home_today_todo_empty: 'No tasks for today.',
    home_today_events_label: 'Sukoon events',
    home_today_events_empty: 'No events today.',
    home_today_event_venue_prefix: 'Venue: ',
    home_today_event_contact_prefix: 'Contact: ',

    reminders_title: 'Reminders and Logs',
    reminders_all_title: 'All reminders',
    reminders_all_empty: 'You haven’t added any reminders yet.',
    reminders_todo_title: 'Things to do',
    reminders_todo_placeholder: 'Add a new thing to do',
    reminders_todo_empty: 'No tasks yet. Add your first “thing to do” above.',
    reminders_todo_clear: 'Clear completed',
    reminders_add_button: 'Add a reminder',
    reminders_pick_month_year: 'Select month & year',
    reminders_picker_month: 'Month',
    reminders_picker_year: 'Year',
    reminders_remove_title: 'Remove reminder',
    reminders_remove_message: 'Do you want to remove this reminder?\n\n{{title}}',

    common_cancel: 'Cancel',
    common_remove: 'Remove',
    common_done: 'Done',

    medical_title: 'Medical Records',
    medical_add_section_title: 'Add a new medical record',
    medical_field_title: 'Title',
    medical_field_title_placeholder: 'e.g. Blood test, BP check-up',
    medical_field_date: 'Date',
    medical_field_date_placeholder: 'e.g. 14 Nov 2025',
    medical_field_notes: 'Notes',
    medical_field_notes_placeholder: 'Doctor’s advice, medicine changes, etc.',
    medical_add_button: 'Save record',
    medical_existing_section_title: 'Your records',
    medical_empty_text: 'You have not added any medical records yet.',

    medical_label_date: 'Date: ',
    medical_label_notes: 'Notes: ',

    medical_default_title: 'Medical record',
    medical_delete_title: 'Delete record',
    medical_delete_message: 'Do you want to delete this record?\n\n{{title}}',
    medical_delete_message_simple: 'Do you want to delete this record?',

    medical_attach_button: 'Attach file (report, scan, etc.)',
    medical_label_file: 'File:',
    medical_file_default_name: 'Medical file',
    medical_open_error_title: 'Cannot open file',
    medical_open_error_message: 'Sorry, we could not open this file on this device.',

    // Home / Today section
    home_today_title: 'Today at Sukoon',
    home_today_reminders: 'Reminders',
    home_today_todos: 'Things to do',
    home_today_events: 'Sukoon events',
    home_today_no_reminders: 'No reminders for today.',
    home_today_no_todos: 'No tasks for today.',
    home_today_no_events: 'No events today.',
    home_today_event_venue: 'Venue:',
    home_today_event_contact: 'Contact:',

    // Health card on home
    home_card_health_title: 'Not feeling well?',
    home_card_health_desc:
    'Tell us how you feel. We will gently guide you to rest or a doctor.',

    // Not feeling well screen
    health_title: 'Not feeling well',
    health_question_symptom: 'What is bothering you the most?',
    health_question_severity: 'How bad is it right now?',

    health_symptom_headache: 'Headache / head heavy',
    health_symptom_stomach: 'Stomach pain or gas',
    health_symptom_fever: 'Fever or body pain',
    health_symptom_breathing: 'Breathing trouble',
    health_symptom_chest_pain: 'Chest pain',
    health_symptom_feeling_low: 'Feeling very low / anxious',
    health_symptom_other: 'Something else',

    health_severity_mild: 'Mild – manageable',
    health_severity_moderate: 'Moderate – uncomfortable',
    health_severity_severe: 'Severe – very uncomfortable',

    health_button_see_suggestions: 'See suggestions',

    health_result_title: 'Our gentle suggestion',
    health_suggestion_mild:
    'It seems mild right now. Please rest, drink water, and watch your symptoms. If it gets worse, please contact a doctor.',
    health_suggestion_moderate:
    'It may be better to talk to a doctor today. You can call your family doctor or the nearest clinic.',
    health_suggestion_severe:
    'This may be serious. Please contact a doctor or emergency service immediately.',

    health_call_doctor: 'Call doctor',
    health_open_video: 'Open video call link',

    health_disclaimer:
    'Sukoon cannot give a medical diagnosis. For any doubt or serious symptom, please talk to a doctor or emergency service.',

    health_call_error_title: 'Could not start call',
    health_call_error_message: 'Please dial your doctor or emergency number manually.',
    health_video_error_title: 'Could not open link',
    health_video_error_message: 'Please try again or contact your doctor directly.',

    health_open_whatsapp: 'Open WhatsApp with doctor',
    health_whatsapp_prefill: 'Namaste doctor, I am not feeling well. Can we speak on a video call?',
    health_whatsapp_error_title: 'Could not open WhatsApp',
    health_whatsapp_error_message:
    'Please open WhatsApp manually and call your doctor from there.',

    sos_title: "Emergency SOS",
    sos_call_button: "Call for Help",
    sos_note: "This will call your emergency contact.",
    sos_no_number_title: "No Contact Found",
    sos_no_number_message: "Please add an emergency contact in your profile.",
    sos_error_title: "Call Failed",
    sos_error_message: "Could not open the dialer. Please try manually.",
  },

  hi: {
    // tabs
    tab_home: 'होम',
    tab_reminders: 'रिमाइंडर',
    tab_help: 'मदद',
    tab_profile: 'प्रोफ़ाइल',

    // profile
    profile_title: 'आपकी सुकून प्रोफ़ाइल',
    profile_edit: 'सुकून प्रोफ़ाइल बदलें',
    profile_progress: 'मेरी प्रगति',
    profile_medical: 'चिकित्सा रिकॉर्ड',
    profile_help: 'मदद',
    profile_sos: 'एसओएस',
    profile_logout: 'सुकून से लॉग आउट करें',
    profile_language_label: 'ऐप की भाषा',
    profile_language_english: 'अंग्रेज़ी',
    profile_language_hindi: 'हिन्दी',

    // hi.js
    profile_name_not_set: "नाम सेट नहीं है",
    profile_years: "वर्ष",
    profile_age_not_set: "उम्र सेट नहीं है",
    profile_contact_not_set: "कॉण्टैक्ट सेट नहीं है",
    profile_emergency_contact_not_set: "आपातकालीन संपर्क नहीं है",
    profile_gender_not_specified: "लिंग निर्दिष्ट नहीं है",
    profile_logout_title: "सुकून से लॉगआउट करें",
    profile_logout_message: "क्या आप लॉगआउट करना चाहते हैं और प्रारंभ स्क्रीन पर लौटना चाहते हैं?",

    profile_contact: "संपर्क",
    profile_emergency_contact: "आपातकालीन संपर्क",

    // reminders
    reminders_title: 'रिमाइंडर और लॉग',
    reminders_things_to_do: 'करने के काम',
    reminders_add_placeholder: 'नया काम जोड़ें',
    reminders_empty: 'अभी कोई काम नहीं है। ऊपर अपना पहला काम जोड़ें।',
    reminders_add_button: 'रिमाइंडर जोड़ें',

    // generic
    common_clear_completed: 'पूरा किए गए हटाएं',
    app_name: 'सुकून',
    app_tagline: 'हर दिल का सुकून',
    get_started_title: 'आपकी शांति, देखभाल और स्वास्थ्य का अपना स्थान',
    auth_login: 'लॉग इन',
    auth_signup: 'साइन अप',

    home_greeting_prefix: 'स्वागत है',
    home_section_shortcuts: 'आपके सुकून शॉर्टकट',
    home_card_reminders_title: 'रिमाइंडर और लॉग',
    home_card_reminders_sub: 'दवाइयाँ, कार्यक्रम और बाकी चीज़ें याद रखें',
    home_card_help_title: 'मदद और सहयोग',
    home_card_help_sub: 'जानिए सुकून आपको कैसे मदद कर सकता है',
    home_card_profile_title: 'आपकी प्रोफ़ाइल',
    home_card_profile_sub: 'व्यक्तिगत और मेडिकल जानकारी अपडेट करें',

    sos_title: 'आपातकालीन एसओएस',
    sos_subtitle: 'एसओएस का उपयोग केवल आपात स्थिति में करें।',
    sos_primary_action: 'आपातकालीन संपर्क को कॉल करें',
    sos_secondary_action: 'डॉक्टर / हेल्पलाइन को कॉल करें',

    help_title: 'मदद और सहयोग',
    help_FAQ_heading: 'अक्सर पूछे जाने वाले सवाल',
    help_contact_heading: 'और मदद चाहिए?',
    help_contact_text:
      'ऐप में मदद के लिए किसी भरोसेमंद परिवार के सदस्य या स्वास्थ्य कार्यकर्ता से सहायता लें।',

    reminders_select_month_year: 'माह और वर्ष चुनें',
    reminders_month_label: 'माह',
    reminders_year_label: 'वर्ष',

    home_greeting: 'सुकून में आपका स्वागत है',
    home_subtitle:
    'आज आप क्या करना चाहते हैं, चुनिए। शांति, देखभाल और स्वास्थ्य के लिए आपका अपना स्थान।',

    home_card_connect_title: 'सुकून कनेक्ट',
    home_card_connect_desc:
    'अपने भरोसेमंद लोगों और मददगारों से बात करें, साझा करें या हालचाल लें।',

    home_card_reminders_title: 'सुकून रिमाइंडर',
    home_card_reminders_desc:
    'दवाइयों, पानी और आत्म-देखभाल के रिमाइंडर अपने अनुसार सेट करें।',

    home_card_games_title: 'माइंड गेम्स',
    home_card_games_desc:
    'मन को शांत, ध्यान केंद्रित और सक्रिय रखने के लिए हल्के खेल खेलें।',

    home_card_move_title: 'सुकून के साथ चलें',
    home_card_move_desc:
    'शरीर को सक्रिय रखने के लिए हल्की स्ट्रेचिंग और मूवमेंट करें।',

    home_card_profile_title: 'आपकी सुकून प्रोफ़ाइल',
    home_card_profile_desc:
    'अपनी जानकारी, पसंद और आपातकालीन संपर्क अपडेट करें।',
    help_title: 'मदद और सहयोग',
    help_FAQ_heading: 'अक्सर पूछे जाने वाले सवाल',

    help_FAQ_item1: 'मैं रिमाइंडर कैसे सेट करूँ?',
    help_FAQ_item1_desc:
    'रिमाइंडर टैब पर जाएँ, कैलेंडर में तारीख चुनें और “रिमाइंडर जोड़ें” पर टैप करें।',

    help_FAQ_item2: 'एसओएस कब इस्तेमाल करना चाहिए?',
    help_FAQ_item2_desc:
    'एसओएस का उपयोग केवल आपात स्थिति में करें, जैसे तेज सीने में दर्द, सांस लेने में दिक्कत या खुद को असुरक्षित महसूस करना।',

    help_FAQ_item3: 'ऐप की भाषा कैसे बदलूँ?',
    help_FAQ_item3_desc:
    'प्रोफ़ाइल → ऐप की भाषा पर जाएँ और अंग्रेज़ी या हिन्दी चुनें।',

    help_contact_heading: 'और मदद चाहिए?',
    help_contact_text:
    'ऐप में मदद के लिए किसी भरोसेमंद परिवार के सदस्य या स्वास्थ्य कार्यकर्ता से सहायता लें। सेहत से जुड़ी चिंता हो तो अपने डॉक्टर से संपर्क करें।',

    help_simple_title: 'हम आपकी किस बात में मदद कर सकते हैं?',
    help_q1: 'रिमाइंडर कैसे सेट करें?',
    help_q2: 'एसओएस कॉल कैसे करें?',
    help_q3: 'गेम कैसे खेलें?',
    help_q4: 'ईवेंट कैसे बनाएं?',
    help_q5: 'कुछ और? हमसे बात करें',
    help_video_placeholder: 'इसके लिए मार्गदर्शक वीडियो चल रहा है:',

    move_title: "सुक़ून के साथ चलें और साँस लें",
    move_subtitle: "आज का हल्का व्यायाम क्रम शुरू करें।",
    move_routine_stretch_flow: "स्ट्रेच और फ्लो",
    move_routine_balance_posture: "संतुलन और पोस्टर",
    move_routine_stretch_relax: "स्ट्रेच और आराम",
    move_routine_stretch_relax: "स्ट्रेच और आराम",
    move_routine_mini_yoga: "मिनी योग",

    exercise_open_on_youtube_info: "यह व्यायाम वीडियो देखने के लिए नीचे दिए बटन पर टैप करें।",
    exercise_open_on_youtube: "यह व्यायाम YouTube पर देखें",
    exercise_open_error_title: "वीडियो नहीं खुल पाया",
    exercise_open_error_message: "YouTube खोलने में दिक्कत आई। कृपया थोड़ी देर बाद दोबारा कोशिश करें।",

    // --- Exercise / Move with Sukoon ---
    exercise_open_on_youtube_info:
      'यह व्यायाम वीडियो देखने के लिए नीचे दिए बटन पर टैप करें।',
    exercise_open_on_youtube: 'यह व्यायाम YouTube पर देखें',
    exercise_open_error_title: 'वीडियो नहीं खुल पाया',
    exercise_open_error_message:
      'YouTube खोलने में दिक्कत आई। कृपया थोड़ी देर बाद दोबारा कोशिश करें।',

    // --- Games menu ---
    games_title: 'दैनिक दिमागी खेल',
    games_ttt: 'टीक-टैक-टो',
    games_odd_one_out: 'अलग कौन सा है?',
    games_card_match: 'कार्ड मिलान खेल',
    games_shopping_list: 'शॉपिंग लिस्ट खेल',

    sos_title: "आपातकालीन सहायता",
    sos_call_button: "मदद के लिए कॉल करें",
    sos_note: "यह आपके आपातकालीन संपर्क को कॉल करेगा।",
    sos_no_number_title: "कोई संपर्क नहीं मिला",
    sos_no_number_message: "कृपया प्रोफ़ाइल में एक आपातकालीन संपर्क जोड़ें।",
    sos_error_title: "कॉल विफल रही",
    sos_error_message: "डायलर नहीं खोल सके। कृपया मैन्युअल रूप से प्रयास करें।",


    // --- Tic-Tac-Toe ---
    ttt_title: 'टीक-टैक-टो',
    ttt_your_turn: 'अब आपकी चाल है',
    ttt_you_win: 'बहुत बढ़िया! आपने खेल जीत लिया।',
    ttt_computer_wins: 'इस बार कंप्यूटर जीत गया। फिर से कोशिश करें।',
    ttt_draw: 'खेल बराबरी पर खत्म हुआ।',
    ttt_confirm_move: 'चाल पक्की करें',
    ttt_reset: 'नया खेल शुरू करें',

    // --- Odd One Out ---
    odd_title: 'अलग कौन सा है?',
    odd_subtitle:
      'जो चीज़ बाकी सब से अलग हो, उस पर हल्के से टैप करें।',
    odd_correct: 'सही जवाब! यह अलग चीज़ थी।',
    odd_try_again: 'यह अलग नहीं है, फिर से कोशिश करें।',
    odd_next: 'अगला सवाल',

    // --- Card Match ---
    match_title: 'कार्ड मिलान खेल',
    match_subtitle:
      'याद करके दो-दो मिलते कार्ड खोजिए। चालें:',
    match_success:
      'बहुत अच्छा! आपने सभी जोड़े ढूंढ लिए।',
    match_reset: 'फिर से खेलें',

    // --- Shopping List Game ---
    shop_title: 'शॉपिंग लिस्ट खेल',
    shop_subtitle_memorise:
      'पहले इस सूची को आराम से पढ़ कर याद कर लीजिए।',
    shop_subtitle_quiz:
      'अब वे चीज़ें चुनिए जो लिस्ट में थीं।',
    shop_ready: 'मैंने याद कर लिया',
    shop_check: 'जवाब जांचें',
    shop_restart: 'फिर से शुरू करें',
    shop_all_correct:
      'शाबाश! आपने सारी चीज़ें सही चुनीं।',
    shop_feedback_prefix: 'आपने सही चुना:',
    shop_feedback_suffix:
      ' आइटम। दोबारा कोशिश कर सकते हैं।',

    // ...keep any remaining Hindi keys you already had...
    home_today_title: 'आज का सुखून',
    home_today_reminders_label: 'रीमाइंडर',
    home_today_reminders_empty: 'आज के लिए कोई रीमाइंडर नहीं है।',
    home_today_todo_label: 'आज के काम',
    home_today_todo_empty: 'आज के लिए कोई काम नहीं है।',
    home_today_events_label: 'सुखून इवेंट',
    home_today_events_empty: 'आज कोई इवेंट नहीं है।',
    home_today_event_venue_prefix: 'स्थान: ',
    home_today_event_contact_prefix: 'संपर्क: ',

    reminders_title: 'रीमाइंडर और लॉग',
    reminders_all_title: 'सभी रीमाइंडर',
    reminders_all_empty: 'आपने अभी तक कोई रीमाइंडर नहीं जोड़ा है।',
    reminders_todo_title: 'करने के काम',
    reminders_todo_placeholder: 'यहाँ नया काम लिखें',
    reminders_todo_empty: 'अभी कोई काम नहीं है। ऊपर अपना पहला काम जोड़ें।',
    reminders_todo_clear: 'पूरा हुए काम हटाएँ',
    reminders_add_button: 'नया रीमाइंडर जोड़ें',
    reminders_pick_month_year: 'महीना और साल चुनें',
    reminders_picker_month: 'महीना',
    reminders_picker_year: 'साल',
    reminders_remove_title: 'रीमाइंडर हटाएँ',
    reminders_remove_message: 'क्या आप यह रीमाइंडर हटाना चाहते हैं?\n\n{{title}}',

    common_cancel: 'रद्द करें',
    common_remove: 'हटाएँ',
    common_done: 'हो गया',

    medical_title: 'मेडिकल रिकॉर्ड',
    medical_add_section_title: 'नया मेडिकल रिकॉर्ड जोड़ें',
    medical_field_title: 'शीर्षक',
    medical_field_title_placeholder: 'जैसे – ब्लड टेस्ट, बी.पी. चेकअप',
    medical_field_date: 'तारीख',
    medical_field_date_placeholder: 'जैसे – १४ नवम्बर २०२५',
    medical_field_notes: 'नोट्स',
    medical_field_notes_placeholder: 'डॉक्टर की सलाह, दवाओं में बदलाव आदि',
    medical_add_button: 'रिकॉर्ड सेव करें',
    medical_existing_section_title: 'आपके रिकॉर्ड',
    medical_empty_text: 'आपने अभी तक कोई मेडिकल रिकॉर्ड नहीं जोड़ा है।',

    medical_label_date: 'तारीख: ',
    medical_label_notes: 'नोट्स: ',

    medical_default_title: 'मेडिकल रिकॉर्ड',
    medical_delete_title: 'रिकॉर्ड हटाएँ',
    medical_delete_message: 'क्या आप यह रिकॉर्ड हटाना चाहते हैं?\n\n{{title}}',
    medical_delete_message_simple: 'क्या आप यह रिकॉर्ड हटाना चाहते हैं?',

    medical_attach_button: 'फाइल जोड़ें (रिपोर्ट, स्कैन आदि)',
    medical_label_file: 'फाइल:',
    medical_file_default_name: 'मेडिकल फाइल',
    medical_open_error_title: 'फाइल नहीं खुल सकी',
    medical_open_error_message: 'क्षमा करें, यह फाइल इस डिवाइस पर नहीं खोली जा सकी।',

    // Home / Today section
    home_today_title: 'आज सुकून में',
    home_today_reminders: 'रिमाइंडर',
    home_today_todos: 'आज के काम',
    home_today_events: 'सुकून इवेंट',
    home_today_no_reminders: 'आज के लिए कोई रिमाइंडर नहीं है।',
    home_today_no_todos: 'आज के लिए कोई काम नहीं जोड़ा गया है।',
    home_today_no_events: 'आज कोई इवेंट नहीं है।',
    home_today_event_venue: 'स्थान:',
    home_today_event_contact: 'संपर्क:',

    // Health card on home
    home_card_health_title: 'तबियत ठीक नहीं लग रही?',
    home_card_health_desc:
    'कैसा महसूस हो रहा है बताइए, हम आपको आराम या डॉक्टर से बात करने की ओर मार्गदर्शन करेंगे।',

    // Not feeling well screen
    health_title: 'तबियत ठीक नहीं लग रही',
    health_question_symptom: 'सबसे ज़्यादा तकलीफ़ कहाँ / कैसी है?',
    health_question_severity: 'अभी तकलीफ़ कितनी ज़्यादा है?',

    health_symptom_headache: 'सिर दर्द / भारी सिर',
    health_symptom_stomach: 'पेट दर्द या गैस',
    health_symptom_fever: 'बुखार या बदन दर्द',
    health_symptom_breathing: 'साँस लेने में दिक्कत',
    health_symptom_chest_pain: 'सीने में दर्द',
    health_symptom_feeling_low: 'बहुत उदास / घबराहट',
    health_symptom_other: 'कुछ और',

    health_severity_mild: 'हल्की – संभालने लायक',
    health_severity_moderate: 'मাঝरी – काफ़ी तकलीफ़',
    health_severity_severe: 'तेज़ – बहुत ज़्यादा तकलीफ़',

    health_button_see_suggestions: 'सलाह देखें',

    health_result_title: 'हमारी सरल सलाह',
    health_suggestion_mild:
    'अभी तकलीफ़ हल्की लग रही है। थोड़ा आराम करें, पानी पीते रहें और लक्षणों पर ध्यान रखें। अगर हालत बिगड़ती लगे तो डॉक्टर से संपर्क करें।',
    health_suggestion_moderate:
    'बेहतर होगा कि आज ही किसी डॉक्टर से बात कर लें। आप अपने फ़ैमिली डॉक्टर या नज़दीकी क्लिनिक पर संपर्क कर सकते हैं।',
    health_suggestion_severe:
    'यह स्थिति गंभीर हो सकती है। कृपया तुरंत डॉक्टर या आपातकालीन सेवा से संपर्क करें।',

    health_call_doctor: 'डॉक्टर को कॉल करें',
    health_open_video: 'वीडियो कॉल लिंक खोलें',

    health_disclaimer:
    'सुकून कोई मेडिकल ऐप नहीं है और बीमारी की पक्की पहचान नहीं बता सकता। किसी भी शंका या गंभीर लक्षण में तुरंत डॉक्टर या आपातकालीन सेवा से संपर्क करें।',

    health_call_error_title: 'कॉल शुरू नहीं हो पाई',
    health_call_error_message:
    'कृपया डॉक्टर या इमरजेंसी नंबर पर मैन्युअली कॉल करें।',
    health_video_error_title: 'लिंक नहीं खुल पाया',
    health_video_error_message:
    'कृपया दोबारा कोशिश करें या सीधे डॉक्टर से संपर्क करें।',

    health_open_whatsapp: 'डॉक्टर के साथ व्हाट्सऐप खोलें',
    health_whatsapp_prefill:
    'नमस्ते डॉक्टर, मेरी तबियत ठीक नहीं लग रही। क्या हम वीडियो कॉल पर बात कर सकते हैं?',
    health_whatsapp_error_title: 'व्हाट्सऐप नहीं खुल पाया',
    health_whatsapp_error_message:
    'कृपया व्हाट्सऐप ऐप खोलकर डॉक्टर को मैन्युअली कॉल करें।',
  },
};

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('en');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (stored === 'en' || stored === 'hi') {
          setLanguageState(stored);
        }
      } catch (e) {
        console.log('Error loading language', e);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const setLanguage = async (lang) => {
    try {
      setLanguageState(lang);
      await AsyncStorage.setItem(LANGUAGE_KEY, lang);
    } catch (e) {
      console.log('Error saving language', e);
    }
  };

  const t = (key) => {
    const langTable = translations[language] || translations.en;
    return langTable[key] || translations.en[key] || key;
  };

  // avoid flicker while reading from storage
  if (!ready) return null;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
