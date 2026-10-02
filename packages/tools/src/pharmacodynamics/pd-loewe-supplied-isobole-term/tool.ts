import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstAmount: number;
  readonly secondAmount: number;
  readonly firstReference: number;
  readonly secondReference: number;
};
export type Output = {
  readonly firstFraction: number;
  readonly secondFraction: number;
  readonly combinationIndex: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAmount: { type: "number", minimum: 0 },
    secondAmount: { type: "number", minimum: 0 },
    firstReference: { type: "number", exclusiveMinimum: 0 },
    secondReference: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "firstAmount",
    "secondAmount",
    "firstReference",
    "secondReference",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstFraction: { type: "number" },
    secondFraction: { type: "number" },
    combinationIndex: { type: "number" },
  },
  required: ["firstFraction", "secondFraction", "combinationIndex"],
} as const;
/** Supplied same-effect reference fractions without inferring synergy thresholds or treatment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstAmount, secondAmount, firstReference, secondReference } =
    request;
  const compute = (): Output => {
    H.domain(firstAmount >= 0 && secondAmount >= 0);
    H.positive(firstReference);
    H.positive(secondReference);
    return {
      firstFraction: firstAmount / firstReference,
      secondFraction: secondAmount / secondReference,
      combinationIndex:
        firstAmount / firstReference + secondAmount / secondReference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstAmount: 2,
    secondAmount: 3,
    firstReference: 4,
    secondReference: 6,
  },
  output: { firstFraction: 0.5, secondFraction: 0.5, combinationIndex: 1 },
} satisfies ToolExample<Input, Output>;
export const pdLoeweSuppliedIsoboleTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacodynamics/pd-loewe-supplied-isobole-term",
    title: "PD Loewe Supplied Isobole Term Tool",
    description:
      "Supplied same-effect reference fractions without inferring synergy thresholds or treatment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstAmount: { type: "number", minimum: 0 },
        secondAmount: { type: "number", minimum: 0 },
        firstReference: { type: "number", exclusiveMinimum: 0 },
        secondReference: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "firstAmount",
        "secondAmount",
        "firstReference",
        "secondReference",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstFraction: { type: "number" },
        secondFraction: { type: "number" },
        combinationIndex: { type: "number" },
      },
      required: ["firstFraction", "secondFraction", "combinationIndex"],
    },
    ports: {
      inputs: [
        {
          id: "firstAmount",
          label: "First Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondAmount",
          label: "Second Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstReference",
          label: "First Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondReference",
          label: "Second Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstFraction",
          label: "First Fraction",
          valueType: { type: "number" },
        },
        {
          id: "secondFraction",
          label: "Second Fraction",
          valueType: { type: "number" },
        },
        {
          id: "combinationIndex",
          label: "Combination Index",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pdLoeweSuppliedIsoboleTermTool.execute;
export default pdLoeweSuppliedIsoboleTermTool;
