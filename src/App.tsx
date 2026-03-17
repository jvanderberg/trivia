import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Globe2,
  Landmark,
  MapPinned,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  Waves,
  XCircle,
} from "lucide-react"
import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress, ProgressLabel } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  buildQuiz,
  type CategoryId,
  categoryDetails,
  getCorrectAnswers,
  getQuestionCountOptions,
  isMultiAnswerQuestion,
  type QuizQuestion,
  questionBank,
} from "@/lib/trivia"
import { cn } from "@/lib/utils"

type Screen = "setup" | "quiz" | "results"

type QuizAnswer = {
  questionId: string
  selectedChoices: string[]
  correct: boolean
}

type QuizSession = {
  questions: QuizQuestion[]
  answers: Record<string, QuizAnswer>
  currentIndex: number
}

type StoredPreferences = {
  selectedCategories: CategoryId[]
  questionCount: number
}

const storageKey = "trivia-app-preferences"
const categories = Object.values(categoryDetails)
const defaultCategories = categories.map((category) => category.id)
const mappableCategories = new Set<CategoryId>([
  "us-geography",
  "world-geography",
  "world-countries",
  "major-rivers",
])

function getCategoryBadgeClass(categoryId: CategoryId) {
  switch (categoryId) {
    case "us-geography":
      return "bg-slate-900 text-white"
    case "world-geography":
      return "bg-sky-700 text-white"
    case "world-countries":
      return "bg-emerald-700 text-white"
    case "major-rivers":
      return "bg-cyan-700 text-white"
    case "us-presidents":
      return "bg-red-700 text-white"
  }
}

function getCategoryIcon(categoryId: CategoryId) {
  switch (categoryId) {
    case "us-geography":
      return Landmark
    case "world-geography":
      return Globe2
    case "world-countries":
      return Globe2
    case "major-rivers":
      return Waves
    case "us-presidents":
      return Trophy
  }
}

function getDifficultyBadgeClass(difficulty: "medium" | "hard") {
  return difficulty === "hard"
    ? "border-slate-900 bg-slate-950 text-white"
    : "border-amber-300 bg-amber-50 text-amber-900"
}

function getMapsUrl(question: QuizQuestion) {
  const query = getCorrectAnswers(question).join(", ")
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

function canOpenInMaps(question: QuizQuestion) {
  return mappableCategories.has(question.category)
}

function readStoredPreferences(): StoredPreferences {
  if (typeof window === "undefined") {
    return {
      selectedCategories: defaultCategories,
      questionCount: 10,
    }
  }

  try {
    const rawValue = window.localStorage.getItem(storageKey)

    if (!rawValue) {
      return {
        selectedCategories: defaultCategories,
        questionCount: 10,
      }
    }

    const parsedValue = JSON.parse(rawValue) as Partial<StoredPreferences>
    const selectedCategories = (parsedValue.selectedCategories ?? []).filter(
      (value): value is CategoryId => value in categoryDetails,
    )

    return {
      selectedCategories:
        selectedCategories.length > 0 ? selectedCategories : defaultCategories,
      questionCount: parsedValue.questionCount ?? 10,
    }
  } catch {
    return {
      selectedCategories: defaultCategories,
      questionCount: 10,
    }
  }
}

function getCategoryCount(categoryId: CategoryId) {
  return questionBank.filter((question) => question.category === categoryId)
    .length
}

function App() {
  const [screen, setScreen] = useState<Screen>("setup")
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>(
    () => readStoredPreferences().selectedCategories,
  )
  const [questionCount, setQuestionCount] = useState(
    () => readStoredPreferences().questionCount,
  )
  const [quiz, setQuiz] = useState<QuizSession | null>(null)
  const [draftSelections, setDraftSelections] = useState<string[]>([])

  const availableQuestions = questionBank.filter((question) =>
    selectedCategories.includes(question.category),
  )
  const countOptions = getQuestionCountOptions(availableQuestions.length)
  const activeCount =
    countOptions.find((value) => value === questionCount) ??
    countOptions[countOptions.length - 1] ??
    0
  const currentQuestion = quiz?.questions[quiz.currentIndex] ?? null
  const currentAnswer = currentQuestion
    ? quiz?.answers[currentQuestion.id]
    : null
  const currentCorrectAnswers = currentQuestion
    ? getCorrectAnswers(currentQuestion)
    : []
  const answeredCount = quiz ? Object.keys(quiz.answers).length : 0
  const score = quiz
    ? Object.values(quiz.answers).filter((answer) => answer.correct).length
    : 0

  useEffect(() => {
    if (availableQuestions.length === 0) {
      return
    }

    if (!countOptions.includes(questionCount)) {
      setQuestionCount(countOptions[countOptions.length - 1])
    }
  }, [availableQuestions.length, countOptions, questionCount])

  useEffect(() => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        selectedCategories,
        questionCount,
      } satisfies StoredPreferences),
    )
  }, [questionCount, selectedCategories])

  useEffect(() => {
    if (!currentQuestion) {
      setDraftSelections([])
      return
    }

    setDraftSelections(currentAnswer?.selectedChoices ?? [])
  }, [currentAnswer, currentQuestion])

  function toggleCategory(
    categoryId: CategoryId,
    nextChecked: boolean | "indeterminate",
  ) {
    setSelectedCategories((currentValue) => {
      if (nextChecked === true) {
        return currentValue.includes(categoryId)
          ? currentValue
          : [...currentValue, categoryId]
      }

      return currentValue.filter((value) => value !== categoryId)
    })
  }

  function startQuiz() {
    if (selectedCategories.length === 0 || activeCount === 0) {
      return
    }

    setQuiz({
      questions: buildQuiz(selectedCategories, activeCount),
      answers: {},
      currentIndex: 0,
    })
    setDraftSelections([])
    setScreen("quiz")
  }

  function toggleDraftSelection(choice: string) {
    if (!currentQuestion || currentAnswer) {
      return
    }

    if (isMultiAnswerQuestion(currentQuestion)) {
      setDraftSelections((currentSelections) =>
        currentSelections.includes(choice)
          ? currentSelections.filter((value) => value !== choice)
          : [...currentSelections, choice],
      )

      return
    }

    setDraftSelections([choice])
    recordAnswer([choice])
  }

  function recordAnswer(nextSelections: string[]) {
    if (
      !quiz ||
      !currentQuestion ||
      currentAnswer ||
      nextSelections.length === 0
    ) {
      return
    }

    const selectedChoices = [...nextSelections].sort()
    const correctChoices = [...getCorrectAnswers(currentQuestion)].sort()
    const correct =
      selectedChoices.length === correctChoices.length &&
      selectedChoices.every((choice, index) => choice === correctChoices[index])

    setQuiz({
      ...quiz,
      answers: {
        ...quiz.answers,
        [currentQuestion.id]: {
          questionId: currentQuestion.id,
          selectedChoices,
          correct,
        },
      },
    })
  }

  function submitAnswer() {
    if (
      !quiz ||
      !currentQuestion ||
      currentAnswer ||
      draftSelections.length === 0
    ) {
      return
    }

    recordAnswer(draftSelections)
  }

  function moveToNextQuestion() {
    if (!quiz || !currentQuestion || !currentAnswer) {
      return
    }

    if (quiz.currentIndex === quiz.questions.length - 1) {
      setScreen("results")
      return
    }

    setQuiz({
      ...quiz,
      currentIndex: quiz.currentIndex + 1,
    })
  }

  function resetToSetup() {
    setQuiz(null)
    setDraftSelections([])
    setScreen("setup")
  }

  function getResultsBreakdown() {
    if (!quiz) {
      return []
    }

    return categories
      .map((category) => {
        const categoryQuestions = quiz.questions.filter(
          (question) => question.category === category.id,
        )

        if (categoryQuestions.length === 0) {
          return null
        }

        const correctAnswers = categoryQuestions.filter(
          (question) => quiz.answers[question.id]?.correct,
        ).length

        return {
          ...category,
          total: categoryQuestions.length,
          correct: correctAnswers,
        }
      })
      .filter((value): value is NonNullable<typeof value> => value !== null)
  }

  const resultsBreakdown = getResultsBreakdown()
  const missedQuestions =
    quiz?.questions.filter((question) => !quiz.answers[question.id]?.correct) ??
    []
  const accuracy = quiz ? Math.round((score / quiz.questions.length) * 100) : 0
  const worldCountryCount = getCategoryCount("world-countries")
  const riverCount = getCategoryCount("major-rivers")

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(245,239,226,0.92)_35%,_rgba(225,232,245,0.95)_100%)] text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(233,88,48,0.25),_transparent_60%)]" />
      <div className="pointer-events-none absolute right-0 top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(46,109,199,0.18),_transparent_65%)] blur-3xl" />
      <div className="pointer-events-none absolute left-[-4rem] top-56 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(251,191,36,0.16),_transparent_70%)] blur-3xl" />

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-white/60 bg-white/70 px-5 py-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <Badge
                variant="outline"
                className="rounded-full border-slate-300 bg-white/80 px-3 py-1 text-[11px] tracking-[0.24em] uppercase"
              >
                Flexible Trivia Trainer
              </Badge>
              <div className="space-y-2">
                <h1 className="font-[family-name:var(--font-display)] text-4xl leading-none tracking-[-0.04em] text-slate-950 sm:text-5xl">
                  Build fast recall on the trivia that actually comes up.
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Mix U.S. geography, world geography, world countries, major
                  rivers, and presidential trivia into short, repeatable rounds
                  built for a phone screen first.
                </p>
              </div>
            </div>

            <div className="grid w-full grid-cols-3 gap-2 sm:w-auto sm:min-w-80">
              <Card size="sm" className="bg-white/80">
                <CardContent className="px-3 py-3">
                  <p className="text-[11px] font-medium tracking-[0.22em] text-slate-500 uppercase">
                    Topics
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950">
                    {categories.length}
                  </p>
                </CardContent>
              </Card>
              <Card size="sm" className="bg-white/80">
                <CardContent className="px-3 py-3">
                  <p className="text-[11px] font-medium tracking-[0.22em] text-slate-500 uppercase">
                    Questions
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950">
                    {questionBank.length}
                  </p>
                </CardContent>
              </Card>
              <Card size="sm" className="bg-white/80">
                <CardContent className="px-3 py-3">
                  <p className="text-[11px] font-medium tracking-[0.22em] text-slate-500 uppercase">
                    Mode
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950">
                    Random
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = getCategoryIcon(category.id)

              return (
                <Badge
                  key={category.id}
                  variant="secondary"
                  className={cn(
                    "rounded-full px-3 py-1",
                    getCategoryBadgeClass(category.id),
                  )}
                >
                  <Icon className="size-3.5" />
                  {category.title}
                </Badge>
              )
            })}
          </div>
        </header>

        {screen === "setup" ? (
          <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="overflow-hidden border-white/70 bg-white/72 shadow-[0_18px_64px_rgba(15,23,42,0.08)] backdrop-blur">
              <CardHeader className="gap-3">
                <Badge
                  variant="outline"
                  className="w-fit rounded-full px-3 py-1 text-xs"
                >
                  Choose your mix
                </Badge>
                <CardTitle className="font-[family-name:var(--font-display)] text-3xl text-slate-950 sm:text-4xl">
                  Start with a custom round.
                </CardTitle>
                <CardDescription className="max-w-2xl text-sm leading-6 text-slate-600">
                  Pick one or more topics, choose the round length, and the app
                  builds a randomized quiz from a nearly 500-question pool with
                  harder country, border, and river prompts mixed in.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {categories.map((category) => {
                    const isChecked = selectedCategories.includes(category.id)
                    const checkboxId = `topic-${category.id}`

                    return (
                      <label
                        key={category.id}
                        htmlFor={checkboxId}
                        className="block cursor-pointer"
                      >
                        <div
                          className={cn(
                            "rounded-[1.5rem] border p-4 transition-all",
                            isChecked
                              ? "border-slate-900 bg-slate-950 text-white shadow-[0_20px_50px_rgba(15,23,42,0.18)]"
                              : "border-slate-200 bg-white/85 text-slate-900 hover:border-slate-300 hover:bg-white",
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox
                              id={checkboxId}
                              checked={isChecked}
                              onCheckedChange={(checked) =>
                                toggleCategory(category.id, checked)
                              }
                              className={cn(
                                "mt-1",
                                isChecked &&
                                  "border-white/50 bg-white text-slate-950 data-checked:border-white data-checked:bg-white",
                              )}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-lg font-semibold tracking-tight">
                                  {category.title}
                                </h2>
                                <Badge
                                  variant={isChecked ? "secondary" : "outline"}
                                  className={cn(
                                    "rounded-full px-2.5 py-0.5 text-[11px]",
                                    isChecked &&
                                      "border-white/20 bg-white/12 text-white",
                                  )}
                                >
                                  {getCategoryCount(
                                    category.id,
                                  ).toLocaleString()}{" "}
                                  questions
                                </Badge>
                              </div>
                              <p
                                className={cn(
                                  "mt-2 text-sm leading-6",
                                  isChecked
                                    ? "text-slate-200"
                                    : "text-slate-600",
                                )}
                              >
                                {category.blurb}
                              </p>
                            </div>
                          </div>
                        </div>
                      </label>
                    )
                  })}
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold tracking-[0.18em] text-slate-500 uppercase">
                        Round length
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Available from the currently selected topic mix.
                      </p>
                    </div>
                    <Badge variant="outline" className="rounded-full px-3 py-1">
                      {availableQuestions.length.toLocaleString()} available
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {countOptions.map((count) => (
                      <Button
                        key={count}
                        type="button"
                        variant={
                          questionCount === count ? "default" : "outline"
                        }
                        className={cn(
                          "h-11 rounded-full px-4 text-sm",
                          questionCount === count &&
                            "bg-slate-950 text-white hover:bg-slate-800",
                        )}
                        onClick={() => setQuestionCount(count)}
                      >
                        {count === availableQuestions.length
                          ? `All ${count}`
                          : count}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-600">
                  {selectedCategories.length === 0
                    ? "Pick at least one topic to unlock the round."
                    : `You’re set for a ${activeCount}-question round.`}
                </div>
                <Button
                  type="button"
                  size="lg"
                  className="h-12 rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800"
                  disabled={
                    selectedCategories.length === 0 || activeCount === 0
                  }
                  onClick={startQuiz}
                >
                  Start round
                  <ArrowRight className="size-4" />
                </Button>
              </CardFooter>
            </Card>

            <div className="grid gap-4">
              <Card className="border-white/70 bg-white/72 shadow-[0_18px_64px_rgba(15,23,42,0.08)] backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-950">
                    How it works
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
                  <div className="rounded-2xl bg-slate-950 px-4 py-3 text-slate-100">
                    Every round is randomized from the active categories, so
                    repeats stay useful instead of predictable.
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    World country coverage now includes{" "}
                    {worldCountryCount.toLocaleString()} questions, which is
                    enough to touch every country and still vary the prompt
                    style.
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    Major rivers adds {riverCount.toLocaleString()} more route
                    and endpoint questions, and missed questions are reviewed at
                    the end so the weak spots stay obvious.
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/70 bg-white/72 shadow-[0_18px_64px_rgba(15,23,42,0.08)] backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-slate-950">
                    <Sparkles className="size-4 text-amber-500" />
                    Why this stack
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
                  <p>
                    React + Vite keeps the app fast, shadcn gives you composable
                    UI pieces instead of a locked component theme, and Tailwind
                    v4 keeps the styling portable.
                  </p>
                  <p>
                    For formatting and linting, this project is being set up to
                    use Biome as the single tool instead of splitting style and
                    lint rules across multiple packages.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        ) : null}

        {screen === "quiz" && currentQuestion && quiz ? (
          <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col py-2 lg:justify-center">
            <Card className="flex min-h-[calc(100svh-2rem)] flex-col border-white/70 bg-white/78 shadow-[0_22px_70px_rgba(15,23,42,0.1)] backdrop-blur lg:min-h-[78svh]">
              <CardHeader className="gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="rounded-full px-3 py-1">
                      {categoryDetails[currentQuestion.category].title}
                    </Badge>
                    {currentQuestion.difficulty ? (
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full px-3 py-1 uppercase",
                          getDifficultyBadgeClass(currentQuestion.difficulty),
                        )}
                      >
                        {currentQuestion.difficulty}
                      </Badge>
                    ) : null}
                  </div>
                  <Badge className="rounded-full bg-slate-950 px-3 py-1 text-white">
                    Score {score}/{quiz.questions.length}
                  </Badge>
                </div>

                <Progress
                  value={(answeredCount / quiz.questions.length) * 100}
                  className="gap-2"
                >
                  <ProgressLabel>
                    Question {quiz.currentIndex + 1} of {quiz.questions.length}
                  </ProgressLabel>
                  <span className="ml-auto text-sm text-muted-foreground tabular-nums">
                    {answeredCount} answered
                  </span>
                </Progress>

                <div className="space-y-3">
                  <CardTitle className="font-[family-name:var(--font-display)] text-3xl leading-tight text-slate-950 sm:text-4xl">
                    {currentQuestion.prompt}
                  </CardTitle>
                  <CardDescription className="text-sm leading-6 text-slate-600">
                    {isMultiAnswerQuestion(currentQuestion)
                      ? "Select all that apply, then check your answer."
                      : "Tap an answer to check it immediately."}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-3 overflow-y-auto pb-6">
                {currentQuestion.shuffledChoices.map((choice, index) => {
                  const letter = String.fromCharCode(65 + index)
                  const isSelected =
                    currentAnswer?.selectedChoices.includes(choice) ?? false
                  const isDraftSelected = draftSelections.includes(choice)
                  const isCorrect = currentCorrectAnswers.includes(choice)

                  return (
                    <Button
                      key={choice}
                      type="button"
                      variant="outline"
                      className={cn(
                        "h-auto min-h-16 w-full justify-start rounded-[1.5rem] px-4 py-4 text-left text-sm leading-6 whitespace-normal",
                        !currentAnswer &&
                          "hover:border-slate-400 hover:bg-slate-50",
                        !currentAnswer &&
                          isDraftSelected &&
                          "border-slate-950 bg-slate-950 text-white hover:bg-slate-900",
                        currentAnswer &&
                          isCorrect &&
                          "border-emerald-500 bg-emerald-50 text-emerald-900",
                        currentAnswer &&
                          isSelected &&
                          !isCorrect &&
                          "border-red-500 bg-red-50 text-red-900",
                        currentAnswer &&
                          !isSelected &&
                          !isCorrect &&
                          "border-slate-200 bg-white text-slate-500",
                      )}
                      disabled={Boolean(currentAnswer)}
                      onClick={() => toggleDraftSelection(choice)}
                    >
                      <div className="flex w-full items-start gap-3">
                        <span
                          className={cn(
                            "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                            !currentAnswer &&
                              isDraftSelected &&
                              "border-white/40 bg-white/15 text-white",
                            currentAnswer && isCorrect
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : currentAnswer && isSelected && !isCorrect
                                ? "border-red-500 bg-red-500 text-white"
                                : "border-slate-300 bg-white text-slate-700",
                          )}
                        >
                          {letter}
                        </span>
                        <span>{choice}</span>
                      </div>
                    </Button>
                  )
                })}

                {currentAnswer ? (
                  <div
                    className={cn(
                      "rounded-[1.5rem] border px-4 py-4",
                      currentAnswer.correct
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-red-300 bg-red-50",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {currentAnswer.correct ? (
                        <CheckCircle2 className="mt-0.5 size-5 text-emerald-600" />
                      ) : (
                        <XCircle className="mt-0.5 size-5 text-red-600" />
                      )}
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-950">
                          {currentAnswer.correct
                            ? "Correct."
                            : `Correct answer: ${currentCorrectAnswers.join(", ")}`}
                        </p>
                        {!currentAnswer.correct ? (
                          <p className="text-sm leading-6 text-slate-700">
                            Your answer:{" "}
                            {currentAnswer.selectedChoices.join(", ")}
                          </p>
                        ) : null}
                        <p className="text-sm leading-6 text-slate-700">
                          {currentQuestion.explanation}
                        </p>
                        {canOpenInMaps(currentQuestion) ? (
                          <a
                            href={getMapsUrl(currentQuestion)}
                            target="_blank"
                            rel="noreferrer"
                            className={cn(
                              buttonVariants({
                                variant: "outline",
                                size: "sm",
                              }),
                              "mt-2 w-fit rounded-full",
                            )}
                          >
                            <MapPinned className="size-4" />
                            Open in Maps
                            <ExternalLink className="size-4" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : null}
              </CardContent>

              <CardFooter className="sticky bottom-0 mt-auto justify-between gap-3 border-t bg-white/92 backdrop-blur">
                <Button type="button" variant="ghost" onClick={resetToSetup}>
                  Reset topics
                </Button>
                {currentAnswer ? (
                  <Button
                    type="button"
                    size="lg"
                    className="h-11 rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800"
                    onClick={moveToNextQuestion}
                  >
                    {quiz.currentIndex === quiz.questions.length - 1
                      ? "See results"
                      : "Next question"}
                    <ArrowRight className="size-4" />
                  </Button>
                ) : isMultiAnswerQuestion(currentQuestion) ? (
                  <Button
                    type="button"
                    size="lg"
                    className="h-11 rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800"
                    disabled={draftSelections.length === 0}
                    onClick={submitAnswer}
                  >
                    Check answer
                    <ArrowRight className="size-4" />
                  </Button>
                ) : (
                  <p className="text-right text-sm text-slate-500">
                    Tap an answer to reveal it.
                  </p>
                )}
              </CardFooter>
            </Card>
          </section>
        ) : null}

        {screen === "results" && quiz ? (
          <section className="grid gap-4 pb-4 lg:grid-cols-[0.92fr_1.08fr]">
            <Card className="border-white/70 bg-white/78 shadow-[0_22px_70px_rgba(15,23,42,0.1)] backdrop-blur">
              <CardHeader className="gap-3">
                <Badge
                  variant="outline"
                  className="w-fit rounded-full px-3 py-1"
                >
                  Round complete
                </Badge>
                <CardTitle className="font-[family-name:var(--font-display)] text-4xl text-slate-950">
                  {accuracy >= 80 ? "Strong run." : "Review the misses."}
                </CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  The scoreboard and missed questions are below so you can
                  immediately repeat the weak areas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <Card size="sm" className="bg-slate-950 text-white ring-0">
                    <CardContent className="px-3 py-3">
                      <p className="text-[11px] tracking-[0.22em] text-slate-300 uppercase">
                        Score
                      </p>
                      <p className="mt-1 text-2xl font-semibold">
                        {score}/{quiz.questions.length}
                      </p>
                    </CardContent>
                  </Card>
                  <Card size="sm" className="bg-white">
                    <CardContent className="px-3 py-3">
                      <p className="text-[11px] tracking-[0.22em] text-slate-500 uppercase">
                        Accuracy
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-slate-950">
                        {accuracy}%
                      </p>
                    </CardContent>
                  </Card>
                  <Card size="sm" className="bg-white">
                    <CardContent className="px-3 py-3">
                      <p className="text-[11px] tracking-[0.22em] text-slate-500 uppercase">
                        Topics
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-slate-950">
                        {resultsBreakdown.length}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Target className="size-4 text-slate-500" />
                    <h2 className="text-sm font-semibold tracking-[0.18em] text-slate-500 uppercase">
                      Category breakdown
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {resultsBreakdown.map((result) => (
                      <div
                        key={result.id}
                        className="rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-950">
                              {result.title}
                            </p>
                            <p className="text-sm text-slate-600">
                              {result.correct} correct out of {result.total}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="rounded-full px-3 py-1"
                          >
                            {Math.round((result.correct / result.total) * 100)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-between">
                <Button type="button" variant="ghost" onClick={resetToSetup}>
                  Reconfigure
                </Button>
                <Button type="button" variant="outline" onClick={startQuiz}>
                  <RotateCcw className="size-4" />
                  New random round
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-white/70 bg-white/78 shadow-[0_22px_70px_rgba(15,23,42,0.1)] backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-950">
                  Missed question review
                </CardTitle>
                <CardDescription className="text-sm leading-6 text-slate-600">
                  Use this list as your immediate study guide before the next
                  round.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {missedQuestions.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-4 py-5">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 size-5 text-emerald-600" />
                      <div>
                        <p className="font-semibold text-slate-950">
                          Perfect round.
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-700">
                          You answered every question correctly in this set.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  missedQuestions.map((question) => (
                    <div
                      key={question.id}
                      className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className="rounded-full px-2.5 py-0.5"
                        >
                          {categoryDetails[question.category].title}
                        </Badge>
                        {question.difficulty ? (
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-full px-2.5 py-0.5 uppercase",
                              getDifficultyBadgeClass(question.difficulty),
                            )}
                          >
                            {question.difficulty}
                          </Badge>
                        ) : null}
                      </div>
                      <p className="mt-3 text-base font-semibold leading-7 text-slate-950">
                        {question.prompt}
                      </p>
                      <div className="mt-3 space-y-1 text-sm leading-6 text-slate-700">
                        <p>
                          <span className="font-semibold text-slate-950">
                            Your answer:
                          </span>{" "}
                          {quiz.answers[question.id]?.selectedChoices.join(
                            ", ",
                          ) ?? "No answer"}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-950">
                            Correct answer:
                          </span>{" "}
                          {getCorrectAnswers(question).join(", ")}
                        </p>
                        <p>{question.explanation}</p>
                        {canOpenInMaps(question) ? (
                          <a
                            href={getMapsUrl(question)}
                            target="_blank"
                            rel="noreferrer"
                            className={cn(
                              buttonVariants({
                                variant: "outline",
                                size: "sm",
                              }),
                              "mt-2 w-fit rounded-full",
                            )}
                          >
                            <MapPinned className="size-4" />
                            Open in Maps
                            <ExternalLink className="size-4" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </section>
        ) : null}
      </div>
    </main>
  )
}

export default App
