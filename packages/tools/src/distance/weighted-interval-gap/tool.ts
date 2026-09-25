import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLower: number;
  readonly firstUpper: number;
  readonly secondLower: number;
  readonly secondUpper: number;
  readonly weight: number;
};
export type Output = { readonly gap: number; readonly weightedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLower: { type: "number" },
    firstUpper: { type: "number" },
    secondLower: { type: "number" },
    secondUpper: { type: "number" },
    weight: { type: "number", minimum: 0 },
  },
  required: [
    "firstLower",
    "firstUpper",
    "secondLower",
    "secondUpper",
    "weight",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" }, weightedGap: { type: "number" } },
  required: ["gap", "weightedGap"],
} as const;
/** Calculate weighted interval gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstLower, firstUpper, secondLower, secondUpper, weight } = request;
  const compute = (): Output => {
    H.domain(
      firstLower <= firstUpper && secondLower <= secondUpper && weight >= 0,
    );
    return {
      gap: Math.max(0, firstLower - secondUpper, secondLower - firstUpper),
      weightedGap:
        Math.max(0, firstLower - secondUpper, secondLower - firstUpper) *
        weight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstLower: 0,
    firstUpper: 2,
    secondLower: 5,
    secondUpper: 8,
    weight: 3,
  },
  output: { gap: 3, weightedGap: 9 },
} satisfies ToolExample<Input, Output>;
export const weightedIntervalGapTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "distance/weighted-interval-gap",
      title: "Weighted Interval Gap Tool",
      description:
        "Calculate weighted interval gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstLower: { type: "number" },
          firstUpper: { type: "number" },
          secondLower: { type: "number" },
          secondUpper: { type: "number" },
          weight: { type: "number", minimum: 0 },
        },
        required: [
          "firstLower",
          "firstUpper",
          "secondLower",
          "secondUpper",
          "weight",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          gap: { type: "number" },
          weightedGap: { type: "number" },
        },
        required: ["gap", "weightedGap"],
      },
      ports: {
        inputs: [
          {
            id: "firstLower",
            label: "First Lower",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstUpper",
            label: "First Upper",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondLower",
            label: "Second Lower",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondUpper",
            label: "Second Upper",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "weight",
            label: "Weight",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "gap", label: "Gap", valueType: { type: "number" } },
          {
            id: "weightedGap",
            label: "Weighted Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = weightedIntervalGapTool.execute;
export default weightedIntervalGapTool;
