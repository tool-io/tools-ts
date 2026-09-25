import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly epochMinute: number };
export type Output = {
  readonly lowerMilliseconds: number;
  readonly upperMillisecondsExclusive: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { epochMinute: { type: "integer" } },
  required: ["epochMinute"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerMilliseconds: { type: "integer" },
    upperMillisecondsExclusive: { type: "integer" },
  },
  required: ["lowerMilliseconds", "upperMillisecondsExclusive"],
} as const;
/** Calculate minute precision interval envelope from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { epochMinute } = input;
  const compute = (): Output => {
    return {
      lowerMilliseconds: epochMinute * 60000,
      upperMillisecondsExclusive: (epochMinute + 1) * 60000,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { epochMinute: 2 },
  output: { lowerMilliseconds: 120000, upperMillisecondsExclusive: 180000 },
} satisfies ToolExample<Input, Output>;
export const minutePrecisionIntervalEnvelopeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "date/minute-precision-interval-envelope",
    title: "Minute Precision Interval Envelope Tool",
    description:
      "Calculate minute precision interval envelope from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { epochMinute: { type: "integer" } },
      required: ["epochMinute"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerMilliseconds: { type: "integer" },
        upperMillisecondsExclusive: { type: "integer" },
      },
      required: ["lowerMilliseconds", "upperMillisecondsExclusive"],
    },
    ports: {
      inputs: [
        {
          id: "epochMinute",
          label: "Epoch Minute",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "lowerMilliseconds",
          label: "Lower Milliseconds",
          valueType: { type: "integer" },
        },
        {
          id: "upperMillisecondsExclusive",
          label: "Upper Milliseconds Exclusive",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = minutePrecisionIntervalEnvelopeTool.execute;
export default minutePrecisionIntervalEnvelopeTool;
