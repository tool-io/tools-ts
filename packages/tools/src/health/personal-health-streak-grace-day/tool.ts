import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly completedDays: readonly boolean[];
  readonly graceDayBudget: number;
};
export type Output = {
  readonly currentStreak: number;
  readonly graceDaysUsed: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completedDays: { type: "array", maxItems: 256, items: { type: "boolean" } },
    graceDayBudget: { type: "integer", minimum: 0 },
  },
  required: ["completedDays", "graceDayBudget"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentStreak: { type: "integer" },
    graceDaysUsed: { type: "integer" },
  },
  required: ["currentStreak", "graceDaysUsed"],
} as const;
/** Count completed days backward through at most an explicit grace-day budget, excluding grace days from the completion count. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { completedDays, graceDayBudget } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(graceDayBudget) &&
        graceDayBudget >= 0 &&
        graceDayBudget <= Number.MAX_SAFE_INTEGER,
      "graceDayBudget",
    ),
      graceDayBudget);
    let currentStreak = 0,
      graceDaysUsed = 0;
    for (let i = completedDays.length - 1; i >= 0; i--) {
      if (completedDays[i]) currentStreak++;
      else if (graceDaysUsed < graceDayBudget) graceDaysUsed++;
      else break;
    }
    return { currentStreak, graceDaysUsed };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { completedDays: [true, false, true, false, true], graceDayBudget: 1 },
  output: { currentStreak: 2, graceDaysUsed: 1 },
} satisfies ToolExample<Input, Output>;
export const personalHealthStreakGraceDayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["health", "health and medicine"],
      keywords: ["health", "health and medicine"],
    },
    id: "health/personal-health-streak-grace-day",
    title: "Personal Health Streak Grace Day",
    description:
      "Count completed days backward through at most an explicit grace-day budget, excluding grace days from the completion count.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        completedDays: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        graceDayBudget: { type: "integer", minimum: 0 },
      },
      required: ["completedDays", "graceDayBudget"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentStreak: { type: "integer" },
        graceDaysUsed: { type: "integer" },
      },
      required: ["currentStreak", "graceDaysUsed"],
    },
    ports: {
      inputs: [
        {
          id: "completedDays",
          label: "Completed Days",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "graceDayBudget",
          label: "Grace Day Budget",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "currentStreak",
          label: "Current Streak",
          valueType: { type: "integer" },
        },
        {
          id: "graceDaysUsed",
          label: "Grace Days Used",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = personalHealthStreakGraceDayTool.execute;
export default personalHealthStreakGraceDayTool;
