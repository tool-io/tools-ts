import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dependentCount: number;
  readonly oldWorkingAgeBase: number;
  readonly newWorkingAgeBase: number;
};
export type Output = {
  readonly oldRatio: number;
  readonly newRatio: number;
  readonly ratioChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dependentCount: { type: "integer", minimum: 0 },
    oldWorkingAgeBase: { type: "integer", minimum: 1 },
    newWorkingAgeBase: { type: "integer", minimum: 1 },
  },
  required: ["dependentCount", "oldWorkingAgeBase", "newWorkingAgeBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldRatio: { type: "number" },
    newRatio: { type: "number" },
    ratioChange: { type: "number" },
  },
  required: ["oldRatio", "newRatio", "ratioChange"],
} as const;
/** Compare supplied dependency-count ratios under an explicit denominator revision without choosing age categories. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dependentCount, oldWorkingAgeBase, newWorkingAgeBase } = request;
  const compute = (): Output => {
    H.integer(dependentCount, 0);
    H.integer(oldWorkingAgeBase, 1);
    H.integer(newWorkingAgeBase, 1);
    return {
      oldRatio: dependentCount / oldWorkingAgeBase,
      newRatio: dependentCount / newWorkingAgeBase,
      ratioChange:
        dependentCount / newWorkingAgeBase - dependentCount / oldWorkingAgeBase,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dependentCount: 60, oldWorkingAgeBase: 100, newWorkingAgeBase: 120 },
  output: { oldRatio: 0.6, newRatio: 0.5, ratioChange: -0.09999999999999998 },
} satisfies ToolExample<Input, Output>;
export const dependencyRatioDenominatorShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/dependency-ratio-denominator-shift",
    title: "Dependency Ratio Denominator Shift Tool",
    description:
      "Compare supplied dependency-count ratios under an explicit denominator revision without choosing age categories.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dependentCount: { type: "integer", minimum: 0 },
        oldWorkingAgeBase: { type: "integer", minimum: 1 },
        newWorkingAgeBase: { type: "integer", minimum: 1 },
      },
      required: ["dependentCount", "oldWorkingAgeBase", "newWorkingAgeBase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldRatio: { type: "number" },
        newRatio: { type: "number" },
        ratioChange: { type: "number" },
      },
      required: ["oldRatio", "newRatio", "ratioChange"],
    },
    ports: {
      inputs: [
        {
          id: "dependentCount",
          label: "Dependent Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "oldWorkingAgeBase",
          label: "Old Working Age Base",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "newWorkingAgeBase",
          label: "New Working Age Base",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "oldRatio", label: "Old Ratio", valueType: { type: "number" } },
        { id: "newRatio", label: "New Ratio", valueType: { type: "number" } },
        {
          id: "ratioChange",
          label: "Ratio Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dependencyRatioDenominatorShiftTool.execute;
export default dependencyRatioDenominatorShiftTool;
