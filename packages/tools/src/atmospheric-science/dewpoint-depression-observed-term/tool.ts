import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly temperature: number; readonly dewpoint: number };
export type Output = { readonly depression: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { temperature: { type: "number" }, dewpoint: { type: "number" } },
  required: ["temperature", "dewpoint"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { depression: { type: "number" } },
  required: ["depression"],
} as const;
/** Subtract an explicitly observed dewpoint in matching temperature units; supersaturated observations retain a negative depression. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { temperature, dewpoint } = request;
  const compute = (): Output => {
    return { depression: temperature - dewpoint };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { temperature: 20, dewpoint: 12 },
  output: { depression: 8 },
} satisfies ToolExample<Input, Output>;
export const dewpointDepressionObservedTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-science/dewpoint-depression-observed-term",
    title: "Dewpoint Depression Observed Term Tool",
    description:
      "Subtract an explicitly observed dewpoint in matching temperature units; supersaturated observations retain a negative depression.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        temperature: { type: "number" },
        dewpoint: { type: "number" },
      },
      required: ["temperature", "dewpoint"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { depression: { type: "number" } },
      required: ["depression"],
    },
    ports: {
      inputs: [
        {
          id: "temperature",
          label: "Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dewpoint",
          label: "Dewpoint",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "depression",
          label: "Depression",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dewpointDepressionObservedTermTool.execute;
export default dewpointDepressionObservedTermTool;
