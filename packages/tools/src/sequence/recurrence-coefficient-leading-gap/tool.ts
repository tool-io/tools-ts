import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coefficients: readonly number[];
  readonly referenceLeading: number;
};
export type Output = {
  readonly leadingIndex: number;
  readonly leadingCoefficient: number;
  readonly gap: number;
  readonly allZero: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coefficients: { type: "array", maxItems: 256, items: { type: "number" } },
    referenceLeading: { type: "number" },
  },
  required: ["coefficients", "referenceLeading"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leadingIndex: { type: "integer" },
    leadingCoefficient: { type: "number" },
    gap: { type: "number" },
    allZero: { type: "boolean" },
  },
  required: ["leadingIndex", "leadingCoefficient", "gap", "allZero"],
} as const;
/** Inspect a supplied leading-to-trailing recurrence coefficient list without solving the recurrence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coefficients, referenceLeading } = request;
  const compute = (): Output => {
    return (() => {
      const leadingIndex = coefficients.findIndex((x) => x !== 0),
        leadingCoefficient = leadingIndex < 0 ? 0 : coefficients[leadingIndex];
      return {
        leadingIndex,
        leadingCoefficient,
        gap: leadingCoefficient - referenceLeading,
        allZero: leadingIndex < 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coefficients: [0, 0, 3, 2], referenceLeading: 2 },
  output: { leadingIndex: 2, leadingCoefficient: 3, gap: 1, allZero: false },
} satisfies ToolExample<Input, Output>;
export const recurrenceCoefficientLeadingGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/recurrence-coefficient-leading-gap",
    title: "Recurrence Coefficient Leading Gap Tool",
    description:
      "Inspect a supplied leading-to-trailing recurrence coefficient list without solving the recurrence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coefficients: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        referenceLeading: { type: "number" },
      },
      required: ["coefficients", "referenceLeading"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leadingIndex: { type: "integer" },
        leadingCoefficient: { type: "number" },
        gap: { type: "number" },
        allZero: { type: "boolean" },
      },
      required: ["leadingIndex", "leadingCoefficient", "gap", "allZero"],
    },
    ports: {
      inputs: [
        {
          id: "coefficients",
          label: "Coefficients",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "referenceLeading",
          label: "Reference Leading",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "leadingIndex",
          label: "Leading Index",
          valueType: { type: "integer" },
        },
        {
          id: "leadingCoefficient",
          label: "Leading Coefficient",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        { id: "allZero", label: "All Zero", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = recurrenceCoefficientLeadingGapTool.execute;
export default recurrenceCoefficientLeadingGapTool;
