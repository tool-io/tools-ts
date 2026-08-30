import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PersonalBackcastInput = {
  readonly currentConstraints: ReadonlyArray<string>;
  readonly currentStrengths: ReadonlyArray<string>;
  readonly desiredOutcome: string;
  readonly firstMilestoneDate: string;
  readonly targetYear: number;
};

export type PersonalBackcastOutput = {
  readonly backcastQuestions: ReadonlyArray<string>;
  readonly milestoneYears: ReadonlyArray<number>;
  readonly worksheet: string;
};

export const buildPersonalFuturesBackcastWorksheet = (
  input: PersonalBackcastInput,
): PersonalBackcastOutput => {
  for (const [field, value] of [
    ["desiredOutcome", input.desiredOutcome],
    ["firstMilestoneDate", input.firstMilestoneDate],
  ] as const)
    if (typeof value !== "string" || value.trim() === "")
      simpleError(
        field,
        "Desired outcome and milestone date must be nonempty strings.",
        "backcast_field_required",
      );
  if (
    !Number.isSafeInteger(input.targetYear) ||
    input.targetYear < 2000 ||
    input.targetYear > 2200
  )
    simpleError(
      "targetYear",
      "Target year must be an integer from 2000 through 2200.",
      "invalid_target_year",
    );
  for (const [field, values] of [
    ["currentStrengths", input.currentStrengths],
    ["currentConstraints", input.currentConstraints],
  ] as const) {
    if (!Array.isArray(values) || values.length === 0)
      simpleError(
        field,
        "At least one value is required.",
        "backcast_list_required",
      );
    for (const [index, value] of values.entries())
      if (typeof value !== "string" || value.trim() === "")
        simpleError(
          `${field}.${index}`,
          "List values must be nonempty strings.",
          "invalid_backcast_value",
        );
  }
  const targetYear = input.targetYear;
  const milestoneYears = [
    targetYear - 10,
    targetYear - 5,
    targetYear - 2,
    targetYear,
  ];
  const strengths = input.currentStrengths.map((value) => value.trim());
  const constraints = input.currentConstraints.map((value) => value.trim());
  return {
    backcastQuestions: milestoneYears.map(
      (year) =>
        `What must be true by ${year} for ${input.desiredOutcome.trim()} to remain achievable?`,
    ),
    milestoneYears,
    worksheet: `# Personal futures backcast\nOutcome: ${input.desiredOutcome.trim()}\nFirst milestone: ${input.firstMilestoneDate.trim()}\nStrengths: ${strengths.join("; ")}\nConstraints: ${constraints.join("; ")}\n\n${milestoneYears
      .map(
        (year) =>
          `${year}: Success condition = [complete]\n${year}: Evidence that the path is working = [complete]\n${year}: Decision or action = [complete]`,
      )
      .join(
        "\n",
      )}\n\nWhat assumptions could make this plan fail? [complete]\nWhat early signal would cause adaptation? [complete]`,
  };
};

export const personalBackcastExample = {
  input: {
    currentConstraints: ["Limited savings", "Care responsibilities"],
    currentStrengths: ["Design experience", "Community network"],
    desiredOutcome: "Run a sustainable creative practice",
    firstMilestoneDate: "2027-03-01",
    targetYear: 2040,
  },
  output: {
    backcastQuestions: [
      "What must be true by 2030 for Run a sustainable creative practice to remain achievable?",
      "What must be true by 2035 for Run a sustainable creative practice to remain achievable?",
      "What must be true by 2038 for Run a sustainable creative practice to remain achievable?",
      "What must be true by 2040 for Run a sustainable creative practice to remain achievable?",
    ],
    milestoneYears: [2030, 2035, 2038, 2040],
    worksheet:
      "# Personal futures backcast\nOutcome: Run a sustainable creative practice\nFirst milestone: 2027-03-01\nStrengths: Design experience; Community network\nConstraints: Limited savings; Care responsibilities\n\n2030: Success condition = [complete]\n2030: Evidence that the path is working = [complete]\n2030: Decision or action = [complete]\n2035: Success condition = [complete]\n2035: Evidence that the path is working = [complete]\n2035: Decision or action = [complete]\n2038: Success condition = [complete]\n2038: Evidence that the path is working = [complete]\n2038: Decision or action = [complete]\n2040: Success condition = [complete]\n2040: Evidence that the path is working = [complete]\n2040: Decision or action = [complete]\n\nWhat assumptions could make this plan fail? [complete]\nWhat early signal would cause adaptation? [complete]",
  },
} satisfies ToolExample<PersonalBackcastInput, PersonalBackcastOutput>;

export const personalBackcastTool = createSimpleTool({
  calculate: (input) =>
    buildPersonalFuturesBackcastWorksheet({
      currentConstraints: input.currentConstraints as string[],
      currentStrengths: input.currentStrengths as string[],
      desiredOutcome: input.desiredOutcome as string,
      firstMilestoneDate: input.firstMilestoneDate as string,
      targetYear: input.targetYear as number,
    }),
  description:
    "Build a personal futures worksheet by backcasting from a target year through concrete success, evidence, and action milestones.",
  id: "futurology/personal-futures-life-planning-backcast-worksheet",
  inputs: [
    {
      id: "currentConstraints",
      kind: "stringList",
      label: "Current constraints",
    },
    { id: "currentStrengths", kind: "stringList", label: "Current strengths" },
    { id: "desiredOutcome", kind: "string", label: "Desired outcome" },
    { id: "firstMilestoneDate", kind: "string", label: "First milestone date" },
    {
      id: "targetYear",
      kind: "integer",
      label: "Target year",
      maximum: 2200,
      minimum: 2000,
    },
  ],
  outputs: [
    {
      id: "backcastQuestions",
      kind: "stringList",
      label: "Backcast questions",
    },
    { id: "milestoneYears", kind: "numberList", label: "Milestone years" },
    { id: "worksheet", kind: "string", label: "Backcast worksheet" },
  ],
  title: "Personal Futures Life Planning Backcast Worksheet",
});

export const runPersonalBackcast = personalBackcastTool.execute;
export default personalBackcastTool;
