import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly weightedTotal: number;
  readonly credits: number;
  readonly removedScore: number;
  readonly removedCredits: number;
};
export type Output = { readonly remainingAverage: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedTotal: { type: "number" },
    credits: { type: "number" },
    removedScore: { type: "number" },
    removedCredits: { type: "number", minimum: 0 },
  },
  required: ["weightedTotal", "credits", "removedScore", "removedCredits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainingAverage: { type: "number" } },
  required: ["remainingAverage"],
} as const;
/** Calculate course credit weighted drop one term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weightedTotal, credits, removedScore, removedCredits } = request;
  const compute = (): Output => {
    H.domain(removedCredits >= 0 && credits > removedCredits);
    return {
      remainingAverage:
        (weightedTotal - removedScore * removedCredits) /
        (credits - removedCredits),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    weightedTotal: 240,
    credits: 12,
    removedScore: 15,
    removedCredits: 4,
  },
  output: { remainingAverage: 22.5 },
} satisfies ToolExample<Input, Output>;
export const courseCreditWeightedDropOneTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/course-credit-weighted-drop-one-term",
    title: "Course Credit Weighted Drop One Term Tool",
    description:
      "Calculate course credit weighted drop one term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weightedTotal: { type: "number" },
        credits: { type: "number" },
        removedScore: { type: "number" },
        removedCredits: { type: "number", minimum: 0 },
      },
      required: ["weightedTotal", "credits", "removedScore", "removedCredits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { remainingAverage: { type: "number" } },
      required: ["remainingAverage"],
    },
    ports: {
      inputs: [
        {
          id: "weightedTotal",
          label: "Weighted Total",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "credits",
          label: "Credits",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "removedScore",
          label: "Removed Score",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "removedCredits",
          label: "Removed Credits",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingAverage",
          label: "Remaining Average",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = courseCreditWeightedDropOneTermTool.execute;
export default courseCreditWeightedDropOneTermTool;
