import { generatedUsQuestionBank } from "@/lib/generated-us-trivia"
import { generatedQuestionBank } from "@/lib/generated-world-trivia"

export type CategoryId =
  | "us-geography"
  | "world-geography"
  | "world-countries"
  | "major-rivers"
  | "us-presidents"

export type QuestionDifficulty = "medium" | "hard"

export type CategoryDetails = {
  id: CategoryId
  title: string
  blurb: string
  accent: string
}

export type Question = {
  id: string
  category: CategoryId
  prompt: string
  choices: readonly string[]
  answer: string | readonly string[]
  explanation: string
  difficulty?: QuestionDifficulty
}

export type QuizQuestion = Question & {
  shuffledChoices: string[]
}

export const categoryDetails: Record<CategoryId, CategoryDetails> = {
  "us-geography": {
    id: "us-geography",
    title: "U.S. Geography",
    blurb: "States, capitals, landmarks, and regional basics.",
    accent: "from-red-500/20 via-amber-300/20 to-sky-500/20",
  },
  "world-geography": {
    id: "world-geography",
    title: "World Geography",
    blurb: "Continents, landmarks, deserts, and broad global knowledge.",
    accent: "from-cyan-500/20 via-emerald-300/20 to-indigo-500/20",
  },
  "world-countries": {
    id: "world-countries",
    title: "World Countries",
    blurb: "Full country coverage with capitals, borders, and subregion clues.",
    accent: "from-sky-500/20 via-cyan-300/20 to-emerald-500/20",
  },
  "major-rivers": {
    id: "major-rivers",
    title: "Major Rivers",
    blurb:
      "Route, basin, and endpoint questions across the world's best-known rivers.",
    accent: "from-blue-500/20 via-teal-300/20 to-cyan-500/20",
  },
  "us-presidents": {
    id: "us-presidents",
    title: "U.S. Presidents",
    blurb: "Common presidential facts, timelines, and milestones.",
    accent: "from-blue-500/20 via-slate-300/20 to-red-500/20",
  },
}

const usGeographyQuestions: Question[] = [
  {
    id: "usgeo-1",
    category: "us-geography",
    prompt: "Which U.S. state is the largest by area?",
    choices: ["Texas", "California", "Alaska", "Montana"],
    answer: "Alaska",
    explanation: "Alaska is the largest U.S. state by land area.",
  },
  {
    id: "usgeo-2",
    category: "us-geography",
    prompt: "What is the capital of California?",
    choices: ["Los Angeles", "San Diego", "Sacramento", "San Francisco"],
    answer: "Sacramento",
    explanation: "Sacramento has been California's capital since 1854.",
  },
  {
    id: "usgeo-3",
    category: "us-geography",
    prompt: "Which Great Lake lies entirely within the United States?",
    choices: ["Lake Erie", "Lake Superior", "Lake Huron", "Lake Michigan"],
    answer: "Lake Michigan",
    explanation:
      "Lake Michigan is the only Great Lake entirely within U.S. borders.",
  },
  {
    id: "usgeo-4",
    category: "us-geography",
    prompt: "Mount Rushmore is located in which state?",
    choices: ["Wyoming", "South Dakota", "North Dakota", "Colorado"],
    answer: "South Dakota",
    explanation:
      "Mount Rushmore National Memorial is in the Black Hills of South Dakota.",
  },
  {
    id: "usgeo-5",
    category: "us-geography",
    prompt: "Which river forms much of the border between Texas and Mexico?",
    choices: [
      "Colorado River",
      "Rio Grande",
      "Arkansas River",
      "Missouri River",
    ],
    answer: "Rio Grande",
    explanation:
      "The Rio Grande defines a large stretch of the Texas-Mexico border.",
  },
  {
    id: "usgeo-6",
    category: "us-geography",
    prompt: "Which city is nicknamed the Mile High City?",
    choices: ["Phoenix", "Salt Lake City", "Denver", "Santa Fe"],
    answer: "Denver",
    explanation: "Denver sits about one mile above sea level.",
  },
  {
    id: "usgeo-7",
    category: "us-geography",
    prompt: "Which U.S. state is known as the Sunshine State?",
    choices: ["Arizona", "Hawaii", "Florida", "California"],
    answer: "Florida",
    explanation: "Florida's official nickname is the Sunshine State.",
  },
  {
    id: "usgeo-8",
    category: "us-geography",
    prompt: "What is the smallest U.S. state by area?",
    choices: ["Delaware", "Connecticut", "Rhode Island", "New Jersey"],
    answer: "Rhode Island",
    explanation: "Rhode Island is the smallest state by total area.",
  },
  {
    id: "usgeo-9",
    category: "us-geography",
    prompt: "Which ocean borders the East Coast of the United States?",
    choices: [
      "Pacific Ocean",
      "Atlantic Ocean",
      "Arctic Ocean",
      "Indian Ocean",
    ],
    answer: "Atlantic Ocean",
    explanation: "The Atlantic Ocean runs along the eastern seaboard.",
  },
  {
    id: "usgeo-10",
    category: "us-geography",
    prompt: "What is the capital of Texas?",
    choices: ["Dallas", "Houston", "San Antonio", "Austin"],
    answer: "Austin",
    explanation: "Austin is the capital city of Texas.",
  },
]

const advancedUsGeographyQuestions: Question[] = [
  {
    id: "usgeo-adv-1",
    category: "us-geography",
    prompt: "Select the four states that meet at Four Corners.",
    choices: ["Arizona", "Colorado", "New Mexico", "Utah"],
    answer: ["Arizona", "Colorado", "New Mexico", "Utah"],
    explanation:
      "The Four Corners monument marks the meeting point of Arizona, Colorado, New Mexico, and Utah.",
    difficulty: "hard",
  },
  {
    id: "usgeo-adv-2",
    category: "us-geography",
    prompt: "Select the New England states from this list.",
    choices: ["Maine", "New Hampshire", "Vermont", "Oregon"],
    answer: ["Maine", "New Hampshire", "Vermont"],
    explanation:
      "Maine, New Hampshire, and Vermont are all in New England. Oregon is not.",
    difficulty: "hard",
  },
  {
    id: "usgeo-adv-3",
    category: "us-geography",
    prompt: "Select the Gulf Coast states from this list.",
    choices: ["Texas", "Louisiana", "Mississippi", "Georgia"],
    answer: ["Texas", "Louisiana", "Mississippi"],
    explanation:
      "Texas, Louisiana, and Mississippi are Gulf Coast states. Georgia is on the Atlantic.",
    difficulty: "hard",
  },
  {
    id: "usgeo-adv-4",
    category: "us-geography",
    prompt:
      "Which state has coastline on both the Atlantic Ocean and the Gulf of Mexico?",
    choices: ["Florida", "Texas", "Louisiana", "North Carolina"],
    answer: "Florida",
    explanation:
      "Florida borders both the Atlantic Ocean and the Gulf of Mexico.",
    difficulty: "medium",
  },
  {
    id: "usgeo-adv-5",
    category: "us-geography",
    prompt: "Which state borders both Oregon and Mexico?",
    choices: ["California", "Arizona", "Nevada", "New Mexico"],
    answer: "California",
    explanation:
      "California borders Oregon to the north and Mexico to the south.",
    difficulty: "hard",
  },
  {
    id: "usgeo-adv-6",
    category: "us-geography",
    prompt: "Which state borders both Canada and the Atlantic Ocean?",
    choices: ["Maine", "Michigan", "New York", "Washington"],
    answer: "Maine",
    explanation: "Maine borders Canada and also has Atlantic coastline.",
    difficulty: "hard",
  },
  {
    id: "usgeo-adv-7",
    category: "us-geography",
    prompt: "Select the Pacific Coast states from this list.",
    choices: ["California", "Oregon", "Washington", "Nevada"],
    answer: ["California", "Oregon", "Washington"],
    explanation:
      "California, Oregon, and Washington border the Pacific. Nevada does not.",
    difficulty: "hard",
  },
  {
    id: "usgeo-adv-8",
    category: "us-geography",
    prompt: "Which pair are the two noncontiguous U.S. states?",
    choices: [
      "Alaska and Hawaii",
      "Alaska and Washington",
      "Hawaii and California",
      "Alaska and Oregon",
    ],
    answer: "Alaska and Hawaii",
    explanation:
      "Alaska and Hawaii are the two states not connected to the contiguous United States.",
    difficulty: "medium",
  },
  {
    id: "usgeo-adv-9",
    category: "us-geography",
    prompt: "Which state is home to both Las Vegas and Hoover Dam?",
    choices: ["Nevada", "Arizona", "Utah", "New Mexico"],
    answer: "Nevada",
    explanation:
      "Las Vegas and Hoover Dam are both in Nevada, near the Arizona border.",
    difficulty: "medium",
  },
  {
    id: "usgeo-adv-10",
    category: "us-geography",
    prompt: "Which state contains the Grand Canyon?",
    choices: ["Utah", "Arizona", "Nevada", "Colorado"],
    answer: "Arizona",
    explanation: "The Grand Canyon is in northern Arizona.",
    difficulty: "medium",
  },
  {
    id: "usgeo-adv-11",
    category: "us-geography",
    prompt:
      "Select the states in this list that border at least one Great Lake.",
    choices: ["Minnesota", "Illinois", "Michigan", "Iowa"],
    answer: ["Minnesota", "Illinois", "Michigan"],
    explanation:
      "Minnesota, Illinois, and Michigan border the Great Lakes. Iowa does not.",
    difficulty: "hard",
  },
  {
    id: "usgeo-adv-12",
    category: "us-geography",
    prompt: "Which state contains both the Badlands and Mount Rushmore?",
    choices: ["Wyoming", "Montana", "South Dakota", "North Dakota"],
    answer: "South Dakota",
    explanation: "Both the Badlands and Mount Rushmore are in South Dakota.",
    difficulty: "medium",
  },
  {
    id: "usgeo-adv-13",
    category: "us-geography",
    prompt: "Which two states share the Kansas City metro area?",
    choices: [
      "Kansas and Missouri",
      "Kansas and Nebraska",
      "Missouri and Arkansas",
      "Kansas and Oklahoma",
    ],
    answer: "Kansas and Missouri",
    explanation: "Kansas City spans the Kansas-Missouri state line.",
    difficulty: "hard",
  },
  {
    id: "usgeo-adv-14",
    category: "us-geography",
    prompt: "Which state is nicknamed the Last Frontier?",
    choices: ["Montana", "Alaska", "Wyoming", "Idaho"],
    answer: "Alaska",
    explanation: "Alaska is nicknamed the Last Frontier.",
    difficulty: "medium",
  },
  {
    id: "usgeo-adv-15",
    category: "us-geography",
    prompt:
      "Which river forms much of the border between Indiana and Kentucky?",
    choices: [
      "Tennessee River",
      "Mississippi River",
      "Ohio River",
      "Wabash River",
    ],
    answer: "Ohio River",
    explanation: "The Ohio River forms much of Kentucky's border with Indiana.",
    difficulty: "hard",
  },
]

const worldGeographyQuestions: Question[] = [
  {
    id: "world-1",
    category: "world-geography",
    prompt: "What is the largest hot desert in the world?",
    choices: ["Gobi", "Kalahari", "Sahara", "Arabian Desert"],
    answer: "Sahara",
    explanation: "The Sahara is the largest hot desert on Earth.",
    difficulty: "medium",
  },
  {
    id: "world-2",
    category: "world-geography",
    prompt: "Which continent has the most countries?",
    choices: ["Asia", "Europe", "Africa", "South America"],
    answer: "Africa",
    explanation: "Africa has more sovereign states than any other continent.",
    difficulty: "medium",
  },
  {
    id: "world-3",
    category: "world-geography",
    prompt: "Machu Picchu is located in which country?",
    choices: ["Chile", "Peru", "Bolivia", "Ecuador"],
    answer: "Peru",
    explanation: "Machu Picchu is the famous Inca citadel in Peru.",
    difficulty: "medium",
  },
  {
    id: "world-4",
    category: "world-geography",
    prompt: "Mount Kilimanjaro is located in which country?",
    choices: ["Kenya", "Tanzania", "Uganda", "Ethiopia"],
    answer: "Tanzania",
    explanation: "Kilimanjaro, Africa's highest peak, is in Tanzania.",
    difficulty: "medium",
  },
  {
    id: "world-5",
    category: "world-geography",
    prompt:
      "Which line of latitude divides Earth into the Northern and Southern Hemispheres?",
    choices: ["Prime Meridian", "Tropic of Cancer", "Arctic Circle", "Equator"],
    answer: "Equator",
    explanation: "The Equator marks 0 degrees latitude.",
    difficulty: "medium",
  },
  {
    id: "world-6",
    category: "world-geography",
    prompt: "Which sea lies between southern Europe and northern Africa?",
    choices: ["Black Sea", "Red Sea", "Mediterranean Sea", "Arabian Sea"],
    answer: "Mediterranean Sea",
    explanation:
      "The Mediterranean Sea separates Europe from Africa in that region.",
    difficulty: "medium",
  },
  {
    id: "world-7",
    category: "world-geography",
    prompt:
      "Which mountain range separates much of Europe from Asia in Russia?",
    choices: ["Alps", "Caucasus", "Urals", "Pyrenees"],
    answer: "Urals",
    explanation:
      "The Ural Mountains are a traditional geographic boundary between Europe and Asia.",
    difficulty: "hard",
  },
  {
    id: "world-8",
    category: "world-geography",
    prompt: "Which strait separates Alaska from eastern Russia?",
    choices: [
      "Strait of Gibraltar",
      "Bering Strait",
      "Bosporus",
      "Strait of Malacca",
    ],
    answer: "Bering Strait",
    explanation:
      "The Bering Strait lies between Alaska and Russia's Chukotka Peninsula.",
    difficulty: "hard",
  },
  {
    id: "world-9",
    category: "world-geography",
    prompt: "Which plateau is often called the Roof of the World?",
    choices: [
      "Deccan Plateau",
      "Patagonian Plateau",
      "Tibetan Plateau",
      "Colorado Plateau",
    ],
    answer: "Tibetan Plateau",
    explanation:
      "The Tibetan Plateau is often called the Roof of the World because of its very high elevation.",
    difficulty: "hard",
  },
  {
    id: "world-10",
    category: "world-geography",
    prompt: "Which canal connects the Mediterranean Sea to the Red Sea?",
    choices: ["Panama Canal", "Kiel Canal", "Suez Canal", "Corinth Canal"],
    answer: "Suez Canal",
    explanation:
      "The Suez Canal links the Mediterranean Sea and the Red Sea through Egypt.",
    difficulty: "medium",
  },
]

const advancedWorldGeographyQuestions: Question[] = [
  {
    id: "world-adv-1",
    category: "world-geography",
    prompt:
      "Select the South American countries whose land territory lies on the Equator.",
    choices: ["Brazil", "Colombia", "Ecuador", "Peru"],
    answer: ["Brazil", "Colombia", "Ecuador"],
    explanation:
      "In South America, the Equator crosses Ecuador, Colombia, and Brazil, but not Peru.",
    difficulty: "hard",
  },
  {
    id: "world-adv-2",
    category: "world-geography",
    prompt:
      "Select the African countries whose land territory lies on the Equator.",
    choices: ["Gabon", "Kenya", "Uganda", "Tanzania"],
    answer: ["Gabon", "Kenya", "Uganda"],
    explanation:
      "The Equator crosses Gabon, Kenya, and Uganda. Tanzania lies just south of it.",
    difficulty: "hard",
  },
  {
    id: "world-adv-3",
    category: "world-geography",
    prompt: "Which of these countries does not actually lie on the Equator?",
    choices: ["Ecuador", "Indonesia", "Colombia", "Equatorial Guinea"],
    answer: "Equatorial Guinea",
    explanation:
      "Despite its name, Equatorial Guinea is close to the Equator but its mainland does not lie on it.",
    difficulty: "hard",
  },
  {
    id: "world-adv-4",
    category: "world-geography",
    prompt:
      "Which country is the only one with land on both the Equator and the Tropic of Capricorn?",
    choices: [
      "Brazil",
      "Indonesia",
      "Democratic Republic of the Congo",
      "Australia",
    ],
    answer: "Brazil",
    explanation:
      "Brazil is the only country whose land is crossed by both the Equator and the Tropic of Capricorn.",
    difficulty: "hard",
  },
  {
    id: "world-adv-5",
    category: "world-geography",
    prompt:
      "Select the countries whose land territory touches the Prime Meridian.",
    choices: ["Ghana", "Spain", "Italy", "Mali"],
    answer: ["Ghana", "Spain", "Mali"],
    explanation:
      "Ghana, Spain, and Mali all touch the Prime Meridian. Italy does not.",
    difficulty: "hard",
  },
  {
    id: "world-adv-6",
    category: "world-geography",
    prompt: "Which of these countries does not touch the Prime Meridian?",
    choices: ["France", "Togo", "Benin", "United Kingdom"],
    answer: "Benin",
    explanation:
      "France, Togo, and the United Kingdom touch the Prime Meridian, but Benin does not.",
    difficulty: "hard",
  },
  {
    id: "world-adv-7",
    category: "world-geography",
    prompt: "Select the European countries with no land borders.",
    choices: ["Iceland", "Cyprus", "Malta", "Portugal"],
    answer: ["Iceland", "Cyprus", "Malta"],
    explanation:
      "Iceland, Cyprus, and Malta are island countries with no land borders. Portugal borders Spain.",
    difficulty: "hard",
  },
  {
    id: "world-adv-8",
    category: "world-geography",
    prompt:
      "Which pair of countries shares the longest international land border in the world?",
    choices: [
      "Russia and Kazakhstan",
      "Argentina and Chile",
      "Canada and the United States",
      "China and Mongolia",
    ],
    answer: "Canada and the United States",
    explanation:
      "Canada and the United States share the world's longest international land border.",
    difficulty: "hard",
  },
  {
    id: "world-adv-9",
    category: "world-geography",
    prompt: "Which country has the longest coastline in the world?",
    choices: ["Canada", "Russia", "Indonesia", "Norway"],
    answer: "Canada",
    explanation: "Canada has the world's longest coastline by total length.",
    difficulty: "hard",
  },
  {
    id: "world-adv-10",
    category: "world-geography",
    prompt:
      "Which South American country borders the greatest number of other countries?",
    choices: ["Argentina", "Peru", "Brazil", "Colombia"],
    answer: "Brazil",
    explanation:
      "Brazil borders every South American country except Chile and Ecuador, for a total of 10 neighbors.",
    difficulty: "hard",
  },
  {
    id: "world-adv-11",
    category: "world-geography",
    prompt:
      "Which European country has exactly one land border, and that border is with Germany?",
    choices: ["Denmark", "Portugal", "Ireland", "Netherlands"],
    answer: "Denmark",
    explanation: "Denmark's only land border is with Germany.",
    difficulty: "hard",
  },
  {
    id: "world-adv-12",
    category: "world-geography",
    prompt:
      "Which river is most closely associated with ancient Egyptian civilization?",
    choices: ["Nile", "Congo", "Niger", "Zambezi"],
    answer: "Nile",
    explanation:
      "Ancient Egyptian civilization was centered on the Nile Valley.",
    difficulty: "medium",
  },
  {
    id: "world-adv-13",
    category: "world-geography",
    prompt: "Which river is most closely associated with Mesopotamia?",
    choices: ["Volga", "Euphrates", "Danube", "Yangtze"],
    answer: "Euphrates",
    explanation:
      "Mesopotamia developed in the Tigris-Euphrates basin; the Euphrates is the clearest match here.",
    difficulty: "hard",
  },
  {
    id: "world-adv-14",
    category: "world-geography",
    prompt:
      "Which of these is the odd one out based on Mediterranean geography?",
    choices: ["Portugal", "Greece", "Egypt", "Morocco"],
    answer: "Portugal",
    explanation: "Portugal is on the Atlantic, not the Mediterranean.",
    difficulty: "hard",
  },
  {
    id: "world-adv-15",
    category: "world-geography",
    prompt:
      "Which of these is the odd one out based on rivers tied to ancient civilizations?",
    choices: ["Indus", "Nile", "Mississippi", "Euphrates"],
    answer: "Mississippi",
    explanation:
      "The Indus, Nile, and Euphrates are directly associated with major ancient civilizations; the Mississippi is not.",
    difficulty: "hard",
  },
  {
    id: "world-adv-16",
    category: "world-geography",
    prompt: "Which South American country does not border Brazil?",
    choices: ["Colombia", "Peru", "Chile", "Bolivia"],
    answer: "Chile",
    explanation:
      "Brazil borders every South American country except Chile and Ecuador.",
    difficulty: "medium",
  },
  {
    id: "world-adv-17",
    category: "world-geography",
    prompt: "Which pair are the two landlocked countries in South America?",
    choices: [
      "Bolivia and Paraguay",
      "Bolivia and Peru",
      "Paraguay and Uruguay",
      "Ecuador and Paraguay",
    ],
    answer: "Bolivia and Paraguay",
    explanation:
      "Bolivia and Paraguay are the two landlocked countries in South America.",
    difficulty: "hard",
  },
  {
    id: "world-adv-18",
    category: "world-geography",
    prompt: "Which equatorial African country lies on the Horn of Africa?",
    choices: ["Somalia", "Kenya", "Uganda", "Gabon"],
    answer: "Somalia",
    explanation:
      "Somalia lies on the Horn of Africa and is one of the countries crossed by the Equator.",
    difficulty: "hard",
  },
  {
    id: "world-adv-19",
    category: "world-geography",
    prompt:
      "What is the capital of the South American country whose name comes from the Equator?",
    choices: ["Lima", "Quito", "Bogotá", "La Paz"],
    answer: "Quito",
    explanation:
      "Quito is the capital of Ecuador, whose name derives from its equatorial position.",
    difficulty: "medium",
  },
  {
    id: "world-adv-20",
    category: "world-geography",
    prompt:
      "Which equatorial country is an island state in the Gulf of Guinea?",
    choices: [
      "São Tomé and Príncipe",
      "Gabon",
      "Republic of the Congo",
      "Uganda",
    ],
    answer: "São Tomé and Príncipe",
    explanation:
      "São Tomé and Príncipe is the island state on the Equator in the Gulf of Guinea.",
    difficulty: "hard",
  },
  {
    id: "world-adv-21",
    category: "world-geography",
    prompt:
      "Select the countries in this list that border exactly one other country.",
    choices: ["Portugal", "Monaco", "Denmark", "Belgium"],
    answer: ["Portugal", "Monaco", "Denmark"],
    explanation:
      "Portugal borders Spain, Monaco borders France, and Denmark borders Germany. Belgium borders several countries.",
    difficulty: "hard",
  },
  {
    id: "world-adv-22",
    category: "world-geography",
    prompt:
      "Which river flows through Vienna, Bratislava, Budapest, and Belgrade?",
    choices: ["Rhine", "Danube", "Volga", "Elbe"],
    answer: "Danube",
    explanation: "The Danube passes through all four of those capitals.",
    difficulty: "hard",
  },
  {
    id: "world-adv-23",
    category: "world-geography",
    prompt: "Which body of water does the Volga empty into?",
    choices: ["Black Sea", "Caspian Sea", "Aral Sea", "Baltic Sea"],
    answer: "Caspian Sea",
    explanation: "The Volga flows southward into the Caspian Sea.",
    difficulty: "hard",
  },
  {
    id: "world-adv-24",
    category: "world-geography",
    prompt: "Which body of water does the Danube empty into?",
    choices: ["Adriatic Sea", "Aegean Sea", "Black Sea", "Mediterranean Sea"],
    answer: "Black Sea",
    explanation: "The Danube empties into the Black Sea via a large delta.",
    difficulty: "medium",
  },
  {
    id: "world-adv-25",
    category: "world-geography",
    prompt: "Which of these countries is both on the Equator and in Africa?",
    choices: ["Uganda", "Rwanda", "Ethiopia", "Tanzania"],
    answer: "Uganda",
    explanation:
      "Uganda is crossed by the Equator; Rwanda, Ethiopia, and Tanzania are nearby but not crossed by it.",
    difficulty: "hard",
  },
  {
    id: "world-adv-26",
    category: "world-geography",
    prompt: "Select the Baltic states from this list.",
    choices: ["Estonia", "Latvia", "Lithuania", "Finland"],
    answer: ["Estonia", "Latvia", "Lithuania"],
    explanation: "The Baltic states are Estonia, Latvia, and Lithuania.",
    difficulty: "hard",
  },
  {
    id: "world-adv-27",
    category: "world-geography",
    prompt:
      "Select the sovereign states on the Iberian Peninsula from this list.",
    choices: ["Spain", "Portugal", "Andorra", "France"],
    answer: ["Spain", "Portugal", "Andorra"],
    explanation:
      "The sovereign states on the Iberian Peninsula are Spain, Portugal, and Andorra.",
    difficulty: "hard",
  },
  {
    id: "world-adv-28",
    category: "world-geography",
    prompt: "Which sea lies east of Italy and west of the Balkans?",
    choices: ["Aegean Sea", "Adriatic Sea", "Tyrrhenian Sea", "Black Sea"],
    answer: "Adriatic Sea",
    explanation:
      "The Adriatic Sea lies between the Italian Peninsula and the Balkans.",
    difficulty: "medium",
  },
  {
    id: "world-adv-29",
    category: "world-geography",
    prompt: "Which strait connects the Black Sea to the Sea of Marmara?",
    choices: [
      "Bosporus",
      "Dardanelles",
      "Bering Strait",
      "Strait of Gibraltar",
    ],
    answer: "Bosporus",
    explanation: "The Bosporus links the Black Sea to the Sea of Marmara.",
    difficulty: "hard",
  },
  {
    id: "world-adv-30",
    category: "world-geography",
    prompt:
      "Which strait connects the Mediterranean Sea to the Atlantic Ocean?",
    choices: [
      "Bosporus",
      "Bab-el-Mandeb",
      "Strait of Gibraltar",
      "Strait of Malacca",
    ],
    answer: "Strait of Gibraltar",
    explanation:
      "The Strait of Gibraltar links the Mediterranean to the Atlantic.",
    difficulty: "medium",
  },
  {
    id: "world-adv-31",
    category: "world-geography",
    prompt: "Which isthmus joins North America and South America?",
    choices: [
      "Isthmus of Suez",
      "Isthmus of Panama",
      "Isthmus of Corinth",
      "Isthmus of Kra",
    ],
    answer: "Isthmus of Panama",
    explanation: "The Isthmus of Panama connects North and South America.",
    difficulty: "medium",
  },
  {
    id: "world-adv-32",
    category: "world-geography",
    prompt:
      "Which mountain range forms much of the border between Spain and France?",
    choices: ["Alps", "Apennines", "Pyrenees", "Carpathians"],
    answer: "Pyrenees",
    explanation: "The Pyrenees separate most of Spain from France.",
    difficulty: "medium",
  },
  {
    id: "world-adv-33",
    category: "world-geography",
    prompt:
      "Which mountain range runs along the western edge of South America?",
    choices: ["Rockies", "Alps", "Andes", "Atlas"],
    answer: "Andes",
    explanation: "The Andes run along the western side of South America.",
    difficulty: "medium",
  },
  {
    id: "world-adv-34",
    category: "world-geography",
    prompt:
      "Select the countries from this list that lie on the Arabian Peninsula.",
    choices: ["Saudi Arabia", "Yemen", "Oman", "Jordan"],
    answer: ["Saudi Arabia", "Yemen", "Oman"],
    explanation:
      "Saudi Arabia, Yemen, and Oman are on the Arabian Peninsula. Jordan is not.",
    difficulty: "hard",
  },
  {
    id: "world-adv-35",
    category: "world-geography",
    prompt: "Which country occupies most of the Arabian Peninsula?",
    choices: ["Saudi Arabia", "Yemen", "Oman", "United Arab Emirates"],
    answer: "Saudi Arabia",
    explanation:
      "Saudi Arabia covers the largest share of the Arabian Peninsula.",
    difficulty: "medium",
  },
  {
    id: "world-adv-36",
    category: "world-geography",
    prompt: "Which lake is bordered by Tanzania, Uganda, and Kenya?",
    choices: ["Lake Tanganyika", "Lake Victoria", "Lake Malawi", "Lake Chad"],
    answer: "Lake Victoria",
    explanation: "Lake Victoria lies between Tanzania, Uganda, and Kenya.",
    difficulty: "medium",
  },
  {
    id: "world-adv-37",
    category: "world-geography",
    prompt: "Which lake is the deepest freshwater lake in the world?",
    choices: [
      "Lake Superior",
      "Lake Tanganyika",
      "Lake Baikal",
      "Lake Victoria",
    ],
    answer: "Lake Baikal",
    explanation:
      "Lake Baikal in Siberia is the world's deepest freshwater lake.",
    difficulty: "hard",
  },
  {
    id: "world-adv-38",
    category: "world-geography",
    prompt: "Which body of water lies between Iran and the Arabian Peninsula?",
    choices: ["Red Sea", "Persian Gulf", "Arabian Sea", "Caspian Sea"],
    answer: "Persian Gulf",
    explanation:
      "The Persian Gulf lies between Iran and the Arabian Peninsula.",
    difficulty: "medium",
  },
  {
    id: "world-adv-39",
    category: "world-geography",
    prompt:
      "Which inland sea lies between Kazakhstan and Uzbekistan and has dramatically shrunk in modern times?",
    choices: ["Black Sea", "Caspian Sea", "Aral Sea", "Dead Sea"],
    answer: "Aral Sea",
    explanation:
      "The Aral Sea, between Kazakhstan and Uzbekistan, is known for its severe shrinkage.",
    difficulty: "hard",
  },
  {
    id: "world-adv-40",
    category: "world-geography",
    prompt: "Select the island countries in the Indian Ocean from this list.",
    choices: ["Madagascar", "Sri Lanka", "Maldives", "Pakistan"],
    answer: ["Madagascar", "Sri Lanka", "Maldives"],
    explanation:
      "Madagascar, Sri Lanka, and the Maldives are island countries in the Indian Ocean. Pakistan is not.",
    difficulty: "hard",
  },
  {
    id: "world-adv-41",
    category: "world-geography",
    prompt: "Which of these countries is not landlocked?",
    choices: ["Bolivia", "Paraguay", "Nepal", "Cambodia"],
    answer: "Cambodia",
    explanation:
      "Cambodia has a coastline on the Gulf of Thailand, while the others are landlocked.",
    difficulty: "hard",
  },
  {
    id: "world-adv-42",
    category: "world-geography",
    prompt: "Select the Central American countries from this list.",
    choices: ["Guatemala", "Honduras", "Nicaragua", "Colombia"],
    answer: ["Guatemala", "Honduras", "Nicaragua"],
    explanation:
      "Guatemala, Honduras, and Nicaragua are in Central America. Colombia is in South America.",
    difficulty: "hard",
  },
  {
    id: "world-adv-43",
    category: "world-geography",
    prompt: "Which African lake is the main source of the White Nile?",
    choices: ["Lake Chad", "Lake Victoria", "Lake Tanganyika", "Lake Turkana"],
    answer: "Lake Victoria",
    explanation:
      "Lake Victoria is widely recognized as the principal source of the White Nile.",
    difficulty: "hard",
  },
  {
    id: "world-adv-44",
    category: "world-geography",
    prompt: "Which desert lies in northern China and southern Mongolia?",
    choices: ["Taklamakan", "Gobi", "Karakum", "Thar"],
    answer: "Gobi",
    explanation:
      "The Gobi Desert stretches across northern China and southern Mongolia.",
    difficulty: "medium",
  },
  {
    id: "world-adv-45",
    category: "world-geography",
    prompt: "Which island is shared by Haiti and the Dominican Republic?",
    choices: ["Puerto Rico", "Cuba", "Hispaniola", "Jamaica"],
    answer: "Hispaniola",
    explanation:
      "Haiti and the Dominican Republic share the island of Hispaniola.",
    difficulty: "medium",
  },
  {
    id: "world-adv-46",
    category: "world-geography",
    prompt: "Which island is shared by Indonesia, Malaysia, and Brunei?",
    choices: ["Java", "Sulawesi", "Borneo", "Sumatra"],
    answer: "Borneo",
    explanation: "Borneo is shared by Indonesia, Malaysia, and Brunei.",
    difficulty: "hard",
  },
  {
    id: "world-adv-47",
    category: "world-geography",
    prompt:
      "Which island is home to both Papua New Guinea and part of Indonesia?",
    choices: ["Borneo", "New Guinea", "Sumatra", "Timor"],
    answer: "New Guinea",
    explanation:
      "The island of New Guinea is divided between Papua New Guinea and Indonesia.",
    difficulty: "hard",
  },
  {
    id: "world-adv-48",
    category: "world-geography",
    prompt:
      "Which country controls both the European and Asian sides of the Bosporus?",
    choices: ["Russia", "Greece", "Turkey", "Georgia"],
    answer: "Turkey",
    explanation:
      "Turkey spans both sides of the Bosporus, including European and Asian territory.",
    difficulty: "medium",
  },
  {
    id: "world-adv-49",
    category: "world-geography",
    prompt:
      "Which African country has coastlines on both the Atlantic Ocean and the Indian Ocean?",
    choices: ["Namibia", "South Africa", "Mozambique", "Tanzania"],
    answer: "South Africa",
    explanation:
      "South Africa has coastline on both the Atlantic and Indian oceans.",
    difficulty: "hard",
  },
  {
    id: "world-adv-50",
    category: "world-geography",
    prompt:
      "Which South American country has coasts on both the Caribbean Sea and the Pacific Ocean?",
    choices: ["Ecuador", "Peru", "Colombia", "Venezuela"],
    answer: "Colombia",
    explanation:
      "Colombia is the South American country with both Caribbean and Pacific coastlines.",
    difficulty: "hard",
  },
  {
    id: "world-adv-51",
    category: "world-geography",
    prompt: "Select the landlocked countries in this list.",
    choices: ["Austria", "Switzerland", "Czechia", "Germany"],
    answer: ["Austria", "Switzerland", "Czechia"],
    explanation:
      "Austria, Switzerland, and Czechia are landlocked. Germany has coastlines on the North and Baltic seas.",
    difficulty: "hard",
  },
  {
    id: "world-adv-52",
    category: "world-geography",
    prompt: "Which country is home to the Atacama Desert?",
    choices: ["Peru", "Bolivia", "Chile", "Argentina"],
    answer: "Chile",
    explanation: "The Atacama Desert is in northern Chile.",
    difficulty: "medium",
  },
  {
    id: "world-adv-53",
    category: "world-geography",
    prompt: "Which river flows through Baghdad?",
    choices: ["Euphrates", "Tigris", "Jordan", "Nile"],
    answer: "Tigris",
    explanation: "Baghdad sits on the Tigris River.",
    difficulty: "hard",
  },
  {
    id: "world-adv-54",
    category: "world-geography",
    prompt:
      "Which salt lake sits at the lowest exposed land elevation on Earth?",
    choices: ["Great Salt Lake", "Dead Sea", "Aral Sea", "Caspian Sea"],
    answer: "Dead Sea",
    explanation:
      "The Dead Sea shoreline is the lowest exposed land elevation on Earth.",
    difficulty: "hard",
  },
  {
    id: "world-adv-55",
    category: "world-geography",
    prompt:
      "Which inland sea is bordered by Russia, Kazakhstan, Turkmenistan, Iran, and Azerbaijan?",
    choices: ["Aral Sea", "Caspian Sea", "Black Sea", "Dead Sea"],
    answer: "Caspian Sea",
    explanation: "The Caspian Sea is bordered by those five countries.",
    difficulty: "hard",
  },
  {
    id: "world-adv-56",
    category: "world-geography",
    prompt:
      "Which African country lies immediately south of Spain across the Strait of Gibraltar?",
    choices: ["Algeria", "Tunisia", "Morocco", "Libya"],
    answer: "Morocco",
    explanation:
      "Morocco lies directly across the Strait of Gibraltar from Spain.",
    difficulty: "medium",
  },
  {
    id: "world-adv-57",
    category: "world-geography",
    prompt: "Which island country lies east of Mozambique in the Indian Ocean?",
    choices: ["Madagascar", "Mauritius", "Comoros", "Sri Lanka"],
    answer: "Madagascar",
    explanation:
      "Madagascar lies off the southeastern African coast east of Mozambique.",
    difficulty: "medium",
  },
  {
    id: "world-adv-58",
    category: "world-geography",
    prompt: "Which waterway separates the Malay Peninsula from Sumatra?",
    choices: [
      "Sunda Strait",
      "Strait of Malacca",
      "Makassar Strait",
      "Lombok Strait",
    ],
    answer: "Strait of Malacca",
    explanation:
      "The Strait of Malacca separates the Malay Peninsula from Sumatra.",
    difficulty: "hard",
  },
]

const presidentQuestions: Question[] = [
  {
    id: "pres-1",
    category: "us-presidents",
    prompt: "Who was the first president of the United States?",
    choices: [
      "John Adams",
      "Thomas Jefferson",
      "George Washington",
      "James Madison",
    ],
    answer: "George Washington",
    explanation:
      "George Washington served as the first U.S. president from 1789 to 1797.",
  },
  {
    id: "pres-2",
    category: "us-presidents",
    prompt: "Who was the 16th president of the United States?",
    choices: [
      "Ulysses S. Grant",
      "Abraham Lincoln",
      "Andrew Johnson",
      "James Buchanan",
    ],
    answer: "Abraham Lincoln",
    explanation:
      "Abraham Lincoln was the 16th president and led the country during the Civil War.",
  },
  {
    id: "pres-3",
    category: "us-presidents",
    prompt: "Which president is the only one to have resigned from office?",
    choices: [
      "Richard Nixon",
      "Gerald Ford",
      "Warren G. Harding",
      "Herbert Hoover",
    ],
    answer: "Richard Nixon",
    explanation: "Richard Nixon resigned in 1974 during the Watergate scandal.",
    difficulty: "medium",
  },
  {
    id: "pres-4",
    category: "us-presidents",
    prompt: "Which president oversaw the Louisiana Purchase?",
    choices: [
      "James Monroe",
      "Thomas Jefferson",
      "John Adams",
      "Andrew Jackson",
    ],
    answer: "Thomas Jefferson",
    explanation:
      "The Louisiana Purchase was completed during Thomas Jefferson's presidency.",
    difficulty: "medium",
  },
  {
    id: "pres-5",
    category: "us-presidents",
    prompt: "Who was the first president to live in the White House?",
    choices: [
      "George Washington",
      "John Adams",
      "Thomas Jefferson",
      "James Madison",
    ],
    answer: "John Adams",
    explanation:
      "John Adams was the first president to occupy the White House in 1800.",
    difficulty: "medium",
  },
  {
    id: "pres-6",
    category: "us-presidents",
    prompt: "Which president is most closely associated with the New Deal?",
    choices: [
      "Harry S. Truman",
      "Woodrow Wilson",
      "Franklin D. Roosevelt",
      "Calvin Coolidge",
    ],
    answer: "Franklin D. Roosevelt",
    explanation:
      "Franklin D. Roosevelt launched the New Deal during the Great Depression.",
  },
  {
    id: "pres-7",
    category: "us-presidents",
    prompt: "Who was president of the United States during World War I?",
    choices: [
      "William Howard Taft",
      "Woodrow Wilson",
      "Warren G. Harding",
      "Theodore Roosevelt",
    ],
    answer: "Woodrow Wilson",
    explanation:
      "Woodrow Wilson was president when the U.S. entered World War I in 1917.",
    difficulty: "medium",
  },
  {
    id: "pres-8",
    category: "us-presidents",
    prompt:
      "Who was the youngest person to become president of the United States?",
    choices: [
      "John F. Kennedy",
      "Bill Clinton",
      "Theodore Roosevelt",
      "Ulysses S. Grant",
    ],
    answer: "Theodore Roosevelt",
    explanation:
      "Theodore Roosevelt became president at age 42 after McKinley's assassination.",
    difficulty: "hard",
  },
  {
    id: "pres-9",
    category: "us-presidents",
    prompt: "Who was the second president of the United States?",
    choices: [
      "Thomas Jefferson",
      "John Adams",
      "James Madison",
      "James Monroe",
    ],
    answer: "John Adams",
    explanation:
      "John Adams served as the second U.S. president from 1797 to 1801.",
  },
  {
    id: "pres-10",
    category: "us-presidents",
    prompt: "Which president was a former Hollywood actor?",
    choices: [
      "Jimmy Carter",
      "Ronald Reagan",
      "Gerald Ford",
      "George H. W. Bush",
    ],
    answer: "Ronald Reagan",
    explanation:
      "Ronald Reagan had a film acting career before entering politics.",
  },
]

export const questionBank: Question[] = [
  ...usGeographyQuestions,
  ...advancedUsGeographyQuestions,
  ...worldGeographyQuestions,
  ...advancedWorldGeographyQuestions,
  ...generatedQuestionBank,
  ...generatedUsQuestionBank,
  ...presidentQuestions,
]

export function shuffleItems<T>(items: readonly T[]) {
  const next = [...items]

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
  }

  return next
}

export function getQuestionCountOptions(total: number) {
  const presets = [5, 10, 15, 20, 30, 40, 50, 75, 100, 150]
  const options = presets.filter((value) => value < total)

  if (total > 0) {
    options.push(total)
  }

  return [...new Set(options)].sort((left, right) => left - right)
}

export function buildQuiz(
  selectedCategories: CategoryId[],
  requestedCount: number,
) {
  const availableQuestions = questionBank.filter((question) =>
    selectedCategories.includes(question.category),
  )
  const total = Math.min(requestedCount, availableQuestions.length)

  return shuffleItems(availableQuestions)
    .slice(0, total)
    .map<QuizQuestion>((question) => ({
      ...question,
      shuffledChoices: shuffleItems(question.choices),
    }))
}

export function getCorrectAnswers(question: Question) {
  return Array.isArray(question.answer)
    ? [...question.answer]
    : [question.answer]
}

export function isMultiAnswerQuestion(question: Question) {
  return Array.isArray(question.answer)
}
