import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly high: number; readonly low: number };
export type Output = { readonly scalar: number; readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    high: { type: "integer", minimum: 55296, maximum: 56319 },
    low: { type: "integer", minimum: 56320, maximum: 57343 },
  },
  required: ["high", "low"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scalar: { type: "integer" },
    text: { type: "string", maxLength: 8192 },
  },
  required: ["scalar", "text"],
} as const;
/** Calculate json string utf16 pair assembly from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { high, low } = input;
  const compute = (): Output => {
    H.integer(high, 55296, 56319);
    H.integer(low, 56320, 57343);
    const scalar = 65536 + (high - 55296) * 1024 + low - 56320;
    return { scalar, text: String.fromCodePoint(scalar) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { high: 55357, low: 56832 },
  output: { scalar: 128512, text: "😀" },
} satisfies ToolExample<Input, Output>;
export const jsonStringUtf16PairAssemblyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "json/json-string-utf16-pair-assembly",
    title: "JSON String Utf16 Pair Assembly Tool",
    description:
      "Calculate json string utf16 pair assembly from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        high: { type: "integer", minimum: 55296, maximum: 56319 },
        low: { type: "integer", minimum: 56320, maximum: 57343 },
      },
      required: ["high", "low"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scalar: { type: "integer" },
        text: { type: "string", maxLength: 8192 },
      },
      required: ["scalar", "text"],
    },
    ports: {
      inputs: [
        {
          id: "high",
          label: "High",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "low",
          label: "Low",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "scalar", label: "Scalar", valueType: { type: "integer" } },
        { id: "text", label: "Text", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = jsonStringUtf16PairAssemblyTool.execute;
export default jsonStringUtf16PairAssemblyTool;
