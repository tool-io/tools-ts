import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
};
export type Output = { readonly hour: number; readonly dayCarry: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hour: { type: "integer", minimum: 0, maximum: 24 },
    minute: { type: "integer", minimum: 0, maximum: 59 },
    second: { type: "integer", minimum: 0, maximum: 59 },
  },
  required: ["hour", "minute", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { hour: { type: "integer" }, dayCarry: { type: "integer" } },
  required: ["hour", "dayCarry"],
} as const;
/** Calculate hour 24 endpoint normalization from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { hour, minute, second } = input;
  const compute = (): Output => {
    H.integer(hour, 0, 24);
    H.integer(minute, 0, 59);
    H.integer(second, 0, 59);
    H.domain(hour !== 24 || (minute === 0 && second === 0));
    return { hour: hour === 24 ? 0 : hour, dayCarry: hour === 24 ? 1 : 0 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { hour: 24, minute: 0, second: 0 },
  output: { hour: 0, dayCarry: 1 },
} satisfies ToolExample<Input, Output>;
export const hour24EndpointNormalizationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "date/hour-24-endpoint-normalization",
    title: "Hour 24 Endpoint Normalization Tool",
    description:
      "Calculate hour 24 endpoint normalization from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hour: { type: "integer", minimum: 0, maximum: 24 },
        minute: { type: "integer", minimum: 0, maximum: 59 },
        second: { type: "integer", minimum: 0, maximum: 59 },
      },
      required: ["hour", "minute", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { hour: { type: "integer" }, dayCarry: { type: "integer" } },
      required: ["hour", "dayCarry"],
    },
    ports: {
      inputs: [
        {
          id: "hour",
          label: "Hour",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "minute",
          label: "Minute",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "hour", label: "Hour", valueType: { type: "integer" } },
        { id: "dayCarry", label: "Day Carry", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = hour24EndpointNormalizationTool.execute;
export default hour24EndpointNormalizationTool;
