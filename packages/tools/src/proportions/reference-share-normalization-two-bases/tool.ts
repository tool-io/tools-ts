import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amount: number;
  readonly firstBase: number;
  readonly secondBase: number;
};
export type Output = {
  readonly firstShare: number;
  readonly secondShare: number;
  readonly ratio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amount: { type: "number" },
    firstBase: { type: "number", exclusiveMinimum: 0 },
    secondBase: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["amount", "firstBase", "secondBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstShare: { type: "number" },
    secondShare: { type: "number" },
    ratio: { type: "number" },
  },
  required: ["firstShare", "secondShare", "ratio"],
} as const;
/** Calculate reference share normalization two bases from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amount, firstBase, secondBase } = request;
  const compute = (): Output => {
    H.positive(firstBase);
    H.positive(secondBase);
    return {
      firstShare: amount / firstBase,
      secondShare: amount / secondBase,
      ratio: firstBase / secondBase,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { amount: 20, firstBase: 100, secondBase: 80 },
  output: { firstShare: 0.2, secondShare: 0.25, ratio: 1.25 },
} satisfies ToolExample<Input, Output>;
export const referenceShareNormalizationTwoBasesTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "proportions/reference-share-normalization-two-bases",
      title: "Reference Share Normalization Two Bases Tool",
      description:
        "Calculate reference share normalization two bases from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          amount: { type: "number" },
          firstBase: { type: "number", exclusiveMinimum: 0 },
          secondBase: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["amount", "firstBase", "secondBase"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstShare: { type: "number" },
          secondShare: { type: "number" },
          ratio: { type: "number" },
        },
        required: ["firstShare", "secondShare", "ratio"],
      },
      ports: {
        inputs: [
          {
            id: "amount",
            label: "Amount",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstBase",
            label: "First Base",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondBase",
            label: "Second Base",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "firstShare",
            label: "First Share",
            valueType: { type: "number" },
          },
          {
            id: "secondShare",
            label: "Second Share",
            valueType: { type: "number" },
          },
          { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = referenceShareNormalizationTwoBasesTool.execute;
export default referenceShareNormalizationTwoBasesTool;
