import { writeFile } from "node:fs/promises"
import { createRequire } from "node:module"
import path from "node:path"

const require = createRequire(import.meta.url)
const worldCountries = require("world-countries")
const us = require("us")
const { presidents } = require("us-presidents")

const worldOutputPath = path.resolve(
  process.cwd(),
  "src/lib/generated-world-trivia.ts",
)
const usOutputPath = path.resolve(
  process.cwd(),
  "src/lib/generated-us-trivia.ts",
)

const countryPool = worldCountries
  .filter(
    (country) =>
      country.capital?.length &&
      country.region &&
      ((country.independent && country.unMember) || country.cca3 === "PSE"),
  )
  .map((country) => ({
    name: country.name.common,
    capital: country.capital[0],
    region: country.region === "Americas" ? country.subregion : country.region,
    subregion: country.subregion || country.region,
    landlocked: Boolean(country.landlocked),
    borders: country.borders ?? [],
    cca3: country.cca3,
  }))
  .sort((left, right) => left.name.localeCompare(right.name))

const countriesByCode = new Map(
  countryPool.map((country) => [country.cca3, country]),
)

const statePool = us.STATES.filter(
  (state) => !state.is_territory && state.name !== "District of Columbia",
)
  .map((state) => ({
    name: state.name,
    abbreviation: state.abbr,
    capital: state.capital,
    statehoodYear: state.statehood_year,
    capitalTimeZone: state.capital_tz,
  }))
  .sort((left, right) => left.name.localeCompare(right.name))

const statehoodYearCounts = statePool.reduce((counts, state) => {
  counts[state.statehoodYear] = (counts[state.statehoodYear] ?? 0) + 1
  return counts
}, {})

const presidentPool = presidents.map((president) => ({
  order: president.order,
  name: president.name,
  party: president.party,
  startYear: president.term.startYear,
  endYear: president.term.endYear,
  termsServed: president.term.served,
}))

const riverPool = [
  {
    name: "Nile",
    continent: "Africa",
    countries: ["Uganda", "South Sudan", "Sudan", "Egypt"],
    mouth: "Mediterranean Sea",
    hook: "ancient Egyptian civilization and the cities of Khartoum and Cairo",
  },
  {
    name: "Amazon",
    continent: "South America",
    countries: ["Peru", "Colombia", "Brazil"],
    mouth: "Atlantic Ocean",
    hook: "the largest drainage basin on Earth and the Amazon rainforest",
  },
  {
    name: "Yangtze",
    continent: "Asia",
    countries: ["China"],
    mouth: "East China Sea",
    hook: "the Three Gorges region and the cities of Wuhan, Nanjing, and Shanghai",
  },
  {
    name: "Mississippi",
    continent: "North America",
    countries: ["United States"],
    mouth: "Gulf of Mexico",
    hook: "the river system tied to New Orleans and the American Midwest",
  },
  {
    name: "Missouri",
    continent: "North America",
    countries: ["United States"],
    mouth: "Mississippi River",
    hook: "the longest river in the United States by many standard measurements",
  },
  {
    name: "Danube",
    continent: "Europe",
    countries: ["Germany", "Austria", "Hungary", "Serbia", "Romania"],
    mouth: "Black Sea",
    hook: "the capitals Vienna, Bratislava, Budapest, and Belgrade",
  },
  {
    name: "Rhine",
    continent: "Europe",
    countries: ["Switzerland", "Germany", "France", "Netherlands"],
    mouth: "North Sea",
    hook: "western Europe's industrial corridor and the port of Rotterdam",
  },
  {
    name: "Mekong",
    continent: "Asia",
    countries: ["China", "Myanmar", "Laos", "Thailand", "Cambodia", "Vietnam"],
    mouth: "South China Sea",
    hook: "mainland Southeast Asia and the Mekong Delta",
  },
  {
    name: "Ganges",
    continent: "Asia",
    countries: ["India", "Bangladesh"],
    mouth: "Bay of Bengal",
    hook: "Varanasi and the sacred river traditions of northern India",
  },
  {
    name: "Brahmaputra",
    continent: "Asia",
    countries: ["China", "India", "Bangladesh"],
    mouth: "Bay of Bengal",
    hook: "Tibet, Assam, and its confluence with the Ganges delta system",
  },
  {
    name: "Indus",
    continent: "Asia",
    countries: ["China", "India", "Pakistan"],
    mouth: "Arabian Sea",
    hook: "the Indus Valley civilization and modern Pakistan",
  },
  {
    name: "Congo",
    continent: "Africa",
    countries: [
      "Democratic Republic of the Congo",
      "Republic of the Congo",
      "Angola",
    ],
    mouth: "Atlantic Ocean",
    hook: "central Africa and one of the world's deepest river channels",
  },
  {
    name: "Niger",
    continent: "Africa",
    countries: ["Guinea", "Mali", "Niger", "Nigeria"],
    mouth: "Gulf of Guinea",
    hook: "West Africa and the inland delta near Timbuktu",
  },
  {
    name: "Volga",
    continent: "Europe",
    countries: ["Russia"],
    mouth: "Caspian Sea",
    hook: "Russia's national river and the city of Volgograd",
  },
  {
    name: "Tigris",
    continent: "Asia",
    countries: ["Turkey", "Iraq"],
    mouth: "Shatt al-Arab",
    hook: "Mesopotamia and the city of Baghdad",
  },
  {
    name: "Euphrates",
    continent: "Asia",
    countries: ["Turkey", "Syria", "Iraq"],
    mouth: "Shatt al-Arab",
    hook: "Mesopotamia and the Fertile Crescent",
  },
  {
    name: "Lena",
    continent: "Asia",
    countries: ["Russia"],
    mouth: "Laptev Sea",
    hook: "eastern Siberia and one of the great Arctic-draining rivers",
  },
  {
    name: "Ob",
    continent: "Asia",
    countries: ["Russia", "Kazakhstan"],
    mouth: "Kara Sea",
    hook: "western Siberia and the city of Novosibirsk",
  },
  {
    name: "Yenisei",
    continent: "Asia",
    countries: ["Mongolia", "Russia"],
    mouth: "Kara Sea",
    hook: "central Siberia and one of the largest river systems flowing to the Arctic",
  },
  {
    name: "Amur",
    continent: "Asia",
    countries: ["Russia", "China"],
    mouth: "Sea of Okhotsk",
    hook: "a long stretch of the Russia-China border in the Far East",
  },
  {
    name: "Parana",
    continent: "South America",
    countries: ["Brazil", "Paraguay", "Argentina"],
    mouth: "Rio de la Plata",
    hook: "the basin that includes Itaipu Dam and much of southern South America",
  },
  {
    name: "Orinoco",
    continent: "South America",
    countries: ["Venezuela", "Colombia"],
    mouth: "Atlantic Ocean",
    hook: "Venezuela and the Llanos region",
  },
  {
    name: "Zambezi",
    continent: "Africa",
    countries: [
      "Zambia",
      "Angola",
      "Namibia",
      "Botswana",
      "Zimbabwe",
      "Mozambique",
    ],
    mouth: "Indian Ocean",
    hook: "Victoria Falls in southern Africa",
  },
  {
    name: "Murray",
    continent: "Australia",
    countries: ["Australia"],
    mouth: "Southern Ocean",
    hook: "the Murray-Darling Basin in southeastern Australia",
  },
  {
    name: "Jordan",
    continent: "Asia",
    countries: ["Israel", "Jordan", "Palestine"],
    mouth: "Dead Sea",
    hook: "the boundary region around the Sea of Galilee and the Dead Sea",
  },
  {
    name: "Colorado",
    continent: "North America",
    countries: ["United States", "Mexico"],
    mouth: "Gulf of California",
    hook: "the Grand Canyon of the American Southwest",
  },
  {
    name: "Rio Grande",
    continent: "North America",
    countries: ["United States", "Mexico"],
    mouth: "Gulf of Mexico",
    hook: "a major stretch of the U.S.-Mexico border",
  },
  {
    name: "Yukon",
    continent: "North America",
    countries: ["Canada", "United States"],
    mouth: "Bering Sea",
    hook: "the Klondike gold rush and interior Alaska",
  },
  {
    name: "St. Lawrence",
    continent: "North America",
    countries: ["Canada", "United States"],
    mouth: "Atlantic Ocean",
    hook: "the Great Lakes outlet and Montreal",
  },
  {
    name: "Seine",
    continent: "Europe",
    countries: ["France"],
    mouth: "English Channel",
    hook: "Paris and northwestern France",
  },
  {
    name: "Thames",
    continent: "Europe",
    countries: ["United Kingdom"],
    mouth: "North Sea",
    hook: "London and southern England",
  },
  {
    name: "Po",
    continent: "Europe",
    countries: ["Italy"],
    mouth: "Adriatic Sea",
    hook: "the great plain of northern Italy",
  },
  {
    name: "Loire",
    continent: "Europe",
    countries: ["France"],
    mouth: "Bay of Biscay",
    hook: "the famous chateaux of central France",
  },
  {
    name: "Elbe",
    continent: "Europe",
    countries: ["Czechia", "Germany"],
    mouth: "North Sea",
    hook: "central Europe and the port city of Hamburg",
  },
  {
    name: "Dnieper",
    continent: "Europe",
    countries: ["Russia", "Belarus", "Ukraine"],
    mouth: "Black Sea",
    hook: "Kyiv and eastern Europe's steppe corridor",
  },
  {
    name: "Don",
    continent: "Europe",
    countries: ["Russia"],
    mouth: "Sea of Azov",
    hook: "southern Russia and the approach to the Black Sea basin",
  },
]

function hashValue(input) {
  return Array.from(input).reduce(
    (total, character, index) =>
      (total + character.charCodeAt(0) * (index + 17)) % 2147483647,
    0,
  )
}

function rotatePool(items, seed) {
  if (items.length <= 1) {
    return items
  }

  const shift = hashValue(seed) % items.length
  return items.slice(shift).concat(items.slice(0, shift))
}

function pickDistractors(items, answer, count, seed) {
  const filtered = items.filter((item) => item !== answer)
  return rotatePool(filtered, seed).slice(0, count)
}

function buildChoices(answer, distractorPool, seed) {
  return rotatePool(
    [answer, ...pickDistractors(distractorPool, answer, 3, seed)],
    `${seed}-choices`,
  )
}

function chunkList(items) {
  if (items.length === 1) {
    return items[0]
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`
  }

  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`
}

function countriesInScope(country, scopeKey) {
  const pool = countryPool.filter(
    (entry) => entry[scopeKey] === country[scopeKey],
  )
  return pool.length >= 4
    ? pool
    : countryPool.filter((entry) => entry.region === country.region)
}

function buildCountryQuestions() {
  return countryPool.flatMap((country, index) => {
    const localPool = countriesInScope(country, "subregion")
    const countryNames = localPool.map((entry) => entry.name)
    const capitals = localPool
      .map((entry) => entry.capital)
      .filter(
        (capital, capitalIndex, allCapitals) =>
          allCapitals.indexOf(capital) === capitalIndex,
      )

    const borderNames = country.borders
      .map((code) => countriesByCode.get(code)?.name)
      .filter(Boolean)
    const contextualQuestion = buildContextQuestion(
      country,
      localPool,
      borderNames,
    )

    return [
      {
        id: `world-country-capital-${country.cca3.toLowerCase()}`,
        category: "world-countries",
        difficulty: "medium",
        prompt:
          index % 2 === 0
            ? `${country.capital} is the capital of which country?`
            : `What is the capital of ${country.name}?`,
        choices:
          index % 2 === 0
            ? buildChoices(country.name, countryNames, country.cca3)
            : buildChoices(country.capital, capitals, country.cca3),
        answer: index % 2 === 0 ? country.name : country.capital,
        explanation:
          index % 2 === 0
            ? `${country.capital} is the capital city of ${country.name}.`
            : `${country.capital} is the capital city of ${country.name}.`,
      },
      contextualQuestion,
    ]
  })
}

function buildContextQuestion(country, localPool, borderNames) {
  const countryNames = localPool.map((entry) => entry.name)
  const contextualId = `world-country-context-${country.cca3.toLowerCase()}`

  if (borderNames.length >= 3) {
    const pickedBorders = rotatePool(
      borderNames,
      `${country.cca3}-borders`,
    ).slice(0, 3)

    return {
      id: contextualId,
      category: "world-countries",
      difficulty: "hard",
      prompt: `Which country in ${country.subregion} borders ${chunkList(pickedBorders)}?`,
      choices: buildChoices(
        country.name,
        countryNames,
        `${country.cca3}-border-question`,
      ),
      answer: country.name,
      explanation: `${country.name} is in ${country.subregion} and borders ${chunkList(pickedBorders)}.`,
    }
  }

  if (country.landlocked) {
    const distractorPool = localPool
      .filter((entry) => entry.name !== country.name && !entry.landlocked)
      .map((entry) => entry.name)
    const fallbackPool = countryNames

    return {
      id: contextualId,
      category: "world-countries",
      difficulty: "hard",
      prompt: `Which landlocked country in ${country.subregion} has ${country.capital} as its capital?`,
      choices: buildChoices(
        country.name,
        distractorPool.length >= 3 ? distractorPool : fallbackPool,
        `${country.cca3}-landlocked-question`,
      ),
      answer: country.name,
      explanation: `${country.name} is a landlocked country in ${country.subregion}, and its capital is ${country.capital}.`,
    }
  }

  if (borderNames.length === 1) {
    return {
      id: contextualId,
      category: "world-countries",
      difficulty: "hard",
      prompt: `Which country in ${country.subregion} borders only ${borderNames[0]} and has ${country.capital} as its capital?`,
      choices: buildChoices(
        country.name,
        countryNames,
        `${country.cca3}-single-border-question`,
      ),
      answer: country.name,
      explanation: `${country.name} is in ${country.subregion}, borders only ${borderNames[0]}, and has ${country.capital} as its capital.`,
    }
  }

  return {
    id: contextualId,
    category: "world-countries",
    difficulty: "hard",
    prompt: `Which country in ${country.subregion} has ${country.capital} as its capital?`,
    choices: buildChoices(
      country.name,
      countryNames,
      `${country.cca3}-subregion-question`,
    ),
    answer: country.name,
    explanation: `${country.name} is part of ${country.subregion}, and ${country.capital} is its capital city.`,
  }
}

function buildRiverQuestions() {
  return riverPool.flatMap((river, index) => {
    const regionalPool = riverPool.filter(
      (entry) => entry.continent === river.continent,
    )
    const riverNames = regionalPool.map((entry) => entry.name)
    const mouths = regionalPool.map((entry) => entry.mouth)

    return [
      {
        id: `river-route-${slugify(river.name)}`,
        category: "major-rivers",
        difficulty: "medium",
        prompt: `Which river flows through ${chunkList(
          river.countries.slice(0, Math.min(3, river.countries.length)),
        )} and empties into the ${river.mouth}?`,
        choices: buildChoices(river.name, riverNames, `${river.name}-route`),
        answer: river.name,
        explanation: `${river.name} flows through ${chunkList(river.countries)} and empties into the ${river.mouth}.`,
      },
      {
        id: `river-hook-${slugify(river.name)}`,
        category: "major-rivers",
        difficulty: index % 2 === 0 ? "hard" : "medium",
        prompt:
          index % 2 === 0
            ? `Which river is most associated with ${river.hook}?`
            : `The ${river.name} eventually empties into which body of water?`,
        choices:
          index % 2 === 0
            ? buildChoices(river.name, riverNames, `${river.name}-hook`)
            : buildChoices(river.mouth, mouths, `${river.name}-mouth`),
        answer: index % 2 === 0 ? river.name : river.mouth,
        explanation:
          index % 2 === 0
            ? `${river.name} is strongly associated with ${river.hook}.`
            : `${river.name} empties into the ${river.mouth}.`,
      },
    ]
  })
}

function buildUsGeographyQuestions() {
  const stateNames = statePool.map((state) => state.name)
  const capitals = statePool.map((state) => state.capital)
  const abbreviations = statePool.map((state) => state.abbreviation)

  return statePool.flatMap((state, index) => {
    const hasUniqueStatehoodYear =
      statehoodYearCounts[state.statehoodYear] === 1

    return [
      {
        id: `us-state-capital-${slugify(state.name)}`,
        category: "us-geography",
        difficulty: "medium",
        prompt:
          index % 2 === 0
            ? `What is the capital of ${state.name}?`
            : `${state.capital} is the capital of which U.S. state?`,
        choices:
          index % 2 === 0
            ? buildChoices(state.capital, capitals, `${state.name}-capital`)
            : buildChoices(state.name, stateNames, `${state.name}-state`),
        answer: index % 2 === 0 ? state.capital : state.name,
        explanation:
          index % 2 === 0
            ? `${state.capital} is the capital of ${state.name}.`
            : `${state.capital} is the capital city of ${state.name}.`,
      },
      hasUniqueStatehoodYear && index % 3 === 0
        ? {
            id: `us-state-year-${slugify(state.name)}`,
            category: "us-geography",
            difficulty: "hard",
            prompt: `Which state joined the Union in ${state.statehoodYear}?`,
            choices: buildChoices(
              state.name,
              stateNames,
              `${state.name}-statehood`,
            ),
            answer: state.name,
            explanation: `${state.name} entered the Union in ${state.statehoodYear}.`,
          }
        : index % 2 === 0
          ? {
              id: `us-state-abbr-${slugify(state.name)}`,
              category: "us-geography",
              difficulty: "medium",
              prompt: `Which state uses the postal abbreviation ${state.abbreviation}?`,
              choices: buildChoices(
                state.name,
                stateNames,
                `${state.name}-abbreviation-reverse`,
              ),
              answer: state.name,
              explanation: `${state.abbreviation} is the postal abbreviation for ${state.name}.`,
            }
          : {
              id: `us-state-postal-${slugify(state.name)}`,
              category: "us-geography",
              difficulty: "medium",
              prompt: `What is the postal abbreviation for ${state.name}?`,
              choices: buildChoices(
                state.abbreviation,
                abbreviations,
                `${state.name}-abbreviation`,
              ),
              answer: state.abbreviation,
              explanation: `${state.abbreviation} is the postal abbreviation for ${state.name}.`,
            },
    ]
  })
}

function buildPresidentQuestions() {
  const presidentNames = presidentPool.map((president) => president.name)
  const orderLabels = presidentPool.map((president) =>
    toOrdinal(president.order),
  )

  return presidentPool.flatMap((president, index) => {
    const previousPresident = presidentPool[index - 1]
    const neighboringPresidents = presidentPool
      .filter(
        (entry) =>
          Math.abs(entry.order - president.order) <= 2 &&
          entry.name !== president.name,
      )
      .map((entry) => entry.name)

    return [
      {
        id: `president-order-${president.order}`,
        category: "us-presidents",
        difficulty: "medium",
        prompt:
          index % 2 === 0
            ? `Who was the ${toOrdinal(president.order)} president of the United States?`
            : `${president.name} was which numbered president of the United States?`,
        choices:
          index % 2 === 0
            ? buildChoices(
                president.name,
                presidentNames,
                `${president.name}-order-name`,
              )
            : buildChoices(
                toOrdinal(president.order),
                orderLabels,
                `${president.name}-order-label`,
              ),
        answer: index % 2 === 0 ? president.name : toOrdinal(president.order),
        explanation:
          index % 2 === 0
            ? `${president.name} was the ${toOrdinal(president.order)} president of the United States.`
            : `${president.name} was the ${toOrdinal(president.order)} president of the United States.`,
      },
      previousPresident && index % 2 === 0
        ? {
            id: `president-succession-${president.order}`,
            category: "us-presidents",
            difficulty: "hard",
            prompt: `Who succeeded ${previousPresident.name} as president?`,
            choices: buildChoices(
              president.name,
              neighboringPresidents.length >= 3
                ? neighboringPresidents
                : presidentNames,
              `${president.name}-succession`,
            ),
            answer: president.name,
            explanation: `${president.name} followed ${previousPresident.name} in the presidency.`,
          }
        : {
            id: `president-term-${president.order}`,
            category: "us-presidents",
            difficulty: "hard",
            prompt: `Which president served from ${president.startYear} to ${president.endYear}?`,
            choices: buildChoices(
              president.name,
              presidentNames,
              `${president.name}-term`,
            ),
            answer: president.name,
            explanation: `${president.name} served from ${president.startYear} to ${president.endYear}.`,
          },
    ]
  })
}

function toOrdinal(value) {
  const remainderTen = value % 10
  const remainderHundred = value % 100

  if (remainderTen === 1 && remainderHundred !== 11) {
    return `${value}st`
  }

  if (remainderTen === 2 && remainderHundred !== 12) {
    return `${value}nd`
  }

  if (remainderTen === 3 && remainderHundred !== 13) {
    return `${value}rd`
  }

  return `${value}th`
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-")
}

const generatedQuestionBank = [
  ...buildCountryQuestions(),
  ...buildRiverQuestions(),
]

const generatedUsQuestionBank = [
  ...buildUsGeographyQuestions(),
  ...buildPresidentQuestions(),
]

const worldFileContents = `export const generatedQuestionBank = ${JSON.stringify(
  generatedQuestionBank,
  null,
  2,
)} as const\n`
const usFileContents = `export const generatedUsQuestionBank = ${JSON.stringify(
  generatedUsQuestionBank,
  null,
  2,
)} as const\n`

await writeFile(worldOutputPath, worldFileContents)
await writeFile(usOutputPath, usFileContents)

console.log(
  `Generated ${generatedQuestionBank.length} world questions in ${path.relative(process.cwd(), worldOutputPath)}`,
)
console.log(
  `Generated ${generatedUsQuestionBank.length} U.S. questions in ${path.relative(process.cwd(), usOutputPath)}`,
)
