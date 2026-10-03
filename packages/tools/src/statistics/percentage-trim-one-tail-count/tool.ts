import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly count: number; readonly fraction: number };
export type Output = { readonly trimmed: number; readonly remaining: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 0 },
    fraction: { type: "number", minimum: 0, exclusiveMaximum: 0.5 },
  },
  required: ["count", "fraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { trimmed: { type: "integer" }, remaining: { type: "integer" } },
  required: ["trimmed", "remaining"],
} as const;
/** Calculate percentage trim one tail count from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { count, fraction } = input;
  const compute = (): Output => {
    H.integer(count, 0);
    H.domain(fraction >= 0 && fraction < 0.5);
    const trimmed = Math.floor(count * fraction);
    return { trimmed, remaining: count - 2 * trimmed };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { count: 11, fraction: 0.1 },
  output: { trimmed: 1, remaining: 9 },
} satisfies ToolExample<Input, Output>;
export const percentageTrimOneTailCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/percentage-trim-one-tail-count",
    title: "Percentage Trim One Tail Count Tool",
    description:
      "Calculate percentage trim one tail count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer", minimum: 0 },
        fraction: { type: "number", minimum: 0, exclusiveMaximum: 0.5 },
      },
      required: ["count", "fraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trimmed: { type: "integer" },
        remaining: { type: "integer" },
      },
      required: ["trimmed", "remaining"],
    },
    ports: {
      inputs: [
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "fraction",
          label: "Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "trimmed", label: "Trimmed", valueType: { type: "integer" } },
        { id: "remaining", label: "Remaining", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = percentageTrimOneTailCountTool.execute;
export default percentageTrimOneTailCountTool;
