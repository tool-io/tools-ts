import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly overlap: number;
  readonly firstSize: number;
  readonly secondSize: number;
};
export type Output = {
  readonly numeratorDecimal: string;
  readonly denominatorDecimal: string;
  readonly dice: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlap: { type: "integer", minimum: 0 },
    firstSize: { type: "integer", minimum: 0 },
    secondSize: { type: "integer", minimum: 0 },
  },
  required: ["overlap", "firstSize", "secondSize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numeratorDecimal: { type: "string", maxLength: 8192 },
    denominatorDecimal: { type: "string", maxLength: 8192 },
    dice: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["numeratorDecimal", "denominatorDecimal", "dice", "defined"],
} as const;
/** Calculate dice overlap count contribution from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { overlap, firstSize, secondSize } = request;
  const compute = (): Output => {
    H.integer(firstSize, 0);
    H.integer(secondSize, 0);
    H.integer(overlap, 0, Math.min(firstSize, secondSize));
    return {
      numeratorDecimal: (2n * BigInt(overlap)).toString(),
      denominatorDecimal: (BigInt(firstSize) + BigInt(secondSize)).toString(),
      dice:
        firstSize + secondSize > 0
          ? (2 * overlap) / (firstSize + secondSize)
          : 0,
      defined: firstSize + secondSize > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { overlap: 2, firstSize: 3, secondSize: 5 },
  output: {
    numeratorDecimal: "4",
    denominatorDecimal: "8",
    dice: 0.5,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const diceOverlapCountContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/dice-overlap-count-contribution",
    title: "Dice Overlap Count Contribution Tool",
    description:
      "Calculate dice overlap count contribution from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlap: { type: "integer", minimum: 0 },
        firstSize: { type: "integer", minimum: 0 },
        secondSize: { type: "integer", minimum: 0 },
      },
      required: ["overlap", "firstSize", "secondSize"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        numeratorDecimal: { type: "string", maxLength: 8192 },
        denominatorDecimal: { type: "string", maxLength: 8192 },
        dice: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["numeratorDecimal", "denominatorDecimal", "dice", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "overlap",
          label: "Overlap",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstSize",
          label: "First Size",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondSize",
          label: "Second Size",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "numeratorDecimal",
          label: "Numerator Decimal",
          valueType: { type: "string" },
        },
        {
          id: "denominatorDecimal",
          label: "Denominator Decimal",
          valueType: { type: "string" },
        },
        { id: "dice", label: "Dice", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = diceOverlapCountContributionTool.execute;
export default diceOverlapCountContributionTool;
