import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wholeMinute: number;
  readonly knownSecond: number;
  readonly secondKnown: boolean;
};
export type Output = {
  readonly lowerSecond: number;
  readonly upperSecond: number;
  readonly upperExclusive: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wholeMinute: { type: "integer" },
    knownSecond: { type: "integer", minimum: 0, maximum: 59 },
    secondKnown: { type: "boolean" },
  },
  required: ["wholeMinute", "knownSecond", "secondKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerSecond: { type: "integer" },
    upperSecond: { type: "integer" },
    upperExclusive: { type: "boolean" },
  },
  required: ["lowerSecond", "upperSecond", "upperExclusive"],
} as const;
/** Represent a supplied absolute-minute birth timestamp as an exact second or truncated minute envelope. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wholeMinute, knownSecond, secondKnown } = request;
  const compute = (): Output => {
    H.integer(knownSecond, 0, 59);
    return {
      lowerSecond: wholeMinute * 60 + (secondKnown ? knownSecond : 0),
      upperSecond: wholeMinute * 60 + (secondKnown ? knownSecond : 60),
      upperExclusive: !secondKnown,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wholeMinute: 100, knownSecond: 30, secondKnown: false },
  output: { lowerSecond: 6000, upperSecond: 6060, upperExclusive: true },
} satisfies ToolExample<Input, Output>;
export const birthRecordPartialMinuteEnvelopeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "midwifery/birth-record-partial-minute-envelope",
    title: "Birth Record Partial Minute Envelope Tool",
    description:
      "Represent a supplied absolute-minute birth timestamp as an exact second or truncated minute envelope.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wholeMinute: { type: "integer" },
        knownSecond: { type: "integer", minimum: 0, maximum: 59 },
        secondKnown: { type: "boolean" },
      },
      required: ["wholeMinute", "knownSecond", "secondKnown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerSecond: { type: "integer" },
        upperSecond: { type: "integer" },
        upperExclusive: { type: "boolean" },
      },
      required: ["lowerSecond", "upperSecond", "upperExclusive"],
    },
    ports: {
      inputs: [
        {
          id: "wholeMinute",
          label: "Whole Minute",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "knownSecond",
          label: "Known Second",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondKnown",
          label: "Second Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "lowerSecond",
          label: "Lower Second",
          valueType: { type: "integer" },
        },
        {
          id: "upperSecond",
          label: "Upper Second",
          valueType: { type: "integer" },
        },
        {
          id: "upperExclusive",
          label: "Upper Exclusive",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = birthRecordPartialMinuteEnvelopeTool.execute;
export default birthRecordPartialMinuteEnvelopeTool;
