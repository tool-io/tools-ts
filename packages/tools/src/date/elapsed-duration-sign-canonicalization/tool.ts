import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly days: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
};
export type Output = {
  readonly totalSeconds: number;
  readonly sign: number;
  readonly magnitudeSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    days: { type: "integer" },
    hours: { type: "integer" },
    minutes: { type: "integer" },
    seconds: { type: "integer" },
  },
  required: ["days", "hours", "minutes", "seconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalSeconds: { type: "integer" },
    sign: { type: "integer" },
    magnitudeSeconds: { type: "integer" },
  },
  required: ["totalSeconds", "sign", "magnitudeSeconds"],
} as const;
/** Calculate elapsed duration sign canonicalization from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { days, hours, minutes, seconds } = input;
  const compute = (): Output => {
    const totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;
    return {
      totalSeconds,
      sign: Math.sign(totalSeconds),
      magnitudeSeconds: Math.abs(totalSeconds),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { days: 1, hours: -25, minutes: 0, seconds: 0 },
  output: { totalSeconds: -3600, sign: -1, magnitudeSeconds: 3600 },
} satisfies ToolExample<Input, Output>;
export const elapsedDurationSignCanonicalizationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "date/elapsed-duration-sign-canonicalization",
      title: "Elapsed Duration Sign Canonicalization Tool",
      description:
        "Calculate elapsed duration sign canonicalization from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          days: { type: "integer" },
          hours: { type: "integer" },
          minutes: { type: "integer" },
          seconds: { type: "integer" },
        },
        required: ["days", "hours", "minutes", "seconds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalSeconds: { type: "integer" },
          sign: { type: "integer" },
          magnitudeSeconds: { type: "integer" },
        },
        required: ["totalSeconds", "sign", "magnitudeSeconds"],
      },
      ports: {
        inputs: [
          {
            id: "days",
            label: "Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "hours",
            label: "Hours",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "minutes",
            label: "Minutes",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "seconds",
            label: "Seconds",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "totalSeconds",
            label: "Total Seconds",
            valueType: { type: "integer" },
          },
          { id: "sign", label: "Sign", valueType: { type: "integer" } },
          {
            id: "magnitudeSeconds",
            label: "Magnitude Seconds",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = elapsedDurationSignCanonicalizationTool.execute;
export default elapsedDurationSignCanonicalizationTool;
