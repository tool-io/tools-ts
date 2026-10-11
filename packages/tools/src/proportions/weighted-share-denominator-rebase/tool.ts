import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly weightedNumerator: number;
  readonly oldDenominator: number;
  readonly newDenominator: number;
};
export type Output = { readonly oldShare: number; readonly newShare: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedNumerator: { type: "number" },
    oldDenominator: { type: "number", exclusiveMinimum: 0 },
    newDenominator: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["weightedNumerator", "oldDenominator", "newDenominator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { oldShare: { type: "number" }, newShare: { type: "number" } },
  required: ["oldShare", "newShare"],
} as const;
/** Rebase one explicit signed weighted numerator between two positive compatible denominators. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weightedNumerator, oldDenominator, newDenominator } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(oldDenominator) && oldDenominator > 0,
      "oldDenominator",
    ),
      oldDenominator);
    (H.domain(
      Number.isFinite(newDenominator) && newDenominator > 0,
      "newDenominator",
    ),
      newDenominator);
    return {
      oldShare: weightedNumerator / oldDenominator,
      newShare: weightedNumerator / newDenominator,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { weightedNumerator: 12, oldDenominator: 40, newDenominator: 60 },
  output: { oldShare: 0.3, newShare: 0.2 },
} satisfies ToolExample<Input, Output>;
export const weightedShareDenominatorRebaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["proportions", "mathematics"],
      keywords: ["proportions", "mathematics"],
    },
    id: "proportions/weighted-share-denominator-rebase",
    title: "Weighted Share Denominator Rebase",
    description:
      "Rebase one explicit signed weighted numerator between two positive compatible denominators.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weightedNumerator: { type: "number" },
        oldDenominator: { type: "number", exclusiveMinimum: 0 },
        newDenominator: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["weightedNumerator", "oldDenominator", "newDenominator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldShare: { type: "number" },
        newShare: { type: "number" },
      },
      required: ["oldShare", "newShare"],
    },
    ports: {
      inputs: [
        {
          id: "weightedNumerator",
          label: "Weighted Numerator",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "oldDenominator",
          label: "Old Denominator",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newDenominator",
          label: "New Denominator",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "oldShare", label: "Old Share", valueType: { type: "number" } },
        { id: "newShare", label: "New Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = weightedShareDenominatorRebaseTool.execute;
export default weightedShareDenominatorRebaseTool;
