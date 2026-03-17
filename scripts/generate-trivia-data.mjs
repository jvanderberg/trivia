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
    timeZones: state.time_zones,
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
  birthYear: president.life.birthYear,
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

function unique(items) {
  return items.filter(
    (item, index, allItems) => allItems.indexOf(item) === index,
  )
}

function pickDistractors(items, answer, count) {
  const filtered = unique(items).filter((item) => item !== answer)
  return filtered.slice(0, count)
}

function buildChoices(
  answer,
  distractorPool,
  seed,
  fallbackPool = distractorPool,
) {
  const distractors = pickDistractors(distractorPool, answer, 3)

  if (distractors.length < 3) {
    distractors.push(
      ...pickDistractors(
        fallbackPool.filter((item) => !distractors.includes(item)),
        answer,
        3 - distractors.length,
      ),
    )
  }

  return rotatePool([answer, ...distractors], `${seed}-choices`)
}

function commonPrefixLength(left, right) {
  let index = 0
  while (
    index < left.length &&
    index < right.length &&
    left[index] === right[index]
  ) {
    index += 1
  }

  return index
}

function commonSuffixLength(left, right) {
  let index = 0
  while (
    index < left.length &&
    index < right.length &&
    left.at(-(index + 1)) === right.at(-(index + 1))
  ) {
    index += 1
  }

  return index
}

function stringSimilarityScore(answer, candidate) {
  const normalizedAnswer = answer.toLowerCase()
  const normalizedCandidate = candidate.toLowerCase()
  const answerWords = normalizedAnswer.split(/\s+/)
  const candidateWords = normalizedCandidate.split(/\s+/)

  return (
    (normalizedAnswer[0] === normalizedCandidate[0] ? 8 : 0) +
    (answerWords.length === candidateWords.length ? 4 : 0) +
    Math.min(commonPrefixLength(normalizedAnswer, normalizedCandidate), 4) * 2 +
    Math.min(commonSuffixLength(normalizedAnswer, normalizedCandidate), 4) * 2 -
    Math.abs(normalizedAnswer.length - normalizedCandidate.length)
  )
}

function rankByStringSimilarity(answer, items) {
  return unique(items)
    .filter((item) => item !== answer)
    .sort((left, right) => {
      const scoreDifference =
        stringSimilarityScore(answer, right) -
        stringSimilarityScore(answer, left)

      if (scoreDifference !== 0) {
        return scoreDifference
      }

      return left.localeCompare(right)
    })
}

function rankByNumericDistance(items, answerValue, valueGetter) {
  return [...items].sort((left, right) => {
    const leftDistance = Math.abs(valueGetter(left) - answerValue)
    const rightDistance = Math.abs(valueGetter(right) - answerValue)

    if (leftDistance !== rightDistance) {
      return leftDistance - rightDistance
    }

    return valueGetter(left) - valueGetter(right)
  })
}

function buildRankedChoices(
  answer,
  primaryPool,
  seed,
  fallbackPool = primaryPool,
) {
  return buildChoices(answer, primaryPool, seed, fallbackPool)
}

function relatedStateEntries(state, matcher) {
  return statePool.filter(
    (entry) => entry.name !== state.name && matcher(entry),
  )
}

function stateCapitalDistractors(state) {
  const sameTimeZone = relatedStateEntries(
    state,
    (entry) => entry.capitalTimeZone === state.capitalTimeZone,
  ).map((entry) => entry.capital)
  const similarCapitals = rankByStringSimilarity(
    state.capital,
    statePool.map((entry) => entry.capital),
  )

  return unique([...sameTimeZone, ...similarCapitals])
}

function stateNameDistractors(state) {
  const sameTimeZone = relatedStateEntries(
    state,
    (entry) => entry.capitalTimeZone === state.capitalTimeZone,
  ).map((entry) => entry.name)
  const similarNames = rankByStringSimilarity(
    state.name,
    statePool.map((entry) => entry.name),
  )

  return unique([...sameTimeZone, ...similarNames])
}

function stateAbbreviationDistractors(state) {
  return statePool
    .filter((entry) => entry.name !== state.name)
    .sort((left, right) => {
      const leftScore =
        (left.abbreviation[0] === state.abbreviation[0] ? 8 : 0) +
        (left.abbreviation[1] === state.abbreviation[1] ? 8 : 0) +
        (left.name[0] === state.name[0] ? 4 : 0)
      const rightScore =
        (right.abbreviation[0] === state.abbreviation[0] ? 8 : 0) +
        (right.abbreviation[1] === state.abbreviation[1] ? 8 : 0) +
        (right.name[0] === state.name[0] ? 4 : 0)

      if (leftScore !== rightScore) {
        return rightScore - leftScore
      }

      return left.name.localeCompare(right.name)
    })
    .map((entry) => entry.abbreviation)
}

function statehoodDistractors(state) {
  return rankByNumericDistance(
    statePool.filter((entry) => entry.name !== state.name),
    state.statehoodYear,
    (entry) => entry.statehoodYear,
  ).map((entry) => entry.name)
}

function presidentsNearOrder(president, span = 3) {
  const nearby = presidentPool.filter(
    (entry) =>
      entry.name !== president.name &&
      Math.abs(entry.order - president.order) <= span,
  )

  if (nearby.length >= 3) {
    return nearby
  }

  return rankByNumericDistance(
    presidentPool.filter((entry) => entry.name !== president.name),
    president.order,
    (entry) => entry.order,
  )
}

function presidentsNearYears(president, span = 16) {
  const nearby = presidentPool.filter(
    (entry) =>
      entry.name !== president.name &&
      entry.startYear !== null &&
      Math.abs(entry.startYear - president.startYear) <= span,
  )

  if (nearby.length >= 3) {
    return nearby
  }

  return rankByNumericDistance(
    presidentPool.filter((entry) => entry.name !== president.name),
    president.startYear,
    (entry) => entry.startYear,
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
    const countryNames = rankByStringSimilarity(
      country.name,
      localPool.map((entry) => entry.name),
    )
    const capitals = rankByStringSimilarity(
      country.capital,
      localPool
        .map((entry) => entry.capital)
        .filter(
          (capital, capitalIndex, allCapitals) =>
            allCapitals.indexOf(capital) === capitalIndex,
        ),
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
            ? buildRankedChoices(
                country.name,
                countryNames,
                country.cca3,
                localPool.map((entry) => entry.name),
              )
            : buildRankedChoices(
                country.capital,
                capitals,
                country.cca3,
                localPool.map((entry) => entry.capital),
              ),
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
  const countryNames = rankByStringSimilarity(
    country.name,
    localPool.map((entry) => entry.name),
  )
  const contextualId = `world-country-context-${country.cca3.toLowerCase()}`

  if (borderNames.length >= 3) {
    const pickedBorders = rotatePool(
      borderNames,
      `${country.cca3}-borders`,
    ).slice(0, 3)
    const borderQuestionChoices = countryNames.filter(
      (name) => !pickedBorders.includes(name),
    )

    return {
      id: contextualId,
      category: "world-countries",
      difficulty: "hard",
      prompt: `Which country in ${country.subregion} borders ${chunkList(pickedBorders)}?`,
      choices: buildRankedChoices(
        country.name,
        borderQuestionChoices,
        `${country.cca3}-border-question`,
        localPool.map((entry) => entry.name),
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
        fallbackPool,
      ),
      answer: country.name,
      explanation: `${country.name} is a landlocked country in ${country.subregion}, and its capital is ${country.capital}.`,
    }
  }

  if (borderNames.length === 1) {
    const singleBorderChoices = countryNames.filter(
      (name) => name !== borderNames[0],
    )

    return {
      id: contextualId,
      category: "world-countries",
      difficulty: "hard",
      prompt: `Which country in ${country.subregion} borders only ${borderNames[0]} and has ${country.capital} as its capital?`,
      choices: buildChoices(
        country.name,
        singleBorderChoices,
        `${country.cca3}-single-border-question`,
        localPool.map((entry) => entry.name),
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
      localPool.map((entry) => entry.name),
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
            ? buildRankedChoices(
                state.capital,
                stateCapitalDistractors(state),
                `${state.name}-capital`,
                capitals,
              )
            : buildRankedChoices(
                state.name,
                stateNameDistractors(state),
                `${state.name}-state`,
                stateNames,
              ),
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
            choices: buildRankedChoices(
              state.name,
              statehoodDistractors(state),
              `${state.name}-statehood`,
              stateNames,
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
              choices: buildRankedChoices(
                state.name,
                stateNameDistractors(state),
                `${state.name}-abbreviation-reverse`,
                stateNames,
              ),
              answer: state.name,
              explanation: `${state.abbreviation} is the postal abbreviation for ${state.name}.`,
            }
          : {
              id: `us-state-postal-${slugify(state.name)}`,
              category: "us-geography",
              difficulty: "medium",
              prompt: `What is the postal abbreviation for ${state.name}?`,
              choices: buildRankedChoices(
                state.abbreviation,
                stateAbbreviationDistractors(state),
                `${state.name}-abbreviation`,
                abbreviations,
              ),
              answer: state.abbreviation,
              explanation: `${state.abbreviation} is the postal abbreviation for ${state.name}.`,
            },
    ]
  })
}

function buildPresidentQuestions() {
  const presidentNames = unique(
    presidentPool.map((president) => president.name),
  )
  const orderLabels = presidentPool.map((president) =>
    toOrdinal(president.order),
  )

  return presidentPool.flatMap((president, index) => {
    const previousPresident = presidentPool[index - 1]
    const neighboringPresidents = presidentsNearOrder(president).map(
      (entry) => entry.name,
    )
    const nearbyOrderLabels = presidentsNearOrder(president).map((entry) =>
      toOrdinal(entry.order),
    )
    const eraPresidents = presidentsNearYears(president).map(
      (entry) => entry.name,
    )

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
            ? buildRankedChoices(
                president.name,
                neighboringPresidents,
                `${president.name}-order-name`,
                presidentNames,
              )
            : buildRankedChoices(
                toOrdinal(president.order),
                nearbyOrderLabels,
                `${president.name}-order-label`,
                orderLabels,
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
            choices: buildRankedChoices(
              president.name,
              neighboringPresidents,
              `${president.name}-succession`,
              presidentNames,
            ),
            answer: president.name,
            explanation: `${president.name} followed ${previousPresident.name} in the presidency.`,
          }
        : {
            id: `president-term-${president.order}`,
            category: "us-presidents",
            difficulty: "hard",
            prompt:
              president.endYear === null
                ? `Which president first took office in ${president.startYear}?`
                : `Which president served from ${president.startYear} to ${president.endYear}?`,
            choices: buildRankedChoices(
              president.name,
              eraPresidents,
              `${president.name}-term`,
              presidentNames,
            ),
            answer: president.name,
            explanation:
              president.endYear === null
                ? `${president.name} first took office in ${president.startYear}.`
                : `${president.name} served from ${president.startYear} to ${president.endYear}.`,
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
