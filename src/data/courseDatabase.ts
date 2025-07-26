import { Course } from "@/lib/firebase";

export interface CourseData extends Course {
  modules?: {
    id: string;
    title: string;
    description: string;
    lessons: string[]; // lesson IDs
    duration: number;
  }[];
  certificate?: {
    available: boolean;
    requirements: string[];
    template: string;
  };
  resources?: {
    type: 'pdf' | 'link' | 'video' | 'tool';
    title: string;
    url: string;
    description: string;
  }[];
}

export const courseDatabase: CourseData[] = [
  {
    id: "1",
    title: "Elektroniker für Energie- und Gebäudetechnik - Grundlagen",
    description: "Umfassender Grundkurs für angehende Elektroniker. Lernen Sie die theoretischen Grundlagen und praktischen Anwendungen der Elektrotechnik von den Basics bis zu komplexen Schaltungen.",
    instructor: "instructor1",
    instructorName: "Dipl.-Ing. Thomas Schneider",
    thumbnailUrl: "",
    category: "Ausbildung",
    level: "beginner",
    duration: 600, // 10 hours
    requirements: [
      "Grundkenntnisse in Mathematik (Grundrechenarten, einfache Algebra)",
      "Interesse an Technik und Elektrizität",
      "Keine Vorerfahrung in der Elektrotechnik erforderlich"
    ],
    objectives: [
      "Grundlagen der Elektrizität verstehen",
      "Ohmsches Gesetz anwenden können",
      "Einfache Schaltungen berechnen",
      "VDE-Bestimmungen kennen",
      "Messgeräte bedienen können"
    ],
    tags: ["Elektrotechnik", "Grundlagen", "VDE", "Sicherheit"],
    rating: 4.8,
    enrolledCount: 1250,
    price: 0,
    isPro: false,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15",
    modules: [
      {
        id: "module1",
        title: "Grundlagen der Elektrizität",
        description: "Die Basis - Was ist Elektrizität und wie funktioniert sie?",
        lessons: ["lesson1", "lesson2", "lesson3"],
        duration: 120
      },
      {
        id: "module2", 
        title: "Ohmsches Gesetz und Grundschaltungen",
        description: "Das wichtigste Gesetz der Elektrotechnik",
        lessons: ["lesson4", "lesson5", "lesson6"],
        duration: 150
      }
    ],
    certificate: {
      available: true,
      requirements: [
        "Alle Lektionen erfolgreich abgeschlossen",
        "Alle Quiz mit mindestens 70% bestanden"
      ],
      template: "grundlagen_elektrotechnik"
    },
    resources: [
      {
        type: 'pdf',
        title: 'VDE 0100 Grundlagen',
        url: '/resources/vde-guide.pdf',
        description: 'Wichtige VDE-Bestimmungen für Einsteiger'
      }
    ],
    lessons: [
      {
        id: "lesson1",
        title: "Was ist Elektrizität? - Die Grundlagen",
        description: "Verstehen Sie die fundamentalen Konzepte der Elektrizität",
        type: "video",
        content: {
          videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
          textContent: "# Willkommen zur Elektrotechnik!\n\n## Was ist Elektrizität?\n\nElektrizität ist eine Form der Energie, die durch die Bewegung von Elektronen entsteht. In dieser Lektion lernen Sie die Grundlagen kennen:\n\n- Aufbau von Atomen\n- Elektronenbewegung\n- Grundbegriffe der Elektrotechnik\n\nStellen Sie sich Elektrizität wie Wasser in einem Rohr vor - diese Analogie hilft beim Verstehen!"
        },
        duration: 45,
        isCompleted: false,
        order: 1
      },
      {
        id: "lesson2",
        title: "Spannung, Strom und Widerstand",
        description: "Die drei Grundgrößen der Elektrotechnik",
        type: "text",
        content: {
          textContent: "# Spannung, Strom und Widerstand\n\nDie drei wichtigsten Grundgrößen in der Elektrotechnik:\n\n## 1. Elektrische Spannung (U)\n**Einheit: Volt (V)**\n**Formelzeichen: U**\n\nDie elektrische Spannung ist die Ursache für den elektrischen Strom.\n\n### Beispiele:\n- Batterie AA: 1,5 V\n- Autobatterie: 12 V\n- Haushaltssteckdose: 230 V\n\n## 2. Elektrischer Strom (I)\n**Einheit: Ampere (A)**\n**Formelzeichen: I**\n\nDer elektrische Strom ist die gerichtete Bewegung von Ladungsträgern.\n\n### Stromstärken im Alltag:\n- LED-Lampe: 0,02 A (20 mA)\n- Smartphone-Ladegerät: 2 A\n- Waschmaschine: 10 A\n\n### Gefährlichkeit:\n- Ab 1 mA: Spürbar\n- Ab 30 mA: Lebensgefährlich\n\n## 3. Elektrischer Widerstand (R)\n**Einheit: Ohm (Ω)**\n**Formelzeichen: R**\n\nDer elektrische Widerstand hemmt den Stromfluss.\n\n## Das Ohm'sche Gesetz\n**U = R × I**\n\nOder umgestellt:\n- I = U / R\n- R = U / I\n\n### Praktisches Beispiel:\nEin Widerstand von 100 Ω wird mit 12 V betrieben.\n**Gesucht:** Der Strom\n\n**Lösung:** I = U / R = 12 V / 100 Ω = 0,12 A = 120 mA\n\n## Übungsaufgaben:\n\n1. Berechnen Sie den Strom: U = 24 V, R = 8 Ω\n2. Berechnen Sie den Widerstand: U = 9 V, I = 0,5 A\n\n### Lösungen:\n1. I = 24V/8Ω = 3 A\n2. R = 9V/0,5A = 18 Ω"
        },
        duration: 60,
        isCompleted: false,
        order: 2
      },
      {
        id: "lesson3",
        title: "Wissenstest: Elektrotechnik Grundlagen",
        description: "Testen Sie Ihr Wissen über die Grundlagen",
        type: "quiz",
        content: {
          quiz: {
            id: "quiz1",
            title: "Grundlagen der Elektrotechnik",
            questions: [
              {
                id: "q1",
                question: "Was ist die Einheit der elektrischen Spannung?",
                type: "multiple_choice",
                options: ["Ampere (A)", "Volt (V)", "Ohm (Ω)", "Watt (W)"],
                correctAnswer: "Volt (V)",
                explanation: "Die Einheit der elektrischen Spannung ist Volt (V), benannt nach Alessandro Volta.",
                points: 10
              },
              {
                id: "q2",
                question: "Das Ohm'sche Gesetz lautet:",
                type: "multiple_choice", 
                options: ["U = R + I", "U = R × I", "U = R / I", "U = R - I"],
                correctAnswer: "U = R × I",
                explanation: "Das Ohm'sche Gesetz besagt: Spannung = Widerstand × Strom.",
                points: 15
              },
              {
                id: "q3",
                question: "Ein Widerstand von 5 Ω wird mit 10 V betrieben. Wie groß ist der Strom?",
                type: "multiple_choice",
                options: ["1 A", "2 A", "5 A", "50 A"],
                correctAnswer: "2 A", 
                explanation: "I = U/R = 10V/5Ω = 2A",
                points: 15
              }
            ],
            timeLimit: 15,
            passingScore: 70,
            maxAttempts: 3
          }
        },
        duration: 15,
        isCompleted: false,
        order: 3
      },
      {
        id: "lesson4",
        title: "Elektrische Schaltungen - Grundlagen",
        description: "Lernen Sie verschiedene Arten von Schaltungen kennen",
        type: "text",
        content: {
          textContent: "# Elektrische Schaltungen\n\n## Was ist eine elektrische Schaltung?\n\nEine elektrische Schaltung ist ein geschlossener Stromkreis aus:\n- Stromquelle (Batterie, Generator)\n- Verbraucher (Glühbirne, Motor)\n- Leitungen (Drähte, Kabel)\n- Schaltelemente (Schalter, Sicherungen)\n\n## 1. Reihenschaltung\n\n### Eigenschaften:\n- Alle Bauteile hintereinander geschaltet\n- Strom überall gleich: I1 = I2 = I3\n- Spannungen addieren sich: U_gesamt = U1 + U2 + U3\n- Widerstände addieren sich: R_gesamt = R1 + R2 + R3\n\n### Beispiel:\n3 Widerstände: R1 = 10Ω, R2 = 20Ω, R3 = 30Ω bei 12V\n\n**Berechnung:**\n- R_gesamt = 10Ω + 20Ω + 30Ω = 60Ω\n- I = U/R = 12V/60Ω = 0,2A\n- U1 = 10Ω × 0,2A = 2V\n- U2 = 20Ω × 0,2A = 4V\n- U3 = 30Ω × 0,2A = 6V\n\n**Kontrolle:** 2V + 4V + 6V = 12V ✓\n\n## 2. Parallelschaltung\n\n### Eigenschaften:\n- Alle Bauteile nebeneinander\n- Spannung überall gleich: U1 = U2 = U3\n- Ströme addieren sich: I_gesamt = I1 + I2 + I3\n- Kehrwert der Widerstände: 1/R_gesamt = 1/R1 + 1/R2 + 1/R3\n\n### Vorteile:\n- Jedes Bauteil bekommt die volle Spannung\n- Bei Ausfall funktionieren andere weiter\n- Jedes Bauteil einzeln schaltbar\n\n## Kirchhoff'sche Gesetze\n\n### 1. Knotenpunktregel:\n**Zuefließende Ströme = Abfließende Ströme**\n\n### 2. Maschenregel:\n**Summe aller Spannungen in einer Masche = 0**\n\n## Praktische Anwendungen:\n\n### Haushalt:\n- Lichtschalter: Reihenschaltung mit Lampe\n- Steckdosen: Parallelschaltung\n\n### Fahrzeug:\n- Beleuchtung: Parallelschaltung\n- Sicherungen: Reihenschaltung mit Verbrauchern"
        },
        duration: 75,
        isCompleted: false,
        order: 4
      },
      {
        id: "lesson5",
        title: "Sicherheit in der Elektrotechnik",
        description: "VDE-Bestimmungen und Sicherheitsregeln",
        type: "video",
        content: {
          videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
          textContent: "# Sicherheit in der Elektrotechnik\n\n**Sicherheit hat IMMER oberste Priorität!**\n\n## Die 5 Sicherheitsregeln\n\n### 1. Freischalten\n- Anlage vollständig spannungsfrei schalten\n- Alle Pole trennen\n- Sicherungen herausnehmen\n\n### 2. Gegen Wiedereinschalten sichern\n- Sicherungen entfernen oder abschließen\n- Schalter blockieren\n- Warnschilder anbringen\n\n### 3. Spannungsfreiheit prüfen\n- Mit geeignetem Spannungsprüfer testen\n- An allen Leitern prüfen\n- Prüfgerät vorher und nachher testen\n\n### 4. Erden und Kurzschließen\n- Alle Leiter erden\n- Leiter untereinander kurzschließen\n\n### 5. Benachbarte Teile abdecken\n- Isoliermatten auslegen\n- Abdeckungen anbringen\n- Arbeitsbereich absperren\n\n## Schutzarten (IP-Code)\n\n### IP XY\n- X = Schutz gegen Berührung (0-6)\n- Y = Schutz gegen Wasser (0-9)\n\n### Beispiele:\n- IP20: Schutz gegen Finger, kein Wasserschutz\n- IP44: Schutz gegen Draht, spritzwasserdicht\n- IP65: Staubdicht, strahlwasserdicht\n\n## Schutzklassen\n\n### Schutzklasse I\n- Schutzleiter erforderlich\n- Metallgehäuse mit Schutzleiter verbunden\n\n### Schutzklasse II\n- Verstärkte Isolation\n- Kein Schutzleiter erforderlich\n\n### Schutzklasse III\n- Schutzkleinspannung\n- Max. 50V Wechselspannung\n\n## Persönliche Schutzausrüstung\n\n### Grundausstattung:\n- Schutzhelm mit Kinnriemen\n- Sicherheitsschuhe (isolierend)\n- Arbeitshandschuhe (isolierend)\n- Schutzbrille\n\n## Erste Hilfe bei Elektrounfällen\n\n### Sofortmaßnahmen:\n1. **Eigenschutz beachten!**\n2. Stromzufuhr unterbrechen\n3. Bei Bewusstlosigkeit: Notruf 112\n4. Atemkontrolle, ggf. Beatmung\n5. Bei Herzstillstand: Wiederbelebung\n\n**Merksatz: Sicherheit ist kein Zufall - sie ist das Ergebnis sorgfältiger Planung!**"
        },
        duration: 90,
        isCompleted: false,
        order: 5
      }
    ]
  },
  {
    id: "2", 
    title: "SPS-Programmierung für Einsteiger",
    description: "Lernen Sie die Grundlagen der SPS-Programmierung mit praktischen Beispielen. Von ersten Schritten bis zu komplexen Steuerungen.",
    instructor: "instructor2",
    instructorName: "Meister Elektronik Andreas Weber", 
    thumbnailUrl: "",
    category: "Automatisierung",
    level: "intermediate",
    duration: 720, // 12 hours
    requirements: [
      "Grundkenntnisse in Elektrotechnik",
      "Verständnis von Schaltplänen",
      "Logisches Denkvermögen"
    ],
    objectives: [
      "SPS-Hardware verstehen",
      "Grundlagen der SPS-Programmierung",
      "Programme in FUP und KOP erstellen",
      "Ein-/Ausgänge konfigurieren",
      "Automatisierungsaufgaben lösen"
    ],
    tags: ["SPS", "Automatisierung", "Siemens", "Programmierung"],
    rating: 4.7,
    enrolledCount: 890,
    price: 0,
    isPro: false,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-20",
    lessons: [
      {
        id: "sps_lesson1",
        title: "Was ist eine SPS? - Grundlagen der Automatisierung", 
        description: "Einführung in die Welt der speicherprogrammierbaren Steuerungen",
        type: "video",
        content: {
          videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          textContent: "# SPS - Speicherprogrammierbare Steuerung\n\n## Was ist eine SPS?\n\nEine **Speicherprogrammierbare Steuerung (SPS)** ist ein digitaler Computer für die Steuerung von Maschinen und Anlagen.\n\n## Aufgaben einer SPS:\n- **Eingänge lesen**: Sensoren, Schalter, Messgeräte\n- **Programm abarbeiten**: Logische Verknüpfungen\n- **Ausgänge setzen**: Aktoren, Ventile, Motoren\n- **Kommunikation**: Mit anderen Systemen\n\n## Vorteile:\n✓ **Flexibel**: Änderungen durch Umprogrammieren\n✓ **Kostengünstig**: Weniger Verdrahtung\n✓ **Zuverlässig**: Industrietauglich und robust\n✓ **Diagnosefähig**: Fehler schnell finden\n✓ **Erweiterbar**: Module nachträglich hinzufügen\n\n## SPS vs. Klassische Steuerung:\n\n### Klassische Steuerung:\n- Relais und Schütze\n- Feste Verdrahtung\n- Änderungen = Umbau\n- Große Schaltschränke\n\n### SPS-Steuerung:\n- Software-basiert\n- Flexible Programmierung\n- Änderungen = Umprogrammieren\n- Kompakte Bauweise\n\nDiese Lektion gibt Ihnen den perfekten Einstieg in die SPS-Welt!"
        },
        duration: 40,
        isCompleted: false,
        order: 1
      }
    ]
  },
  {
    id: "3",
    title: "Photovoltaik Techniker - Solarenergie verstehen",
    description: "Werden Sie zum Experten für Photovoltaik-Anlagen. Von den Grundlagen bis zur professionellen Installation.",
    instructor: "instructor3", 
    instructorName: "Dipl.-Ing. (FH) Sarah Müller",
    thumbnailUrl: "",
    category: "Erneuerbare Energien",
    level: "intermediate", 
    duration: 900, // 15 hours
    requirements: [
      "Grundausbildung als Elektroniker",
      "Erfahrung in der Elektroinstallation",
      "Kenntnisse der VDE-Bestimmungen"
    ],
    objectives: [
      "Funktionsweise von Solarzellen verstehen",
      "PV-Anlagen dimensionieren und planen",
      "Installation fachgerecht durchführen",
      "Inbetriebnahme und Dokumentation"
    ],
    tags: ["Photovoltaik", "Solar", "Erneuerbare Energien", "Installation"],
    rating: 4.9,
    enrolledCount: 420,
    price: 0,
    isPro: true,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-18",
    lessons: [
      {
        id: "pv_lesson1",
        title: "Grundlagen der Solarenergie",
        description: "Wie funktioniert Photovoltaik und warum ist sie wichtig?",
        type: "video",
        content: {
          videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          textContent: "# Photovoltaik - Energie der Zukunft\n\n## Der Photoeffekt\n\nDie Grundlage jeder Solarzelle ist der **photoelektrische Effekt**, für den Albert Einstein 1921 den Nobelpreis erhielt.\n\n### Funktionsweise:\n1. **Photonen** (Lichtteilchen) treffen auf Halbleitermaterial\n2. **Elektronen** werden aus Bindungen gelöst\n3. **Gleichstrom** entsteht durch gerichtete Elektronenbewegung\n4. **Wechselrichter** wandelt DC in AC um\n\n## Warum Photovoltaik?\n\n♻️ **Umweltfreundlich**: Keine CO₂-Emissionen im Betrieb\n💰 **Wirtschaftlich**: Sinkende Kosten, steigende Strompreise\n🔄 **Nachhaltig**: 25+ Jahre Betriebsdauer\n🏠 **Dezentral**: Jeder kann Produzent werden\n\n## Solarzellen-Typen:\n\n### Monokristallin:\n- Höchster Wirkungsgrad (20-22%)\n- Dunkelblau bis schwarz\n- Teurer in der Herstellung\n\n### Polykristallin:\n- Mittlerer Wirkungsgrad (16-18%)\n- Blau schimmernd\n- Gutes Preis-Leistungs-Verhältnis\n\n### Dünnschicht:\n- Niedrigerer Wirkungsgrad (8-12%)\n- Flexibel einsetzbar\n- Günstig in der Herstellung\n\n## Systemkomponenten:\n\n1. **Solarmodule**: Wandeln Licht in Strom\n2. **Wechselrichter**: DC zu AC Wandlung\n3. **Montagesystem**: Befestigung auf Dach\n4. **Verkabelung**: DC und AC Leitungen\n5. **Zähler**: Messen Erzeugung und Verbrauch\n6. **Überwachung**: Kontrolle der Anlage\n\n## Standortfaktoren:\n\n### Optimal:\n- Südausrichtung (Azimut 180°)\n- Neigung 30-35°\n- Keine Verschattung\n- Stabile Dachkonstruktion\n\n### Akzeptabel:\n- Südost bis Südwest\n- Neigung 20-50°\n- Minimale Verschattung\n\nDie Sonne liefert in einer Stunde mehr Energie zur Erde, als die Menschheit in einem ganzen Jahr verbraucht!"
        },
        duration: 45,
        isCompleted: false,
        order: 1
      }
    ]
  }
];

// Helper functions
export const getCourseById = (id: string): CourseData | undefined => {
  return courseDatabase.find(course => course.id === id);
};

export const getCoursesByCategory = (category: string): CourseData[] => {
  return courseDatabase.filter(course => course.category === category);
};

export const getCoursesByLevel = (level: string): CourseData[] => {
  return courseDatabase.filter(course => course.level === level);
};

export const searchCourses = (query: string): CourseData[] => {
  const lowercaseQuery = query.toLowerCase();
  return courseDatabase.filter(course => 
    course.title.toLowerCase().includes(lowercaseQuery) ||
    course.description.toLowerCase().includes(lowercaseQuery) ||
    course.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};