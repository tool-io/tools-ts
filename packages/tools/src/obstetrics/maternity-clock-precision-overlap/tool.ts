import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstLower: number;
  readonly firstUpper: number;
  readonly secondLower: number;
  readonly secondUpper: number;
};
export type Output = {
  readonly overlap: number;
  readonly couldCoincide: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstLower: { type: "number" },
    firstUpper: { type: "number" },
    secondLower: { type: "number" },
    secondUpper: { type: "number" },
  },
  required: ["firstLower", "firstUpper", "secondLower", "secondUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlap: { type: "number" },
    couldCoincide: { type: "boolean" },
  },
  required: ["overlap", "couldCoincide"],
} as const;
/** Compare closed timestamp uncertainty envelopes, including point contact, without inferring event sequence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstLower, firstUpper, secondLower, secondUpper } = request;
  const compute = (): Output => {
    H.domain(firstLower <= firstUpper && secondLower <= secondUpper);
    return {
      overlap: Math.max(
        0,
        Math.min(firstUpper, secondUpper) - Math.max(firstLower, secondLower),
      ),
      couldCoincide:
        Math.max(firstLower, secondLower) <= Math.min(firstUpper, secondUpper),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstLower: 10, firstUpper: 12, secondLower: 11, secondUpper: 13 },
  output: { overlap: 1, couldCoincide: true },
} satisfies ToolExample<Input, Output>;
export const maternityClockPrecisionOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "obstetrics/maternity-clock-precision-overlap",
    title: "Maternity Clock Precision Overlap Tool",
    description:
      "Compare closed timestamp uncertainty envelopes, including point contact, without inferring event sequence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstLower: { type: "number" },
        firstUpper: { type: "number" },
        secondLower: { type: "number" },
        secondUpper: { type: "number" },
      },
      required: ["firstLower", "firstUpper", "secondLower", "secondUpper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlap: { type: "number" },
        couldCoincide: { type: "boolean" },
      },
      required: ["overlap", "couldCoincide"],
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
      ],
      outputs: [
        { id: "overlap", label: "Overlap", valueType: { type: "number" } },
        {
          id: "couldCoincide",
          label: "Could Coincide",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = maternityClockPrecisionOverlapTool.execute;
export default maternityClockPrecisionOverlapTool;
