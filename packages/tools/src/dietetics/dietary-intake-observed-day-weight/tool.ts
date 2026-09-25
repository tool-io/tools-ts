import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dayIntake: number;
  readonly dayWeight: number;
  readonly totalWeight: number;
};
export type Output = { readonly weightedContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dayIntake: { type: "number", minimum: 0 },
    dayWeight: { type: "number", minimum: 0 },
    totalWeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["dayIntake", "dayWeight", "totalWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weightedContribution: { type: "number" } },
  required: ["weightedContribution"],
} as const;
/** Calculate dietary intake observed day weight from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dayIntake, dayWeight, totalWeight } = request;
  const compute = (): Output => {
    H.domain(dayIntake >= 0 && dayWeight >= 0);
    H.positive(totalWeight);
    H.domain(dayWeight <= totalWeight);
    return { weightedContribution: (dayIntake * dayWeight) / totalWeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dayIntake: 100, dayWeight: 2, totalWeight: 10 },
  output: { weightedContribution: 20 },
} satisfies ToolExample<Input, Output>;
export const dietaryIntakeObservedDayWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/dietary-intake-observed-day-weight",
    title: "Dietary Intake Observed Day Weight Tool",
    description:
      "Calculate dietary intake observed day weight from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dayIntake: { type: "number", minimum: 0 },
        dayWeight: { type: "number", minimum: 0 },
        totalWeight: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["dayIntake", "dayWeight", "totalWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { weightedContribution: { type: "number" } },
      required: ["weightedContribution"],
    },
    ports: {
      inputs: [
        {
          id: "dayIntake",
          label: "Day Intake",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dayWeight",
          label: "Day Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalWeight",
          label: "Total Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedContribution",
          label: "Weighted Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dietaryIntakeObservedDayWeightTool.execute;
export default dietaryIntakeObservedDayWeightTool;
