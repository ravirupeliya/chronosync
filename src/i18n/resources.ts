export const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'hi', 'zh'] as const

export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const LANGUAGE_STORAGE_KEY = 'chronosync-language'

export const LANGUAGE_LABELS: Record<AppLanguage, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  hi: 'हिन्दी',
  zh: '中文',
}

export const LANGUAGE_LOCALES: Record<AppLanguage, string> = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  hi: 'hi-IN',
  zh: 'zh-CN',
}

export const LANGUAGE_COUNTRY_CODES: Record<AppLanguage, string> = {
  en: 'US',
  es: 'ES',
  fr: 'FR',
  de: 'DE',
  hi: 'IN',
  zh: 'CN',
}

const resources = {
  en: {
    translation: {
      app: {
        tagline: 'World clock and time zone converter for global teams.',
        switchTheme: 'Switch to {{mode}} mode',
        light: 'light',
        dark: 'dark',
        logoAlt: 'ChronoSync logo',
      },
      language: {
        label: 'Language',
      },
      overview: {
        title: 'Time zone converter and world clock overview',
        description:
          'ChronoSync helps you compare city times, convert local schedules, and pick meeting windows across distributed teams. The primary clock controls the source date and time, while secondary clocks stay in sync for instant global comparison.',
        subtitle: 'What ChronoSync helps with',
        item1: 'Convert time between countries and IANA time zones.',
        item2: 'Check current time differences for remote teams and clients.',
        item3: 'Plan international meetings with daylight saving awareness.',
        item4: 'Track multiple office locations from a single UTC reference.',
      },
      faq: {
        title: 'Frequently asked questions',
        q1: 'Does ChronoSync handle daylight saving time?',
        a1: 'Yes. ChronoSync detects ambiguous and non-existent local times during DST transitions and shows a clear warning when an adjustment is required.',
        q2: 'Can I compare more than one city at the same time?',
        a2: 'Yes. Add multiple secondary clocks, then drag and reorder them so your most important regions are always visible first.',
        q3: 'Is ChronoSync free to use?',
        a3: 'Yes. ChronoSync is a browser-based app and currently free to use.',
      },
      footer: {
        madeBy: 'Made with ❤️ in New Zealand by',
        githubAria: 'Ravi Patel on GitHub',
        githubTitle: 'GitHub',
        githubAlt: 'GitHub',
      },
      primaryClock: {
        badge: 'Primary',
        dragHint: 'Drag the clock hands to set time',
        timezoneLabel: 'Primary time zone',
        currentZone: 'Current primary zone',
        dateLabel: 'Date',
        selectDate: 'Select date',
        amPmToggle: 'Toggle AM/PM',
      },
      secondaryClock: {
        title: 'Secondary Clocks',
        description: 'Synced to primary date and time',
        clearAll: 'Clear all',
        clearAllAria: 'Clear all secondary clocks',
        addClock: 'Add clock',
        addClockAria: 'Add secondary clock',
        addClockTitle: 'Add secondary clock',
        addClockDescription: 'Choose another IANA time zone to track against the primary clock.',
        secondaryTimezone: 'Secondary time zone',
        add: 'Add',
        empty: 'No secondary clocks yet. Add a clock to compare regions.',
        dropPlaceholder: 'Drop to place clock',
        dragging: 'Dragging {{zone}}',
        removeAria: 'Remove {{zone}}',
        dragAria: 'Drag to reorder {{zone}}',
      },
      timezoneSelect: {
        selectTimezone: 'Select a time zone',
        searchPlaceholder: 'Search time zone...',
        notFound: 'No time zone found.',
      },
      warnings: {
        invalid: 'Selected date/time is invalid for this time zone. Falling back to current time.',
        adjusted: 'The selected local time did not exist due to DST. It was adjusted to {{time}}.',
        ambiguous: 'The selected local time is ambiguous due to DST end. Using the earlier occurrence.',
      },
      common: {
        close: 'Close',
        global: 'Global',
      },
      command: {
        title: 'Command Palette',
        description: 'Search for a command to run...',
      },
    },
  },
  es: {
    translation: {
      app: {
        tagline: 'Reloj mundial y conversor de zona horaria para equipos globales.',
        switchTheme: 'Cambiar al modo {{mode}}',
        light: 'claro',
        dark: 'oscuro',
        logoAlt: 'Logotipo de ChronoSync',
      },
      language: {
        label: 'Idioma',
      },
      overview: {
        title: 'Resumen del reloj mundial y conversor de zona horaria',
        description:
          'ChronoSync te ayuda a comparar horas entre ciudades, convertir horarios locales y elegir ventanas de reunión en equipos distribuidos. El reloj principal controla la fecha y hora de origen, mientras que los relojes secundarios se mantienen sincronizados para una comparación global instantánea.',
        subtitle: 'Para qué ayuda ChronoSync',
        item1: 'Convierte hora entre países y zonas horarias IANA.',
        item2: 'Consulta diferencias horarias actuales para equipos remotos y clientes.',
        item3: 'Planifica reuniones internacionales con conciencia de horario de verano.',
        item4: 'Supervisa múltiples oficinas desde una única referencia UTC.',
      },
      faq: {
        title: 'Preguntas frecuentes',
        q1: '¿ChronoSync gestiona el horario de verano?',
        a1: 'Sí. ChronoSync detecta horas locales ambiguas o inexistentes durante transiciones de DST y muestra una advertencia clara cuando se requiere un ajuste.',
        q2: '¿Puedo comparar más de una ciudad al mismo tiempo?',
        a2: 'Sí. Añade varios relojes secundarios y luego arrástralos para reordenarlos, para que tus regiones más importantes estén siempre primero.',
        q3: '¿ChronoSync es gratuito?',
        a3: 'Sí. ChronoSync es una aplicación en navegador y actualmente es gratuita.',
      },
      footer: {
        madeBy: 'Hecho con ❤️ en Nueva Zelanda por',
        githubAria: 'Ravi Patel en GitHub',
        githubTitle: 'GitHub',
        githubAlt: 'GitHub',
      },
      primaryClock: {
        badge: 'Principal',
        dragHint: 'Arrastra las manecillas para ajustar la hora',
        timezoneLabel: 'Zona horaria principal',
        currentZone: 'Zona principal actual',
        dateLabel: 'Fecha',
        selectDate: 'Seleccionar fecha',
        amPmToggle: 'Alternar AM/PM',
      },
      secondaryClock: {
        title: 'Relojes secundarios',
        description: 'Sincronizados con la fecha y hora principal',
        clearAll: 'Limpiar todo',
        clearAllAria: 'Limpiar todos los relojes secundarios',
        addClock: 'Agregar reloj',
        addClockAria: 'Agregar reloj secundario',
        addClockTitle: 'Agregar reloj secundario',
        addClockDescription: 'Elige otra zona horaria IANA para seguir junto al reloj principal.',
        secondaryTimezone: 'Zona horaria secundaria',
        add: 'Agregar',
        empty: 'Aún no hay relojes secundarios. Agrega uno para comparar regiones.',
        dropPlaceholder: 'Suelta para colocar el reloj',
        dragging: 'Arrastrando {{zone}}',
        removeAria: 'Quitar {{zone}}',
        dragAria: 'Arrastrar para reordenar {{zone}}',
      },
      timezoneSelect: {
        selectTimezone: 'Selecciona una zona horaria',
        searchPlaceholder: 'Buscar zona horaria...',
        notFound: 'No se encontró ninguna zona horaria.',
      },
      warnings: {
        invalid: 'La fecha/hora seleccionada no es válida para esta zona horaria. Se usará la hora actual.',
        adjusted: 'La hora local seleccionada no existía por el DST. Se ajustó a las {{time}}.',
        ambiguous: 'La hora local seleccionada es ambigua por el fin del DST. Se usa la primera ocurrencia.',
      },
      common: {
        close: 'Cerrar',
        global: 'Global',
      },
      command: {
        title: 'Paleta de comandos',
        description: 'Busca un comando para ejecutar...',
      },
    },
  },
  fr: {
    translation: {
      app: {
        tagline: 'Horloge mondiale et convertisseur de fuseaux horaires pour les équipes internationales.',
        switchTheme: 'Passer en mode {{mode}}',
        light: 'clair',
        dark: 'sombre',
        logoAlt: 'Logo ChronoSync',
      },
      language: {
        label: 'Langue',
      },
      overview: {
        title: 'Présentation de l’horloge mondiale et du convertisseur de fuseaux',
        description:
          'ChronoSync vous aide à comparer les heures entre villes, convertir des plannings locaux et choisir des créneaux de réunion pour des équipes distribuées. L’horloge principale contrôle la date et l’heure source, tandis que les horloges secondaires restent synchronisées pour une comparaison globale instantanée.',
        subtitle: 'Ce que ChronoSync permet',
        item1: 'Convertir l’heure entre pays et fuseaux IANA.',
        item2: 'Vérifier les écarts horaires actuels pour les équipes distantes et les clients.',
        item3: 'Planifier des réunions internationales avec gestion de l’heure d’été.',
        item4: 'Suivre plusieurs bureaux à partir d’une seule référence UTC.',
      },
      faq: {
        title: 'Questions fréquentes',
        q1: 'ChronoSync gère-t-il l’heure d’été ?',
        a1: 'Oui. ChronoSync détecte les heures locales ambiguës ou inexistantes pendant les transitions DST et affiche un avertissement clair lorsqu’un ajustement est nécessaire.',
        q2: 'Puis-je comparer plusieurs villes en même temps ?',
        a2: 'Oui. Ajoutez plusieurs horloges secondaires, puis faites-les glisser pour les réorganiser afin de garder vos régions les plus importantes en tête.',
        q3: 'ChronoSync est-il gratuit ?',
        a3: 'Oui. ChronoSync est une application web actuellement gratuite.',
      },
      footer: {
        madeBy: 'Créé avec ❤️ en Nouvelle-Zélande par',
        githubAria: 'Ravi Patel sur GitHub',
        githubTitle: 'GitHub',
        githubAlt: 'GitHub',
      },
      primaryClock: {
        badge: 'Principale',
        dragHint: 'Faites glisser les aiguilles pour régler l’heure',
        timezoneLabel: 'Fuseau horaire principal',
        currentZone: 'Fuseau principal actuel',
        dateLabel: 'Date',
        selectDate: 'Sélectionner une date',
        amPmToggle: 'Basculer AM/PM',
      },
      secondaryClock: {
        title: 'Horloges secondaires',
        description: 'Synchronisées avec la date et l’heure principales',
        clearAll: 'Tout effacer',
        clearAllAria: 'Effacer toutes les horloges secondaires',
        addClock: 'Ajouter une horloge',
        addClockAria: 'Ajouter une horloge secondaire',
        addClockTitle: 'Ajouter une horloge secondaire',
        addClockDescription: 'Choisissez un autre fuseau IANA à suivre avec l’horloge principale.',
        secondaryTimezone: 'Fuseau horaire secondaire',
        add: 'Ajouter',
        empty: 'Aucune horloge secondaire pour le moment. Ajoutez-en une pour comparer les régions.',
        dropPlaceholder: 'Déposez pour placer l’horloge',
        dragging: 'Glissement de {{zone}}',
        removeAria: 'Supprimer {{zone}}',
        dragAria: 'Glisser pour réordonner {{zone}}',
      },
      timezoneSelect: {
        selectTimezone: 'Sélectionnez un fuseau horaire',
        searchPlaceholder: 'Rechercher un fuseau horaire...',
        notFound: 'Aucun fuseau horaire trouvé.',
      },
      warnings: {
        invalid: 'La date/heure sélectionnée est invalide pour ce fuseau horaire. Retour à l’heure actuelle.',
        adjusted: 'L’heure locale sélectionnée n’existait pas à cause du DST. Elle a été ajustée à {{time}}.',
        ambiguous: 'L’heure locale sélectionnée est ambiguë à cause de la fin du DST. La première occurrence est utilisée.',
      },
      common: {
        close: 'Fermer',
        global: 'Global',
      },
      command: {
        title: 'Palette de commandes',
        description: 'Rechercher une commande à exécuter...',
      },
    },
  },
  de: {
    translation: {
      app: {
        tagline: 'Weltuhr und Zeitzonen-Konverter für globale Teams.',
        switchTheme: 'Zum {{mode}}-Modus wechseln',
        light: 'hell',
        dark: 'dunkel',
        logoAlt: 'ChronoSync-Logo',
      },
      language: {
        label: 'Sprache',
      },
      overview: {
        title: 'Überblick über Weltuhr und Zeitzonen-Konverter',
        description:
          'ChronoSync hilft dir dabei, Uhrzeiten zwischen Städten zu vergleichen, lokale Zeitpläne umzuwandeln und Meeting-Fenster für verteilte Teams zu finden. Die primäre Uhr steuert Datum und Uhrzeit der Quelle, während sekundäre Uhren für den sofortigen globalen Vergleich synchron bleiben.',
        subtitle: 'Wobei ChronoSync hilft',
        item1: 'Zeit zwischen Ländern und IANA-Zeitzonen umrechnen.',
        item2: 'Aktuelle Zeitunterschiede für Remote-Teams und Kunden prüfen.',
        item3: 'Internationale Meetings mit Sommerzeit-Berücksichtigung planen.',
        item4: 'Mehrere Standorte von einer UTC-Referenz aus verfolgen.',
      },
      faq: {
        title: 'Häufig gestellte Fragen',
        q1: 'Berücksichtigt ChronoSync die Sommerzeit?',
        a1: 'Ja. ChronoSync erkennt mehrdeutige und nicht existierende lokale Zeiten bei DST-Übergängen und zeigt bei Bedarf eine klare Warnung an.',
        q2: 'Kann ich mehrere Städte gleichzeitig vergleichen?',
        a2: 'Ja. Füge mehrere sekundäre Uhren hinzu und ordne sie per Drag-and-drop neu, damit wichtige Regionen immer zuerst sichtbar sind.',
        q3: 'Ist ChronoSync kostenlos nutzbar?',
        a3: 'Ja. ChronoSync ist eine browserbasierte App und derzeit kostenlos nutzbar.',
      },
      footer: {
        madeBy: 'Mit ❤️ in Neuseeland erstellt von',
        githubAria: 'Ravi Patel auf GitHub',
        githubTitle: 'GitHub',
        githubAlt: 'GitHub',
      },
      primaryClock: {
        badge: 'Primär',
        dragHint: 'Ziehe die Uhrzeiger, um die Uhrzeit einzustellen',
        timezoneLabel: 'Primäre Zeitzone',
        currentZone: 'Aktuelle primäre Zeitzone',
        dateLabel: 'Datum',
        selectDate: 'Datum auswählen',
        amPmToggle: 'AM/PM umschalten',
      },
      secondaryClock: {
        title: 'Sekundäre Uhren',
        description: 'Mit primärem Datum und Uhrzeit synchronisiert',
        clearAll: 'Alle löschen',
        clearAllAria: 'Alle sekundären Uhren löschen',
        addClock: 'Uhr hinzufügen',
        addClockAria: 'Sekundäre Uhr hinzufügen',
        addClockTitle: 'Sekundäre Uhr hinzufügen',
        addClockDescription: 'Wähle eine weitere IANA-Zeitzone, die mit der primären Uhr verfolgt werden soll.',
        secondaryTimezone: 'Sekundäre Zeitzone',
        add: 'Hinzufügen',
        empty: 'Noch keine sekundären Uhren. Füge eine Uhr hinzu, um Regionen zu vergleichen.',
        dropPlaceholder: 'Zum Platzieren der Uhr ablegen',
        dragging: '{{zone}} wird gezogen',
        removeAria: '{{zone}} entfernen',
        dragAria: 'Zum Neuordnen von {{zone}} ziehen',
      },
      timezoneSelect: {
        selectTimezone: 'Zeitzone auswählen',
        searchPlaceholder: 'Zeitzone suchen...',
        notFound: 'Keine Zeitzone gefunden.',
      },
      warnings: {
        invalid: 'Das gewählte Datum/die gewählte Uhrzeit ist für diese Zeitzone ungültig. Es wird auf die aktuelle Uhrzeit zurückgesetzt.',
        adjusted: 'Die gewählte lokale Uhrzeit existierte wegen DST nicht. Sie wurde auf {{time}} angepasst.',
        ambiguous: 'Die gewählte lokale Uhrzeit ist wegen DST-Ende mehrdeutig. Es wird die frühere Variante verwendet.',
      },
      common: {
        close: 'Schließen',
        global: 'Global',
      },
      command: {
        title: 'Befehls-Palette',
        description: 'Suche nach einem auszuführenden Befehl...',
      },
    },
  },
  hi: {
    translation: {
      app: {
        tagline: 'वैश्विक टीमों के लिए वर्ल्ड क्लॉक और टाइम ज़ोन कन्वर्टर।',
        switchTheme: '{{mode}} मोड में बदलें',
        light: 'लाइट',
        dark: 'डार्क',
        logoAlt: 'ChronoSync लोगो',
      },
      language: {
        label: 'भाषा',
      },
      overview: {
        title: 'टाइम ज़ोन कन्वर्टर और वर्ल्ड क्लॉक का अवलोकन',
        description:
          'ChronoSync आपको शहरों के समय की तुलना करने, लोकल शेड्यूल कन्वर्ट करने और वितरित टीमों के लिए मीटिंग विंडो चुनने में मदद करता है। प्राइमरी क्लॉक स्रोत तारीख और समय नियंत्रित करती है, जबकि सेकेंडरी क्लॉक्स तुरंत वैश्विक तुलना के लिए सिंक रहती हैं।',
        subtitle: 'ChronoSync किसमें मदद करता है',
        item1: 'देशों और IANA टाइम ज़ोन्स के बीच समय कन्वर्ट करें।',
        item2: 'रिमोट टीमों और क्लाइंट्स के लिए वर्तमान समय अंतर देखें।',
        item3: 'डेलाइट सेविंग के साथ अंतरराष्ट्रीय मीटिंग्स की योजना बनाएं।',
        item4: 'एक ही UTC रेफरेंस से कई ऑफिस लोकेशन्स ट्रैक करें।',
      },
      faq: {
        title: 'अक्सर पूछे जाने वाले सवाल',
        q1: 'क्या ChronoSync डेलाइट सेविंग टाइम संभालता है?',
        a1: 'हाँ। ChronoSync DST ट्रांज़िशन के दौरान अस्पष्ट और अस्तित्वहीन लोकल समय पहचानता है और समायोजन की जरूरत होने पर स्पष्ट चेतावनी दिखाता है।',
        q2: 'क्या मैं एक साथ एक से अधिक शहरों की तुलना कर सकता हूँ?',
        a2: 'हाँ। कई सेकेंडरी क्लॉक्स जोड़ें, फिर उन्हें ड्रैग करके रीऑर्डर करें ताकि आपके महत्वपूर्ण क्षेत्र सबसे ऊपर रहें।',
        q3: 'क्या ChronoSync मुफ़्त है?',
        a3: 'हाँ। ChronoSync एक ब्राउज़र-आधारित ऐप है और वर्तमान में मुफ्त है।',
      },
      footer: {
        madeBy: 'न्यूज़ीलैंड में ❤️ के साथ बनाया गया, द्वारा',
        githubAria: 'GitHub पर Ravi Patel',
        githubTitle: 'GitHub',
        githubAlt: 'GitHub',
      },
      primaryClock: {
        badge: 'प्राइमरी',
        dragHint: 'समय सेट करने के लिए क्लॉक हैंड्स ड्रैग करें',
        timezoneLabel: 'प्राइमरी टाइम ज़ोन',
        currentZone: 'वर्तमान प्राइमरी ज़ोन',
        dateLabel: 'तारीख',
        selectDate: 'तारीख चुनें',
        amPmToggle: 'AM/PM टॉगल करें',
      },
      secondaryClock: {
        title: 'सेकेंडरी क्लॉक्स',
        description: 'प्राइमरी तारीख और समय के साथ सिंक',
        clearAll: 'सभी हटाएँ',
        clearAllAria: 'सभी सेकेंडरी क्लॉक्स हटाएँ',
        addClock: 'क्लॉक जोड़ें',
        addClockAria: 'सेकेंडरी क्लॉक जोड़ें',
        addClockTitle: 'सेकेंडरी क्लॉक जोड़ें',
        addClockDescription: 'प्राइमरी क्लॉक के साथ ट्रैक करने के लिए एक और IANA टाइम ज़ोन चुनें।',
        secondaryTimezone: 'सेकेंडरी टाइम ज़ोन',
        add: 'जोड़ें',
        empty: 'अभी कोई सेकेंडरी क्लॉक नहीं है। क्षेत्रों की तुलना के लिए एक क्लॉक जोड़ें।',
        dropPlaceholder: 'क्लॉक रखने के लिए यहाँ छोड़ें',
        dragging: '{{zone}} को ड्रैग किया जा रहा है',
        removeAria: '{{zone}} हटाएँ',
        dragAria: '{{zone}} को रीऑर्डर करने के लिए ड्रैग करें',
      },
      timezoneSelect: {
        selectTimezone: 'एक टाइम ज़ोन चुनें',
        searchPlaceholder: 'टाइम ज़ोन खोजें...',
        notFound: 'कोई टाइम ज़ोन नहीं मिला।',
      },
      warnings: {
        invalid: 'चुनी गई तारीख/समय इस टाइम ज़ोन के लिए मान्य नहीं है। वर्तमान समय पर वापस जा रहे हैं।',
        adjusted: 'चुना गया लोकल समय DST के कारण मौजूद नहीं था। इसे {{time}} पर समायोजित किया गया।',
        ambiguous: 'चुना गया लोकल समय DST समाप्ति के कारण अस्पष्ट है। पहले वाले समय का उपयोग किया गया।',
      },
      common: {
        close: 'बंद करें',
        global: 'ग्लोबल',
      },
      command: {
        title: 'कमांड पैलेट',
        description: 'चलाने के लिए कोई कमांड खोजें...',
      },
    },
  },
  zh: {
    translation: {
      app: {
        tagline: '面向全球团队的世界时钟与时区转换器。',
        switchTheme: '切换到{{mode}}模式',
        light: '浅色',
        dark: '深色',
        logoAlt: 'ChronoSync 标志',
      },
      language: {
        label: '语言',
      },
      overview: {
        title: '时区转换器与世界时钟概览',
        description:
          'ChronoSync 可帮助你比较各城市时间、转换本地日程，并为分布式团队选择会议时间窗口。主时钟控制源日期和时间，次级时钟保持同步，以便进行即时全球对比。',
        subtitle: 'ChronoSync 可帮助你完成',
        item1: '在国家与 IANA 时区之间进行时间转换。',
        item2: '查看远程团队和客户的当前时差。',
        item3: '结合夏令时规划国际会议。',
        item4: '基于单一 UTC 参考跟踪多个办公地点。',
      },
      faq: {
        title: '常见问题',
        q1: 'ChronoSync 支持夏令时吗？',
        a1: '支持。ChronoSync 会在 DST 切换期间检测到模糊或不存在的本地时间，并在需要调整时给出清晰提示。',
        q2: '我可以同时比较多个城市吗？',
        a2: '可以。你可以添加多个次级时钟，并通过拖拽重新排序，让最重要的地区始终优先显示。',
        q3: 'ChronoSync 是免费的吗？',
        a3: '是的。ChronoSync 是一款基于浏览器的应用，目前免费使用。',
      },
      footer: {
        madeBy: '由 Ravi Patel 在新西兰用 ❤️ 制作',
        githubAria: 'Ravi Patel 的 GitHub',
        githubTitle: 'GitHub',
        githubAlt: 'GitHub',
      },
      primaryClock: {
        badge: '主时钟',
        dragHint: '拖动表针来设置时间',
        timezoneLabel: '主时区',
        currentZone: '当前主时区',
        dateLabel: '日期',
        selectDate: '选择日期',
        amPmToggle: '切换 AM/PM',
      },
      secondaryClock: {
        title: '次级时钟',
        description: '与主日期和时间同步',
        clearAll: '清除全部',
        clearAllAria: '清除所有次级时钟',
        addClock: '添加时钟',
        addClockAria: '添加次级时钟',
        addClockTitle: '添加次级时钟',
        addClockDescription: '选择另一个 IANA 时区，与主时钟一起追踪。',
        secondaryTimezone: '次级时区',
        add: '添加',
        empty: '暂无次级时钟。添加一个时钟以比较各地区时间。',
        dropPlaceholder: '拖放到此处以放置时钟',
        dragging: '正在拖动 {{zone}}',
        removeAria: '移除 {{zone}}',
        dragAria: '拖动以重新排序 {{zone}}',
      },
      timezoneSelect: {
        selectTimezone: '选择时区',
        searchPlaceholder: '搜索时区...',
        notFound: '未找到时区。',
      },
      warnings: {
        invalid: '所选日期/时间在此时区无效。已回退到当前时间。',
        adjusted: '所选本地时间因 DST 不存在，已调整为 {{time}}。',
        ambiguous: '所选本地时间因 DST 结束而存在歧义。将使用较早的时间。',
      },
      common: {
        close: '关闭',
        global: '全球',
      },
      command: {
        title: '命令面板',
        description: '搜索要执行的命令...',
      },
    },
  },
} as const

export default resources

export const normalizeLanguage = (language?: string | null): AppLanguage => {
  if (!language) {
    return 'en'
  }

  const normalized = language.toLowerCase()
  if (normalized.startsWith('es')) {
    return 'es'
  }

  if (normalized.startsWith('fr')) {
    return 'fr'
  }

  if (normalized.startsWith('de')) {
    return 'de'
  }

  if (normalized.startsWith('hi')) {
    return 'hi'
  }

  if (normalized.startsWith('zh')) {
    return 'zh'
  }

  return 'en'
}
